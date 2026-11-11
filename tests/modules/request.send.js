// 各类原始响应各占一条用例；此处只生成不依赖外部变量的浏览器测试函数。
const rawResponseCases = ['plain text', '[1,2]', '', null].map(function (value) {
  const literal = JSON.stringify(value);
  return { remark: '响应 ' + literal + ' 按原始 responseText 单参数返回', test: new Function(`
    var received, count;
    window.XMLHttpRequest = function () { this.open = function () {}; this.setRequestHeader = function () {}; this.send = function () {}; };
    var xhr = translate.request.send('/test', {}, {}, function (value) { received = value; count = arguments.length; }, 'post', true, {}, null, false);
    xhr.readyState = 4; xhr.status = 200; xhr.responseText = ${literal}; xhr.onreadystatechange();
    return received === ${literal} && count === 1;
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '构造相对地址请求，发送编码参数、合并请求头并保留附加数据', test: function () {
    var opened, headers = {}, body, append = { uuid: 'unit' };
    window.XMLHttpRequest = function () { this.open = function () { opened = Array.from(arguments); }; this.setRequestHeader = function (key, value) { headers[key] = value; }; this.send = function (value) { body = value; }; };
    translate.request.api.host = ['https://api.example/']; translate.request.appendHeaders = { 'X-Global': 'global' };
    // send 接收的字段遵循现有表单协议：业务层先编码正文，发送层追加公共参数。
    var encoded = encodeURIComponent('中文 &=+');
    var xhr = translate.request.send('test.json', { text: encoded }, append, function () {}, 'post', true, { 'X-Local': 'local' }, null, false);
    return opened[0] === 'post' && opened[1] === 'https://api.example/test.json?v=' + translate.version && opened[2] === true && xhr.data === append && new URLSearchParams(body).get('text') === '中文 &=+' && headers['X-Local'] === 'local' && headers['X-Global'] === 'global';
  } },
  { remark: '绝对 HTTP 和 HTTPS 地址保持原样，保留同步参数并返回 XHR', test: function () {
    var opened = [];
    window.XMLHttpRequest = function () { this.open = function () { opened.push(Array.from(arguments)); }; this.setRequestHeader = function () {}; this.send = function () {}; };
    var first = translate.request.send('http://example.com/a', '', {}, function () {}, 'get', false, {}, null, false);
    var second = translate.request.send('https://example.com/b', '', {}, function () {}, 'post', true, {}, null, false);
    return first !== second && opened[0][1] === 'http://example.com/a' && opened[0][2] === false && opened[1][1] === 'https://example.com/b';
  } },
  { remark: 'JSON 成功响应先经过 response 拦截，再携带数据和 XHR 回调业务', test: function () {
    var calls = [], append = { uuid: 'unit' }, received;
    window.XMLHttpRequest = function () { this.open = function () {}; this.setRequestHeader = function () {}; this.send = function () {}; };
    translate.request.response = function (xhr) { calls.push('intercept'); xhr.intercepted = true; };
    var xhr = translate.request.send('/test', {}, append, function (value, data, request) { calls.push('success'); received = value.result === 1 && data === append && request === xhr && request.intercepted === true; }, 'post', true, {}, null, false);
    xhr.readyState = 3; xhr.status = 200; xhr.responseText = '{"result":1}'; xhr.onreadystatechange();
    if (calls.length) return false;
    xhr.readyState = 4; xhr.onreadystatechange();
    return received === true && JSON.stringify(calls) === '["intercept","success"]';
  } },
  ...rawResponseCases,
  { remark: '含大括号但不是合法 JSON 的文本记录解析异常，仍返回原始文本', test: function () {
    var received, logs = 0;
    window.XMLHttpRequest = function () { this.open = function () {}; this.setRequestHeader = function () {}; this.send = function () {}; };
    translate.log = function () { logs++; };
    var xhr = translate.request.send('/test', {}, {}, function (value) { received = value; }, 'post', true, {}, null, false);
    xhr.readyState = 4; xhr.status = 200; xhr.responseText = 'message {invalid}'; xhr.onreadystatechange();
    return received === 'message {invalid}' && logs === 1;
  } },
  { remark: 'HTTP 失败先经过 response 拦截，再携带完整地址调用失败回调', test: function () {
    var calls = [], received, success = 0;
    window.XMLHttpRequest = function () { this.open = function () {}; this.setRequestHeader = function () {}; this.send = function () {}; };
    translate.request.response = function (xhr) { calls.push('intercept'); };
    var xhr = translate.request.send('https://example.com/fail', {}, {}, function () { success++; }, 'post', true, {}, function (value) { calls.push('failure'); received = value; }, false);
    xhr.readyState = 4; xhr.status = 503; xhr.responseText = 'Unavailable'; xhr.onreadystatechange();
    return success === 0 && received === xhr && xhr.requestURL === 'https://example.com/fail' && JSON.stringify(calls) === '["intercept","failure"]';
  } },
  { remark: '未提供失败回调时 HTTP 错误不抛异常', test: function () {
    window.XMLHttpRequest = function () { this.open = function () {}; this.setRequestHeader = function () {}; this.send = function () {}; };
    var xhr = translate.request.send('https://example.com/fail', {}, {}, function () { throw new Error('不应成功'); }, 'post', true, {}, null, false);
    xhr.readyState = 4; xhr.status = 0; xhr.onreadystatechange();
    return xhr.requestURL === 'https://example.com/fail';
  } },
  { remark: 'XMLHttpRequest 构造失败时使用兼容的 ActiveXObject 通道', test: function () {
    var name, sent = false;
    window.XMLHttpRequest = function () { throw new Error('unavailable'); };
    window.ActiveXObject = function (value) { name = value; this.open = function () {}; this.setRequestHeader = function () {}; this.send = function () { sent = true; }; };
    var xhr = translate.request.send('https://example.com/test', {}, {}, function () {}, 'post', true, {}, null, false);
    return name === 'Microsoft.XMLHTTP' && sent && typeof xhr.onreadystatechange === 'function';
  } }
]);
