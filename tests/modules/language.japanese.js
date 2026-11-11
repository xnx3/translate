'use strict';

require('../helpers/module')(__filename, [
  { remark: '平假名被识别为日语', args: ['あ'], expected: true },
  { remark: '片假名被识别为日语', args: ['ア'], expected: true },
  { remark: '日语句子中的假名被识别', args: ['こんにちは世界'], expected: true },
  { remark: '英文混合片假名仍包含日语', args: ['testカナ'], expected: true },
  { remark: '中文混合平假名仍包含日语', args: ['中文の内容'], expected: true },
  { remark: '空字符串不包含日语', args: [''], expected: false },
  { remark: '纯英文不包含日语', args: ['Hello'], expected: false },
  { remark: '共用汉字本身不能证明包含日语', args: ['世界'], expected: false },
  { remark: '韩文字母不被误判为日语', args: ['한'], expected: false },
  { remark: '表情符号不被误判为日语', args: ['😀'], expected: false }
]);
