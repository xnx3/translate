// 每个标签和每类非元素输入单独注册，报告中可直接定位遗漏的边界规则。
// 动态构造的函数只包含本项字面量，不捕获 Node 侧变量。
const blockCases = ['br','hr','pre','code','script','style','template','noscript','iframe','canvas','svg','math','div','p','section','article','header','footer','main','nav','aside','blockquote','h1','h2','h3','h4','h5','h6','table','thead','tbody','tfoot','tr','td','th','ul','ol','li','dl','dt','dd','figure','figcaption','form','input','textarea','select','option','button'].map(function (tag) {
  return { remark: tag + ' 标签切断上下文', test: new Function(`
    return translate.whole.context.isBreakElement(document.createElement(${JSON.stringify(tag)})) === true;
  `) };
});
const inlineCases = ['span', 'a', 'em', 'strong', 'b', 'i'].map(function (tag) {
  return { remark: tag + ' 行内标签允许继续组合', test: new Function(`
    var element = document.createElement(${JSON.stringify(tag)}); document.body.append(element);
    return translate.whole.context.isBreakElement(element) === false;
  `) };
});
const invalidCases = [
  ['null', 'null'], ['undefined', 'undefined'], ['document', 'document'],
  ['文本节点', "document.createTextNode('文本')"], ['注释节点', "document.createComment('注释')"]
].map(function (item) {
  return { remark: item[0] + ' 不能混入行内上下文', test: new Function(`
    return translate.whole.context.isBreakElement(${item[1]}) === true;
  `) };
});

require('../helpers/module')(__filename, [
  ...blockCases,
  ...inlineCases,
  { remark: 'hidden 属性和 translate=no 均形成边界，属性大小写按约定处理', test: function () {
    var hidden = document.createElement('span'), no = document.createElement('span'), yes = document.createElement('span');
    hidden.hidden = true; no.setAttribute('translate', 'NO'); yes.setAttribute('translate', 'yes'); document.body.append(hidden, no, yes);
    return translate.whole.context.isBreakElement(hidden) === true && translate.whole.context.isBreakElement(no) === true && translate.whole.context.isBreakElement(yes) === false;
  } },
  { remark: '可编辑区域及其继承可编辑状态的子元素形成边界', test: function () {
    var root = document.createElement('span'), child = document.createElement('em'); root.contentEditable = 'true'; root.append(child); document.body.append(root);
    return translate.whole.context.isBreakElement(root) === true && translate.whole.context.isBreakElement(child) === true;
  } },
  { remark: 'notranslate 类按完整类名匹配，兼容制表符和换行', test: function () {
    var element = document.createElement('span'); document.body.append(element); element.className = 'a\tnotranslate\nb';
    var exact = translate.whole.context.isBreakElement(element); element.className = 'notranslate-more';
    return exact === true && translate.whole.context.isBreakElement(element) === false;
  } },
  { remark: '复用 translate.ignore 配置，忽略元素和其子元素均切断上下文', test: function () {
    translate.ignore.class.push('excluded');
    var root = document.createElement('span'), child = document.createElement('em'); root.className = 'excluded'; root.append(child); document.body.append(root);
    return translate.whole.context.isBreakElement(root) === true && translate.whole.context.isBreakElement(child) === true;
  } },
  ...invalidCases
]);
