require('../helpers/module')(__filename, [
  { remark: '旧对象参数默认采用四空格格式化', args: [{ a: 'hello' }], expected: '{\n    "a": "hello"\n}' },
  { remark: '第二个参数可指定两空格缩进', args: [{ a: { b: 1 } }, 2], expected: '{\n  "a": {\n    "b": 1\n  }\n}' },
  { remark: '零缩进输出紧凑字符串', args: [{ a: 1, b: false }, 0], expected: '{"a":1,"b":false}' },
  { remark: '数组元素按原顺序输出', args: [['hello', 0, false, null], 0], expected: '["hello",0,false,null]' },
  { remark: '新配置对象支持 jsObject 和指定缩进', args: [{ jsObject: { a: 'hello' }, formatSupplementaryCharLength: 2 }], expected: '{\n  "a": "hello"\n}' },
  { remark: '第二参数优先于配置对象的缩进', args: [{ jsObject: { a: 1 }, formatSupplementaryCharLength: 4 }, 0], expected: '{"a":1}' },
  { remark: '文本中的换行保留为字符串转义而不是函数换行', args: [{ text: 'first\nsecond' }, 0], expected: '{"text":"first\\nsecond"}' },
  { remark: '多行函数仍输出为可调用的函数表达式', test: function () {
    const fn = function plus(value) {
      return value + 1;
    };
    const text = translate.js.objToString({ action: fn }, 2);
    const restored = Function('return (' + text + ')')();
    return typeof restored.action === 'function' && restored.action(2) === 3;
  } },
  { remark: '函数体处理器只修改输出函数体且不改原函数', test: function () {
    const fn = function plus(value) {
      return value + 1;
    };
    const text = translate.js.objToString({ jsObject: { action: fn }, functionBodyHandle: function (body) { return body.replace('value + 1', 'value + 2'); } });
    const restored = Function('return (' + text + ')')();
    return restored.action(2) === 4 && fn(2) === 3;
  } }
]);
