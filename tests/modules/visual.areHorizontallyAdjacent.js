require('../helpers/module')(__filename, [
  { remark: '水平边界相接且垂直重叠时判定相邻', args: [{ top: 0, bottom: 10, right: 10 }, { top: 0, bottom: 10, left: 10 }], expected: true },
  { remark: '水平正间隙小于一像素时仍相邻', args: [{ top: 0, bottom: 10, right: 10 }, { top: 2, bottom: 8, left: 10.5 }], expected: true },
  { remark: '水平方向轻微重叠小于一像素时仍相邻', args: [{ top: 0, bottom: 10, right: 10 }, { top: 0, bottom: 10, left: 9.5 }], expected: true },
  { remark: '水平间隙恰好一像素不相邻', args: [{ top: 0, bottom: 10, right: 10 }, { top: 0, bottom: 10, left: 11 }], expected: false },
  { remark: '水平重叠恰好一像素不相邻', args: [{ top: 0, bottom: 10, right: 10 }, { top: 0, bottom: 10, left: 9 }], expected: false },
  { remark: '垂直方向仅边界接触时不相邻', args: [{ top: 0, bottom: 10, right: 10 }, { top: 10, bottom: 20, left: 10 }], expected: false },
  { remark: '水平相接但垂直分离时不相邻', args: [{ top: 0, bottom: 10, right: 10 }, { top: 12, bottom: 20, left: 10 }], expected: false },
  { remark: '负坐标矩形同样按实际间隙判断', args: [{ top: -10, bottom: -1, right: -5 }, { top: -8, bottom: 0, left: -5 }], expected: true },
  {
    remark: '参数组合：跨原点仅有四分之一像素垂直交叠时仍可水平贴边',
    test: function () {
      const before = {right: -0.5, top: -3, bottom: 0};
      const after = {left: 0, top: -0.25, bottom: 4};
      const noHeight = {...after, bottom: after.top};
      return translate.visual.areHorizontallyAdjacent(before, after) === true &&
        translate.visual.areHorizontallyAdjacent(before, noHeight) === false;
    }
  }
]);
