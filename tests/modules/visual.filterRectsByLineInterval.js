require('../helpers/module')(__filename, [
  { remark: '空数组返回空数组', args: [[], 1], expected: [] },
  { remark: '非数组矩形参数被拒绝', args: [null, 1], expected: [] },
  { remark: '行间隔为零被拒绝', args: [[{ top: 0 }], 0], expected: [] },
  { remark: '负的行间隔被拒绝', args: [[{ top: 0 }], -1], expected: [] },
  { remark: '字符串行间隔不作为数字接受', args: [[{ top: 0 }], '2'], expected: [] },
  { remark: '逐行取第一个矩形并按从上到下排序', test: function () {
    const input = [{ top: 20, id: 'c' }, { top: 0, id: 'a' }, { top: 0, id: 'a2' }, { top: 10, id: 'b' }];
    const actual = translate.visual.filterRectsByLineInterval(input, 1);
    return actual.map(r => r.id).join(',') === 'a,b,c' && input[0].id === 'c' && !('rowBase' in input[0]);
  } },
  { remark: '间隔二行取得第一和第三行', test: function () {
    const actual = translate.visual.filterRectsByLineInterval([{ top: 30, id: 4 }, { top: 20, id: 3 }, { top: 10, id: 2 }, { top: 0, id: 1 }], 2);
    return actual.map(r => r.id).join(',') === '1,3';
  } },
  { remark: '间隔大于总行数时仍保留首行', test: function () {
    const actual = translate.visual.filterRectsByLineInterval([{ top: 10 }, { top: 0 }], 5);
    return actual.length === 1 && actual[0].top === 0;
  } },
  { remark: '无效矩形被过滤且小数顶部按同一行归组', test: function () {
    const actual = translate.visual.filterRectsByLineInterval([null, {}, { top: 0.1, id: 'first' }, { top: 0.4, id: 'same' }, { top: 10, id: 'next' }], 1);
    return actual.map(r => r.id).join(',') === 'first,next';
  } }
]);
