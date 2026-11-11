'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '无参数获取当前页面的实际 origin',
    test: function () {
      return translate.postMessage.getCurrentOrigin() === location.origin;
    }
  },
  {
    remark: '当前页面路径、查询和片段不会进入 origin',
    test: function () {
      history.replaceState(null, '', '/nested/page?x=1#part');
      return translate.postMessage.getCurrentOrigin() === location.protocol + '//' + location.host;
    }
  },
  {
    remark: '无参数方法不因多余参数改变当前来源',
    test: function () {
      return translate.postMessage.getCurrentOrigin('https://other.example') === location.origin;
    }
  }
]);
