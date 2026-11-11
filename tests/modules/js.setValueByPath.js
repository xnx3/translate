require('../helpers/module')(__filename, [
  { remark: '设置顶层属性并保留其他字段', test: function () {
    const object = { a: 'old', b: 'keep' };
    const result = translate.js.setValueByPath(object, 'a', 'new');
    return result === undefined && object.a === 'new' && object.b === 'keep';
  } },
  { remark: '点路径更新多层对象中的目标字段', test: function () {
    const object = { a: { b: { value: 'old', other: 'keep' } } };
    translate.js.setValueByPath(object, 'a.b.value', 'new');
    return object.a.b.value === 'new' && object.a.b.other === 'keep';
  } },
  { remark: '括号路径更新对象内数组的指定元素', test: function () {
    const object = { list: ['first', 'second'] };
    translate.js.setValueByPath(object, 'list[1]', 'new');
    return object.list.length === 2 && object.list[0] === 'first' && object.list[1] === 'new';
  } },
  { remark: '对象与数组混合路径准确定位嵌套值', test: function () {
    const object = { groups: [{ values: ['old', 'keep'] }] };
    translate.js.setValueByPath(object, 'groups[0].values[0]', 'new');
    return object.groups[0].values[0] === 'new' && object.groups[0].values[1] === 'keep';
  } },
  { remark: '数字零不会被当成缺少替换值', test: function () {
    const object = { value: 1 }; translate.js.setValueByPath(object, 'value', 0);
    return object.value === 0;
  } },
  { remark: '布尔 false 可以作为替换值', test: function () {
    const object = { value: true }; translate.js.setValueByPath(object, 'value', false);
    return object.value === false;
  } },
  { remark: '空字符串和 undefined 都能作为实际替换值', test: function () {
    const object = { a: 'old', b: 'old' }; translate.js.setValueByPath(object, 'a', ''); translate.js.setValueByPath(object, 'b', undefined);
    return object.a === '' && Object.hasOwn(object, 'b') && object.b === undefined;
  } },
  { remark: '对象值保持引用且不替换父容器身份', test: function () {
    const parent = { value: null }, object = { parent }, replacement = { a: 1 };
    translate.js.setValueByPath(object, 'parent.value', replacement);
    return object.parent === parent && object.parent.value === replacement;
  } }
]);
