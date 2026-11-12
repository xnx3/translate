'use strict';

require('../helpers/module')(__filename, [
  { remark: '简体中文单字符识别为简体中文', args: ['汉'], expected: 'chinese_simplified' },
  { remark: '繁体中文单字符识别为繁体中文', args: ['漢'], expected: 'chinese_traditional' },
  { remark: '大写英文字母识别为英文', args: ['A'], expected: 'english' },
  { remark: '小写英文字母识别为英文', args: ['z'], expected: 'english' },
  { remark: '俄文字母识别为俄语', args: ['Ё'], expected: 'russian' },
  { remark: '罗曼语族重音字符优先于其他拉丁字符分类', args: ['é'], expected: 'romance' },
  { remark: 'ASCII 数字识别为数字', args: ['0'], expected: 'number' },
  { remark: '日文假名识别为日语', args: ['あ'], expected: 'japanese' },
  { remark: '韩文音节识别为韩语', args: ['한'], expected: 'korean' },
  { remark: '希腊字母识别为希腊语', args: ['Ω'], expected: 'greek' },
  { remark: '泰文字母识别为泰语', args: ['ก'], expected: 'thai' },
  { remark: '阿拉伯字母识别为阿拉伯语', args: ['ا'], expected: 'arabic' },
  { remark: '罗马尼亚语特有字母识别为罗马尼亚语', args: ['Ș'], expected: 'romanian' },
  { remark: '希伯来字母识别为希伯来语', args: ['א'], expected: 'hebrew' },
  { remark: '乘号识别为特殊字符而非罗马尼亚语', args: ['×'], expected: 'specialCharacter' },
  { remark: '除号识别为特殊字符而非罗马尼亚语', args: ['÷'], expected: 'specialCharacter' },
  { remark: '中文标点识别为特殊字符', args: ['，'], expected: 'specialCharacter' },
  { remark: '空格识别为特殊字符', args: [' '], expected: 'specialCharacter' },
  { remark: '空字符串没有可识别语种', args: [''], expected: '' },
  { remark: 'null 返回未识别而不抛错', args: [null], expected: '' },
  { remark: '省略参数返回未识别而不抛错', args: [], expected: '' },
  { remark: '显式 undefined 返回未识别而不抛错', args: [undefined], expected: '' },
  { remark: 'ASCII 冒号识别为特殊字符而非未识别语种', args: [':'], expected: 'specialCharacter' }
]);
