'use strict';

require('../helpers/module')(__filename, [
  { remark: '常用简体汉字被识别为简体中文', args: ['汉'], expected: 'simplified' },
  { remark: '另一个简体汉字被识别为简体中文', args: ['龙'], expected: 'simplified' },
  { remark: '繁体汉字被识别为繁体中文', args: ['漢'], expected: 'traditional' },
  { remark: '繁体字典中的龍被识别为繁体中文', args: ['龍'], expected: 'traditional' },
  { remark: '简繁共用字使用简体分类', args: ['中'], expected: 'simplified' },
  { remark: '简体中文短句包含汉字', args: ['你好世界'], expected: 'simplified' },
  { remark: '空字符串不包含中文', args: [''], expected: '' },
  { remark: '英文字母不被误判成中文', args: ['a'], expected: '' },
  { remark: '数字不被误判成中文', args: ['1'], expected: '' },
  { remark: '日文假名不被误判成中文', args: ['あ'], expected: '' },
  { remark: '韩文音节不被误判成中文', args: ['한'], expected: '' },
  { remark: '表情符号不被误判成中文', args: ['😀'], expected: '' }
]);
