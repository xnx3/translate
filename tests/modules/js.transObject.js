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
  { remark: '接口业务失败时报告原始原因且不改原文', test: function () {
    const input = { title: '你好' };
    const failures = []; let succeeded = 0;
    for (const [result, info] of [[0, '额度不足'], [401, '账户未激活']]) {
      translate.request.post = (path, data, done) => done({ result, info, text: ['你好'] }, data);
      translate.js.transObject(input, 'english', () => succeeded++, reason => failures.push(reason));
    }
    return succeeded === 0 && failures.join(',') === '额度不足,账户未激活' && input.title === '你好';
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
  } },
  {
    remark: '异步返回前保留原文，返回后同时更新重复字段并保留原容器',
    test: function () {
      const row = { label: '你好' };
      const input = [row, '你好', '世界'];
      let finish, request, output;
      let succeeded = 0, failed = 0;
      translate.request.translateText = (data, done) => { request = data; finish = done; };
      translate.js.transObject(input, 'english', value => { succeeded++; output = value; }, () => failed++);
      if (succeeded !== 0 || failed !== 0 || row.label !== '你好' || input[2] !== '世界' ||
          JSON.stringify(request.texts) !== JSON.stringify(['你好', '世界'])) return false;
      finish({ result: 1, text: ['Hello', 'World'], to: 'english' });
      return succeeded === 1 && failed === 0 && output === input && input[0] === row &&
        row.label === 'Hello' && input[1] === 'Hello' && input[2] === 'World';
    }
  },
  {
    remark: '响应缺少 result 时只触发一次失败，全部嵌套字段仍是原值',
    test: function () {
      const input = { title: '你好', list: ['世界'] };
      let succeeded = 0, failed = 0, message;
      translate.request.translateText = (data, done) => done({ text: ['Hello', 'World'] });
      translate.js.transObject(input, 'english', () => succeeded++, reason => { failed++; message = reason; });
      return succeeded === 0 && failed === 1 && typeof message === 'string' && message.length > 0 &&
        input.title === '你好' && input.list[0] === '世界';
    }
  },
  {
    remark: '忽略列表中的点和美元按字面保护，重复整段文本仅请求一次',
    test: function () {
      translate.ignore.text = ['v1.0', '$9'];
      const input = { first: '甲v1.0乙$9丙', second: '甲v1.0乙$9丙' };
      let request, output;
      translate.request.translateText = (data, done) => {
        request = data.texts;
        done({ result: 1, text: ['壹', '贰', '叁'], to: 'chinese_simplified' });
      };
      translate.js.transObject(input, 'chinese_simplified', value => { output = value; }, () => {});
      return JSON.stringify(request) === JSON.stringify(['甲', '乙', '丙']) && output === input &&
        input.first === '壹v1.0贰$9叁' && input.second === input.first;
    }
  },
  {
    remark: '[E17] 整项是忽略文本时，后续字段仍可回填且保持请求与结果下标对应',
    test: function () {
      translate.ignore.text = ['KEEP'];
      const input = { code: 'KEEP', name: '世界' };
      let request, output;
      translate.request.translateText = (data, done) => {
        request = data.texts;
        done({ result: 1, text: ['World'], to: 'english' });
      };
      translate.js.transObject(input, 'english', value => { output = value; }, () => {});
      return JSON.stringify(request) === JSON.stringify(['世界']) && output === input &&
        input.code === 'KEEP' && input.name === 'World';
    }
  },
  {
    remark: '参数组合：共享子对象与数值形字符串按返回位置回填，数字和只读兄弟字段不变',
    test: async function () {
      const shared = { text: '20' };
      const unchanged = Object.freeze({ count: 20, active: false });
      const input = { card: shared, rows: [shared, unchanged, { text: '3' }] };
      const requests = [];
      translate.request.translateText = (data, done) => {
        requests.push(data.texts.slice());
        queueMicrotask(() => done({ result: 1, to: data.to, text: data.texts.map(s => 'T' + s) }));
      };
      const output = await new Promise((resolve, reject) => translate.js.transObject(input, 'french', resolve, reject));
      return requests.length === 1 && JSON.stringify(requests[0].slice().sort()) === '["20","3"]' &&
        output === input && output.card === output.rows[0] && shared.text === 'T20' &&
        output.rows[2].text === 'T3' && output.rows[1] === unchanged && unchanged.count === 20;
    }
  }
]);
