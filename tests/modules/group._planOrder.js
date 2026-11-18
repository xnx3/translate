'use strict';

require('../helpers/module')(__filename, [
  { remark: '嵌套链接可整体移动，也可对链接内的兄弟排序，规划过程保留原 DOM',
    test: function () {
      const root = document.createElement('p');
      root.innerHTML = '<a><b>甲</b>乙</a>丙';
      const link = root.firstChild, bold = link.firstChild;
      const nodes = [bold.firstChild, link.lastChild, root.lastChild];
      const group = { nodes, layout: translate.group._captureLayout(nodes) };
      const plans = translate.group._planOrder(group, [2, 1, 0]);
      const outer = plans.find(plan => plan.parent === root);
      const inner = plans.find(plan => plan.parent === link);
      return plans.length === 2 && outer.before[0] === link && outer.after[0] === nodes[2] &&
        inner.before[0] === bold && inner.after[0] === nodes[1] && root.textContent === '甲乙丙';
    } },
  ...[
    ['嵌套链接的两个片段不能被外部文字拆开', '<a>甲<b>乙</b></a>丙', [0, 2, 1]],
    ['段内图片不能随正文跨位', '甲<img>乙', [1, 0]],
    ['带有未参与子树的整个标签不能随正文跨位', '<b>甲<img></b>乙', [1, 0]]
  ].map(([remark, html, order]) => ({
    remark, input: { html, order },
    test: function ({ html, order }) {
      const root = document.createElement('p');
      root.innerHTML = html;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      const plan = translate.group._planOrder({ nodes, layout: translate.group._captureLayout(nodes) }, order);
      return plan === null && root.innerHTML === html;
    }
  }))
]);
