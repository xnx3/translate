'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '未注册回调时正常结束并返回 undefined',
    test: function () {
      translate.lifecycle.execute.translateNetworkAfter = [];
      return translate.lifecycle.execute.translateNetworkAfter_Trigger({ to: "english" }) === undefined;
    }
  },
  {
    remark: '单个回调收到原始数据对象引用和其中的完整字段',
    test: function () {
      const data = { uuid: '任务-😀', from: 'chinese_simplified', to: 'english', result: 0, info: '请求失败', texts: ['你好', '世界'] };
      let received;
      translate.lifecycle.execute.translateNetworkAfter = [function (value) { received = value; }];
      translate.lifecycle.execute.translateNetworkAfter_Trigger(data);
      return received === data && received.texts === data.texts && received.result === 0 && received.info === '请求失败';
    }
  },
  {
    remark: '多个回调按注册顺序执行且共享同一数据对象',
    test: function () {
      const data = { to: 'japanese' };
      const order = [];
      translate.lifecycle.execute.translateNetworkAfter = [function (value) { value.mark = '第一个'; order.push(1); }, function (value) { order.push(value === data && value.mark === '第一个' ? 2 : -1); }];
      translate.lifecycle.execute.translateNetworkAfter_Trigger(data);
      return JSON.stringify(order) === '[1,2]';
    }
  },
  {
    remark: '回调抛错会记录异常且后续回调仍然执行',
    test: function () {
      const failure = new Error('有意验证回调隔离');
      const logged = [];
      let later = false;
      // 仅替换日志出口以核对异常；被测的分发和异常隔离逻辑保持真实。
      translate.log = function (error) { logged.push(error); };
      translate.lifecycle.execute.translateNetworkAfter = [function () { throw failure; }, function () { later = true; }];
      translate.lifecycle.execute.translateNetworkAfter_Trigger({ to: 'english' });
      return later && logged.length === 1 && logged[0] === failure;
    }
  },
  {
    remark: '空对象数据原样传递且回调返回 false 不阻断其他回调',
    test: function () {
      const data = {};
      let received;
      let count = 0;
      translate.lifecycle.execute.translateNetworkAfter = [function () { count++; return false; }, function (value) { count++; received = value; }];
      const result = translate.lifecycle.execute.translateNetworkAfter_Trigger(data);
      return result === undefined && count === 2 && received === data;
    }
  },
  ...[
    { label: '网络失败后同目标重试成功', firstResult: 0, secondResult: 1 },
    { label: '成功请求后另一语种请求失败', firstResult: 1, secondResult: 0 }
  ].map(input => ({
    remark: '参数组合：' + input.label + '分别交付对应请求的节点、原文及结果',
    input,
    test: function ({ firstResult, secondResult }) {
      const events = translate.lifecycle.execute;
      const one = document.createTextNode('one'), two = document.createTextNode('two');
      const first = { uuid: 'u', from: 'english', to: 'french', nodes: [one], texts: ['one'], result: firstResult, info: firstResult ? '' : 'offline' };
      const second = { uuid: 'v', from: firstResult ? 'deutsch' : 'english', to: 'french', nodes: [two], texts: ['two'], result: secondResult, info: secondResult ? '' : 'offline' };
      const received = [];
      events.translateNetworkAfter = [data => received.push(data)];
      events.translateNetworkAfter_Trigger(first); events.translateNetworkAfter_Trigger(second);
      return received.length === 2 && received[0] === first && received[1] === second &&
        received[0].nodes[0] === one && received[1].nodes[0] === two &&
        received[0].result === firstResult && received[1].result === secondResult;
    }
  }))
]);
