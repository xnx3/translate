// 标签类型、meta name/property 各自独立报告；生成函数仅包含本项数据字面量。
const inputCases = ['button', 'submit', 'text'].map(function (type) {
  const expected = type === 'text' ? ['placeholder'] : ['value', 'placeholder'];
  return { remark: 'input type=' + type + ' 只收集对应的 value 和 placeholder', test: new Function(`
    var input = document.createElement('input'); input.type = ${JSON.stringify(type)}; input.setAttribute('value', '值'); input.placeholder = '提示';
    var result = translate.element.nodeAnalyse.gets(input);
    return JSON.stringify(result.map(function (item) { return item.attribute; })) === ${JSON.stringify(JSON.stringify(expected))};
  `) };
});
const metaCases = [
  ['name', 'keywords'], ['name', 'description'], ['name', 'sharetitle'],
  ['property', 'og:title'], ['property', 'og:description'], ['property', 'og:site_name'], ['property', 'og:novel:latest_chapter_name']
].map(function (item) {
  return { remark: 'meta ' + item[0] + '=' + item[1] + ' 大小写不敏感地收集 content', test: new Function(`
    var meta = document.createElement('meta'); meta.setAttribute(${JSON.stringify(item[0])}, ${JSON.stringify(item[1].toUpperCase())}); meta.content = '内容';
    var result = translate.element.nodeAnalyse.gets(meta);
    return result.length === 1 && result[0].node === meta.getAttributeNode('content') && result[0].text === '内容' && result[0].attribute === 'content';
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '文本和属性节点返回自身，空白节点不产生翻译项', test: function () {
    var text = document.createTextNode(' 文本 '), element = document.createElement('span'); element.title = '标题';
    var one = translate.element.nodeAnalyse.gets(text), two = translate.element.nodeAnalyse.gets(element.getAttributeNode('title'));
    return one.length === 1 && one[0].text === ' 文本 ' && one[0].attribute === '' && one[0].node === text && two.length === 1 && two[0].text === '标题' && translate.element.nodeAnalyse.gets(document.createTextNode('\n\t ')).length === 0;
  } },
  { remark: '图片同时收集 alt 和 title，返回真实 Attr 节点', test: function () {
    var image = document.createElement('img'); image.alt = '图片说明'; image.title = '图片标题';
    var result = translate.element.nodeAnalyse.gets(image);
    return result.length === 2 && result[0].attribute === 'alt' && result[0].node === image.getAttributeNode('alt') && result[1].attribute === 'title' && result[1].node === image.getAttributeNode('title');
  } },
  ...inputCases,
  { remark: 'textarea 只收集 placeholder 属性，不把当前 value 擅自当作属性文本', test: function () {
    var element = document.createElement('textarea'); element.placeholder = '多行提示'; element.value = '用户输入';
    var result = translate.element.nodeAnalyse.gets(element);
    return result.length === 1 && result[0].text === '多行提示' && result[0].attribute === 'placeholder';
  } },
  ...metaCases,
  { remark: 'meta 不翻译不在范围内的 name', test: function () {
    var meta = document.createElement('meta'); meta.name = 'viewport'; meta.content = '内容';
    return translate.element.nodeAnalyse.gets(meta).length === 0;
  } },
  { remark: 'meta description 的纯空白 content 不生成翻译项', test: function () {
    var meta = document.createElement('meta'); meta.name = 'description'; meta.content = '  ';
    return translate.element.nodeAnalyse.gets(meta).length === 0;
  } },
  { remark: '自定义属性遵守 condition，默认已收集的 value 不重复加入', test: function () {
    translate.element.tagAttribute.input = { attribute: ['value', 'data-label'], condition: function (node) { return node.classList.contains('allowed'); } };
    var input = document.createElement('input'); input.type = 'submit'; input.setAttribute('value', '提交'); input.setAttribute('data-label', '标签'); input.className = 'allowed';
    var allowed = translate.element.nodeAnalyse.gets(input); input.className = ''; var denied = translate.element.nodeAnalyse.gets(input);
    return JSON.stringify(allowed.map(function (item) { return item.attribute; })) === '["value","data-label"]' && denied.length === 1 && denied[0].attribute === 'value';
  } },
  { remark: '只读取当前节点的可翻译内容，不直接递归收集后代', test: function () {
    var root = document.createElement('div'); root.innerHTML = '甲<span>乙</span>';
    return translate.element.nodeAnalyse.gets(root).length === 0;
  } }
]);
