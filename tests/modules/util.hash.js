'use strict';

require('../helpers/module')(__filename, [
  { remark: 'ASCII 单字符 a 的 hash 值', args: ['a'], expected: '97' },
  { remark: 'ASCII 单字符 A 的 hash 值区分大小写', args: ['A'], expected: '65' },
  { remark: '多个 ASCII 字符的已知 hash 值', args: ['abc'], expected: '96354' },
  { remark: '中文字符按 UTF-16 参与 hash', args: ['你好'], expected: '652829' },
  { remark: '空字符串使用数值零作为空值结果', args: [''], expected: 0 },
  { remark: 'null 原样返回', args: [null], expected: null },
  { remark: '省略参数原样得到 undefined', args: [], expected: undefined },
  { remark: '显式 undefined 原样返回', args: [undefined], expected: undefined },
  {
    remark: '相同文本连续调用的结果稳定',
    test: function () {
      return translate.util.hash('translate测试') === translate.util.hash('translate测试');
    }
  },
  {
    remark: '不同单字符不会因字符大小写丢失而碰撞',
    test: function () {
      return translate.util.hash('x') !== translate.util.hash('X');
    }
  }
]);
