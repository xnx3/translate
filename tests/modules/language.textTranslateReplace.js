'use strict';

require('../helpers/module')(__filename, [
  // 废弃入口仍是兼容 API；使用固定预期验证它与当前替换合同一致。
  { remark: '兼容入口替换整段文本', args: ['你好', '你好', 'Hello', 'english'], expected: 'Hello' },
  { remark: '兼容入口处理后方全角逗号', args: ['你好，世界', '你好', 'Hello', 'english'], expected: 'Hello, 世界' },
  { remark: '兼容入口处理前方全角逗号', args: ['你好，世界', '世界', 'World', 'english'], expected: '你好, World' },
  { remark: '兼容入口没有匹配时保留原文', args: ['你好', '再见', 'Bye', 'english'], expected: '你好' },
  { remark: '兼容入口中文局部替换不加空格', args: ['甲你乙', '你', '我', 'chinese_simplified'], expected: '甲我乙' },
  { remark: '兼容入口日文局部替换不加空格', args: ['甲你乙', '你', 'あ', 'japanese'], expected: '甲あ乙' },
  { remark: '兼容入口空替换结果可以移除整段内容', args: ['你好', '你好', '', 'english'], expected: '' },
  { remark: '兼容入口省略语言采用默认分隔规则', args: ['甲你乙', '你', 'you'], expected: '甲 you 乙' },
  { remark: '兼容入口相同文本替换保持原格式', args: ['你好，世界', '你好', '你好', 'english'], expected: '你好，世界' }
]);
