require('../helpers/module')(__filename, [
  { remark: '记录匹配规则并按原始参数和 XHR 身份调用 open', test: function () {
    const xhr = {}, rule = { url: /search/, methods: ['GET'], params: ['q'] }; let received;
    translate.network.rules = [rule];
    translate.network.originalOpen = function (...args) { received = { owner: this, args }; return 'opened'; };
    const result = translate.network.hookOpen.call(xhr, 'get', '/search?q=x', true, 'user', 'password');
    return result === 'opened' && received.owner === xhr && received.args.join('|') === 'get|/search?q=x|true|user|password' && xhr._requestContext.method === 'GET' && xhr._requestContext.matchedRule === rule && xhr._requestContext.originalUrl === '/search?q=x';
  } },
  { remark: '不匹配的请求同样记录上下文但没有翻译规则', test: function () {
    const xhr = {}; translate.network.rules = []; let calls = 0;
    translate.network.originalOpen = function () { calls++; };
    translate.network.hookOpen.call(xhr, 'POST', '/other', true);
    return calls === 1 && xhr._requestContext.matchedRule === null && xhr._requestContext.method === 'POST' && xhr._requestContext.async === true;
  } },
  { remark: '同步标志和可选认证参数保持原值', test: function () {
    const xhr = {}; let args; translate.network.rules = [];
    translate.network.originalOpen = function (...values) { args = values; };
    translate.network.hookOpen.call(xhr, 'GET', '/path', false);
    return xhr._requestContext.async === false && args[2] === false && args[3] === undefined && args[4] === undefined;
  } },
  { remark: '复用 XHR 打开新地址时替换旧请求上下文', test: function () {
    const xhr = { _requestContext: { headers: { stale: 'old' } } }; translate.network.rules = [];
    translate.network.originalOpen = function () {};
    translate.network.hookOpen.call(xhr, 'GET', '/first', true); translate.network.hookOpen.call(xhr, 'POST', '/second', true);
    return xhr._requestContext.originalUrl === '/second' && xhr._requestContext.method === 'POST' && !('headers' in xhr._requestContext);
  } }
]);
