require('../helpers/module')(__filename, [
  { remark: '空数组得到空保留集合和空移除集合', args: [[]], expected: { rects: [], removes: [] } },
  { remark: '非数组输入被忽略', args: [null], expected: { rects: [], removes: [] } },
  { remark: '单个矩形被保留', args: [[{ left: 0, top: 0, right: 10, bottom: 10 }]], expected: { rects: [{ left: 0, top: 0, right: 10, bottom: 10 }], removes: [] } },
  { remark: '完全分离的矩形全部保留', test: function () {
    const a = { left: 0, top: 0, right: 10, bottom: 10 }, b = { left: 20, top: 0, right: 30, bottom: 10 };
    const actual = translate.visual.rectsSpaceEliminateOverlap([a, b]);
    return actual.rects.length === 2 && actual.rects[0] === a && actual.rects[1] === b && actual.removes.length === 0;
  } },
  { remark: '水平边界仅接触时不删除任何矩形', test: function () {
    const a = { left: 0, top: 0, right: 10, bottom: 10 }, b = { left: 10, top: 0, right: 20, bottom: 10 };
    const actual = translate.visual.rectsSpaceEliminateOverlap([a, b]);
    return actual.rects.length === 2 && actual.removes.length === 0;
  } },
  { remark: '水平方向只交叉两像素时不删除', test: function () {
    const actual = translate.visual.rectsSpaceEliminateOverlap([{ left: 0, top: 0, right: 10, bottom: 10 }, { left: 8, top: 0, right: 18, bottom: 10 }]);
    return actual.rects.length === 2 && actual.removes.length === 0;
  } },
  { remark: '垂直方向只交叉两像素时不删除', test: function () {
    const actual = translate.visual.rectsSpaceEliminateOverlap([{ left: 0, top: 0, right: 10, bottom: 10 }, { left: 0, top: 8, right: 10, bottom: 18 }]);
    return actual.rects.length === 2 && actual.removes.length === 0;
  } },
  { remark: '完全包含时只保留面积较大的矩形', test: function () {
    const small = { left: 3, top: 3, right: 7, bottom: 7 }, big = { left: 0, top: 0, right: 10, bottom: 10 };
    const actual = translate.visual.rectsSpaceEliminateOverlap([small, big]);
    return actual.rects.length === 1 && actual.rects[0] === big && actual.removes.length === 1 && actual.removes[0] === small;
  } },
  { remark: '普通交叉时保留面积较大的矩形', test: function () {
    const small = { left: 7, top: 3, right: 12, bottom: 8 }, big = { left: 0, top: 0, right: 10, bottom: 10 };
    const actual = translate.visual.rectsSpaceEliminateOverlap([small, big]);
    return actual.rects.length === 1 && actual.rects[0] === big && actual.removes[0] === small;
  } },
  { remark: '面积相等的交叉矩形保留排序在前的一项', test: function () {
    const a = { left: 0, top: 0, right: 10, bottom: 10 }, b = { left: 7, top: 0, right: 17, bottom: 10 };
    const input = [b, a];
    const actual = translate.visual.rectsSpaceEliminateOverlap(input);
    return actual.rects.length === 1 && actual.rects[0] === a && actual.removes[0] === b && input[0] === b && input.length === 2;
  } },
  { remark: '多个独立区域的结果保持输入顺序及对象身份', test: function () {
    const a = { left: 30, top: 0, right: 40, bottom: 10 }, b = { left: 0, top: 0, right: 10, bottom: 10 }, c = { left: 3, top: 3, right: 7, bottom: 7 };
    const actual = translate.visual.rectsSpaceEliminateOverlap([a, b, c]);
    return actual.rects.length === 2 && actual.rects[0] === a && actual.rects[1] === b && actual.removes[0] === c;
  } }
]);
