'use strict';

require('../helpers/module')(__filename, [
  { remark: '希腊文大写首字母 Α 被识别', args: ['Α'], expected: true },
  { remark: '希腊文大写末字母 Ω 被识别', args: ['Ω'], expected: true },
  { remark: '希腊文小写首字母 α 被识别', args: ['α'], expected: true },
  { remark: '希腊文小写末字母 ω 被识别', args: ['ω'], expected: true },
  { remark: '希腊文末尾小写 sigma 被识别', args: ['ς'], expected: true },
  { remark: '空字符串不属于希腊文单字符', args: [''], expected: false },
  { remark: '拉丁字母 A 不被误判为相似希腊字母', args: ['A'], expected: false },
  { remark: '俄文字母不被误判为希腊文', args: ['Б'], expected: false },
  { remark: '中文字不被误判为希腊文', args: ['中'], expected: false },
  { remark: '数字不被误判为希腊文', args: ['1'], expected: false }
]);
