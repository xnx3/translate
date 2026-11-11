'use strict';

require('../helpers/module')(__filename, [
  { remark: '希伯来文首字母 א 被识别', args: ['א'], expected: true },
  { remark: '希伯来文末字母 ת 被识别', args: ['ת'], expected: true },
  { remark: '希伯来文终结字形 ך 被识别', args: ['ך'], expected: true },
  { remark: '希伯来文元音标记被识别为所属区块字符', args: ['ְ'], expected: true },
  { remark: '空字符串不属于希伯来文单字符', args: [''], expected: false },
  { remark: '阿拉伯字母不被误判为希伯来文', args: ['ا'], expected: false },
  { remark: '英文字母不被误判为希伯来文', args: ['a'], expected: false },
  { remark: '中文字不被误判为希伯来文', args: ['中'], expected: false },
  { remark: '数字不被误判为希伯来文', args: ['1'], expected: false },
  { remark: '表情符号不被误判为希伯来文', args: ['😀'], expected: false }
]);
