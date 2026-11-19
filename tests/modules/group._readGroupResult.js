'use strict';

// 后端保证响应逐项对应；这里只核对合法响应的读取、顺序和副本，不读取或回填 DOM。
const group = { nodes: ['A', 'B', 'C'] };
const words = [{ text: '甲' }, { text: '' }, { text: '😀\n乙' }];
const texts = ['甲', '', '😀\n乙'];

require('../helpers/module')(__filename, [
  { remark: '未声明 order 时沿用原节点顺序，保留空译文、emoji 和换行', args: [group, { words }],
    expected: { texts, order: [0, 1, 2] } },
  ...[[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(order => ({
    remark: '三个节点合法显示次序 ' + order.join('→') + ' 保留每个译文的原下标',
    args: [group, { words, order }], expected: { texts, order }
  })),
  { remark: '冻结的合法显式 order 返回独立副本，连续读取不改写响应、译文或节点',
    test: function () {
      const nodes = Object.freeze([
        document.createTextNode('原甲'), document.createTextNode('原乙'), document.createTextNode('原丙')
      ]);
      const item = Object.freeze({
        words: Object.freeze([
          Object.freeze({ text: '甲' }), Object.freeze({ text: '' }), Object.freeze({ text: '😀\n乙' })
        ]),
        order: Object.freeze([2, 0, 1])
      });
      const result = translate.group._readGroupResult({ nodes }, item);
      result.texts[0] = '已修改';
      result.order[0] = -1;
      const again = translate.group._readGroupResult({ nodes }, item);
      return result.texts !== again.texts && result.order !== again.order && again.order !== item.order &&
        again.texts[0] === '甲' && again.texts[1] === '' && again.texts[2] === '😀\n乙' &&
        again.order.join(',') === '2,0,1' && item.order.join(',') === '2,0,1' &&
        item.words[0].text === '甲' && nodes.map(node => node.data).join(',') === '原甲,原乙,原丙';
    } },
  { remark: '参数组合：同字节点含不同权重及空译文时，显示顺序不改变原下标的译文',
    args: [
      {nodes: ['first', 'second'], words: [{text: '甲', weight: 0}, {text: '甲', weight: 1}]},
      {words: [{text: '', weight: 0}, {text: 'Second', weight: 1}], order: [1, 0]}
    ],
    expected: {texts: ['', 'Second'], order: [1, 0]} }
]);
