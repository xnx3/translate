'use strict';

require('../helpers/module')(__filename, [
  { remark: '普通中文无需转义', args: ['你好'], expected: '你好' },
  { remark: '空字符串无需转义', args: [''], expected: '' },
  { remark: '反斜杠先被转义，避免影响后续字符', args: ['a\\b'], expected: 'a\\\\b' },
  { remark: '双引号被转义', args: ['a"b'], expected: 'a\\"b' },
  ...['?', '$', '(', ')', '|', '+', '*', '[', ']', '^', '{', '}'].map(char => ({
    remark: `正则特殊字符 ${char} 被转义为字面量`,
    args: [char],
    expected: '\\' + char
  })),
  {
    remark: '多种正则特殊字符混合时可按完整字面量匹配',
    test: function () {
      const value = 'a?b+c[0]$';
      const pattern = translate.util.regExp.pattern(value);
      const regex = new RegExp('^' + pattern + '$');
      return regex.test(value) && !regex.test('abbbc0');
    }
  }
]);
