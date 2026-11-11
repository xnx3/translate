'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '定位元素返回完整的文档坐标和宽高',
    test: function () {
      const node = document.createElement('div');
      node.style.cssText = 'position:absolute;left:20px;top:30px;width:100px;height:40px';
      document.body.appendChild(node);
      const result = translate.util.getElementPosition(node);
      return result.startX === 20 && result.startY === 30 && result.endX === 120 && result.endY === 70 &&
        result.width === 100 && result.height === 40;
    }
  },
  {
    remark: '零宽高元素保留坐标且宽高为零',
    test: function () {
      const node = document.createElement('div');
      node.style.cssText = 'position:absolute;left:5px;top:7px;width:0;height:0';
      document.body.appendChild(node);
      const result = translate.util.getElementPosition(node);
      return result.startX === 5 && result.startY === 7 && result.endX === 5 && result.endY === 7 &&
        result.width === 0 && result.height === 0;
    }
  },
  {
    remark: '边框计入元素实际显示宽高',
    test: function () {
      const node = document.createElement('div');
      node.style.cssText = 'position:absolute;left:10px;top:15px;width:20px;height:30px;border:2px solid black;box-sizing:content-box';
      document.body.appendChild(node);
      const result = translate.util.getElementPosition(node);
      return result.startX === 10 && result.startY === 15 && result.width === 24 && result.height === 34 &&
        result.endX === 34 && result.endY === 49;
    }
  },
  {
    remark: '隐藏元素的边界矩形宽高为零',
    test: function () {
      const node = document.createElement('div');
      node.style.cssText = 'display:none;width:100px;height:40px';
      document.body.appendChild(node);
      const result = translate.util.getElementPosition(node);
      return result.width === 0 && result.height === 0;
    }
  },
  {
    remark: '页面滚动后仍返回文档绝对坐标',
    test: function () {
      document.body.style.minHeight = '3000px';
      const node = document.createElement('div');
      node.style.cssText = 'position:absolute;left:20px;top:1500px;width:10px;height:15px';
      document.body.appendChild(node);
      window.scrollTo(0, 1000);
      const result = translate.util.getElementPosition(node);
      return result.startX === 20 && result.startY === 1500 && result.endY === 1515 && result.height === 15;
    }
  }
]);
