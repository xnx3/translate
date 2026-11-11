require('../helpers/module')(__filename, [
  { remark: '未传入请求数据时不触发任何发送操作', test: function () {
    var calls = 0; translate.request.send = function () { calls++; };
    translate.request.post('translate.json');
    return calls === 0;
  } },
  { remark: '普通请求按原样传递数据、成功失败回调及表单请求头', test: function () {
    var args, data = { text: '中文 & = %' }, success = function () {}, failure = function () {}, adapted = 0;
    translate.service.name = 'translate.service'; translate.request.sse.use = false;
    translate.enterprise.automaticAdaptationService = function () { adapted++; };
    translate.request.send = function () { args = Array.from(arguments); };
    translate.request.post('custom.json', data, success, failure);
    return adapted === 1 && args[0] === 'custom.json' && args[1] === data && args[2] === data && args[3] === success && args[4] === 'post' && args[5] === true && args[6]['content-type'] === 'application/x-www-form-urlencoded' && args[7] === failure && args[8] === true;
  } },
  { remark: 'SSE 接管翻译请求时使用独立浅拷贝，并传递本次请求监听', test: function () {
    var data = Object.create({ inherited: '不发送' }); data.text = '原文';
    var args, xhr = 0, callbacks = {}, success = function () {}, failure = function () {};
    translate.service.name = 'translate.service'; translate.enterprise.automaticAdaptationService = function () {};
    translate.request.sse.use = true; translate.request.sse.post = function () { args = Array.from(arguments); args[1].stream = '1'; return true; };
    translate.request.send = function () { xhr++; };
    translate.request.post(translate.request.api.translate, data, success, failure, callbacks);
    return xhr === 0 && args[1] !== data && args[1].text === '原文' && !Object.hasOwn(args[1], 'inherited') && !Object.hasOwn(data, 'stream') && args[2] === success && args[3] === failure && args[5] === callbacks;
  } },
  { remark: 'SSE 不支持时只发送一次原始 JSON 请求', test: function () {
    var calls = 0, sent, data = { text: '原文' };
    translate.service.name = 'translate.service'; translate.enterprise.automaticAdaptationService = function () {};
    translate.request.sse.use = true; translate.request.sse.post = function () { return false; };
    translate.request.send = function (path, value) { calls++; sent = value; };
    translate.request.post(translate.request.api.translate, data, function () {});
    return calls === 1 && sent === data;
  } },
  { remark: 'SSE 异步失败降级时使用原始数据，不把 stream 参数带入 XHR', test: function () {
    var fallback, sent, data = { text: '原文' }, calls = 0;
    translate.service.name = 'translate.service'; translate.enterprise.automaticAdaptationService = function () {};
    translate.request.sse.use = true; translate.request.sse.post = function (path, value, success, failure, retry) { value.stream = '1'; fallback = retry; return true; };
    translate.request.send = function (path, value) { sent = value; calls++; };
    translate.request.post(translate.request.api.translate, data, function () {}); fallback();
    return calls === 1 && sent === data && !Object.hasOwn(sent, 'stream');
  } },
  { remark: '非翻译接口和字符串请求体不进入 SSE 通道', test: function () {
    var sse = 0, xhr = 0;
    translate.service.name = 'translate.service'; translate.enterprise.automaticAdaptationService = function () {};
    translate.request.sse.use = true; translate.request.sse.post = function () { sse++; return true; };
    translate.request.send = function () { xhr++; };
    translate.request.post('other.json', { a: 1 }, function () {});
    translate.request.post(translate.request.api.translate, 'text=hello', function () {});
    return sse === 0 && xhr === 2;
  } },
  { remark: 'client.edge 翻译接口委托 edge，实现不额外调用 XHR', test: function () {
    var data = { text: '原文' }, args, xhr = 0, success = function () {}, failure = function () {};
    translate.enterprise.automaticAdaptationService = function () {}; translate.service.name = 'client.edge';
    translate.service.edge.translate = function () { args = Array.from(arguments); };
    translate.request.send = function () { xhr++; };
    translate.request.post(translate.request.api.translate, data, success, failure);
    return xhr === 0 && args[0] === translate.request.api.translate && args[1] === data && args[2] === success && args[3] === failure;
  } },
  { remark: 'client.edge 语言列表直接回调本地语言数据', test: function () {
    var response, xhr = 0, list = [{ id: 'english', name: 'English' }];
    translate.enterprise.automaticAdaptationService = function () {}; translate.service.name = 'client.edge';
    translate.service.edge.language.json = list; translate.request.send = function () { xhr++; };
    translate.request.post(translate.request.api.language, {}, function (value) { response = value; });
    return xhr === 0 && response.result === 1 && response.info === 'SUCCESS' && response.list === list;
  } }
]);
