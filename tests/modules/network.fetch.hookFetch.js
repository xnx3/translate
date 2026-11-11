require('../helpers/module')(__filename, [
  { remark: '无匹配规则的 GET 请求保留地址请求头和返回响应', test: async function () {
    translate.network.rules = []; const response = new Response('ok'); let captured, owner;
    translate.network.fetch.originalFetch = async function (request) { captured = request; owner = this; return response; };
    const result = await translate.network.fetch.hookFetch(location.origin + '/sample?q=old', { headers: { 'X-Test': 'value' }, credentials: 'include' });
    return result === response && owner === window && captured.url === location.origin + '/sample?q=old' && captured.headers.get('X-Test') === 'value' && captured.credentials === 'include';
  } },
  { remark: '无匹配规则的 POST 保留原始请求体', test: async function () {
    translate.network.rules = []; let captured;
    translate.network.fetch.originalFetch = async function (request) { captured = await request.text(); return new Response('ok'); };
    await translate.network.fetch.hookFetch(location.origin + '/sample', { method: 'POST', body: 'q=original' });
    return captured === 'q=original';
  } },
  { remark: '匹配 GET 规则时替换指定参数并保留请求属性', test: async function () {
    translate.network.rules = [{ url: /\/search/, methods: ['GET'], params: ['q'] }]; let captured;
    translate.network._translateText = async function () { return { result: 1, text: ['new'] }; };
    translate.network.fetch.originalFetch = async function (request) { captured = request; return new Response('ok'); };
    await translate.network.fetch.hookFetch(location.origin + '/search?q=old&keep=value#anchor', { headers: { 'X-Test': 'value' }, credentials: 'include', cache: 'no-cache' });
    const url = new URL(captured.url);
    return url.searchParams.get('q') === 'new' && url.searchParams.get('keep') === 'value' && url.hash === '#anchor' && captured.headers.get('X-Test') === 'value' && captured.credentials === 'include' && captured.cache === 'no-cache';
  } },
  { remark: 'Request 对象输入也参与规则匹配和参数翻译', test: async function () {
    translate.network.rules = [{ url: /\/search/, methods: ['GET'], params: ['q'] }]; let captured;
    translate.network._translateText = async function () { return { result: 1, text: ['new'] }; };
    translate.network.fetch.originalFetch = async function (request) { captured = request; return new Response('ok'); };
    await translate.network.fetch.hookFetch(new Request(location.origin + '/search?q=old', { headers: { 'X-Test': 'value' } }));
    return new URL(captured.url).searchParams.get('q') === 'new' && captured.headers.get('X-Test') === 'value';
  } },
  { remark: 'POST JSON 经过 JSON 处理器且保留内容类型', test: async function () {
    translate.network.rules = [{ url: /\/search/, methods: ['POST'], params: ['q'] }]; let body, type, calls = 0;
    translate.network.RequestHandler.handleJson = async function (value) { calls++; return value.includes('old') ? '{"q":"new"}' : value; };
    translate.network.fetch.originalFetch = async function (request) { body = await request.text(); type = request.headers.get('Content-Type'); return new Response('ok'); };
    await translate.network.fetch.hookFetch(location.origin + '/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"q":"old"}' });
    return body === '{"q":"new"}' && type === 'application/json' && calls === 1;
  } },
  { remark: 'POST 表单交给表单处理器且保留请求头', test: async function () {
    translate.network.rules = [{ url: /\/search/, methods: ['POST'], params: ['q'] }]; let body, type, calls = 0;
    translate.network.RequestHandler.handleForm = async function (value) { calls++; return value === 'q=old' ? 'q=new' : value; };
    translate.network.fetch.originalFetch = async function (request) { body = await request.text(); type = request.headers.get('Content-Type'); return new Response('ok'); };
    await translate.network.fetch.hookFetch(location.origin + '/search', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'q=old' });
    return body === 'q=new' && type === 'application/x-www-form-urlencoded' && calls === 1;
  } },
  { remark: '正文恰好两千字符时不进行正文翻译', test: async function () {
    translate.network.rules = [{ url: /\/search/, methods: ['POST'], params: ['q'] }]; let body, calls = 0; const input = 'a'.repeat(2000);
    translate.network.RequestHandler.handleForm = async function () { calls++; };
    translate.network.fetch.originalFetch = async function (request) { body = await request.text(); return new Response('ok'); };
    await translate.network.fetch.hookFetch(location.origin + '/search', { method: 'POST', body: input });
    return body === input && calls === 0;
  } },
  { remark: '其他 HTTP 方法直接保留原请求体', test: async function () {
    translate.network.rules = [{ url: /\/search/, methods: ['PUT'], params: ['q'] }]; let body, method;
    translate.network.fetch.originalFetch = async function (request) { body = await request.text(); method = request.method; return new Response('ok'); };
    await translate.network.fetch.hookFetch(location.origin + '/search', { method: 'PUT', body: 'original' });
    return method === 'PUT' && body === 'original';
  } },
  { remark: '参数处理失败时回落到原始请求', test: async function () {
    translate.network.rules = [{ url: /\/search/, methods: ['GET'], params: ['q'] }]; let captured;
    translate.network.RequestHandler.handleGet = async function () { throw new Error('test failure'); };
    translate.network.fetch.originalFetch = async function (request) { captured = request; return new Response('ok'); };
    await translate.network.fetch.hookFetch(location.origin + '/search?q=original');
    return captured.url === location.origin + '/search?q=original';
  } }
]);
