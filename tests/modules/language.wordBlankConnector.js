'use strict';

require('../helpers/module')(__filename, [
  { remark: '简体中文的词之间不追加空格', args: ['chinese_simplified'], expected: false },
  { remark: '繁体中文的词之间不追加空格', args: ['chinese_traditional'], expected: false },
  { remark: '日语的词之间不追加空格', args: ['japanese'], expected: false },
  { remark: '韩语的词之间不追加空格', args: ['korean'], expected: false },
  { remark: '英文的词之间需要空格', args: ['english'], expected: true },
  { remark: '阿拉伯语的词之间需要空格', args: ['arabic'], expected: true },
  { remark: '西班牙语的词之间需要空格', args: ['spanish'], expected: true },
  { remark: '语言标识忽略大小写', args: ['JAPANESE'], expected: false },
  { remark: '语言标识去掉前后空白', args: ['  korean\t'], expected: false },
  { remark: '带空白的大写英文标识仍需要空格', args: [' ENGLISH '], expected: true },
  // 默认行为在源码注释中明确：未匹配的语种需要空格。
  { remark: '空语言标识使用默认的空格连接', args: [''], expected: true },
  { remark: '未知语言标识使用默认的空格连接', args: ['unknown_language'], expected: true },
  { remark: '省略语言参数使用默认的空格连接', args: [], expected: true },
  { remark: '显式 undefined 使用默认的空格连接', args: [undefined], expected: true },
  { remark: 'null 使用默认的空格连接', args: [null], expected: true }
]);
