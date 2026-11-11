require('../helpers/module')(__filename, [
  { remark: '中文无需单词间隔时保持节点内容', test: function () {
    translate.to = 'chinese_simplified';
    const a = document.createTextNode('你'), b = document.createTextNode('好'); document.body.append(a, b);
    translate.visual.adjustTranslationSpaces([a, b]);
    return a.nodeValue === '你' && b.nodeValue === '好';
  } },
  { remark: '英文相接文本补上非断行空格并同步节点翻译记录', test: function () {
    translate.to = 'english';
    const span = document.createElement('span'), a = document.createTextNode('Hello'), b = document.createTextNode('world'); span.append(a, b); document.body.append(span);
    translate.node.set(a, { originalText: '你好', resultText: 'Hello', translateResults: {} });
    translate.node.set(b, { originalText: '世界', resultText: 'world', translateResults: {} });
    translate.visual.adjustTranslationSpaces([a, b]);
    return a.nodeValue === 'Hello\u00a0' && b.nodeValue === 'world' && translate.node.get(a).resultText === 'Hello\u00a0' && translate.node.get(a).translateResults['Hello\u00a0'] === 1 && typeof translate.node.get(a).lastTranslateRenderTime === 'number';
  } },
  { remark: '重复处理已有空格的文本不会重复追加', test: function () {
    translate.to = 'english';
    const span = document.createElement('span'), a = document.createTextNode('Hello\u00a0'), b = document.createTextNode('world'); span.append(a, b); document.body.append(span);
    translate.node.set(a, { originalText: '你好', resultText: 'Hello\u00a0', translateResults: {} });
    translate.node.set(b, { originalText: '世界', resultText: 'world', translateResults: {} });
    translate.visual.adjustTranslationSpaces([a, b]);
    translate.visual.adjustTranslationSpaces([a, b]);
    return a.nodeValue === 'Hello\u00a0' && b.nodeValue === 'world';
  } },
  { remark: '元素节点补空格保留原 HTML 结构和文本节点身份', test: function () {
    translate.to = 'english';
    const span = document.createElement('span'), a = document.createElement('b'), b = document.createElement('i');
    a.textContent = 'Hello'; b.textContent = 'world'; span.append(a, b); document.body.append(span);
    const text = a.firstChild;
    translate.node.set(text, { originalText: '你好', resultText: 'Hello', translateResults: {} });
    translate.visual.adjustTranslationSpaces([a, b]);
    return a.firstChild === text && a.nodeName === 'B' && b.nodeName === 'I' && text.nodeValue === 'Hello\u00a0' && b.textContent === 'world';
  } },
  { remark: '有明确 CSS 间距的文本保持原值', test: function () {
    translate.to = 'english';
    const a = document.createElement('span'), b = document.createElement('span'); a.textContent = 'Hello'; b.textContent = 'world'; a.style.marginRight = '8px'; document.body.append(a, b);
    translate.visual.adjustTranslationSpaces([a, b]);
    return a.textContent === 'Hello' && b.textContent === 'world';
  } },
  { remark: '空节点列表无需改动页面', test: function () {
    translate.to = 'english';
    const div = document.createElement('div'); div.textContent = 'unchanged'; document.body.append(div);
    return translate.visual.adjustTranslationSpaces([]) === undefined && div.textContent === 'unchanged';
  } }
]);
