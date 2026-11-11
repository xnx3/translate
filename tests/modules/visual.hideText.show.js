require('../helpers/module')(__filename, [
  { remark: '缺参解除默认隐藏样式和类名', test: function () {
    translate.visual.hideText.hide(); translate.visual.hideText.show();
    return !document.documentElement.classList.contains('translatejs-text-hidden') && document.getElementById('translatejs-text-hidden') === null;
  } },
  { remark: '未隐藏时调用保持安全且可重复', test: function () {
    translate.visual.hideText.show(); translate.visual.hideText.show();
    return document.getElementById('translatejs-text-hidden') === null && !document.documentElement.classList.contains('translatejs-text-hidden');
  } },
  { remark: 'null 标识解除默认隐藏状态', test: function () {
    translate.visual.hideText.hide(); translate.visual.hideText.show(null);
    return document.getElementById('translatejs-text-hidden') === null;
  } },
  { remark: '空标识解除默认隐藏状态', test: function () {
    translate.visual.hideText.hide(); translate.visual.hideText.show('');
    return !document.documentElement.classList.contains('translatejs-text-hidden');
  } },
  { remark: '解除一个自定义标识保留其他标识隐藏状态', test: function () {
    translate.visual.hideText.hide('a'); translate.visual.hideText.hide('b'); translate.visual.hideText.show('a');
    return document.getElementById('translatejs-text-hidden-a') === null && !document.documentElement.classList.contains('translatejs-text-hidden-a') && document.getElementById('translatejs-text-hidden-b') !== null && document.documentElement.classList.contains('translatejs-text-hidden-b');
  } },
  { remark: '解除隐藏后恢复文本颜色并保留节点', test: function () {
    const p = document.createElement('p'); p.style.color = 'rgb(1, 2, 3)'; p.textContent = 'hello'; document.body.append(p); const text = p.firstChild;
    translate.visual.hideText.hide(); translate.visual.hideText.show();
    return p.firstChild === text && p.textContent === 'hello' && getComputedStyle(p).color === 'rgb(1, 2, 3)';
  } }
]);
