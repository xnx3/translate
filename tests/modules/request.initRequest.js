require('../helpers/module')(__filename, [
  { remark: '初始化路径为空时不发送请求', test: function () {
    let calls = 0;
    translate.request.send = function () { calls++; };
    translate.request.api.init = '';
    translate.request.initRequest();
    return calls === 0 && typeof translate.temp_request_init === 'undefined';
  } },
  { remark: '初始化路径为 null 时不发送请求', test: function () {
    let calls = 0;
    translate.request.send = function () { calls++; };
    translate.request.api.init = null;
    translate.request.initRequest();
    return calls === 0;
  } },
  { remark: '初始化请求在多次调用中只发送一次', test: function () {
    const calls = [];
    translate.request.api.init = 'init.json';
    delete translate.temp_request_init;
    translate.request.send = function (url, data, attached, success, method, async, headers, failure, showErrorLog) { calls.push({ url, method, async, showErrorLog }); success({ result: 1, version: '0.0.0' }); };
    translate.request.initRequest();
    translate.request.initRequest();
    return calls.length === 1 && calls[0].url === 'init.json' && calls[0].method === 'post' && calls[0].async === true && calls[0].showErrorLog === false;
  } },
  { remark: '服务端初始化失败被记录但不会重复发送', test: function () {
    let calls = 0;
    const logs = [];
    translate.log = function (message) { logs.push(message); };
    translate.request.api.init = 'init.json';
    delete translate.temp_request_init;
    translate.request.send = function (url, data, attached, success) { calls++; success({ result: 0, info: 'test failure' }); };
    translate.request.initRequest();
    translate.request.initRequest();
    return calls === 1 && logs.some(message => String(message).includes('test failure'));
  } },
  { remark: '较新服务端版本触发升级提示', test: function () {
    const logs = [];
    translate.log = function (message) { logs.push(message); };
    translate.request.api.init = 'init.json';
    delete translate.temp_request_init;
    translate.request.send = function (url, data, attached, success) { success({ result: 1, version: '99.99.99.20991231' }); };
    translate.request.initRequest();
    return logs.some(message => String(message).includes('99.99.99.20991231'));
  } }
]);
