require('../helpers/module')(__filename, [
  { remark: '缺参使用默认隐藏样式和根元素类名', test: function () {
    translate.visual.hideText.hide();
    const style = document.getElementById('translatejs-text-hidden');
    return document.documentElement.classList.contains('translatejs-text-hidden') && style !== null && style.tagName === 'STYLE' && style.textContent.includes('color: transparent');
  } },
  { remark: 'null 标识使用默认隐藏状态', test: function () {
    translate.visual.hideText.hide(null);
    return document.documentElement.classList.contains('translatejs-text-hidden') && document.getElementById('translatejs-text-hidden') !== null;
  } },
  { remark: '空字符串标识使用默认隐藏状态', test: function () {
    translate.visual.hideText.hide('');
    return document.documentElement.classList.contains('translatejs-text-hidden');
  } },
  { remark: '自定义标识生成匹配的样式选择器和类名', test: function () {
    translate.visual.hideText.hide('loading');
    const style = document.getElementById('translatejs-text-hidden-loading');
    return style !== null && document.documentElement.classList.contains('translatejs-text-hidden-loading') && style.textContent.includes('html.translatejs-text-hidden-loading p');
  } },
  { remark: '不同标识的隐藏状态可同时存在', test: function () {
    translate.visual.hideText.hide('a'); translate.visual.hideText.hide('b');
    return document.documentElement.classList.contains('translatejs-text-hidden-a') && document.documentElement.classList.contains('translatejs-text-hidden-b') && document.getElementById('translatejs-text-hidden-a') !== null && document.getElementById('translatejs-text-hidden-b') !== null;
  } },
  { remark: '隐藏仅改变显示样式而不替换文本节点', test: function () {
    const p = document.createElement('p'); p.textContent = 'hello'; document.body.append(p); const text = p.firstChild;
    translate.visual.hideText.hide();
    return p.firstChild === text && p.textContent === 'hello' && getComputedStyle(p).color === 'rgba(0, 0, 0, 0)';
  } }
]);
