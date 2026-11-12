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
  } },
  { remark: '实际翻译收到 SSE error 时保留原文并统一清理进度样式', test: async function () {
    translate.selectLanguageTag.show = false; translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.request.sse.use = true;
    const element = document.createElement('span'); element.textContent = '你好';
    element.style.cssText = 'display:inline-block;width:40px;height:20px'; document.body.append(element);
    const text = element.firstChild;
    let fetchCalls = 0, after, afterCalls = 0;
    window.fetch = function () {
      fetchCalls++;
      return Promise.resolve(new Response('event: error\ndata: {"result":0,"info":"额度不足"}\n\n', { headers: { 'content-type': 'text/event-stream' } }));
    };
    translate.progress.api.startUITip();
    translate.lifecycle.execute.translateNetworkAfter.push(function (data) { after = data; afterCalls++; });
    const finished = new Promise(function (resolve) {
      // 等待上限只防止测试挂起，不给运行库规定请求超时时间。
      const timer = setTimeout(function () { resolve(false); }, 1500);
      translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timer); resolve(true); });
    });
    translate.execute([text]);
    const started = element.classList.contains('translatejs-text-element-hidden') && element.classList.contains('translate_api_in_progress');
    return await finished === true && started && fetchCalls === 1 && afterCalls === 1 && after.result === 0 &&
      after.info === '额度不足' && after.nodes.length === 1 && after.nodes[0] === text && translate.state === 0 &&
      element.firstChild === text && text.nodeValue === '你好' && !element.classList.contains('translatejs-text-element-hidden') &&
      !element.classList.contains('translate_api_in_progress');
  } },
  { remark: 'SSE error 前文本移到新元素时仍应恢复旧父元素并保留新父元素业务样式', test: async function () {
    translate.selectLanguageTag.show = false; translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.request.sse.use = true;
    const oldParent = document.createElement('span'), newParent = document.createElement('span'), keep = document.createElement('b');
    const text = document.createTextNode('你好'); keep.textContent = '留在原处';
    oldParent.append(text, keep); oldParent.style.cssText = 'display:inline-block;width:100px;height:20px';
    newParent.className = 'business-class'; document.body.append(oldParent, newParent);
    const originalFill = getComputedStyle(keep).webkitTextFillColor;
    let controller, after, afterCalls = 0;
    window.fetch = function () {
      return Promise.resolve(new Response(new ReadableStream({ start: function (value) { controller = value; } }), { headers: { 'content-type': 'text/event-stream' } }));
    };
    translate.progress.api.startUITip();
    translate.lifecycle.execute.translateNetworkAfter.push(function (data) { after = data; afterCalls++; });
    const finished = new Promise(function (resolve) {
      const timer = setTimeout(function () { resolve(false); }, 1500);
      translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timer); resolve(true); });
    });
    translate.execute([text]);
    const started = oldParent.classList.contains('translatejs-text-element-hidden') && oldParent.classList.contains('translate_api_in_progress');
    // 请求期间移动原 Text；完成清理应针对开始时加过样式的旧元素。
    newParent.append(text);
    controller.enqueue(new TextEncoder().encode('event: error\ndata: {"result":0,"info":"额度不足"}\n\n')); controller.close();
    return await finished === true && started && afterCalls === 1 && after.result === 0 && after.nodes[0] === text &&
      translate.state === 0 && text.parentNode === newParent && text.nodeValue === '你好' && keep.parentNode === oldParent &&
      !oldParent.classList.contains('translatejs-text-element-hidden') && !oldParent.classList.contains('translate_api_in_progress') &&
      getComputedStyle(keep).webkitTextFillColor === originalFill && newParent.className === 'business-class';
  } },
  { remark: 'SSE 已渲染一项后断流时清理提示并保留已显示译文，不回滚原文', test: async function () {
    translate.selectLanguageTag.show = false; translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.request.sse.use = true;
    const element = document.createElement('span'); element.textContent = '你好';
    element.style.cssText = 'display:inline-block;width:40px;height:20px'; document.body.append(element);
    const text = element.firstChild;
    let fetchCalls = 0, after, afterCalls = 0, itemRendered = false;
    window.fetch = function () {
      fetchCalls++;
      // 有 item 而无 done，读取完毕后应异常收尾，不重发整批文本。
      return Promise.resolve(new Response('event: item\ndata: {"index":0,"text":"Hello"}\n\n', { headers: { 'content-type': 'text/event-stream' } }));
    };
    translate.request.sse.onItem = function () { itemRendered = text.nodeValue === 'Hello'; };
    translate.progress.api.startUITip();
    translate.lifecycle.execute.translateNetworkAfter.push(function (data) { after = data; afterCalls++; });
    const finished = new Promise(function (resolve) {
      const timer = setTimeout(function () { resolve(false); }, 1500);
      translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timer); resolve(true); });
    });
    translate.execute([text]);
    const started = element.classList.contains('translatejs-text-element-hidden');
    const completed = await finished, record = translate.node.get(text);
    return completed === true && started && itemRendered && fetchCalls === 1 && afterCalls === 1 && after.result === 0 &&
      after.nodes[0] === text && translate.state === 0 && element.firstChild === text && text.nodeValue === 'Hello' &&
      record.originalText === '你好' && record.resultText === 'Hello' && !element.classList.contains('translatejs-text-element-hidden') &&
      !element.classList.contains('translate_api_in_progress');
  } },
  { remark: 'SSE item 前文本移入片段后断流时保留译文并恢复原父元素', test: async function () {
    translate.selectLanguageTag.show = false; translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.request.sse.use = true;
    const oldParent = document.createElement('span'), keep = document.createElement('b'), fragment = document.createDocumentFragment();
    const text = document.createTextNode('你好'); keep.textContent = '留在原处'; oldParent.append(text, keep);
    oldParent.style.cssText = 'display:inline-block;width:100px;height:20px'; document.body.append(oldParent);
    const originalFill = getComputedStyle(keep).webkitTextFillColor;
    let controller, after, afterCalls = 0, itemRendered = false;
    window.fetch = function () {
      return Promise.resolve(new Response(new ReadableStream({ start: function (value) { controller = value; } }), { headers: { 'content-type': 'text/event-stream' } }));
    };
    translate.request.sse.onItem = function () { itemRendered = text.nodeValue === 'Hello'; };
    translate.progress.api.startUITip();
    translate.lifecycle.execute.translateNetworkAfter.push(function (data) { after = data; afterCalls++; });
    const finished = new Promise(function (resolve) {
      const timer = setTimeout(function () { resolve(false); }, 1500);
      translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timer); resolve(true); });
    });
    translate.execute([text]);
    const started = oldParent.classList.contains('translatejs-text-element-hidden') && oldParent.classList.contains('translate_api_in_progress');
    fragment.append(text);
    controller.enqueue(new TextEncoder().encode('event: item\ndata: {"index":0,"text":"Hello"}\n\n')); controller.close();
    const completed = await finished, record = translate.node.get(text);
    return completed === true && started && itemRendered && afterCalls === 1 && after.result === 0 && after.nodes[0] === text &&
      translate.state === 0 && text.parentNode === fragment && text.nodeValue === 'Hello' && record.originalText === '你好' &&
      record.resultText === 'Hello' && !oldParent.classList.contains('translatejs-text-element-hidden') &&
      !oldParent.classList.contains('translate_api_in_progress') && getComputedStyle(keep).webkitTextFillColor === originalFill;
  } },
  { remark: 'SSE 未收到业务事件便断流时保持提示，等待降级 XHR 成功后再恢复并显示译文', test: async function () {
    translate.selectLanguageTag.show = false; translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.request.sse.use = true;
    const element = document.createElement('span'); element.textContent = '你好';
    element.style.cssText = 'display:inline-block;width:40px;height:20px'; document.body.append(element);
    const text = element.firstChild;
    let fetchCalls = 0, xhrCalls = 0, after, afterCalls = 0, sentBody, resolveSent, sentTimer;
    const sent = new Promise(function (resolve) { resolveSent = resolve; sentTimer = setTimeout(function () { resolve(null); }, 1500); });
    window.fetch = function () {
      fetchCalls++;
      return Promise.resolve(new Response(': heartbeat\n\n', { headers: { 'content-type': 'text/event-stream' } }));
    };
    window.XMLHttpRequest = function () {
      xhrCalls++; this.open = function () {}; this.setRequestHeader = function () {};
      this.send = function (body) { sentBody = body; clearTimeout(sentTimer); resolveSent(this); };
    };
    translate.progress.api.startUITip();
    translate.lifecycle.execute.translateNetworkAfter.push(function (data) { after = data; afterCalls++; });
    const finished = new Promise(function (resolve) {
      const timer = setTimeout(function () { resolve(false); }, 1500);
      translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timer); resolve(true); });
    });
    translate.execute([text]);
    const xhr = await sent;
    if (xhr === null) return false;
    // 降级只切换传输方式，最终 XHR 尚未结束时不能提前取消进度提示。
    const pending = afterCalls === 0 && translate.state === 20 && text.nodeValue === '你好' &&
      element.classList.contains('translatejs-text-element-hidden') && element.classList.contains('translate_api_in_progress');
    xhr.readyState = 4; xhr.status = 200;
    xhr.responseText = '{"result":1,"from":"chinese_simplified","to":"english","text":["Hello"]}'; xhr.onreadystatechange();
    return await finished === true && pending && fetchCalls === 1 && xhrCalls === 1 && !new URLSearchParams(sentBody).has('stream') &&
      afterCalls === 1 && after.result === 1 && after.nodes[0] === text && translate.state === 0 && element.firstChild === text &&
      text.nodeValue === 'Hello' && !element.classList.contains('translatejs-text-element-hidden') && !element.classList.contains('translate_api_in_progress');
  } },
  { remark: 'SSE 未收到业务事件便断流时等待降级 XHR 失败后清理提示并保留原文', test: async function () {
    translate.selectLanguageTag.show = false; translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.request.sse.use = true;
    const element = document.createElement('span'); element.textContent = '你好';
    element.style.cssText = 'display:inline-block;width:40px;height:20px'; document.body.append(element);
    const text = element.firstChild;
    let fetchCalls = 0, xhrCalls = 0, after, afterCalls = 0, resolveSent, sentTimer;
    const sent = new Promise(function (resolve) { resolveSent = resolve; sentTimer = setTimeout(function () { resolve(null); }, 1500); });
    window.fetch = function () {
      fetchCalls++;
      return Promise.resolve(new Response(': heartbeat\n\n', { headers: { 'content-type': 'text/event-stream' } }));
    };
    window.XMLHttpRequest = function () {
      xhrCalls++; this.open = function () {}; this.setRequestHeader = function () {};
      this.send = function () { clearTimeout(sentTimer); resolveSent(this); };
    };
    translate.progress.api.startUITip();
    translate.lifecycle.execute.translateNetworkAfter.push(function (data) { after = data; afterCalls++; });
    const finished = new Promise(function (resolve) {
      const timer = setTimeout(function () { resolve(false); }, 1500);
      translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timer); resolve(true); });
    });
    translate.execute([text]);
    const xhr = await sent;
    if (xhr === null) return false;
    const pending = afterCalls === 0 && translate.state === 20 && text.nodeValue === '你好' &&
      element.classList.contains('translatejs-text-element-hidden') && element.classList.contains('translate_api_in_progress');
    xhr.readyState = 4; xhr.status = 503; xhr.responseText = 'Service Unavailable'; xhr.onreadystatechange();
    return await finished === true && pending && fetchCalls === 1 && xhrCalls === 1 && afterCalls === 1 && after.result === 0 &&
      after.nodes[0] === text && translate.state === 0 && element.firstChild === text && text.nodeValue === '你好' &&
      !element.classList.contains('translatejs-text-element-hidden') && !element.classList.contains('translate_api_in_progress');
  } },
  { remark: 'SSE 连续错误触发重复收尾时不清理文本移动目标的其他进度样式', test: async function () {
    translate.selectLanguageTag.show = false; translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.request.sse.use = true;
    const oldParent = document.createElement('span'), target = document.createElement('span'), text = document.createTextNode('你好');
    oldParent.append(text); oldParent.style.cssText = 'display:inline-block;width:40px;height:20px';
    const targetClasses = 'target-business translatejs-text-element-hidden translate_api_in_progress';
    target.className = targetClasses; document.body.append(oldParent, target);
    let controller, afterCalls = 0, secondSent = false, firstCleaned = false, resolveFinished, timer;
    window.fetch = function () {
      return Promise.resolve(new Response(new ReadableStream({ start: function (value) { controller = value; } }), { headers: { 'content-type': 'text/event-stream' } }));
    };
    translate.progress.api.startUITip();
    const finished = new Promise(function (resolve) {
      resolveFinished = resolve; timer = setTimeout(function () { resolve(false); }, 1500);
    });
    translate.lifecycle.execute.translateNetworkAfter.push(function () {
      afterCalls++;
      if (afterCalls === 1) {
        firstCleaned = !oldParent.classList.contains('translatejs-text-element-hidden') && !oldParent.classList.contains('translate_api_in_progress');
        target.append(text);
        // 第一轮收尾后再发送第二个错误，验证后续通知不会误清新父元素的其他请求进度。
        controller.enqueue(new TextEncoder().encode('event: error\ndata: {"result":0,"info":"重复错误"}\n\n')); controller.close(); secondSent = true;
        // 已投递第二事件并关闭流；让 Promise 读取链先走完，再到下一轮检查结果。
        // 这里只验证清理结果，不要求 SSE 永久重复分发错误或完成回调。
        setTimeout(function () { clearTimeout(timer); resolveFinished(true); }, 0);
      }
    });
    translate.execute([text]);
    const started = oldParent.classList.contains('translatejs-text-element-hidden') && oldParent.classList.contains('translate_api_in_progress');
    controller.enqueue(new TextEncoder().encode('event: error\ndata: {"result":0,"info":"首次错误"}\n\n'));
    return await finished === true && started && secondSent && afterCalls >= 1 && firstCleaned && translate.state === 0 &&
      text.parentNode === target && text.nodeValue === '你好' && target.className === targetClasses &&
      !oldParent.classList.contains('translatejs-text-element-hidden') && !oldParent.classList.contains('translate_api_in_progress');
  } },
  { remark: 'SSE done 后晚到读取错误重复收尾时保留译文和移动目标的其他进度样式', test: async function () {
    translate.selectLanguageTag.show = false; translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.request.sse.use = true;
    const oldParent = document.createElement('span'), target = document.createElement('span'), text = document.createTextNode('你好');
    oldParent.append(text); oldParent.style.cssText = 'display:inline-block;width:40px;height:20px';
    const targetClasses = 'target-business translatejs-text-element-hidden translate_api_in_progress';
    target.className = targetClasses; document.body.append(oldParent, target);
    let controller, errorSent = false, afterCalls = 0, firstCleaned = false, resolveFinished, timer;
    const bytes = new TextEncoder().encode('event: done\ndata: {"result":1,"from":"chinese_simplified","to":"english","text":["Hello"]}\n\n');
    window.fetch = function () {
      return Promise.resolve(new Response(new ReadableStream({ start: function (value) {
        controller = value; controller.enqueue(bytes);
      } }), { headers: { 'content-type': 'text/event-stream' } }));
    };
    translate.progress.api.startUITip();
    const finished = new Promise(function (resolve) {
      resolveFinished = resolve; timer = setTimeout(function () { resolve(false); }, 1500);
    });
    translate.lifecycle.execute.translateNetworkAfter.push(function () {
      afterCalls++;
      if (afterCalls === 1) {
        firstCleaned = !oldParent.classList.contains('translatejs-text-element-hidden') && !oldParent.classList.contains('translate_api_in_progress');
        target.append(text);
        // 明确等到首次完成后才让后续读取失败，避免依赖固定延时碰巧撞上先后顺序。
        controller.error(new Error('socket closed after done')); errorSent = true;
        // Promise 的读取异常先走完，再于下一轮检查元素；不固化异常必须重复触发收尾的行为。
        setTimeout(function () { clearTimeout(timer); resolveFinished(true); }, 0);
      }
    });
    translate.execute([text]);
    const started = oldParent.classList.contains('translatejs-text-element-hidden') && oldParent.classList.contains('translate_api_in_progress');
    const completed = await finished, record = translate.node.get(text);
    return completed === true && started && afterCalls >= 1 && errorSent && firstCleaned && translate.state === 0 &&
      text.parentNode === target && text.nodeValue === 'Hello' && record.originalText === '你好' && record.resultText === 'Hello' &&
      target.className === targetClasses && !oldParent.classList.contains('translatejs-text-element-hidden') &&
      !oldParent.classList.contains('translate_api_in_progress');
  } }
]);
