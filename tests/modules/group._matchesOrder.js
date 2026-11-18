'use strict';

require('../helpers/module')(__filename, [
  ['允许范围外兄弟增删', 'outside', true],
  ['片段之间插入注释会使原序列失效', 'insert', false],
  ['同一组节点对调后原序列失效', 'swap', false],
  ['节点离开原父元素后原序列失效', 'detach', false]
].map(([remark, change, expected]) => ({
  remark, input: { change, expected },
  test: function ({ change, expected }) {
    const host = document.createElement('p');
    const a = document.createTextNode('相同'), b = document.createTextNode('相同');
    host.append(a, b);
    if (change === 'outside') host.prepend(document.createElement('img'));
    if (change === 'insert') host.insertBefore(document.createComment('注释'), b);
    if (change === 'swap') host.insertBefore(b, a);
    if (change === 'detach') b.remove();
    return translate.group._matchesOrder(host, [a, b]) === expected;
  }
})));
