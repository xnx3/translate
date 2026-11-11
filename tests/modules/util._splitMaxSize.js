'use strict';

require('../helpers/module')(__filename, [
  { remark: '空二维数组无需处理', args: [[], 100, 2], expected: [] },
  { remark: '每组数量和长度已经满足限制时保持分组', args: [[['a', 'b'], ['c']], 100, 2], expected: [['a', 'b'], ['c']] },
  { remark: '一个超量分组按数量限制拆开', args: [[['a', 'b', 'c']], 100, 2], expected: [['a', 'b'], ['c']] },
  { remark: '数量限制为一时全部元素独立成组', args: [[['a', 'b', 'c']], 100, 1], expected: [['a'], ['b'], ['c']] },
  { remark: '超出数量的余项与下一组共同处理', args: [[['a', 'b', 'c'], ['d']], 100, 2], expected: [['a', 'b'], ['c', 'd']] },
  { remark: 'JSON 长度超过限制时即使数量够小也继续拆分', args: [[['aa', 'bb']], 6, 2], expected: [['aa'], ['bb']] },
  { remark: 'JSON 长度恰好到达上限时保持分组', args: [[['a', 'b']], 9, 2], expected: [['a', 'b']] },
  {
    remark: '数量拆分保留所有元素的顺序且不修改原二维数组',
    test: function () {
      const input = [['a', 'b', 'c'], ['d', 'e']];
      const result = translate.util._splitMaxSize(input, 100, 2);
      return result.flat().join(',') === 'a,b,c,d,e' && result.every(group => group.length <= 2) &&
        input[0].join(',') === 'a,b,c' && input[1].join(',') === 'd,e';
    }
  }
]);
