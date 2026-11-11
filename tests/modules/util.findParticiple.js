'use strict';

require('../helpers/module')(__filename, [
  // 来源：verify.html 原始第 1 条，完整保留原参数和预期。
  {
    remark: '寻找的文本出现在分词中，要保持分词的完整性，语义一致性，分词本身即使被寻找也不能作为结果，要剔除分词命中的下标',
    args: ['你好，你是谁，你你好，你在哪', '你', ['你好', '你是谁', '从哪里来', '你']],
    expected: [7, 11]
  },
  // 来源：verify.html 原始第 14 条。
  {
    remark: '分词中包含多个替换文本的情况',
    args: ['的1的的的2的的的的3的', '的', ['的的的2', '的的的3']],
    expected: [0, 6, 11]
  },
  { remark: '没有保护分词时返回全部匹配下标', args: ['abc abc abc', 'abc', []], expected: [0, 4, 8] },
  { remark: '省略保护分词时返回全部匹配下标', args: ['你你你', '你'], expected: [0, 1, 2] },
  { remark: '显式 undefined 保护分词与省略一致', args: ['你你你', '你', undefined], expected: [0, 1, 2] },
  { remark: 'null 保护分词与省略一致', args: ['你你你', '你', null], expected: [0, 1, 2] },
  { remark: '空原文没有匹配位置', args: ['', 'abc', []], expected: [] },
  { remark: '找不到目标文本时返回空数组', args: ['abc', 'xyz', []], expected: [] },
  { remark: '目标文本长于原文时没有匹配', args: ['ab', 'abc', []], expected: [] },
  { remark: '目标等于完整原文时匹配起点零', args: ['你好', '你好', []], expected: [0] },
  { remark: '保护分词中的目标不参与匹配', args: ['你好你好你', '你', ['你好']], expected: [4] },
  { remark: '不存在于原文的保护分词不影响匹配', args: ['你你', '你', ['你好']], expected: [0, 1] },
  { remark: '与目标同长的保护分词不会屏蔽目标本身', args: ['你你', '你', ['你']], expected: [0, 1] },
  { remark: '不包含目标的保护分词不影响匹配', args: ['abc abc', 'abc', ['xyz']], expected: [0, 4] },
  { remark: '全部目标都位于保护分词中时返回空数组', args: ['abcabc', 'a', ['abc']], expected: [] },
  { remark: '下标使用 JavaScript UTF-16 位置，表情占两个代码单元', args: ['😀你😀你', '你', []], expected: [2, 5] },
  {
    remark: '查找不修改传入的保护分词数组',
    test: function () {
      const words = ['你好', '再见'];
      translate.util.findParticiple('你好，你', '你', words);
      return words.length === 2 && words[0] === '你好' && words[1] === '再见';
    }
  }
]);
