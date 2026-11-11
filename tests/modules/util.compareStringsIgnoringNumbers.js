'use strict';

require('../helpers/module')(__filename, [
  // 来源：verify.html 第 20 条。
  { remark: '比较字符串除了数字外是否完全一致 - 长度相等 - 中间数字', args: ['abc123def', 'abc456def'], expected: true },
  // 来源：verify.html 第 21 条。
  { remark: '比较字符串除了数字外是否完全一致 - 长度相等 - 中间数字', args: ['hello7world', 'hello8world'], expected: true },
  // 来源：verify.html 第 22 条。
  { remark: '比较字符串除了数字外是否完全一致 - 长度不等 - 最后数字', args: ['test123', 'test'], expected: true },
  // 来源：verify.html 第 23 条。
  { remark: '比较字符串除了数字外是否完全一致 - 长度相等 - 无数字 - 不同内容', args: ['abc', 'def'], expected: false },
  // 来源：verify.html 第 24 条。维护者已确认原源码示例注释有误，忽略数字后两边均为 abc，应返回 true。
  { remark: '比较字符串除了数字外是否完全一致 - 长度不等 - 中间间隔数字 - 不同内容', args: ['a1b2c3', 'a4b5c'], expected: true },
  // 来源：verify.html 第 25 条。
  { remark: '比较字符串除了数字外是否完全一致 - 空字符串', args: ['', ''], expected: true },
  // 来源：verify.html 第 26 条。
  { remark: '比较字符串除了数字外是否完全一致 - 长度不等 - 数字位置随机', args: ['你好123世界', '3你好1世界'], expected: true },
  // 来源：verify.html 第 27 条。
  { remark: '比较字符串除了数字外是否完全一致 - 长度不等 - 数字位置随机', args: ['你好123世界', '你好世界4'], expected: true },
  { remark: '完全相同的普通文本相等', args: ['hello', 'hello'], expected: true },
  { remark: '纯数字文本忽略后相等', args: ['123', '456789'], expected: true },
  { remark: '纯数字与空文本忽略后相等', args: ['123', ''], expected: true },
  { remark: '空文本与纯数字忽略后相等', args: ['', '456'], expected: true },
  { remark: '只在开头增加数字不改变文本', args: ['123test', 'test'], expected: true },
  { remark: '两边不同位置的数字不改变非数字内容', args: ['1a2b3', 'ab999'], expected: true },
  { remark: '非数字字符缺失时不相等', args: ['abc1', 'ab2'], expected: false },
  { remark: '只有一边有非数字字符时不相等', args: ['a123', '123'], expected: false },
  { remark: '字母大小写仍然参与比较', args: ['A1', 'a2'], expected: false },
  { remark: '空格仍然参与比较', args: ['a 1b', 'a2b'], expected: false },
  { remark: '标点仍然参与比较', args: ['a,1b', 'a.2b'], expected: false },
  { remark: '中文字符仍然参与比较', args: ['你好1', '您好2'], expected: false },
  { remark: 'ASCII 数字以外的全角数字不会被忽略', args: ['a１', 'a２'], expected: false },
  { remark: '表情相同且只有数字不同时相等', args: ['😀1', '😀2'], expected: true }
]);
