require('../helpers/module')(__filename, [
  { remark: '只将指定 JSON 字符串字段替换为翻译文本', test: async function () {
    translate.network._translateText = async function () { return { result: 1, text: ['你好'] }; };
    const output = JSON.parse(await translate.network.RequestHandler.handleJson('{"q":"Hello","keep":0,"enabled":false}', { params: ['q'] }));
    return output.q === '你好' && output.keep === 0 && output.enabled === false;
  } },
  { remark: '空参数列表保留全部 JSON 数据', test: async function () {
    let called = false; translate.network._translateText = async function () { called = true; };
    const output = JSON.parse(await translate.network.RequestHandler.handleJson('{"q":"original","nested":{"a":1}}', { params: [] }));
    return called === false && output.q === 'original' && output.nested.a === 1;
  } },
  { remark: '规则字段不存在时不调用翻译且不新增字段', test: async function () {
    let called = false; translate.network._translateText = async function () { called = true; };
    const output = JSON.parse(await translate.network.RequestHandler.handleJson('{"keep":"value"}', { params: ['missing'] }));
    return called === false && output.keep === 'value' && !('missing' in output);
  } },
  { remark: '多个选择字段分别替换为对应译文', test: async function () {
    translate.network._translateText = async function (text) { return { result: 1, text: ['translated-' + text] }; };
    const output = JSON.parse(await translate.network.RequestHandler.handleJson('{"a":"one","b":"two","keep":null}', { params: ['a', 'b'] }));
    return output.a === 'translated-one' && output.b === 'translated-two' && output.keep === null;
  } },
  { remark: '无效 JSON 原样返回', args: ['{broken', { params: ['q'] }], expected: '{broken' },
  { remark: '翻译抛错时返回原始 JSON 字符串', test: async function () {
    translate.network._translateText = async function () { throw new Error('test failure'); };
    const input = '{"q":"original"}';
    return await translate.network.RequestHandler.handleJson(input, { params: ['q'] }) === input;
  } }
]);
