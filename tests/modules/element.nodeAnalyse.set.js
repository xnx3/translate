require('../helpers/module')(__filename, [
  { remark: '替换 TextNode 中的原文并返回完整渲染结果，按英文规则转换相邻标点', test: function () {
    translate.to = 'english'; var node = document.createTextNode('你好，世界！');
    var result = translate.element.nodeAnalyse.set(node, '你好', 'Hello');
    return node.nodeValue === 'Hello, 世界！' && result.node === node && result.resultText === 'Hello, 世界！';
  } },
  { remark: '传入属性时只改指定 title，保留正文和其他属性', test: function () {
    // 本例聚焦属性路由，目标中文不额外补英文词间空格。
    translate.to = 'chinese_simplified';
    var element = document.createElement('span'); element.title = '原文标题'; element.textContent = '正文'; element.setAttribute('data-label', '不改');
    var result = translate.element.nodeAnalyse.set(element, '原文', 'Translated', 'title');
    return element.title === 'Translated标题' && element.textContent === '正文' && element.getAttribute('data-label') === '不改' && result.resultText === 'Translated标题';
  } },
  { remark: '实时输入 value 通过 DOM Property 替换，不能覆盖旧 HTML 默认值', test: function () {
    var input = document.createElement('input'); input.setAttribute('value', '旧值'); input.value = '当前输入';
    var result = translate.element.nodeAnalyse.set(input, '当前输入', 'Current input', 'value');
    return input.value === 'Current input' && input.getAttribute('value') === '旧值' && result.resultText === 'Current input';
  } },
  { remark: '原文已被页面修改时不覆盖新内容，并用空 resultText 表示未替换', test: function () {
    var node = document.createTextNode('页面刚更新的新文本');
    var result = translate.element.nodeAnalyse.set(node, '旧文本', 'Old text');
    return node.nodeValue === '页面刚更新的新文本' && result.resultText === '';
  } },
  { remark: '参与分词参数保护长词，避免用短词译文破坏长词', test: function () {
    translate.to = 'english'; var node = document.createTextNode('你好，你是谁，你');
    translate.element.nodeAnalyse.set(node, '你', 'you', '', ['你好', '你是谁']);
    return node.nodeValue === '你好，你是谁, you';
  } },
  { remark: '图片 alt、按钮 value 和 textarea placeholder 分别写回对应属性', test: function () {
    var image = document.createElement('img'), input = document.createElement('input'), textarea = document.createElement('textarea'); image.alt = '图片'; input.type = 'submit'; input.setAttribute('value', '提交'); textarea.placeholder = '填写';
    translate.element.nodeAnalyse.set(image, '图片', 'Image'); translate.element.nodeAnalyse.set(input, '提交', 'Submit'); translate.element.nodeAnalyse.set(textarea, '填写', 'Fill');
    return image.alt === 'Image' && input.value === 'Submit' && textarea.placeholder === 'Fill';
  } }
]);
