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
  } },
  { remark: '多行匿名函数重建后仍可调用且不修改原函数', test: function () {
    // 逗号表达式避免变量赋值自动推断函数名，覆盖真正的匿名函数源码。
    const fn = (0, function (value) {
      return value + 1;
    });
    const text = translate.js.objToString({ action: fn }, 2);
    const restored = Function('return (' + text + ')')();
    return fn.name === '' && typeof restored.action === 'function' && restored.action(2) === 3 && fn(2) === 3;
  } },
  { remark: '多行具名函数保留下划线名称及调用结果', test: function () {
    const fn = function plus_one(value) {
      return value + 1;
    };
    const text = translate.js.objToString({ action: fn }, 2);
    const restored = Function('return (' + text + ')')();
    return restored.action.name === 'plus_one' && restored.action(2) === 3 && fn(2) === 3;
  } },
  { remark: '多行具名函数保留多个参数及参数顺序', test: function () {
    const fn = function combine(first, second) {
      return first * 10 + second;
    };
    const text = translate.js.objToString({ action: fn }, 2);
    const restored = Function('return (' + text + ')')();
    return restored.action.name === 'combine' && restored.action.length === 2 && restored.action(2, 3) === 23;
  } },
  { remark: '同一对象的两个多行具名函数独立恢复且不修改原函数', test: function () {
    const first = function addOne(value) {
      return value + 1;
    };
    const second = function double(value) {
      return value * 2;
    };
    const text = translate.js.objToString({ first: first, second: second }, 2);
    const restored = Function('return (' + text + ')')();
    return restored.first.name === 'addOne' && restored.second.name === 'double' &&
      restored.first(3) === 4 && restored.second(3) === 6 && first(3) === 4 && second(3) === 6;
  } }
]);
