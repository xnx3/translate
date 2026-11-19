'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '没有执行开始回调时直接返回',
    test: function () {
      translate.lifecycle.execute.start = [];
      return translate.lifecycle.execute.start_Trigger({ uuid: '任务', to: 'english' }) === undefined;
    }
  },
  {
    remark: '单形参的新回调接收完整原始数据对象',
    test: function () {
      const data = { uuid: '任务😀', to: 'english', docs: [document.body] };
      let received;
      translate.lifecycle.execute.start = [function (value) { received = value; }];
      translate.lifecycle.execute.start_Trigger(data);
      return received === data && received.docs === data.docs;
    }
  },
  {
    remark: '两个形参的旧回调接收 uuid 和目标语种',
    test: function () {
      let received;
      translate.lifecycle.execute.start = [function (uuid, to) { received = Array.from(arguments); }];
      translate.lifecycle.execute.start_Trigger({ uuid: '任务😀', to: 'japanese' });
      return JSON.stringify(received) === JSON.stringify(['任务😀', 'japanese']);
    }
  },
  {
    remark: '无形参回调仍接收一个数据对象实参',
    test: function () {
      const data = { uuid: '', to: '' };
      let received;
      translate.lifecycle.execute.start = [function () { received = Array.from(arguments); }];
      translate.lifecycle.execute.start_Trigger(data);
      return received.length === 1 && received[0] === data;
    }
  },
  {
    remark: '新旧回调混用时参数协议各自正确且保留注册顺序',
    test: function () {
      const data = { uuid: 'u', to: 'english' };
      const order = [];
      translate.lifecycle.execute.start = [function (value) { order.push(value === data ? 1 : -1); }, function (uuid, to) { order.push(uuid === 'u' && to === 'english' ? 2 : -1); }, function (value) { order.push(value === data ? 3 : -1); }];
      translate.lifecycle.execute.start_Trigger(data);
      return JSON.stringify(order) === '[1,2,3]';
    }
  },
  {
    remark: '新旧协议回调分别抛错仍能继续后续回调',
    test: function () {
      const modern = new Error('新回调错误');
      const legacy = new Error('旧回调错误');
      const logged = [];
      let reached = false;
      translate.log = function (value) { logged.push(value); };
      translate.lifecycle.execute.start = [function (data) { throw modern; }, function (uuid, to) { throw legacy; }, function () { reached = true; }];
      translate.lifecycle.execute.start_Trigger({ uuid: '', to: '' });
      return reached && logged.length === 2 && logged[0] === modern && logged[1] === legacy;
    }
  },
  ...[
    { label: '旧回调在前', legacyFirst: true, to: 'english' },
    { label: '新回调在前，目标为空', legacyFirst: false, to: '' }
  ].map(input => ({
    remark: '参数组合：' + input.label + '，两次执行独立保留本轮标识及对象身份',
    input,
    test: function ({ legacyFirst, to }) {
      const events = translate.lifecycle.execute;
      const modern = [], legacy = [], order = [];
      function objectHook(data) { modern.push(data); order.push('new'); }
      function pairHook(uuid, target) { legacy.push([uuid, target]); order.push('old'); }
      events.start = legacyFirst ? [pairHook, objectHook] : [objectHook, pairHook];
      const first = { uuid: 'first', to }, second = { uuid: 'second', to: 'french' };
      events.start_Trigger(first); events.start_Trigger(second);
      const expectedOrder = legacyFirst ? 'old,new,old,new' : 'new,old,new,old';
      return order.join(',') === expectedOrder && modern[0] === first && modern[1] === second &&
        legacy[0][0] === 'first' && legacy[0][1] === to && legacy[1][0] === 'second' && legacy[1][1] === 'french';
    }
  }))
]);
