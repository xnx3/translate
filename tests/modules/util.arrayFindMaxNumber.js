'use strict';

require('../helpers/module')(__filename, [
  { remark: '空数组没有最高频元素', args: [[]], expected: [] },
  { remark: '单元素数组返回该元素', args: [['english']], expected: ['english'] },
  { remark: '重复元素中返回最高频元素', args: [['english', 'japanese', 'english']], expected: ['english'] },
  { remark: '最高频并列时返回多个元素', args: [['a', 'b', 'a', 'b', 'c']], expected: ['a', 'b'] },
  { remark: '所有元素只出现一次时全部并列', args: [['甲', '乙', '丙']], expected: ['甲', '乙', '丙'] },
  { remark: '空字符串也是可统计元素', args: [['', 'a', '']], expected: [''] },
  { remark: '大小写不同的字符串分别统计', args: [['A', 'a', 'A']], expected: ['A'] },
  { remark: '同一字符串出现多次只返回一次', args: [['中文', '中文', '中文']], expected: ['中文'] },
  {
    remark: '统计不会修改输入数组内容及顺序',
    test: function () {
      const input = ['b', 'a', 'b'];
      translate.util.arrayFindMaxNumber(input);
      return input.length === 3 && input[0] === 'b' && input[1] === 'a' && input[2] === 'b';
    }
  }
]);
