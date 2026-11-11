require('../helpers/module')(__filename, [
  { remark: '浏览器缺少流式读取能力时返回 false，且不发送请求', test: function () {
    var calls = 0; window.fetch = function () { calls++; }; window.TextDecoder = undefined;
    var result = translate.request.sse.post('translate.json', {}, function () {});
    return result === false && calls === 0;
  } },
  { remark: '跨字节分块的中文 SSE 可依次派发 batch、item、done，并且只触发一次最终响应拦截', test: async function () {
    var input = { text: '原文' }, callbacks = [], responseCalls = 0, sent, success, fallback = 0, abnormal = 0;
    var bytes = new TextEncoder().encode('event: batch\r\ndata: {"text":["中"]}\r\n\r\nevent: item\ndata: {"index":0}\n\nevent: done\ndata: {"result":1,"text":["译文"]}\n\n');
    var split = bytes.indexOf(228) + 1;
    window.fetch = function (url, options) {
      sent = { url: url, options: options };
      return Promise.resolve(new Response(new ReadableStream({ start: function (controller) { controller.enqueue(bytes.slice(0, split)); controller.enqueue(bytes.slice(split)); controller.close(); } }), { status: 200, headers: { 'content-type': 'Text/Event-Stream; charset=utf-8' } }));
    };
    translate.request.response = function (xhr) { responseCalls++; success = { xhr: xhr }; };
    var completed = new Promise(function (resolve) {
      var started = translate.request.sse.post('translate.json', input, function (value, data, xhr) { success.value = value; success.data = data; success.same = xhr === success.xhr; resolve(started); }, function () { abnormal++; resolve(false); }, function () { fallback++; resolve(false); }, { onEvent: function (name, data, request) { callbacks.push(name); if (request !== input) callbacks.push('wrong-input'); } });
    });
    var started = await completed; await new Promise(function (resolve) { setTimeout(resolve, 0); });
    var headers = new Headers(sent.options.headers), params = new URLSearchParams(sent.options.body);
    return started === true && sent.options.method === 'POST' && headers.get('accept') === 'text/event-stream' && params.get('stream') === '1' && params.get('text') === '原文' && JSON.stringify(callbacks) === '["batch","item","done"]' && responseCalls === 1 && success.value.text[0] === '译文' && success.data === input && success.same && success.xhr.status === 200 && success.xhr.readyState === 4 && success.xhr.sse === true && JSON.parse(success.xhr.responseText).result === 1 && fallback === 0 && abnormal === 0;
  } },
  { remark: 'error 业务事件同样完成请求并回调业务结果，不触发网络降级', test: async function () {
    var fallback = 0, abnormal = 0, events = 0;
    window.fetch = function () { return Promise.resolve(new Response('event: error\ndata: {"result":0,"info":"额度不足"}\n\n', { headers: { 'content-type': 'text/event-stream' } })); };
    return await new Promise(function (resolve) {
      translate.request.sse.post('translate.json', {}, function (value, input, xhr) { resolve(value.result === 0 && value.info === '额度不足' && xhr.sseEventName === 'error' && events === 1 && fallback === 0 && abnormal === 0); }, function () { abnormal++; resolve(false); }, function () { fallback++; resolve(false); }, { onError: function () { events++; } });
    });
  } },
  { remark: '服务端返回普通 JSON 时直接消费当前响应，不再重复发起 XHR', test: async function () {
    var fallback = 0, responseCalls = 0, input = { text: '甲' };
    window.fetch = function () { return Promise.resolve(new Response('{"result":1,"text":["A"]}', { headers: { 'content-type': 'application/json' } })); };
    translate.request.response = function () { responseCalls++; };
    return await new Promise(function (resolve) {
      translate.request.sse.post('translate.json', input, function (value, data, xhr) { resolve(value.text[0] === 'A' && data === input && xhr.sse === true && xhr.readyState === 4 && xhr.responseText === '{"result":1,"text":["A"]}' && responseCalls === 1 && fallback === 0); }, function () { resolve(false); }, function () { fallback++; resolve(false); });
    });
  } },
  { remark: '普通文本响应保持与 XHR 相同的单参数成功回调', test: async function () {
    window.fetch = function () { return Promise.resolve(new Response('plain text', { headers: { 'content-type': 'text/plain' } })); };
    return await new Promise(function (resolve) {
      translate.request.sse.post('translate.json', {}, function (value) { resolve(value === 'plain text' && arguments.length === 1); }, function () { resolve(false); }, function () { resolve(false); });
    });
  } },
  { remark: '连接失败且未收到业务事件时只降级一次', test: async function () {
    var fallback = 0, intercepted = 0;
    window.fetch = function () { return Promise.reject(new Error('offline')); };
    translate.request.response = function () { intercepted++; };
    await new Promise(function (resolve) { translate.request.sse.post('translate.json', {}, function () { resolve(false); }, function () { resolve(false); }, function () { fallback++; resolve(true); }); });
    await new Promise(function (resolve) { setTimeout(resolve, 0); });
    return fallback === 1 && intercepted === 0;
  } },
  { remark: 'HTTP 非 200 响应尚未进入 SSE 业务阶段时降级', test: async function () {
    window.fetch = function () { return Promise.resolve(new Response('Unavailable', { status: 503 })); };
    return await new Promise(function (resolve) { translate.request.sse.post('translate.json', {}, function () { resolve(false); }, function () { resolve(false); }, function () { resolve(true); }); });
  } },
  { remark: '只有心跳和 id、retry 控制块的响应断流时仍可降级', test: async function () {
    var events = 0;
    window.fetch = function () { return Promise.resolve(new Response(': heartbeat\n\nid: 123\nretry: 1000\n\n', { headers: { 'content-type': 'text/event-stream' } })); };
    return await new Promise(function (resolve) { translate.request.sse.post('translate.json', {}, function () { resolve(false); }, function () { resolve(false); }, function () { resolve(events === 0); }, { onEvent: function () { events++; } }); });
  } },
  { remark: 'SSE 响应没有可读 body 时回到普通请求', test: async function () {
    window.fetch = function () { return Promise.resolve({ status: 200, headers: new Headers({ 'content-type': 'text/event-stream' }), body: null }); };
    return await new Promise(function (resolve) { translate.request.sse.post('translate.json', {}, function () { resolve(false); }, function () { resolve(false); }, function () { resolve(true); }); });
  } },
  { remark: '已收到部分业务数据但缺少 done 时报告异常，防止重复翻译请求', test: async function () {
    var fallback = 0, events = 0, responseCalls = 0;
    window.fetch = function () { return Promise.resolve(new Response('event: item\ndata: {"index":0,"text":"译文"}\n\n', { headers: { 'content-type': 'text/event-stream' } })); };
    translate.request.response = function () { responseCalls++; };
    return await new Promise(function (resolve) { translate.request.sse.post('translate.json', {}, function () { resolve(false); }, function (xhr) { resolve(fallback === 0 && events === 1 && responseCalls === 1 && xhr.readyState === 4 && xhr.info.indexOf('before done') >= 0); }, function () { fallback++; resolve(false); }, { onItem: function () { events++; } }); });
  } },
  { remark: '最后一个事件没有空行结束符时仍在流结束时解析 done', test: async function () {
    window.fetch = function () { return Promise.resolve(new Response('event: done\rdata: {"result":1,"text":["A"]}', { headers: { 'content-type': 'text/event-stream' } })); };
    return await new Promise(function (resolve) { translate.request.sse.post('translate.json', {}, function (value) { resolve(value.result === 1 && value.text[0] === 'A'); }, function () { resolve(false); }, function () { resolve(false); }); });
  } },
  { remark: '响应拦截扩展抛错时记录日志，已完成的业务响应仍正常成功', test: async function () {
    var logs = 0, fallback = 0;
    translate.log = function () { logs++; }; translate.request.response = function () { throw new Error('扩展异常'); };
    window.fetch = function () { return Promise.resolve(new Response('event: done\ndata: {"result":1}\n\n', { headers: { 'content-type': 'text/event-stream' } })); };
    return await new Promise(function (resolve) { translate.request.sse.post('translate.json', {}, function (value) { resolve(value.result === 1 && logs === 1 && fallback === 0); }, function () { resolve(false); }, function () { fallback++; resolve(false); }); });
  } },
  { remark: '读取响应流在首个业务事件前失败时降级一次，不误报为已开始的业务异常', test: async function () {
    var fallback = 0, abnormal = 0, intercepted = 0;
    window.fetch = function () { return Promise.resolve({ status: 200, headers: new Headers({ 'content-type': 'text/event-stream' }), body: { getReader: function () { return { read: function () { return Promise.reject(new Error('read failed')); } }; } } }); };
    translate.request.response = function () { intercepted++; };
    await new Promise(function (resolve) { translate.request.sse.post('translate.json', {}, function () { resolve(); }, function () { abnormal++; resolve(); }, function () { fallback++; resolve(); }); });
    await new Promise(function (resolve) { setTimeout(resolve, 0); });
    return fallback === 1 && abnormal === 0 && intercepted === 0;
  } },
  { remark: '读取响应流在部分业务事件后失败时只通知异常，不重新发送整批文本', test: async function () {
    var reads = 0, fallback = 0, items = 0, intercepted = 0, bytes = new TextEncoder().encode('event: item\ndata: {"index":0,"text":"译文"}\n\n');
    window.fetch = function () { return Promise.resolve({ status: 200, headers: new Headers({ 'content-type': 'text/event-stream' }), body: { getReader: function () { return { read: function () { reads++; return reads === 1 ? Promise.resolve({ done: false, value: bytes }) : Promise.reject(new Error('read failed')); } }; } } }); };
    translate.request.response = function () { intercepted++; };
    return await new Promise(function (resolve) { translate.request.sse.post('translate.json', {}, function () { resolve(false); }, function (xhr) { resolve(fallback === 0 && items === 1 && intercepted === 1 && xhr.status === 200 && xhr.readyState === 4 && xhr.info.indexOf('read failed') >= 0); }, function () { fallback++; resolve(false); }, { onItem: function () { items++; } }); });
  } },
  { remark: 'CRLF 行结束符恰好分隔在两个网络块之间时仍作为一个换行解析', test: async function () {
    var chunks = ['event: done\r', '\ndata: {"result":1,"text":["A"]}\r', '\n\r', '\n'], events = [];
    window.fetch = function () { return Promise.resolve(new Response(new ReadableStream({ start: function (controller) { chunks.forEach(function (part) { controller.enqueue(new TextEncoder().encode(part)); }); controller.close(); } }), { headers: { 'content-type': 'text/event-stream' } })); };
    return await new Promise(function (resolve) { translate.request.sse.post('translate.json', {}, function (value) { resolve(value.result === 1 && value.text[0] === 'A' && JSON.stringify(events) === '["done"]'); }, function () { resolve(false); }, function () { resolve(false); }, { onEvent: function (name) { events.push(name); } }); });
  } }
]);
