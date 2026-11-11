'use strict';

require('../helpers/module')(__filename, [
  ...['é', 'è', 'ê', 'à', 'ç', 'œ', 'ñ', 'á', 'ó', 'ò', 'ì', 'ã', 'õ'].map(char => ({
    remark: `罗曼语族特殊字符 ${char} 被识别`, args: [char], expected: true
  })),
  { remark: '普通英文字母不作为罗曼语族特殊字符', args: ['a'], expected: false },
  { remark: '空字符串不作为罗曼语族特殊字符', args: [''], expected: false },
  { remark: '中文不作为罗曼语族特殊字符', args: ['中'], expected: false },
  { remark: '乘号不作为罗曼语族特殊字符', args: ['×'], expected: false },
  { remark: '除号不作为罗曼语族特殊字符', args: ['÷'], expected: false }
]);
