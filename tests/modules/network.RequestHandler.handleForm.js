require('../helpers/module')(__filename, [
  { remark: '表单只替换指定参数并保留未选中的参数', test: async function () {
    translate.network._translateText = async function () { return { result: 1, text: ['你好'] }; };
    const output = new URLSearchParams(await translate.network.RequestHandler.handleForm('q=Hello&keep=value', { params: ['q'] }));
    return output.get('q') === '你好' && output.get('keep') === 'value';
  } },
  { remark: '无待翻译参数时表单数据保持完整', test: async function () {
    let calls = 0; translate.network._translateText = async function () { calls++; };
    const output = new URLSearchParams(await translate.network.RequestHandler.handleForm('a=one&b=two', { params: [] }));
    return calls === 0 && output.get('a') === 'one' && output.get('b') === 'two';
  } },
  { remark: '规则参数不存在时保留其他表单值', test: async function () {
    let calls = 0; translate.network._translateText = async function () { calls++; };
    const output = new URLSearchParams(await translate.network.RequestHandler.handleForm('keep=value', { params: ['missing'] }));
    return calls === 0 && output.get('keep') === 'value';
  } },
  { remark: '编码过的中文和空值经过选择性翻译后仍可正确解码', test: async function () {
    translate.network._translateText = async function (text) { return { result: 1, text: [text === '' ? 'empty' : '结果'] }; };
    const output = new URLSearchParams(await translate.network.RequestHandler.handleForm('q=%E4%BD%A0%E5%A5%BD&empty=&keep=a%2Bb', { params: ['q', 'empty'] }));
    return output.get('q') === '结果' && output.get('empty') === 'empty' && output.get('keep') === 'a+b';
  } },
  { remark: '翻译异常时原始表单字符串原样返回', test: async function () {
    translate.network._translateText = async function () { throw new Error('test failure'); };
    const input = 'q=original&keep=value';
    return await translate.network.RequestHandler.handleForm(input, { params: ['q'] }) === input;
  } }
]);
