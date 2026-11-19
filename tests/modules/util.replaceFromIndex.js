'use strict';

require('../helpers/module')(__filename, [
  { remark: '从起点替换第一个匹配，允许替换结果包含原词', args: ['你好吗？你也好？', 0, '你', '你是谁'], expected: { text: '你是谁好吗？你也好？', replaceEndIndex: 3 } },
  { remark: '从后半段开始替换不会改变前面的相同目标', args: ['abc abc', 4, 'abc', 'X'], expected: { text: 'abc X', replaceEndIndex: 5 } },
  { remark: '指定位置之后的第一个目标被替换', args: ['ab--ab', 1, 'ab', 'XYZ'], expected: { text: 'ab--XYZ', replaceEndIndex: 7 } },
  { remark: '局部替换为空字符串时保留两侧文本', args: ['abc', 1, 'b', ''], expected: { text: 'ac', replaceEndIndex: 1 } },
  { remark: '相同目标重复出现时本次仅替换一个', args: ['aaa', 0, 'a', 'b'], expected: { text: 'baa', replaceEndIndex: 1 } },
  { remark: '目标在最后一个字符时正确计算结束下标', args: ['abc', 2, 'c', 'XY'], expected: { text: 'abXY', replaceEndIndex: 4 } },
  { remark: '替换整段内容时结束下标等于新文本长度', args: ['abc', 0, 'abc', '你好'], expected: { text: '你好', replaceEndIndex: 2 } },
  { remark: 'UTF-16 下标能越过表情后替换目标', args: ['😀你', 2, '你', '我'], expected: { text: '😀我', replaceEndIndex: 3 } },
  // 源码注释明确约定未命中时原样返回；这些用例可检测无匹配时意外截断原文的回归。
  { remark: '起点为零但没有匹配时应保留完整原文', args: ['abc', 0, 'x', 'y'], expected: { text: 'abc', replaceEndIndex: 0 } },
  { remark: '指定位置之后没有匹配时应保留完整原文', args: ['abc', 1, 'a', 'x'], expected: { text: 'abc', replaceEndIndex: 0 } },
  { remark: '空原文未命中时返回空文本与零下标', args: ['', 0, 'a', 'b'], expected: { text: '', replaceEndIndex: 0 } },
  ...[
    ['只替换表情之后的命中', '😀A😀A', 3, 'A', 'é', '😀A😀é', 6],
    ['末尾命中替换为两个码元', '早a晚a', 2, 'a', '😀', '早a晚😀', 5],
    ['最后一项删除后结束位置指向新串末尾', '😀X X', 3, 'X', '', '😀X ', 4],
    ['起点等于全文长度时不回头匹配', '甲甲', 2, '甲', 'Y', '甲甲', 0],
    ['译文含字面双美元时位置与成品一致', 'A X B', 2, 'X', '$$', 'A $$ B', 4]
  ].map(([label, text, index, original, replacement, result, end]) => ({
    remark: '参数组合：' + label,
    args: [text, index, original, replacement],
    expected: { text: result, replaceEndIndex: end }
  }))
]);
