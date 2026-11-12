'use strict';

require('../helpers/module')(__filename, [
  ...['①', '⑴', '⒈', '┌', '▃', '㈠', '㎎', '㎡', 'Ａ', '１', '×', '÷', '→', '∑', '、', '。', ' ', '\t', '\n', '\u00a0', '\u202f', '\u3000', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ';', '<', '=', '>', '?', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'].map(char => ({
    remark: `特殊字符 ${JSON.stringify(char)} 被识别`, args: [char], expected: true
  })),
  ...['a', 'Z', '0', '9', '中', '한', 'あ', 'א', ''].map(char => ({
    remark: `正常文字或数字 ${JSON.stringify(char)} 不被误判为特殊字符`, args: [char], expected: false
  })),
  { remark: '文字中间包含特殊符号时可检测到', args: ['你好×世界'], expected: true },
  // 源码注释列出的 U+003A 冒号也必须归入特殊字符。
  { remark: 'ASCII 冒号属于标点特殊字符', args: [':'], expected: true },
  { remark: '英文文字开头的 ASCII 冒号可检测到', args: [':Hello'], expected: true },
  { remark: '中文文字中间的 ASCII 冒号可检测到', args: ['你好:世界'], expected: true },
  { remark: '英文文字末尾的 ASCII 冒号可检测到', args: ['Hello:'], expected: true },
  { remark: '连续 ASCII 冒号属于特殊字符', args: ['::'], expected: true }
]);
