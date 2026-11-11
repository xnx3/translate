require('../helpers/module')(__filename, [
  { remark: '只翻译指定查询参数并保留其他参数及片段', test: async function () {
    const requested = [];
    translate.network._translateText = async function (text) { requested.push(text); return { result: 1, text: [encodeURIComponent('你好世界')] }; };
    const output = new URL(await translate.network.RequestHandler.handleGet('https://example.com/search?q=Hello&other=keep#anchor', { params: ['q'] }));
    return output.searchParams.get('q') === '你好世界' && output.searchParams.get('other') === 'keep' && output.hash === '#anchor' && requested.join(',') === 'Hello';
  } },
  { remark: '相对路径按当前页面 origin 解析', test: async function () {
    translate.network._translateText = async function () { return { result: 1, text: ['changed'] }; };
    const output = new URL(await translate.network.RequestHandler.handleGet('/search?q=hello', { params: ['q'] }));
    return output.origin === location.origin && output.pathname === '/search' && output.searchParams.get('q') === 'changed';
  } },
  { remark: '未出现的规则参数不触发翻译', test: async function () {
    let calls = 0; translate.network._translateText = async function () { calls++; };
    const output = new URL(await translate.network.RequestHandler.handleGet('https://example.com/search?other=value', { params: ['missing'] }));
    return calls === 0 && output.searchParams.get('other') === 'value';
  } },
  { remark: '多个指定参数分别翻译且保留空参数值', test: async function () {
    const requested = [];
    translate.network._translateText = async function (text) { requested.push(text); return { result: 1, text: ['translated-' + text] }; };
    const output = new URL(await translate.network.RequestHandler.handleGet('https://example.com/?a=one&b=', { params: ['a', 'b'] }));
    return requested.length === 2 && requested[0] === 'one' && requested[1] === '' && output.searchParams.get('a') === 'translated-one' && output.searchParams.get('b') === 'translated-';
  } },
  { remark: '翻译逻辑失败时保留原参数', test: async function () {
    translate.network._translateText = async function () { return { result: 0, info: 'failure' }; };
    const output = new URL(await translate.network.RequestHandler.handleGet('https://example.com/?q=original', { params: ['q'] }));
    return output.searchParams.get('q') === 'original';
  } },
  { remark: '翻译抛错时返回原始 URL', test: async function () {
    translate.network._translateText = async function () { throw new Error('test failure'); };
    const input = '/search?q=original';
    return await translate.network.RequestHandler.handleGet(input, { params: ['q'] }) === input;
  } },
  { remark: '缺少参数列表的规则不修改业务参数', test: async function () {
    let called = false; translate.network._translateText = async function () { called = true; };
    const output = new URL(await translate.network.RequestHandler.handleGet('https://example.com/?q=original', {}));
    return called === false && output.searchParams.get('q') === 'original';
  } }
]);
