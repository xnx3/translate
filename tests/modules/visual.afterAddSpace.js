require('../helpers/module')(__filename, [
  { remark: '空相邻对数组不产生待加空格节点', args: [[]], expected: [] },
  { remark: '相邻元素无 CSS 间隔时选择前面的节点', test: function () {
    const a = document.createElement('span'), b = document.createElement('span');
    a.textContent = 'Hello'; b.textContent = 'world'; document.body.append(a, b);
    const result = translate.visual.afterAddSpace([{ before: { node: a }, after: { node: b } }]);
    return result.length === 1 && result[0] === a && a.textContent === 'Hello';
  } },
  { remark: '文本节点使用所属元素的样式且保留文本节点身份', test: function () {
    const a = document.createElement('span'), b = document.createElement('span');
    a.textContent = 'Hello'; b.textContent = 'world'; document.body.append(a, b);
    const result = translate.visual.afterAddSpace([{ before: { node: a.firstChild }, after: { node: b.firstChild } }]);
    return result.length === 1 && result[0] === a.firstChild;
  } },
  { remark: '前元素有右 margin 时不再添加空格', test: function () {
    const a = document.createElement('span'), b = document.createElement('span');
    a.style.marginRight = '2px'; a.textContent = 'Hello'; b.textContent = 'world'; document.body.append(a, b);
    return translate.visual.afterAddSpace([{ before: { node: a }, after: { node: b } }]).length === 0;
  } },
  { remark: '后元素有左 padding 时不再添加空格', test: function () {
    const a = document.createElement('span'), b = document.createElement('span');
    b.style.paddingLeft = '2px'; a.textContent = 'Hello'; b.textContent = 'world'; document.body.append(a, b);
    return translate.visual.afterAddSpace([{ before: { node: a }, after: { node: b } }]).length === 0;
  } },
  { remark: '前节点已含末尾空白时不重复选择', test: function () {
    const a = document.createElement('span'), b = document.createElement('span');
    a.textContent = 'Hello\u00a0'; b.textContent = 'world'; document.body.append(a, b);
    return translate.visual.afterAddSpace([{ before: { node: a }, after: { node: b } }]).length === 0;
  } },
  { remark: '后节点已含开头空白时不重复选择', test: function () {
    const a = document.createElement('span'), b = document.createElement('span');
    a.textContent = 'Hello'; b.textContent = '\tworld'; document.body.append(a, b);
    return translate.visual.afterAddSpace([{ before: { node: a }, after: { node: b } }]).length === 0;
  } }
]);
