require('../helpers/module')(__filename, [
  { remark: '空二维数组返回空数组', args: [[]], expected: [] },
  { remark: '各行均为空时返回空数组', args: [[[], []]], expected: [] },
  { remark: '单行保留矩形及其顺序', args: [[[{ left: 1 }, { left: 2 }]]], expected: [{ left: 1 }, { left: 2 }] },
  { remark: '跳过空行并按行顺序展平多个矩形', args: [[[{ left: 1 }], [], [{ left: 2 }, { left: 3 }]]], expected: [{ left: 1 }, { left: 2 }, { left: 3 }] },
  { remark: '展平保留原矩形引用且不修改输入行', test: function () {
    const a = { left: 1 }, b = { left: 2 };
    const rows = [[a], [b]];
    const actual = translate.visual.rectsToOneArray(rows);
    return actual.length === 2 && actual[0] === a && actual[1] === b && rows.length === 2 && rows[0][0] === a;
  } }
]);
