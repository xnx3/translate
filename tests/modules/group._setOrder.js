'use strict';

require('../helpers/module')(__filename, [
  { remark: '在指定锚点前移动原链接与 Text，保留范围外节点及绑定事件',
    test: function () {
      const host = document.createElement('p');
      host.innerHTML = '前<a>甲</a>乙<i>后</i>';
      const [prefix, link, text, suffix] = host.childNodes;
      let clicked = false;
      link.addEventListener('click', () => { clicked = true; });
      translate.group._setOrder(host, [text, link], suffix);
      link.click();
      return clicked && host.firstChild === prefix && prefix.nextSibling === text &&
        text.nextSibling === link && link.nextSibling === suffix;
    } },
  { remark: '同一次微任务中保留移动前后的外部添加，过滤调序触发的自身记录',
    test: async function () {
      const host = document.createElement('p');
      host.innerHTML = '<b>甲</b><b>乙</b>';
      document.body.append(host);
      const [a, b] = host.children;
      const earlier = document.createElement('i'), later = document.createElement('em');
      const batches = [];
      translate.execute = nodes => batches.push(...nodes);
      translate.listener.addListener();
      try {
        host.prepend(earlier);
        translate.group._setOrder(host, [b, a], null);
        host.append(later);
        await new Promise(resolve => setTimeout(resolve, 0));
        return b.nextSibling === a && batches.includes(earlier) && batches.includes(later) &&
          !batches.includes(a) && !batches.includes(b);
      } finally {
        translate.listener.reset();
      }
    } },
  ...['comment', 'end'].map(position => ({
    remark: '参数组合：目标顺序已经满足时不重复移动节点，锚点为' + (position === 'comment' ? '注释' : '末尾'),
    input: position,
    test: function (position) {
      const host = document.createElement('span');
      const a = document.createTextNode('同'), b = document.createTextNode('同');
      host.append(a, b);
      const anchor = position === 'comment' ? host.appendChild(document.createComment('后界')) : null;
      const observer = new MutationObserver(() => {});
      observer.observe(host, {childList: true});
      try {
        translate.group._setOrder(host, [a, b], anchor);
        return observer.takeRecords().length === 0 && host.firstChild === a &&
          a.nextSibling === b && b.nextSibling === anchor;
      } finally {
        observer.disconnect();
      }
    }
  }))
]);
