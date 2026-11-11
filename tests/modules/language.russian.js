'use strict';

require('../helpers/module')(__filename, [
  // 此入口按单字符分类；整句的识别由 recognition 负责。
  { remark: '俄文大写首字母 А 被识别', args: ['А'], expected: true },
  { remark: '俄文大写末字母 Я 被识别', args: ['Я'], expected: true },
  { remark: '俄文小写首字母 а 被识别', args: ['а'], expected: true },
  { remark: '俄文小写末字母 я 被识别', args: ['я'], expected: true },
  { remark: '俄文特殊大写 Ё 被识别', args: ['Ё'], expected: true },
  { remark: '俄文特殊小写 ё 被识别', args: ['ё'], expected: true },
  { remark: '空字符串不属于俄文单字符', args: [''], expected: false },
  { remark: '拉丁字母 A 不被误认成相似俄文字母', args: ['A'], expected: false },
  { remark: '乌克兰语特有字母 Ї 不被误判成俄文', args: ['Ї'], expected: false },
  { remark: '乌克兰语特有字母 і 不被误判成俄文', args: ['і'], expected: false },
  { remark: '中文不被误判成俄文', args: ['中'], expected: false },
  { remark: '数字不被误判成俄文', args: ['1'], expected: false }
]);
