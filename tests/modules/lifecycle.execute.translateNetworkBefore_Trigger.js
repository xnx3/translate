'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '未注册网络请求前回调时正常返回',
    test: function () {
      translate.lifecycle.execute.translateNetworkBefore = [];
      return translate.lifecycle.execute.translateNetworkBefore_Trigger({ uuid: 'u', from: 'english', to: 'japanese', texts: [] }) === undefined;
    }
  },
  {
    remark: '新回调接收原始数据对象及文本节点数组引用',
    test: function () {
      const data = { uuid: '任务😀', from: 'chinese_simplified', to: 'english', texts: ['你好', '世界'], nodes: [document.body] };
      let received;
      translate.lifecycle.execute.translateNetworkBefore = [function (value) { received = value; }];
      translate.lifecycle.execute.translateNetworkBefore_Trigger(data);
      return received === data && received.texts === data.texts && received.nodes === data.nodes;
    }
  },
  {
    remark: '四形参的旧回调按 uuid 来源语种目标语种文本数组传参',
    test: function () {
      const texts = ['你好', '世界'];
      let received;
      translate.lifecycle.execute.translateNetworkBefore = [function (uuid, from, to, values) { received = Array.from(arguments); }];
      translate.lifecycle.execute.translateNetworkBefore_Trigger({ uuid: 'u', from: 'chinese_simplified', to: 'english', texts: texts });
      return received.length === 4 && received[0] === 'u' && received[1] === 'chinese_simplified' && received[2] === 'english' && received[3] === texts;
    }
  },
  {
    remark: '空文本数组和空字符串标识在旧协议中原样传递',
    test: function () {
      const texts = [];
      let received;
      translate.lifecycle.execute.translateNetworkBefore = [function (uuid, from, to, values) { received = Array.from(arguments); }];
      translate.lifecycle.execute.translateNetworkBefore_Trigger({ uuid: '', from: '', to: '', texts: texts });
      return received.length === 4 && received[0] === '' && received[1] === '' && received[2] === '' && received[3] === texts;
    }
  },
  {
    remark: '不同形参数量的回调保持新协议且按注册顺序执行',
    test: function () {
      const data = { texts: [] };
      const order = [];
      translate.lifecycle.execute.translateNetworkBefore = [function () { order.push(arguments[0] === data && arguments.length === 1 ? 1 : -1); }, function (value, unused) { order.push(value === data && arguments.length === 1 ? 2 : -1); }];
      translate.lifecycle.execute.translateNetworkBefore_Trigger(data);
      return JSON.stringify(order) === '[1,2]';
    }
  },
  {
    remark: '新旧回调抛错都被隔离且不会阻止后续回调',
    test: function () {
      const modern = new Error('新回调异常');
      const legacy = new Error('旧回调异常');
      const logs = [];
      let reached = false;
      translate.log = function (value) { logs.push(value); };
      translate.lifecycle.execute.translateNetworkBefore = [function (data) { throw modern; }, function (uuid, from, to, texts) { throw legacy; }, function () { reached = true; }];
      translate.lifecycle.execute.translateNetworkBefore_Trigger({ uuid: 'u', from: 'english', to: 'japanese', texts: [] });
      return reached && logs.length === 2 && logs[0] === modern && logs[1] === legacy;
    }
  }
]);
