require('../helpers/module')(__filename, [
  { remark: '空数组返回空数组', args: [[]], expected: [] },
  { remark: '空矩形条目被过滤', args: [[null, { top: 0, left: 1 }, null]], expected: [{ top: 0, left: 1 }] },
  { remark: '同一行的矩形按左边坐标排序', args: [[{ top: 1, left: 20 }, { top: 1, left: -5 }, { top: 1, left: 0 }]], expected: [{ top: 1, left: -5 }, { top: 1, left: 0 }, { top: 1, left: 20 }] },
  { remark: '不同的行按顶部坐标排序', args: [[{ top: 20, left: 0 }, { top: 0, left: 30 }, { top: 10, left: 20 }]], expected: [{ top: 0, left: 30 }, { top: 10, left: 20 }, { top: 20, left: 0 }] },
  { remark: '顶部相差四像素视为同一行并按左边排序', args: [[{ top: 0, left: 20 }, { top: 4, left: 0 }]], expected: [{ top: 4, left: 0 }, { top: 0, left: 20 }] },
  { remark: '顶部相差五像素时按行排序', args: [[{ top: 5, left: 0 }, { top: 0, left: 20 }]], expected: [{ top: 0, left: 20 }, { top: 5, left: 0 }] },
  { remark: '排序不改变原数组顺序且保留矩形引用', test: function () {
    const a = { top: 10, left: 0 }, b = { top: 0, left: 0 };
    const input = [a, b];
    const actual = translate.visual.coordinateSort(input);
    return actual[0] === b && actual[1] === a && input[0] === a && input[1] === b;
  } }
]);
