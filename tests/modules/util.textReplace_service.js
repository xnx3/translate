'use strict';

require('../helpers/module')(__filename, [
  { remark: '整段文本直接替换为结果', args: ['你好', '你好', 'Hello', 'english'], expected: 'Hello' },
  { remark: '整段文本可以替换为空串', args: ['你好', '你好', '', 'english'], expected: '' },
  { remark: '未找到目标时保留原文', args: ['你好', '再见', 'Bye', 'english'], expected: '你好' },
  { remark: '空原文没有匹配时保持为空', args: ['', '你好', 'Hello', 'english'], expected: '' },
  { remark: '局部英文替换结果与前后文字分隔', args: ['甲你乙', '你', 'you', 'english'], expected: '甲 you 乙' },
  { remark: '局部中文替换不增加空格', args: ['甲你乙', '你', '我', 'chinese_simplified'], expected: '甲我乙' },
  { remark: '局部日文替换不增加空格', args: ['甲你乙', '你', 'あ', 'japanese'], expected: '甲あ乙' },
  { remark: '局部韩文替换不增加空格', args: ['甲你乙', '你', '한', 'korean'], expected: '甲한乙' },
  { remark: '目标出现多次时从后往前全部替换', args: ['你你你', '你', '我', 'chinese_simplified'], expected: '我我我' },
  { remark: '英文替换转换后方全角逗号', args: ['你好，世界', '你好', 'Hello', 'english'], expected: 'Hello, 世界' },
  { remark: '英文替换转换前方全角逗号', args: ['你好，世界', '世界', 'World', 'english'], expected: '你好, World' },
  { remark: '已有空格时不重复增加空格', args: ['甲 你 乙', '你', 'you', 'english'], expected: '甲 you 乙' },
  { remark: '保护分词内的目标不替换', args: ['你好，你', '你', 'you', 'english', ['你好']], expected: '你好, you' },
  { remark: '空保护分词数组允许正常替换', args: ['甲你乙', '你', '我', 'chinese_simplified', []], expected: '甲我乙' },
  { remark: '省略语言使用默认的空格连接', args: ['甲你乙', '你', 'you'], expected: '甲 you 乙' }
]);
