'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '[A29] 保留旧四参数入口的源语种目标语种和文本列表',
    test: function () {
      let received;
      translate.lifecycle.execute.translateNetworkBefore.push(data => { received = data; });
      translate.lifecycle.execute.translateNetworkBefore_Trigger('batch', 'italian', 'english', ['Ciao']);
      return received.uuid === 'batch' && received.from === 'italian' && received.to === 'english' &&
        JSON.stringify(received.texts) === '["Ciao"]';
    }
  },
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
  },
  ...[
    { label: '对象入口、首次批次含多项原文', legacyEntry: false, from: 'english', to: 'french', texts: ['one', 'two'] },
    { label: '旧四参数入口、空文本数组', legacyEntry: true, from: 'english', to: 'french', texts: [] },
    { label: '旧四参数入口、连续重复原文保留下标', legacyEntry: true, from: 'french', to: 'english', texts: ['un', 'un'] }
  ].map(input => ({
    remark: '参数组合：' + input.label + '时两种回调形式收到同一份有效载荷',
    input,
    test: function ({ legacyEntry, from, to, texts }) {
      const events = translate.lifecycle.execute;
      const data = { uuid: 'batch', from, to, texts };
      const received = [];
      events.translateNetworkBefore = [
        function (uuid, source, target, words) { received.push({ uuid, from: source, to: target, texts: words }); },
        function (event) { received.push(event); }
      ];
      if (legacyEntry) events.translateNetworkBefore_Trigger(data.uuid, from, to, texts);
      else events.translateNetworkBefore_Trigger(data);
      return received.length === 2 && received.every(event =>
        event.uuid === data.uuid && event.from === from && event.to === to && event.texts === texts) &&
        (legacyEntry || received[1] === data);
    }
  }))
]);
