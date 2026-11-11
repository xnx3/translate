require('../helpers/module')(__filename, [
  { remark: '空对象返回空的字符串及函数映射', args: [{}], expected: { stringResult: {}, functionResult: {} } },
  { remark: '空数组返回空映射', args: [[]], expected: { stringResult: {}, functionResult: {} } },
  { remark: '单个字符串使用空路径记录', args: ['hello'], expected: { stringResult: { hello: [''] }, functionResult: {} } },
  { remark: '指定父路径时单个字符串保留该路径', args: ['hello', 'root'], expected: { stringResult: { hello: ['root'] }, functionResult: {} } },
  { remark: '顶层不同文本分别记录属性路径', args: [{ title: 'hello', description: 'world' }], expected: { stringResult: { hello: ['title'], world: ['description'] }, functionResult: {} } },
  { remark: '重复文本汇总全部对象和数组路径', args: [{ title: 'same', nested: { value: 'same' }, list: ['same', 'other'] }], expected: { stringResult: { same: ['title', 'nested.value', 'list[0]'], other: ['list[1]'] }, functionResult: {} } },
  { remark: '根数组记录括号下标路径', args: [['a', { key: 'b' }]], expected: { stringResult: { a: ['[0]'], b: ['[1].key'] }, functionResult: {} } },
  { remark: '空字符串仍作为可定位的文本值', args: [{ key: '' }], expected: { stringResult: { '': ['key'] }, functionResult: {} } },
  { remark: '数字布尔和空值不混入字符串映射', args: [{ number: 0, flag: false, nil: null, text: 'ok' }], expected: { stringResult: { ok: ['text'] }, functionResult: {} } },
  { remark: 'null 本身返回空映射', args: [null], expected: { stringResult: {}, functionResult: {} } },
  { remark: 'undefined 本身返回空映射', args: [undefined], expected: { stringResult: {}, functionResult: {} } },
  { remark: '嵌套函数保留引用且不会执行函数', test: function () {
    let called = 0; const fn = function () { called++; };
    const object = { value: 'hello', nested: { action: fn }, list: [fn] };
    const result = translate.js.find(object);
    return result.functionResult['nested.action'] === fn && result.functionResult['list[0]'] === fn && called === 0 && object.nested.action === fn && result.stringResult.hello[0] === 'value';
  } }
]);
