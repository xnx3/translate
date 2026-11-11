'use strict';

require('../helpers/module')(__filename, [
  { remark: '普通文本保持不变', args: ['你好世界'], expected: '你好世界' },
  { remark: '去掉前后普通空格', args: ['  你好 世界  '], expected: '你好 世界' },
  { remark: '去掉制表符', args: ['你\t好'], expected: '你好' },
  { remark: '去掉换行符', args: ['你\n好'], expected: '你好' },
  { remark: '去掉回车符', args: ['你\r好'], expected: '你好' },
  { remark: '去掉垂直制表符', args: ['你\v好'], expected: '你好' },
  { remark: '去掉换页符', args: ['你\f好'], expected: '你好' },
  { remark: '同时去掉不同换行和制表字符', args: [' \t你\r\n好\v\f '], expected: '你好' },
  { remark: '保留文本内部的普通空格', args: ['a b  c'], expected: 'a b  c' },
  { remark: '保留 URL 和 ampersand 内容', args: ['a&b=https://example.test'], expected: 'a&b=https://example.test' },
  { remark: '空字符串仍为空字符串', args: [''], expected: '' },
  { remark: '只包含空白时得到空字符串', args: [' \t\r\n '], expected: '' },
  // 此默认值由源码注释明确约定。
  { remark: '传入 null 得到空字符串', args: [null], expected: '' },
  { remark: '省略参数得到空字符串', args: [], expected: '' },
  { remark: '显式 undefined 得到空字符串', args: [undefined], expected: '' }
]);
