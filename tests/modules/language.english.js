'use strict';

require('../helpers/module')(__filename, [
  { remark: '大写字母起点 A 被识别为英文', args: ['A'], expected: true },
  { remark: '大写字母终点 Z 被识别为英文', args: ['Z'], expected: true },
  { remark: '小写字母起点 a 被识别为英文', args: ['a'], expected: true },
  { remark: '小写字母终点 z 被识别为英文', args: ['z'], expected: true },
  { remark: '整句英文被识别为包含英文', args: ['Hello world!'], expected: true },
  { remark: '中文混合一个英文字母仍包含英文', args: ['中文a内容'], expected: true },
  { remark: '数字混合大写字母仍包含英文', args: ['12X34'], expected: true },
  { remark: '空字符串不包含英文', args: [''], expected: false },
  { remark: '数字不作为英文字母', args: ['0123456789'], expected: false },
  { remark: '中文不作为英文字母', args: ['中文'], expected: false },
  { remark: '全角拉丁字母不属于 ASCII 英文字母', args: ['Ａｚ'], expected: false },
  { remark: '重音拉丁字母不属于 ASCII 英文字母', args: ['éñ'], expected: false },
  { remark: '紧邻字母区间的标点不被误判', args: ['@[`{'], expected: false },
  { remark: '表情符号不作为英文', args: ['😀'], expected: false }
]);
