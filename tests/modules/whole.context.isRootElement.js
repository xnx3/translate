// 非根元素的不同输入各占一条用例，并主动启用开关，避免提前退出掩盖类型校验。
const invalidCases = [
  ['null', 'null'], ['undefined', 'undefined'], ['文本节点', "document.createTextNode('文本')"],
  ['document', 'document'], ['html', 'document.documentElement']
].map(function (item) {
  return { remark: item[0] + ' 不能作为上下文收集根', test: new Function(`
    translate.whole.context.use(); translate.whole.tag = ['html', '#text'];
    return translate.whole.context.isRootElement(${item[1]}) === false;
  `) };
});
const selectorCases = [
  ['tag', "var element = document.createElement('p');"],
  ['id', "var element = document.createElement('span'); element.id = 'main';"],
  ['class', "var element = document.createElement('span'); element.className = 'other whole';"]
].map(function (item) {
  return { remark: '启用后按元素自身 ' + item[0] + ' 命中收集根', test: new Function(`
    translate.whole.context.use(); translate.whole.tag = ['p']; translate.whole.id = ['main']; translate.whole.class = ['whole'];
    ${item[1]}
    return translate.whole.context.isRootElement(element) === true;
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '上下文未启用时即使标签命中也不成为收集根', test: function () {
    translate.whole.context.is_use = false; translate.whole.tag = ['p'];
    return translate.whole.context.isRootElement(document.createElement('p')) === false;
  } },
  ...selectorCases,
  { remark: 'class 按空白分隔的完整词匹配，不能把部分名称当成命中', test: function () {
    translate.whole.context.use(); translate.whole.class = ['whole'];
    var element = document.createElement('span'); element.className = 'a\twhole\n b';
    var exact = translate.whole.context.isRootElement(element); element.className = 'whole-more';
    return exact === true && translate.whole.context.isRootElement(element) === false;
  } },
  { remark: '只命中父元素时子元素不重复成为上下文根', test: function () {
    translate.whole.context.use(); translate.whole.id = ['main'];
    var root = document.createElement('div'), child = document.createElement('span'); root.id = 'main'; root.append(child); document.body.append(root);
    return translate.whole.context.isRootElement(root) === true && translate.whole.context.isRootElement(child) === false;
  } },
  { remark: '不接入 enableAll，未显式配置的元素不会收集过大的上下文', test: function () {
    translate.whole.context.use(); translate.whole.enableAll(); translate.whole.tag = []; translate.whole.class = []; translate.whole.id = [];
    return translate.whole.context.isRootElement(document.body) === false;
  } },
  ...invalidCases
]);
