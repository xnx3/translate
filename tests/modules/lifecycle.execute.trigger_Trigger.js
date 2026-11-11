'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '未注册回调默认允许继续执行',
    test: function () {
      translate.lifecycle.execute.trigger = [];
      return translate.lifecycle.execute.trigger_Trigger({ to: 'english' }) === true;
    }
  },
  {
    remark: '回调收到原始数据及文档数组引用',
    test: function () {
      const data = { to: 'english', docs: [document.body], executeTriggerNumber: 1 };
      let received;
      translate.lifecycle.execute.trigger = [function (value) { received = value; }];
      return translate.lifecycle.execute.trigger_Trigger(data) === true && received === data && received.docs === data.docs;
    }
  },
  {
    remark: '明确返回 true 时允许执行',
    test: function () {
      translate.lifecycle.execute.trigger = [function () { return true; }];
      return translate.lifecycle.execute.trigger_Trigger({}) === true;
    }
  },
  {
    remark: '明确返回 false 时拒绝执行',
    test: function () {
      translate.lifecycle.execute.trigger = [function () { return false; }];
      return translate.lifecycle.execute.trigger_Trigger({}) === false;
    }
  },
  {
    remark: '拒绝执行后其他回调仍按顺序执行且后续 true 不能覆盖拒绝',
    test: function () {
      const order = [];
      translate.lifecycle.execute.trigger = [function () { order.push(1); return false; }, function () { order.push(2); return true; }, function () { order.push(3); }];
      return translate.lifecycle.execute.trigger_Trigger({}) === false && JSON.stringify(order) === '[1,2,3]';
    }
  },
  {
    remark: '返回数字零不会被误判为布尔拒绝',
    test: function () {
      translate.lifecycle.execute.trigger = [function () { return 0; }];
      return translate.lifecycle.execute.trigger_Trigger({}) === true;
    }
  },
  {
    remark: '返回空字符串按默认允许处理',
    test: function () {
      translate.lifecycle.execute.trigger = [function () { return ''; }];
      return translate.lifecycle.execute.trigger_Trigger({}) === true;
    }
  },
  {
    remark: '返回 null 按默认允许处理',
    test: function () {
      translate.lifecycle.execute.trigger = [function () { return null; }];
      return translate.lifecycle.execute.trigger_Trigger({}) === true;
    }
  },
  {
    remark: '返回 undefined 按默认允许处理',
    test: function () {
      translate.lifecycle.execute.trigger = [function () { return undefined; }];
      return translate.lifecycle.execute.trigger_Trigger({}) === true;
    }
  },
  {
    remark: '字符串 false 不是布尔 false 且不能阻止执行',
    test: function () {
      translate.lifecycle.execute.trigger = [function () { return 'false'; }];
      return translate.lifecycle.execute.trigger_Trigger({}) === true;
    }
  },
  {
    remark: '回调异常被记录后继续执行并保留其他回调的否决',
    test: function () {
      const error = new Error('回调异常');
      const logged = [];
      let reached = false;
      translate.log = function (value) { logged.push(value); };
      translate.lifecycle.execute.trigger = [function () { throw error; }, function () { return false; }, function () { reached = true; }];
      return translate.lifecycle.execute.trigger_Trigger({}) === false && reached && logged.length === 1 && logged[0] === error;
    }
  }
]);
