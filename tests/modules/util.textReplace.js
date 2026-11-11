'use strict';

require('../helpers/module')(__filename, [
  // 来源：verify.html 第 2 条。
  { remark: '替换文本后面有标点符号，替换后需要跟前面的标点符号加空格、以及对后面的标点符号进行转半角处理', args: ['你好，世界', '你好', 'Hello', 'english'], expected: 'Hello, 世界' },
  // 来源：verify.html 第 3 条。
  { remark: '替换文本前面有标点符号，替换后需要跟前面的标点符号加空格、以及对前面的标点符号进行转半角处理', args: ['你好，世界', '世界', 'World', 'english'], expected: '你好, World' },
  // 来源：verify.html 第 4 条。
  { remark: '针对替换的文本在分词中的某个词使用，要保持分词的完整性，语义一致性，分词本身决不能拆分', args: ['你好，我好，他也好', '好', 'Good', 'english', ['我好', '大家好']], expected: '你 Good, 我好，他也 Good' },
  // 来源：verify.html 第 5 条。
  { remark: '测试标点符号的半角全角宽泛适配 - 第一个字符没标点符号，最后一个字符有半角标点符号', args: ['你好，世界。', '好，', 'hao,', 'english'], expected: '你 hao, 世界。' },
  // 来源：verify.html 第 6 条。
  { remark: '测试标点符号的半角全角宽泛适配 - 第一个字符没标点符号，最后一个字符有半角标点符号', args: ['你好，世界.', '世界。', 'World.', 'english'], expected: '你好, World.' },
  // 来源：verify.html 第 7 条。
  { remark: '测试标点符号的半角全角宽泛适配 - 第一个字符没标点符号，最后一个字符有全角标点符号', args: ['你好，世界。', '世界。', 'World.', 'english'], expected: '你好, World.' },
  // 来源：verify.html 第 8 条。
  { remark: '测试标点符号的半角全角宽泛适配 - 源文本是全角，第一个标点符号全角，第二个标点符号全角', args: ['你好，世界。', '，世界。', ', World.', 'english'], expected: '你好 , World.' },
  // 来源：verify.html 第 9 条。
  { remark: '测试标点符号的半角全角宽泛适配 - 源文本是全角，第一个标点符号半角，第二个标点符号全角', args: ['你好, 世界。', '，世界。', ', World.', 'english'], expected: '你好 , World.' },
  // 来源：verify.html 第 10 条。
  { remark: '测试标点符号的半角全角宽泛适配 - 源文本是全角，第一个标点符号全角，第二个标点符号半角', args: ['你好，世界.', '，世界。', ', World.', 'english'], expected: '你好 , World.' },
  // 来源：verify.html 第 11 条。
  { remark: '测试标点符号的半角全角宽泛适配 - 源文本是全角，第一个标点符号半角，第二个标点符号半角', args: ['你好, 世界.', '，世界。', ', World.', 'english'], expected: '你好 , World.' },
  // 来源：verify.html 第 12 条，原始记录保留，不擅自与第 13、15 条去重。
  { remark: '测试标点符号的半角全角宽泛适配 - 源文本是半角，第一个标点符号半角，第二个标点符号全角', args: ['你好,世界.', ',世界。', ', World.', 'english'], expected: '你好 , World.' },
  // 来源：verify.html 第 13 条，原表达式与第 12 条相同，但说明不同。
  { remark: '测试标点符号的半角全角宽泛适配 - 源文本是半角，第一个标点符号半角，第二个标点符号半角', args: ['你好,世界.', ',世界。', ', World.', 'english'], expected: '你好 , World.' },
  // 来源：verify.html 第 15 条，原始重复条目完整保留。
  { remark: '测试标点符号的半角全角宽泛适配 - 源文本是半角，第一个标点符号半角，第二个标点符号半角', args: ['你好,世界.', ',世界。', ', World.', 'english'], expected: '你好 , World.' },
  // 来源：verify.html 第 16 条。以实际字符串断言，避免 JSON 字符串比较掩盖类型。
  { remark: '分词中包含多个替换文本的情况', args: ['的1的的的2的的的的3的', '的', 'of', 'english', ['的的的2', '的的的3']], expected: 'of 1的的的2 of 的的的3 of' },

  ...['english', 'chinese_simplified', 'chinese_traditional', 'japanese', 'korean'].map(language => ({
    remark: `目标等于整段原文时直接返回替换文本，语种为 ${language}`,
    args: ['你好，世界。', '你好，世界。', 'Hello, world.', language],
    expected: 'Hello, world.'
  })),
  ...['english', 'chinese_simplified', 'chinese_traditional', 'japanese', 'korean'].map(language => ({
    remark: `原词和替换词相同时保留原有空格及标点，语种为 ${language}`,
    args: ['你好，世界。', '世界', '世界', language],
    expected: '你好，世界。'
  })),
  { remark: '找不到目标词时整段原文保持不变', args: ['你好，世界', '再见', 'Goodbye', 'english'], expected: '你好，世界' },
  { remark: '空原文且没有目标匹配时仍返回空串', args: ['', '你好', 'Hello', 'english'], expected: '' },
  { remark: '整段文本替换为空字符串', args: ['你好', '你好', '', 'english'], expected: '' },
  { remark: '中文语种将局部内容替换为空字符串', args: ['你好世界', '好', '', 'chinese_simplified'], expected: '你世界' },
  { remark: '重复出现的目标全部替换，中文语种不插入空格', args: ['你你你', '你', '我', 'chinese_simplified'], expected: '我我我' },
  { remark: '相邻的英文替换结果用一个空格分开', args: ['你好你好', '你好', 'Hello', 'english'], expected: 'Hello Hello' },
  { remark: '替换目标在文本中间时英文结果与两侧分开', args: ['甲你乙', '你', 'you', 'english'], expected: '甲 you 乙' },
  { remark: '中文替换结果与两侧中文不追加空格', args: ['甲你乙', '你', '我', 'chinese_simplified'], expected: '甲我乙' },
  { remark: '省略可选分词参数时正常替换', args: ['你你好', '你', 'you', 'english'], expected: 'you you 好' },
  { remark: '显式 undefined 分词参数时正常替换', args: ['你你好', '你', 'you', 'english', undefined], expected: 'you you 好' },
  { remark: '空分词数组时正常替换', args: ['你你好', '你', 'you', 'english', []], expected: 'you you 好' },
  ...[' ', '\n', '\t', '|', '_', '-', '/'].map(separator => ({
    remark: `已有分隔符 ${JSON.stringify(separator)} 时替换结果不重复追加空格`,
    args: [separator + '你' + separator, '你', 'you', 'english'],
    expected: separator + 'you' + separator
  })),
  { remark: '方括号内的替换文本不额外增加空格', args: ['[你]', '你', 'you', 'english'], expected: '[you]' },
  { remark: '替换词两侧全角冒号按英文转换并分隔', args: ['甲：你：乙', '你', 'you', 'english'], expected: '甲: you: 乙' },
  { remark: '替换词两侧全角句号按英文转换并分隔', args: ['甲。你。乙', '你', 'you', 'english'], expected: '甲. you. 乙' },
  { remark: '替换词自带前后空格时不重复添加', args: ['甲你乙', '你', ' you ', 'english'], expected: '甲 you 乙' },
  { remark: '省略目标语种时使用默认的空格连接策略', args: ['甲你乙', '你', 'you'], expected: '甲 you 乙' },
  { remark: '保护分词保持不变，其他目标正常替换', args: ['你好，你', '你', 'you', 'english', ['你好']], expected: '你好, you' },
  { remark: '未命中的保护分词不妨碍替换', args: ['甲你乙', '你', '我', 'chinese_simplified', ['再见']], expected: '甲我乙' },

  // 验证公开入口把空译文传入替换流程，默认语种和重复匹配均不能重新补入空格。
  { remark: '中文空译文通过公开入口删除开头匹配', args: ['你好世界', '你好', '', 'chinese_simplified'], expected: '世界' },
  { remark: '英文空译文通过公开入口删除开头匹配，不增加空格', args: ['你好世界', '你好', '', 'english'], expected: '世界' },
  { remark: '省略语种时公开入口仍将空译文作为删除处理', args: ['你好世界', '你好', ''], expected: '世界' },
  { remark: '中文空译文通过公开入口删除开头和末尾的重复匹配', args: ['你好世界你好', '你好', '', 'chinese_simplified'], expected: '世界' },
  { remark: '英文空译文通过公开入口删除重复匹配，不在两端留下新增空格', args: ['你好世界你好', '你好', '', 'english'], expected: '世界' },
  { remark: '省略语种时公开入口的空译文同样删除重复匹配', args: ['你好世界你好', '你好', ''], expected: '世界' },
  { remark: '中文空译文通过公开入口保留保护分词，只删除独立匹配', args: ['你好世界，你好', '你好', '', 'chinese_simplified', ['你好世界']], expected: '你好世界，' },
  { remark: '英文空译文通过公开入口保留保护分词和不属于匹配的标点', args: ['你好世界，你好', '你好', '', 'english', ['你好世界']], expected: '你好世界，' },
  { remark: '省略语种时空译文没有匹配目标，公开入口保持原文', args: ['你好，世界', '再见', ''], expected: '你好，世界' },
  { remark: '英文空译文通过公开入口只删除文字，保留匹配范围之外的原有空格', args: ['甲 你好 乙', '你好', '', 'english'], expected: '甲  乙' },

  // 标点属于匹配原文时随匹配一同删除；原文的全半角适配仍由公开入口完成。
  // 下面的甲、乙、丙及无关标点均不属于匹配，预期值直接按保留这些字符确定。
  { remark: '英文空译文可删除全角原文对应的半角标点及空格变体', args: ['甲, 你好. 乙', '，你好。', '', 'english'], expected: '甲乙' },
  { remark: '中文空译文可删除半角原文对应的全角标点变体', args: ['甲，你好。乙', ',你好.', '', 'chinese_simplified'], expected: '甲乙' },
  { remark: '英文空译文删除同段文字中的全角原文及半角变体，不丢失两者之间的文字', args: ['甲，你好。乙, 你好. 丙', '，你好。', '', 'english'], expected: '甲乙丙' },
  { remark: '英文空译文适配半角变体时仍保留包含原文的保护分词', args: ['你好，世界。你好, ', '你好，', '', 'english', ['你好，世界']], expected: '你好，世界。' },
  { remark: '英文空译文通过公开入口删除表情之间的文字，不拆分两侧表情', args: ['😀你好🚀', '你好', '', 'english'], expected: '😀🚀' },
  { remark: '英文空译文通过公开入口保留不属于匹配的相邻全角冒号和逗号', args: ['甲：你好，乙', '你好', '', 'english'], expected: '甲：，乙' }
]);
