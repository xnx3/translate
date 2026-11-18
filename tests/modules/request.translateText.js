// 非支持类型各自独立报告；参数表达式内嵌，浏览器执行时不引用外层变量。
const invalidCases = [
  ['undefined', 'undefined'], ['null', 'null'], ['数字', '42'], ['布尔', 'true'], ['函数', 'function () {}']
].map(function (item) {
  return { remark: '不支持的顶层' + item[0] + '参数记录错误并退出', test: new Function(`
    var calls = 0, logs = 0;
    translate.request.post = function () { calls++; }; translate.log = function () { logs++; };
    translate.request.translateText(${item[1]}, function () { calls++; });
    return calls === 0 && logs === 1;
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '单字符串使用默认来源和目标语言，保留特殊字符并写入缓存', test: function () {
    translate.language.setLocal('chinese_simplified'); translate.storage.set('to', 'english');
    var posted, response, text = '你好 &=+😀', stored;
    translate.request.post = function (path, data, success) { posted = data; success({ result: 1, text: ['Hello'] }, data); };
    translate.request.translateText(text, function (data) { response = data; });
    stored = translate.storage.get('hash_english_' + translate.util.hash(text));
    return posted.from === 'chinese_simplified' && posted.to === 'english' && JSON.parse(decodeURIComponent(posted.text))[0] === text && response.text[0] === 'Hello' && stored === 'Hello';
  } },
  { remark: '显式对象可以覆盖来源和目标语言，texts 字符串转为单项数组', test: function () {
    var posted, response;
    translate.language.setLocal('chinese_simplified'); translate.storage.set('to', 'english');
    translate.request.post = function (path, data, success) { posted = data; success({ result: 1, text: ['Bonjour'] }, data); };
    translate.request.translateText({ from: 'english', to: 'french', texts: 'Hello' }, function (data) { response = data; });
    return posted.from === 'english' && posted.to === 'french' && posted.text === encodeURIComponent('["Hello"]') && response.text[0] === 'Bonjour';
  } },
  { remark: '混合缓存命中时仅请求未命中文本，并按原始位置合并结果', test: function () {
    translate.language.setLocal('chinese_simplified'); translate.storage.set('to', 'english');
    translate.storage.set('hash_english_' + translate.util.hash('甲'), 'A');
    var posted, response, input = ['甲', '乙', '甲', '丙'];
    translate.request.post = function (path, data, success) { posted = JSON.parse(decodeURIComponent(data.text)); success({ result: 1, text: ['B', 'C'] }, data); };
    translate.request.translateText(input, function (data) { response = data; });
    return JSON.stringify(posted) === '["乙","丙"]' && JSON.stringify(response.text) === '["A","B","A","C"]' && JSON.stringify(input) === '["甲","乙","甲","丙"]';
  } },
  { remark: '全部命中缓存时同步成功，不发送网络请求', test: function () {
    translate.language.setLocal('chinese_simplified'); translate.storage.set('to', 'english');
    translate.storage.set('hash_english_' + translate.util.hash('甲'), 'A');
    var calls = 0, result;
    translate.request.post = function () { calls++; };
    translate.request.translateText(['甲', '甲'], function (data) { result = data; });
    return calls === 0 && result.result === 1 && result.from === 'chinese_simplified' && result.to === 'english' && JSON.stringify(result.text) === '["A","A"]';
  } },
  { remark: '空数组返回空的成功结果，不请求接口', test: function () {
    var calls = 0, result;
    translate.request.post = function () { calls++; };
    translate.request.translateText([], function (data) { result = data; });
    return calls === 0 && result.result === 1 && result.text.length === 0;
  } },
  { remark: '关闭翻译 API 后对未缓存文本不发送请求或伪造成功', test: function () {
    var calls = 0, success = 0;
    translate.request.api.translate = ''; translate.request.post = function () { calls++; };
    translate.request.translateText('未缓存的内容', function () { success++; });
    return calls === 0 && success === 0;
  } },
  { remark: '请求异常原样转交失败回调，不调用成功回调', test: function () {
    var success = 0, received, xhr = { status: 503 };
    translate.request.post = function (path, data, callback, failure) { failure(xhr); };
    translate.request.translateText('甲', function () { success++; }, function (value) { received = value; });
    return success === 0 && received === xhr;
  } },
  { remark: '失败回调未提供或不是函数时可安全忽略请求异常', test: function () {
    var calls = 0;
    translate.request.post = function (path, data, callback, failure) { calls++; failure({ status: 500 }); };
    translate.request.translateText('甲', function () {});
    translate.request.translateText('乙', function () {}, 'invalid');
    return calls === 2;
  } },
  { remark: '接口业务失败时记录错误，不写入缓存或调用成功回调', test: function () {
    var success = 0, logs = 0; translate.language.setLocal('chinese_simplified'); translate.storage.set('to', 'english');
    translate.log = function () { logs++; };
    translate.request.post = function (path, data, callback) { callback({ result: 0, info: '额度不足' }, data); };
    translate.request.translateText('甲', function () { success++; });
    return success === 0 && logs > 0 && translate.storage.get('hash_english_' + translate.util.hash('甲')) == null;
  } },
  { remark: '开启离线全量提取时同时保存原文、目标语言和译文', test: function () {
    var extracted;
    translate.language.setLocal('chinese_simplified'); translate.storage.set('to', 'english'); translate.offline.fullExtract.isUse = true;
    translate.offline.fullExtract.set = function () { extracted = Array.from(arguments); };
    translate.request.post = function (path, data, callback) { callback({ result: 1, text: ['A'] }, data); };
    translate.request.translateText(['甲'], function () {});
    return extracted[0] === translate.util.hash('甲') && extracted[1] === '甲' && extracted[2] === 'english' && extracted[3] === 'A';
  } },
  { remark: '空或非字符串的 from、to 独立回退到本地语种和当前语种', test: function () {
    translate.language.setLocal('chinese_simplified');
    translate.storage.set('to', 'english');
    const results = [];
    const options = [
      { from: '', to: 'french' }, { from: 'japanese', to: '' },
      { from: null, to: false }, { from: 1, to: [] }
    ];
    for (const option of options) {
      translate.request.translateText({ ...option, texts: [] }, value => results.push([value.from, value.to]));
    }
    return JSON.stringify(results) === JSON.stringify([
      ['chinese_simplified', 'french'], ['japanese', 'english'],
      ['chinese_simplified', 'english'], ['chinese_simplified', 'english']
    ]);
  } },
  { remark: '响应比未缓存文本短时原位置保留空值，缓存只写入已返回的结果', test: function () {
    const prefix = 'hash_english_';
    const cacheKey = text => prefix + translate.util.hash(text);
    translate.storage.set(cacheKey('甲'), 'A');
    const stored = [], set = translate.storage.set.bind(translate.storage);
    translate.storage.set = function (key, value) { stored.push([key, value]); set(key, value); };
    translate.request.post = function (path, data, success) {
      success({ result: 1, text: ['B'] }, data);
    };
    let response;
    translate.request.translateText({ to: 'english', texts: ['乙', '甲', '丙'] }, value => { response = value; });
    return JSON.stringify(response.text) === '["B","A",""]' &&
      JSON.stringify(stored) === JSON.stringify([[cacheKey('乙'), 'B']]) &&
      translate.storage.get(cacheKey('丙')) === null;
  } },
  { remark: '响应比请求多时忽略多余译文，离线提取与缓存都只保存对应源文本', test: function () {
    translate.offline.fullExtract.isUse = true;
    const saved = [], extracted = [];
    translate.storage.set = function (key, value) { saved.push([key, value]); };
    translate.offline.fullExtract.set = function (...args) { extracted.push(args); };
    translate.request.post = function (path, data, success) {
      success({ result: 1, text: ['Hello', 'extra'] }, data);
    };
    let response;
    translate.request.translateText({ to: 'english', texts: ['你好'] }, value => { response = value; });
    const hash = translate.util.hash('你好');
    return JSON.stringify(response.text) === '["Hello"]' &&
      JSON.stringify(saved) === JSON.stringify([['hash_english_' + hash, 'Hello']]) &&
      JSON.stringify(extracted) === JSON.stringify([[hash, '你好', 'english', 'Hello']]);
  } },
  { remark: '交错完成的两次请求各自保留目标语种、缓存键和结果位置', test: function () {
    const pending = [], completed = [];
    translate.request.post = function (path, data, success) { pending.push({ data, success }); };
    for (const to of ['english', 'french']) {
      translate.request.translateText({ to, texts: ['你好'] }, result => completed.push([to, result.text[0]]));
    }
    pending[1].success({ result: 1, text: ['Bonjour'] }, pending[1].data);
    pending[0].success({ result: 1, text: ['Hello'] }, pending[0].data);
    const hash = translate.util.hash('你好');
    return JSON.stringify(completed) === '[["french","Bonjour"],["english","Hello"]]' &&
      translate.storage.get('hash_french_' + hash) === 'Bonjour' &&
      translate.storage.get('hash_english_' + hash) === 'Hello';
  } },
  ...invalidCases
]);
