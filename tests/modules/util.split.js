'use strict';

require('../helpers/module')(__filename, [
  { remark: '空数组在足够长度内保留一个空分组', args: [[], 100], expected: [[]] },
  { remark: '一个短字符串无需拆分', args: [['你好'], 100], expected: [['你好']] },
  { remark: '多个短字符串在长度限制内保持顺序', args: [['甲', '乙'], 100], expected: [['甲', '乙']] },
  { remark: 'JSON 字符串长度恰好等于限制时不拆分', args: [['a', 'b'], 9], expected: [['a', 'b']] },
  { remark: 'maxSize 为零时不限制每组元素数', args: [['a', 'b', 'c'], 100, 0], expected: [['a', 'b', 'c']] },
  { remark: '省略 maxSize 时不限制每组元素数', args: [['a', 'b', 'c'], 100], expected: [['a', 'b', 'c']] },
  { remark: 'maxSize 为一时每个元素独立成组', args: [['a', 'b', 'c'], 100, 1], expected: [['a'], ['b'], ['c']] },
  { remark: 'maxSize 为二时保留顺序并处理末尾余数', args: [['a', 'b', 'c'], 100, 2], expected: [['a', 'b'], ['c']] },
  { remark: '数组元素数恰好等于 maxSize 时不拆分', args: [['a', 'b'], 100, 2], expected: [['a', 'b']] },
  {
    remark: '长字符串拆分后满足长度限制且没有漏字或重复',
    test: function () {
      const result = translate.util.split(['abcdefghijklmnop'], 10, 0);
      return result.length > 1 && result.every(group => JSON.stringify(group).length <= 10) &&
        result.flat().join('') === 'abcdefghijklmnop';
    }
  },
  {
    remark: '多个中文字符串同时满足长度和数量限制，全部文字保持原顺序',
    test: function () {
      const result = translate.util.split(['甲乙丙丁', '戊己庚辛', '壬癸'], 12, 2);
      return result.every(group => group.length <= 2 && JSON.stringify(group).length <= 12) &&
        result.flat().join('') === '甲乙丙丁戊己庚辛壬癸';
    }
  },
  {
    remark: '拆分包含双引号的文本时保留原始内容',
    test: function () {
      const input = ['a"b"c"d"e"f', 'tail'];
      const result = translate.util.split(input, 12, 2);
      return result.every(group => group.length <= 2 && JSON.stringify(group).length <= 12) &&
        result.flat().join('') === 'a"b"c"d"e"ftail';
    }
  },
  {
    remark: '拆分包含反斜杠和换行的文本时保留原始内容',
    test: function () {
      const result = translate.util.split(['a\\b\\c\nd\ne', 'tail'], 12, 2);
      return result.every(group => group.length <= 2 && JSON.stringify(group).length <= 12) &&
        result.flat().join('') === 'a\\b\\c\nd\netail';
    }
  },
  {
    remark: '拆分不修改输入数组的内容和顺序',
    test: function () {
      const input = ['abcdef', 'ghijkl'];
      translate.util.split(input, 10, 1);
      return input.length === 2 && input[0] === 'abcdef' && input[1] === 'ghijkl';
    }
  }
]);
