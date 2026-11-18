'use strict';

require('../helpers/module')(__filename, [
  { remark: '按共同容器记录多层兄弟，图片位于片段范围内，范围外兄弟不进入快照',
    test: function () {
      const root = document.createElement('p');
      root.innerHTML = '<i>前</i><b>甲</b><img><a><em>乙</em>丙</a><i>后</i>';
      document.body.append(root);
      const [, bold, image, link] = root.children;
      const em = link.firstChild;
      const layout = translate.group._captureLayout([bold.firstChild, em.firstChild, link.lastChild]);
      const outer = layout.ranges.get(root).children;
      const inner = layout.ranges.get(link).children;
      return layout.container === root && layout.ancestry[0] === root && layout.ancestry.at(-1) === document &&
        outer.length === 3 && outer[0] === bold && outer[1] === image && outer[2] === link &&
        inner.length === 2 && inner[0] === em && inner[1] === link.lastChild;
    } },
  { remark: '单个离线 Text 的容器就是父元素，随后移动节点不改写原快照',
    test: function () {
      const host = document.createElement('span');
      const node = host.appendChild(document.createTextNode('甲'));
      const layout = translate.group._captureLayout([node]);
      document.body.append(node);
      return layout.container === host && layout.ancestry.length === 1 && layout.ancestry[0] === host &&
        layout.ranges.get(host).children[0] === node;
    } }
]);
