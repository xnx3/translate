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
  { remark: '兼容入口相同文本替换保持原格式', args: ['你好，世界', '你好', '你好', 'english'], expected: '你好，世界' },
  { remark: '兼容入口删除中间两处相邻目标后保留原先的两个空格', args: ['A 甲甲 B', '甲', '', 'english'], expected: 'A  B' },
  { remark: '兼容入口省略目标语种时空译文保留两侧标点', args: ['甲，删。乙', '删', ''], expected: '甲，。乙' },
  { remark: '兼容入口替换 emoji 两侧的目标文本，保留完整代理对', args: ['甲😀甲', '甲', '乙', 'chinese_simplified'], expected: '乙😀乙' },
  { remark: '兼容入口译文含有原词时每处原词只替换一次', args: ['好呀好', '好', '你好', 'chinese_traditional'], expected: '你好呀你好' },
  { remark: '兼容入口译文中的美元符和反斜杠按原字面写回', args: ['甲X乙', 'X', '$&\\', 'korean'], expected: '甲$&\\乙' },
  { remark: '兼容入口遇到大小写和首尾空格的语种名仍使用该语种的规则', args: ['甲你乙', '你', '好', ' JAPANESE '], expected: '甲好乙' }
]);
