require('../helpers/module')(__filename, [
  { remark: '空数组不产生行分组', args: [[]], expected: [] },
  { remark: '单个矩形产生单行', args: [[{ top: 0, left: 0 }]], expected: [[{ top: 0, left: 0 }]] },
  { remark: '相同顶部坐标的矩形保持原顺序归入同一行', args: [[{ top: 0, left: 0 }, { top: 0, left: 10 }]], expected: [[{ top: 0, left: 0 }, { top: 0, left: 10 }]] },
  { remark: '顶部相差四像素仍归入同一行', args: [[{ top: 0 }, { top: 4 }]], expected: [[{ top: 0 }, { top: 4 }]] },
  { remark: '顶部相差五像素分为两行', args: [[{ top: 0 }, { top: 5 }]], expected: [[{ top: 0 }], [{ top: 5 }]] },
  { remark: '多行中最后一行不会遗漏', args: [[{ top: 0 }, { top: 0 }, { top: 10 }, { top: 20 }]], expected: [[{ top: 0 }, { top: 0 }], [{ top: 10 }], [{ top: 20 }]] },
  { remark: '行分组保留原矩形引用且不修改输入', test: function () {
    const a = { top: 0 }, b = { top: 10 }, input = [a, b];
    const actual = translate.visual.groupRectsByLine(input);
    return actual[0][0] === a && actual[1][0] === b && input.length === 2 && input[0] === a;
  } }
]);
