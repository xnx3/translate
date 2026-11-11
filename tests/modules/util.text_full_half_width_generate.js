'use strict';

require('../helpers/module')(__filename, [
  { remark: '没有边界标点时保留原文作为唯一候选', args: ['你好世界', 'english'], expected: ['你好世界'] },
  { remark: '空字符串不生成额外候选', args: ['', 'english'], expected: [''] },
  { remark: '纯空白字符串原样保留', args: [' \t ', 'english'], expected: [' \t '] },
  { remark: '省略文本参数保留 undefined 候选', args: [], expected: [undefined] },
  { remark: '显式 undefined 文本保留 undefined 候选', args: [undefined, 'english'], expected: [undefined] },
  { remark: '英文目标为前方全角逗号生成半角加空格候选', args: ['，你好', 'english'], expected: ['，你好', ', 你好'] },
  { remark: '英文目标为前方全角冒号生成半角加空格候选', args: ['：你好', 'english'], expected: ['：你好', ': 你好'] },
  { remark: '英文目标为前方全角句号生成半角加空格候选', args: ['。你好', 'english'], expected: ['。你好', '. 你好'] },
  { remark: '英文目标为后方全角逗号生成带空格及不带空格候选', args: ['你好，', 'english'], expected: ['你好，', '你好, ', '你好,'] },
  { remark: '英文目标为后方全角冒号生成带空格及不带空格候选', args: ['你好：', 'english'], expected: ['你好：', '你好: ', '你好:'] },
  { remark: '英文目标为后方全角句号生成带空格及不带空格候选', args: ['你好。', 'english'], expected: ['你好。', '你好. ', '你好.'] },
  { remark: '中文目标将前方半角逗号转为全角候选', args: [',你好', 'chinese_simplified'], expected: [',你好', '，你好'] },
  { remark: '中文目标保留并去掉半角逗号后的旧空格', args: [', 你好', 'chinese_simplified'], expected: [', 你好', '， 你好', '，你好'] },
  { remark: '中文目标将后方半角句号转为全角候选', args: ['你好.', 'chinese_simplified'], expected: ['你好.', '你好。'] },
  { remark: '日语目标采用全角标点候选', args: ['你好:', 'japanese'], expected: ['你好:', '你好：'] },
  { remark: '韩语目标采用全角标点候选', args: [':你好', 'korean'], expected: [':你好', '：你好'] },
  { remark: '内部标点不生成边界候选', args: ['你，好', 'english'], expected: ['你，好'] },
  { remark: '已有半角标点在英文目标下不重复生成候选', args: [',你好.', 'english'], expected: [',你好.'] }
]);
