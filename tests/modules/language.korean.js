'use strict';

require('../helpers/module')(__filename, [
  { remark: '韩文音节起点 가 被识别', args: ['가'], expected: true },
  { remark: '常见韩文字被识别', args: ['한'], expected: true },
  { remark: '韩文句子被识别', args: ['안녕하세요'], expected: true },
  { remark: '中文混合韩文仍包含韩文', args: ['中文한内容'], expected: true },
  { remark: '数字混合韩文仍包含韩文', args: ['123가'], expected: true },
  { remark: '空字符串不包含韩文', args: [''], expected: false },
  { remark: '中文不被误判为韩文', args: ['中文'], expected: false },
  { remark: '日文假名不被误判为韩文', args: ['あア'], expected: false },
  { remark: '英文不被误判为韩文', args: ['abc'], expected: false },
  { remark: '表情符号不被误判为韩文', args: ['😀'], expected: false }
]);
