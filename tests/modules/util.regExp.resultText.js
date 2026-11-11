'use strict';

require('../helpers/module')(__filename, [
  // 此入口目前的合同是原样保留替换文本，不进行引号或 HTML 转义。
  { remark: '普通文字原样返回', args: ['你好'], expected: '你好' },
  { remark: '空字符串原样返回', args: [''], expected: '' },
  { remark: '单引号原样返回', args: ["a'b"], expected: "a'b" },
  { remark: '双引号原样返回', args: ['a"b'], expected: 'a"b' },
  { remark: 'HTML 实体原样返回', args: ['&quot;&amp;'], expected: '&quot;&amp;' },
  { remark: '美元替换符原样返回', args: ['$&$1$$'], expected: '$&$1$$' },
  { remark: '反斜杠原样返回', args: ['a\\b'], expected: 'a\\b' },
  { remark: '换行原样返回', args: ['a\nb'], expected: 'a\nb' }
]);
