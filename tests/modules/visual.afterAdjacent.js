require('../helpers/module')(__filename, [
  { remark: '空数组无相邻矩形对', args: [[]], expected: [] },
  { remark: '只有一个矩形时无相邻矩形对', args: [[{ left: 0, right: 10, top: 0, bottom: 10 }]], expected: [] },
  { remark: '先排序再发现同一行中相接的矩形对', test: function () {
    const a = { left: 0, right: 10, top: 0, bottom: 10 }, b = { left: 10, right: 20, top: 0, bottom: 10 };
    const result = translate.visual.afterAdjacent([b, a]);
    return result.length === 1 && result[0].before === a && result[0].after === b;
  } },
  { remark: '同一行三个连续矩形产生两个相邻对', test: function () {
    const a = { left: 0, right: 10, top: 0, bottom: 10 }, b = { left: 10, right: 20, top: 0, bottom: 10 }, c = { left: 20, right: 30, top: 0, bottom: 10 };
    const result = translate.visual.afterAdjacent([a, b, c]);
    return result.length === 2 && result[0].before === a && result[0].after === b && result[1].before === b && result[1].after === c;
  } },
  { remark: '水平距离大于容差时不产生相邻对', args: [[{ left: 0, right: 10, top: 0, bottom: 10 }, { left: 12, right: 20, top: 0, bottom: 10 }]], expected: [] },
  { remark: '不同行的相接水平坐标不会产生相邻对', args: [[{ left: 0, right: 10, top: 0, bottom: 10 }, { left: 10, right: 20, top: 20, bottom: 30 }]], expected: [] },
  { remark: '多行分别发现相邻对且保留原节点信息', test: function () {
    const a = { left: 0, right: 10, top: 0, bottom: 10 }, b = { left: 10, right: 20, top: 0, bottom: 10 }, c = { left: 0, right: 10, top: 20, bottom: 30 }, d = { left: 10, right: 20, top: 20, bottom: 30 };
    const result = translate.visual.afterAdjacent([d, c, b, a]);
    return result.length === 2 && result[0].before === a && result[0].after === b && result[1].before === c && result[1].after === d;
  } }
]);
