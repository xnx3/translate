require('../helpers/module')(__filename, [
  { remark: '没有请求上下文时按原 XHR 身份直接发送', test: function () {
    const xhr = {}, body = { payload: 'value' }; let received;
    translate.network.originalSend = function (value) { received = { owner: this, value }; return 'sent'; };
    return translate.network.hookSend.call(xhr, body) === 'sent' && received.owner === xhr && received.value === body;
  } },
  { remark: '没有匹配规则时保持请求体', test: function () {
    const xhr = { _requestContext: { matchedRule: null } }; let received;
    translate.network.originalSend = function (value) { received = value; };
    translate.network.hookSend.call(xhr, 'unchanged');
    return received === 'unchanged';
  } },
  { remark: '同步请求不进入异步翻译并保持原请求体', test: function () {
    const xhr = { _requestContext: { matchedRule: {}, async: false, method: 'POST' } }; let body, handled = false;
    translate.network.RequestHandler.handleGet = async function () { handled = true; };
    translate.network.originalSend = function (value) { body = value; };
    translate.network.hookSend.call(xhr, 'original');
    return body === 'original' && handled === false;
  } },
  { remark: '异步 GET 先更新地址和恢复请求头再发送原请求体', test: async function () {
    const rule = { params: ['q'] }, xhr = { _requestContext: { matchedRule: rule, async: true, method: 'GET', originalUrl: '/search?q=old', user: 'u', password: 'p', headers: { 'X-Test': 'value' } } };
    const order = []; let opened, header;
    translate.network.RequestHandler.handleGet = async function (url, actualRule) { order.push('translate'); return actualRule === rule ? '/search?q=new' : 'wrong'; };
    translate.network.originalOpen = function (...args) { order.push('open'); opened = { owner: this, args }; };
    translate.network.setRequestHeaderOriginal = function (name, value) { order.push('header'); header = { owner: this, name, value }; };
    return await new Promise(resolve => {
      translate.network.originalSend = function (body) { order.push('send'); resolve(this === xhr && body === null && opened.owner === xhr && opened.args.join('|') === 'GET|/search?q=new|true|u|p' && header.owner === xhr && header.name === 'X-Test' && header.value === 'value' && order.join(',') === 'translate,open,header,send'); };
      translate.network.hookSend.call(xhr, null);
    });
  } },
  { remark: 'POST JSON 请求交给 JSON 处理器后发送新请求体', test: async function () {
    const xhr = { _requestContext: { matchedRule: {}, async: true, method: 'POST', originalUrl: '/search' } }; let jsonCalls = 0, formCalls = 0;
    translate.network.RequestHandler.handleGet = async function (url) { return url; };
    translate.network.RequestHandler.handleJson = async function (body) { jsonCalls++; return body.includes('old') ? '{"q":"new"}' : body; };
    translate.network.RequestHandler.handleForm = async function () { formCalls++; };
    translate.network.originalOpen = function () {};
    return await new Promise(resolve => {
      translate.network.originalSend = function (body) { resolve(body === '{"q":"new"}' && jsonCalls === 1 && formCalls === 0); };
      translate.network.hookSend.call(xhr, '  {"q":"old"}');
    });
  } },
  { remark: 'POST 表单请求交给表单处理器', test: async function () {
    const xhr = { _requestContext: { matchedRule: {}, async: true, method: 'POST', originalUrl: '/search' } }; let calls = 0;
    translate.network.RequestHandler.handleGet = async function (url) { return url; };
    translate.network.RequestHandler.handleForm = async function (body) { calls++; return body === 'q=old' ? 'q=new' : body; };
    translate.network.originalOpen = function () {};
    return await new Promise(resolve => {
      translate.network.originalSend = function (body) { resolve(body === 'q=new' && calls === 1); };
      translate.network.hookSend.call(xhr, 'q=old');
    });
  } },
  { remark: '达到两千字符的请求体保持原样且不进行正文翻译', test: async function () {
    const xhr = { _requestContext: { matchedRule: {}, async: true, method: 'POST', originalUrl: '/search' } }; let calls = 0; const input = 'a'.repeat(2000);
    translate.network.RequestHandler.handleGet = async function (url) { return url; };
    translate.network.RequestHandler.handleForm = async function () { calls++; };
    translate.network.originalOpen = function () {};
    return await new Promise(resolve => {
      translate.network.originalSend = function (body) { resolve(body === input && calls === 0); };
      translate.network.hookSend.call(xhr, input);
    });
  } },
  { remark: '地址处理失败时仍发送原始请求体一次', test: async function () {
    const xhr = { _requestContext: { matchedRule: {}, async: true, method: 'GET', originalUrl: '/search' } }; let calls = 0;
    translate.network.RequestHandler.handleGet = async function () { throw new Error('test failure'); };
    return await new Promise(resolve => {
      translate.network.originalSend = function (body) { calls++; resolve(body === 'original' && calls === 1 && this === xhr); };
      translate.network.hookSend.call(xhr, 'original');
    });
  } }
]);
