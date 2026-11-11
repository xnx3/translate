'use strict';

require('../helpers/module')(__filename, [
  {
    remark: 'msg 已存在时不重复请求脚本',
    test: function () {
      window.msg = {};
      let requests = 0;
      // 请求计数只替代外部传输，验证被测入口的重复加载判断。
      translate.util.synchronizesLoadJs = function () { requests++; };
      return translate.util.loadMsgJs() === undefined && requests === 0;
    }
  },
  {
    remark: 'msg 不存在时加载约定的消息组件地址',
    test: function () {
      delete window.msg;
      const requests = [];
      translate.util.synchronizesLoadJs = function (url) { requests.push(url); return true; };
      translate.util.loadMsgJs();
      return requests.length === 1 && requests[0] === 'https://res.zvo.cn/msg/msg.js';
    }
  },
  {
    remark: '第一次加载产生 msg 后再次调用不重复加载',
    test: function () {
      delete window.msg;
      let requests = 0;
      translate.util.synchronizesLoadJs = function () { requests++; window.msg = {}; return true; };
      translate.util.loadMsgJs();
      translate.util.loadMsgJs();
      return requests === 1;
    }
  }
]);
