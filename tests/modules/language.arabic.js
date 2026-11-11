'use strict';

require('../helpers/module')(__filename, [
  { remark: '阿拉伯字母 ا 被识别', args: ['ا'], expected: true },
  { remark: '阿拉伯字母 ي 被识别', args: ['ي'], expected: true },
  { remark: '阿拉伯文数字 ٠ 被识别', args: ['٠'], expected: true },
  { remark: '阿拉伯文逗号被识别为所属区块字符', args: ['،'], expected: true },
  { remark: '阿拉伯补充区块字母被识别', args: ['ݐ'], expected: true },
  { remark: '空字符串不属于阿拉伯文单字符', args: [''], expected: false },
  { remark: 'ASCII 数字不被误判为阿拉伯文', args: ['1'], expected: false },
  { remark: '英文字母不被误判为阿拉伯文', args: ['a'], expected: false },
  { remark: '希伯来字母不被误判为阿拉伯文', args: ['א'], expected: false },
  { remark: '表情符号不被误判为阿拉伯文', args: ['😀'], expected: false }
]);
