require('../helpers/module')(__filename, [
  { remark: '启用后 XHR open 经过翻译上下文包装并保留原调用', test: function () {
    let owner, args; translate.network.rules = [];
    translate.network.originalOpen = function (...values) { owner = this; args = values; };
    translate.network.use();
    const xhr = new XMLHttpRequest(); xhr.open('GET', '/sample', true);
    return translate.network.isUse === true && owner === xhr && args[1] === '/sample' && xhr._requestContext.originalUrl === '/sample';
  } },
  { remark: '启用后的 send 在未匹配规则时仍调用原发送边界', test: function () {
    let owner, body; translate.network.originalSend = function (value) { owner = this; body = value; };
    translate.network.use(); const xhr = new XMLHttpRequest(); xhr.send('body');
    return owner === xhr && body === 'body';
  } },
  { remark: '启用后的 setRequestHeader 仍记录头与原 XHR 身份', test: function () {
    let owner; translate.network.setRequestHeaderOriginal = function () { owner = this; };
    translate.network.use(); const xhr = new XMLHttpRequest(); xhr._requestContext = {}; xhr.setRequestHeader('X-Test', 'value');
    return owner === xhr && xhr._requestContext.headers['X-Test'] === 'value';
  } },
  { remark: '启用后 fetch 经由对应 fetch hook', test: async function () {
    let args, owner; const response = new Response('ok');
    translate.network.fetch.hookFetch = async function (...values) { owner = this; args = values; return response; };
    translate.network.use(); const result = await fetch('/sample', { method: 'GET' });
    return result === response && owner === translate.network.fetch && args[0] === '/sample' && args[1].method === 'GET';
  } }
]);
