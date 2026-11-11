'use strict';

require('../helpers/module')(__filename, [
  { remark: '泰文字母起点 ก 被识别', args: ['ก'], expected: true },
  { remark: '常见泰文字母 ท 被识别', args: ['ท'], expected: true },
  { remark: '泰文元音 า 被识别', args: ['า'], expected: true },
  { remark: '泰文数字 ๐ 被识别', args: ['๐'], expected: true },
  { remark: '泰文数字 ๙ 被识别', args: ['๙'], expected: true },
  { remark: '空字符串不属于泰文单字符', args: [''], expected: false },
  { remark: 'ASCII 数字不被误判为泰文', args: ['0'], expected: false },
  { remark: '英文字母不被误判为泰文', args: ['a'], expected: false },
  { remark: '中文字不被误判为泰文', args: ['中'], expected: false },
  { remark: '泰文区间之前的字符不被误判', args: ['\u0e00'], expected: false }
]);
