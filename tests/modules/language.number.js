'use strict';

require('../helpers/module')(__filename, [
  { remark: '数字起点 0 被识别', args: ['0'], expected: true },
  { remark: '数字终点 9 被识别', args: ['9'], expected: true },
  { remark: '连续十个数字被识别', args: ['0123456789'], expected: true },
  { remark: '中文中间包含数字被识别', args: ['第2页'], expected: true },
  { remark: '带符号小数包含数字', args: ['-12.5'], expected: true },
  { remark: '科学计数表达式包含数字', args: ['1e3'], expected: true },
  { remark: '空字符串不包含数字', args: [''], expected: false },
  { remark: '纯英文不包含数字', args: ['abc'], expected: false },
  { remark: '中文数字不属于阿拉伯数字', args: ['一二三'], expected: false },
  { remark: '全角数字不属于 ASCII 数字', args: ['０１２'], expected: false },
  { remark: '阿拉伯文数字不属于 ASCII 数字', args: ['١٢٣'], expected: false },
  { remark: '数字区间相邻的斜线和冒号不被误判', args: ['/:'], expected: false }
]);
