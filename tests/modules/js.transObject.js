require('../helpers/module')(__filename, [
  { remark: '翻译对象字符串值并保持键名及非字符串值', test: async function () {
    const input = { title: '你好', count: 0, enabled: false, nil: null };
    let request;
    translate.request.translateText = function (data, done) { request = data; done({ result: 1, text: ['Hello'], to: data.to }); };
    return await new Promise(resolve => translate.js.transObject(input, 'english', function (output) { resolve(output === input && output.title === 'Hello' && output.count === 0 && output.enabled === false && output.nil === null && request.from === 'auto' && request.to === 'english' && request.texts[0] === '你好'); }, function () { resolve(false); }));
  } },
  { remark: '重复文本只请求一次并回填所有嵌套位置', test: async function () {
    const input = { title: '你好', nested: { title: '你好' }, list: ['你好', '世界'] };
    let texts;
    translate.request.translateText = function (data, done) { texts = data.texts; done({ result: 1, text: ['Hello', 'World'], to: data.to }); };
    return await new Promise(resolve => translate.js.transObject(input, 'english', function (output) { resolve(texts.length === 2 && output.title === 'Hello' && output.nested.title === 'Hello' && output.list[0] === 'Hello' && output.list[1] === 'World'); }, function () { resolve(false); }));
  } },
  { remark: '空对象成功返回相同对象', test: async function () {
    const input = {};
    translate.request.translateText = function (data, done) { done({ result: 1, text: [], to: data.to }); };
    return await new Promise(resolve => translate.js.transObject(input, 'english', function (output) { resolve(output === input && Object.keys(output).length === 0); }, function () { resolve(false); }));
  } },
  { remark: '函数值保持原函数身份与可调用行为', test: async function () {
    const fn = function () { return 'unchanged'; }, input = { title: '你好', nested: { action: fn } };
    translate.request.translateText = function (data, done) { done({ result: 1, text: ['Hello'], to: data.to }); };
    return await new Promise(resolve => translate.js.transObject(input, 'english', function (output) { resolve(output.title === 'Hello' && output.nested.action === fn && output.nested.action() === 'unchanged'); }, function () { resolve(false); }));
  } },
  { remark: '翻译失败调用失败回调且不改原文', test: async function () {
    const input = { title: '你好' }; let succeeded = false;
    translate.request.translateText = function (data, done) { done({ result: 0, info: 'failure' }); };
    return await new Promise(resolve => translate.js.transObject(input, 'english', function () { succeeded = true; resolve(false); }, function (info) { resolve(succeeded === false && typeof info === 'string' && input.title === '你好'); }));
  } },
  { remark: '忽略文本从待翻译片段中排除并保留在最终结果中', test: async function () {
    translate.ignore.text = ['KEEP'];
    const input = { title: '你好KEEP世界' }; let texts;
    translate.request.translateText = function (data, done) { texts = data.texts; done({ result: 1, text: ['甲', '乙'], to: data.to }); };
    return await new Promise(resolve => translate.js.transObject(input, 'chinese_traditional', function (output) { resolve(texts.join(',') === '你好,世界' && output.title === '甲KEEP乙'); }, function () { resolve(false); }));
  } },
  { remark: '文档支持的根数组翻译应更新全部元素并保留数组身份', test: async function () {
    const input = ['你好', '世界'];
    translate.request.translateText = function (data, done) { done({ result: 1, text: ['Hello', 'World'], to: data.to }); };
    return await new Promise(resolve => translate.js.transObject(input, 'english', function (output) { resolve(output === input && output[0] === 'Hello' && output[1] === 'World'); }, function () { resolve(false); }));
  } },
  { remark: '根数组中的对象文本翻译后保留对象与数组身份', test: async function () {
    const item = { title: '你好', count: 0 }, input = [item];
    let texts;
    translate.request.translateText = function (data, done) {
      texts = data.texts;
      done({ result: 1, text: ['Hello'], to: data.to });
    };
    return await new Promise(resolve => translate.js.transObject(input, 'english', function (output) {
      resolve(output === input && output.length === 1 && output[0] === item &&
        item.title === 'Hello' && item.count === 0 && texts.length === 1 && texts[0] === '你好');
    }, function () { resolve(false); }));
  } },
  { remark: '根数组中的多层数组文本翻译后保留嵌套身份与顺序', test: async function () {
    const inner = ['你好', '世界'], input = [inner];
    let texts;
    translate.request.translateText = function (data, done) {
      texts = data.texts;
      done({ result: 1, text: ['Hello', 'World'], to: data.to });
    };
    return await new Promise(resolve => translate.js.transObject(input, 'english', function (output) {
      resolve(output === input && output.length === 1 && output[0] === inner && inner.length === 2 &&
        inner[0] === 'Hello' && inner[1] === 'World' && texts.length === 2 && texts[0] === '你好' && texts[1] === '世界');
    }, function () { resolve(false); }));
  } },
  { remark: '混合根数组去重翻译并保留非文本值及函数引用', test: async function () {
    let called = 0;
    const fn = function () { called++; return 'unchanged'; };
    const item = { title: '你好', action: fn }, inner = ['世界'];
    const input = ['你好', 0, false, null, fn, item, inner];
    let texts;
    translate.request.translateText = function (data, done) {
      texts = data.texts;
      done({ result: 1, text: ['Hello', 'World'], to: data.to });
    };
    return await new Promise(resolve => translate.js.transObject(input, 'english', function (output) {
      resolve(output === input && output.length === 7 && output[0] === 'Hello' && output[1] === 0 &&
        output[2] === false && output[3] === null && output[4] === fn && output[5] === item &&
        output[6] === inner && item.title === 'Hello' && item.action === fn && called === 0 &&
        inner.length === 1 && inner[0] === 'World' && texts.length === 2 && texts[0] === '你好' && texts[1] === '世界');
    }, function () { resolve(false); }));
  } }
]);
