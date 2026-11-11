require('../helpers/module')(__filename, [
  { remark: '未切换语种时保留原文且不调用翻译服务', test: async function () {
    translate.language.setLocal('chinese_simplified'); let calls = 0;
    translate.request.translateText = function () { calls++; };
    const result = await translate.network._translateText('你好');
    return calls === 0 && result.from === 'auto' && result.to === 'chinese_simplified' && result.text[0] === '你好';
  } },
  { remark: '输入本身为本地语种时不进行重复翻译', test: async function () {
    translate.language.setLocal('chinese_simplified'); translate.language.setDefaultTo('english'); let calls = 0;
    translate.request.translateText = function () { calls++; };
    const result = await translate.network._translateText('这是一个中文句子');
    return calls === 0 && result.text[0] === '这是一个中文句子' && result.to === 'chinese_simplified';
  } },
  { remark: '其他语种输入向本地语种翻译并保留成功响应', test: async function () {
    translate.language.setLocal('chinese_simplified'); translate.language.setDefaultTo('english'); let requested;
    const response = { result: 1, from: 'english', to: 'chinese_simplified', text: ['你好'] };
    translate.request.translateText = function (data, done) { requested = data; done(response); };
    const result = await translate.network._translateText('Hello world');
    return requested.from === 'auto' && requested.to === 'chinese_simplified' && requested.texts.length === 1 && requested.texts[0] === 'Hello world' && result === response;
  } },
  { remark: '翻译服务逻辑失败时 Promise 拒绝并保留原因', test: async function () {
    translate.language.setLocal('chinese_simplified'); translate.language.setDefaultTo('english');
    const response = { result: 0, info: 'test failure' };
    translate.request.translateText = function (data, done) { done(response); };
    try { await translate.network._translateText('Hello world'); return false; } catch (error) { return error === response; }
  } },
  { remark: '空字符串在未切换语种时保持为空', test: async function () {
    translate.language.setLocal('english');
    const result = await translate.network._translateText('');
    return result.text.length === 1 && result.text[0] === '';
  } }
]);
