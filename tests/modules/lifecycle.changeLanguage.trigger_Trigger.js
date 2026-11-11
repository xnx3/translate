'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '新旧回调均为空时正常返回',
    test: function () {
      translate.lifecycle.changeLanguage.trigger = [];
      translate.lifecycle.changeLanguage.old_trigger_array = [];
      return translate.lifecycle.changeLanguage.trigger_Trigger({ to: 'english' }) === undefined;
    }
  },
  {
    remark: '新回调收到数据对象原引用和全部字段',
    test: function () {
      const data = { to: 'english', extra: '中文😀' };
      let received;
      translate.lifecycle.changeLanguage.trigger = [function (value) { received = value; }];
      translate.lifecycle.changeLanguage.old_trigger_array = [];
      translate.lifecycle.changeLanguage.trigger_Trigger(data);
      return received === data && received.extra === '中文😀';
    }
  },
  {
    remark: '旧版回调只收到目标语种字符串',
    test: function () {
      let received;
      translate.lifecycle.changeLanguage.trigger = [];
      translate.lifecycle.changeLanguage.old_trigger_array = [function () { received = Array.from(arguments); }];
      translate.lifecycle.changeLanguage.trigger_Trigger({ to: 'japanese' });
      return received.length === 1 && received[0] === 'japanese';
    }
  },
  {
    remark: '多个新回调先执行再按顺序执行多个旧回调',
    test: function () {
      const order = [];
      translate.lifecycle.changeLanguage.trigger = [function () { order.push('新一'); }, function () { order.push('新二'); }];
      translate.lifecycle.changeLanguage.old_trigger_array = [function () { order.push('旧一'); }, function () { order.push('旧二'); }];
      translate.lifecycle.changeLanguage.trigger_Trigger({ to: 'english' });
      return JSON.stringify(order) === JSON.stringify(['新一', '新二', '旧一', '旧二']);
    }
  },
  {
    remark: '新旧回调分别抛错仍继续后续回调并记录异常',
    test: function () {
      const first = new Error('新回调异常');
      const second = new Error('旧回调异常');
      const logged = [];
      const order = [];
      translate.log = function (value) { logged.push(value); };
      translate.lifecycle.changeLanguage.trigger = [function () { throw first; }, function () { order.push('新'); }];
      translate.lifecycle.changeLanguage.old_trigger_array = [function () { throw second; }, function () { order.push('旧'); }];
      translate.lifecycle.changeLanguage.trigger_Trigger({ to: 'english' });
      return logged.length === 2 && logged[0] === first && logged[1] === second && JSON.stringify(order) === JSON.stringify(['新', '旧']);
    }
  },
  {
    remark: '空目标语种原样传递给新旧回调',
    test: function () {
      const data = { to: '' };
      let modern;
      let legacy;
      translate.lifecycle.changeLanguage.trigger = [function (value) { modern = value; }];
      translate.lifecycle.changeLanguage.old_trigger_array = [function (value) { legacy = value; }];
      translate.lifecycle.changeLanguage.trigger_Trigger(data);
      return modern === data && legacy === '';
    }
  },
  {
    remark: '通知回调返回 false 也不阻止其他通知回调',
    test: function () {
      let count = 0;
      translate.lifecycle.changeLanguage.trigger = [function () { count++; return false; }, function () { count++; }];
      translate.lifecycle.changeLanguage.old_trigger_array = [function () { count++; }];
      translate.lifecycle.changeLanguage.trigger_Trigger({ to: 'english' });
      return count === 3;
    }
  }
]);
