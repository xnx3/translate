'use strict';

require('../helpers/module')(__filename, [
  { remark: '四段版本忽略最后的日期段', args: ['2.11.3.20231232'], expected: 2011003 },
  { remark: '三段版本无需日期也可转换', args: ['1.2.3'], expected: 1002003 },
  { remark: '全零版本转换为零', args: ['0.0.0'], expected: 0 },
  { remark: '只有补丁号变化时保持补丁号', args: ['0.0.9'], expected: 9 },
  { remark: '次版本按千位区分', args: ['0.12.0'], expected: 12000 },
  { remark: '主版本按百万位区分', args: ['12.0.0'], expected: 12000000 },
  { remark: '版本分量的前导零不改变数值', args: ['01.002.003'], expected: 1002003 },
  { remark: '日期变化不改变用于比较的版本值', args: ['2.11.3.20260101'], expected: 2011003 },
  { remark: '较大的补丁版本仍保持三个分量', args: ['4.10.999'], expected: 4010999 }
]);
