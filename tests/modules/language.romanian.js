'use strict';

require('../helpers/module')(__filename, [
  { remark: '罗马尼亚语大写 Ă 被识别', args: ['Ă'], expected: true },
  { remark: '罗马尼亚语小写 ă 被识别', args: ['ă'], expected: true },
  { remark: '罗马尼亚语 Ș 被识别', args: ['Ș'], expected: true },
  { remark: '罗马尼亚语 ș 被识别', args: ['ș'], expected: true },
  { remark: '罗马尼亚语 Ț 被识别', args: ['Ț'], expected: true },
  { remark: '罗马尼亚语 ț 被识别', args: ['ț'], expected: true },
  { remark: '带重音拉丁字母 Â 被识别', args: ['Â'], expected: true },
  { remark: '带重音拉丁字母 î 被识别', args: ['î'], expected: true },
  // 乘除号虽然邻近拉丁字符区间，但不应当作为罗马尼亚文字母。
  { remark: '乘号不属于罗马尼亚语', args: ['×'], expected: false },
  { remark: '除号不属于罗马尼亚语', args: ['÷'], expected: false },
  { remark: 'ASCII 字母不属于该特殊字母识别范围', args: ['a'], expected: false },
  { remark: '空字符串不属于罗马尼亚文单字符', args: [''], expected: false },
  { remark: '中文不被误判成罗马尼亚语', args: ['中'], expected: false },
  { remark: '数字不被误判成罗马尼亚语', args: ['1'], expected: false }
]);
