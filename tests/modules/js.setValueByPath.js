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
  } },
  { remark: '根数组零号下标路径更新元素并保留相邻对象', test: function () {
    const sibling = { keep: true }, array = ['old', sibling];
    const result = translate.js.setValueByPath(array, '[0]', 'new');
    return result === undefined && array.length === 2 && array[0] === 'new' && array[1] === sibling;
  } },
  { remark: '根数组非零下标路径更新目标并保留前项', test: function () {
    const sibling = { keep: true }, array = [sibling, 'old'];
    translate.js.setValueByPath(array, '[1]', 'new');
    return array.length === 2 && array[0] === sibling && array[1] === 'new';
  } },
  { remark: '根数组的连续括号路径保留嵌套数组身份', test: function () {
    const inner = ['old', 'keep'], sibling = { keep: true }, array = [inner, sibling];
    translate.js.setValueByPath(array, '[0][0]', 'new');
    return array.length === 2 && array[0] === inner && array[1] === sibling &&
      inner.length === 2 && inner[0] === 'new' && inner[1] === 'keep';
  } },
  { remark: '根数组内对象的属性路径更新目标并保留对象身份', test: function () {
    const item = { name: 'old', other: 'keep' }, sibling = { keep: true }, array = [item, sibling];
    translate.js.setValueByPath(array, '[0].name', 'new');
    return array.length === 2 && array[0] === item && array[1] === sibling &&
      item.name === 'new' && item.other === 'keep';
  } },
  { remark: '根数组路径修复不改变已有空字符串属性路径', test: function () {
    // 空路径目前指向空字符串属性，不能把它当成数组转换产生的空段删除。
    const sibling = { keep: true }, object = { '': 'old', sibling: sibling };
    translate.js.setValueByPath(object, '', 'new');
    return object[''] === 'new' && object.sibling === sibling;
  } },
  { remark: '以点开头的已有路径仍通过空属性定位下层对象', test: function () {
    const parent = { value: 'old', other: 'keep' }, sibling = { keep: true };
    const object = { '': parent, sibling: sibling };
    translate.js.setValueByPath(object, '.value', 'new');
    return object[''] === parent && parent.value === 'new' && parent.other === 'keep' && object.sibling === sibling;
  } },
  { remark: '非数字括号字面属性不被当作根数组下标处理', test: function () {
    const sibling = { keep: true }, object = { '[name]': 'old', sibling: sibling };
    translate.js.setValueByPath(object, '[name]', 'new');
    return object['[name]'] === 'new' && object.sibling === sibling && !Object.hasOwn(object, 'name');
  } }
]);
