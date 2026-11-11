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
  { remark: '省略语言使用默认的空格连接', args: ['甲你乙', '你', 'you'], expected: '甲 you 乙' },

  // 空译文仅删除匹配文字。语言、匹配位置和周围字符分别登记，便于独立定位回归。
  { remark: '中文空译文删除开头匹配，合法结束位置为零时仍采纳结果', args: ['你好世界', '你好', '', 'chinese_simplified'], expected: '世界' },
  { remark: '中文空译文删除中间匹配并保留两侧文字', args: ['甲你好乙', '你好', '', 'chinese_simplified'], expected: '甲乙' },
  { remark: '中文空译文删除末尾匹配并保留前文', args: ['世界你好', '你好', '', 'chinese_simplified'], expected: '世界' },
  { remark: '英文空译文删除开头匹配，不额外增加分隔空格', args: ['你好世界', '你好', '', 'english'], expected: '世界' },
  { remark: '英文空译文删除中间匹配，不额外增加分隔空格', args: ['甲你好乙', '你好', '', 'english'], expected: '甲乙' },
  { remark: '英文空译文删除末尾匹配，不额外增加分隔空格', args: ['世界你好', '你好', '', 'english'], expected: '世界' },
  { remark: '省略语言时空译文删除开头匹配，不走默认补空格处理', args: ['你好世界', '你好', ''], expected: '世界' },
  { remark: '省略语言时空译文删除中间匹配，不走默认补空格处理', args: ['甲你好乙', '你好', ''], expected: '甲乙' },
  { remark: '省略语言时空译文删除末尾匹配，不走默认补空格处理', args: ['世界你好', '你好', ''], expected: '世界' },
  { remark: '中文整段匹配可直接替换为空译文', args: ['你好', '你好', '', 'chinese_simplified'], expected: '' },
  { remark: '省略语言时整段匹配可直接替换为空译文', args: ['你好', '你好', ''], expected: '' },

  // 删除会改变字符串长度，重复和相邻匹配用于验证原有逆序替换仍使用正确位置。
  { remark: '中文空译文删除开头和末尾两处匹配，中间文字保持不变', args: ['你好世界你好', '你好', '', 'chinese_simplified'], expected: '世界' },
  { remark: '英文空译文删除开头和末尾两处匹配，中间文字保持不变', args: ['你好世界你好', '你好', '', 'english'], expected: '世界' },
  { remark: '省略语言时空译文删除开头和末尾两处匹配', args: ['你好世界你好', '你好', ''], expected: '世界' },
  { remark: '中文空译文删除两处相邻匹配，结果可以完全为空', args: ['你好你好', '你好', '', 'chinese_simplified'], expected: '' },
  { remark: '英文空译文删除两处相邻匹配，结果可以完全为空', args: ['你好你好', '你好', '', 'english'], expected: '' },
  { remark: '省略语言时空译文删除两处相邻匹配，结果可以完全为空', args: ['你好你好', '你好', ''], expected: '' },
  { remark: '中文空译文未命中时不能截断原文', args: ['世界', '你好', '', 'chinese_simplified'], expected: '世界' },
  { remark: '英文空译文未命中时不能截断原文', args: ['世界', '你好', '', 'english'], expected: '世界' },
  { remark: '省略语言时空译文未命中仍保留原文', args: ['世界', '你好', ''], expected: '世界' },
  { remark: '中文空译文保留受保护分词，只删除独立出现的匹配', args: ['你好世界，你好', '你好', '', 'chinese_simplified', ['你好世界']], expected: '你好世界，' },
  { remark: '英文空译文保留受保护分词及原标点，只删除独立匹配', args: ['你好世界，你好', '你好', '', 'english', ['你好世界']], expected: '你好世界，' },
  // language 用 undefined 占位，才能把保护分词传入第五个参数。
  { remark: '未指定语言时空译文同样保留受保护分词及原标点', args: ['你好世界，你好', '你好', '', undefined, ['你好世界']], expected: '你好世界，' },

  // 未包含在匹配原文中的空格、标点和表情不属于删除范围，不能顺便修剪或格式化。
  { remark: '英文空译文删除文字后保留两侧原有空格，不合并连续空格', args: ['甲 你好 乙', '你好', '', 'english'], expected: '甲  乙' },
  { remark: '英文空译文删除开头文字后保留原有后方空格', args: ['你好 世界', '你好', '', 'english'], expected: ' 世界' },
  { remark: '英文空译文删除末尾文字后保留原有前方空格', args: ['世界 你好', '你好', '', 'english'], expected: '世界 ' },
  { remark: '英文空译文保留匹配两侧的全角逗号', args: ['甲，你好，乙', '你好', '', 'english'], expected: '甲，，乙' },
  { remark: '英文空译文保留匹配两侧的半角逗号', args: ['甲,你好,乙', '你好', '', 'english'], expected: '甲,,乙' },
  { remark: '英文空译文保留匹配两侧的全角句号', args: ['甲。你好。乙', '你好', '', 'english'], expected: '甲。。乙' },
  { remark: '英文空译文保留匹配两侧的半角句号', args: ['甲.你好.乙', '你好', '', 'english'], expected: '甲..乙' },
  { remark: '英文空译文保留匹配两侧的全角冒号', args: ['甲：你好：乙', '你好', '', 'english'], expected: '甲：：乙' },
  { remark: '英文空译文保留匹配两侧的半角冒号', args: ['甲:你好:乙', '你好', '', 'english'], expected: '甲::乙' },
  { remark: '英文空译文删除表情之间的文字，不拆分两侧表情', args: ['😀你好🚀', '你好', '', 'english'], expected: '😀🚀' },
  { remark: '英文空译文删除作为匹配原文的表情，保留两侧文字', args: ['甲😀乙', '😀', '', 'english'], expected: '甲乙' },
  { remark: '中文空译文逆序删除四处匹配，保留所有间隔文字', args: ['你好A你好B你好C你好', '你好', '', 'chinese_simplified'], expected: 'ABC' },
  { remark: '英文空译文逆序删除四处匹配，不插入额外空格', args: ['你好A你好B你好C你好', '你好', '', 'english'], expected: 'ABC' }
]);
