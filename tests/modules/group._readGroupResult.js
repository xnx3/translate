'use strict';

// 这里校验响应的数据结构。该方法只按 nodes 的长度核对索引，不读取或回填 DOM。
const group = { nodes: ['A', 'B', 'C'] };
const words = [{ text: '甲' }, { text: '' }, { text: '😀\n乙' }];
const texts = ['甲', '', '😀\n乙'];

require('../helpers/module')(__filename, [
  ...[
    ['省略全部参数', []],
    ['组为 null', [null, { words }]],
    ['组缺少节点数组', [{}, { words }]],
    ['没有节点的空组', [{ nodes: [] }, { words: [] }]],
    ['节点是类数组对象', [{ nodes: { length: 3 } }, { words }]],
    ['缺少响应项', [group]],
    ['响应项为 null', [group, null]],
    ['缺少 words', [group, {}]],
    ['words 为字符串', [group, { words: 'abc' }]],
    ['译文少于节点', [group, { words: words.slice(1) }]],
    ['译文多于节点', [group, { words: [...words, { text: '多余' }] }]],
    ['末尾词项为 null', [group, { words: [words[0], words[1], null] }]],
    ['末尾缺少 text', [group, { words: [words[0], words[1], {}] }]],
    ['末尾 text 为数字', [group, { words: [words[0], words[1], { text: 0 }] }]]
  ].map(([label, args]) => ({ remark: label + '时拒绝整组', args, expected: null })),
  ...[
    ['显式 undefined', undefined], ['null', null], ['字符串', '201'],
    ['空数组', []], ['遗漏下标', [0, 2]], ['多出下标', [2, 1, 0, 3]],
    ['末项重复', [2, 0, 2]], ['负数', [2, 1, -1]], ['等于节点数量', [0, 1, 3]],
    ['小数', [0, 1, 1.5]], ['数字字符串', [0, 1, '2']], ['布尔值', [0, 1, true]]
  ].map(([label, order]) => ({
    remark: 'order 为' + label + '时不返回部分译文', args: [group, { words, order }], expected: null
  })),
  { remark: '未声明 order 时沿用原节点顺序，保留空译文、emoji 和换行', args: [group, { words }],
    expected: { texts, order: [0, 1, 2] } },
  ...[[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(order => ({
    remark: '三个节点合法显示次序 ' + order.join('→') + ' 保留每个译文的原下标',
    args: [group, { words, order }], expected: { texts, order }
  })),
  { remark: '从原型继承的 order 不覆盖缺省原序，连续读取均不会改写响应或节点',
    test: function () {
      const nodes = Object.freeze([document.createTextNode('原文')]);
      const item = Object.create({ order: [999] });
      item.words = Object.freeze([Object.freeze({ text: '译文' })]);
      Object.freeze(item);
      const result = translate.group._readGroupResult({ nodes }, item);
      result.texts[0] = '已修改';
      result.order[0] = -1;
      const again = translate.group._readGroupResult({ nodes }, item);
      return again.texts[0] === '译文' && again.order[0] === 0 && nodes[0].data === '原文';
    } }
]);
