'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '[A28] 旧入口注册的函数一次只收到一个目标语种字符串',
    test: function () {
      const received = [];
      translate.lifecycle.changeLanguage.push(to => received.push(to));
      translate.lifecycle.changeLanguage.trigger_Trigger({to: 'english'});
      return JSON.stringify(received) === '["english"]';
    }
  },
  {
    remark: '旧版注册入口保留回调引用且注册时不会立即执行',
    test: function () {
      let count = 0;
      const callback = function () { count++; };
      translate.lifecycle.changeLanguage.trigger = [];
      translate.lifecycle.changeLanguage.old_trigger_array = [];
      const result = translate.lifecycle.changeLanguage.push(callback);
      return result === undefined && count === 0 && translate.lifecycle.changeLanguage.old_trigger_array.length === 1 && translate.lifecycle.changeLanguage.old_trigger_array[0] === callback;
    }
  },
  {
    remark: '多次注册按顺序追加到旧版回调列表',
    test: function () {
      const first = function () {};
      const second = function () {};
      const legacy = [first];
      translate.lifecycle.changeLanguage.trigger = [];
      translate.lifecycle.changeLanguage.old_trigger_array = legacy;
      translate.lifecycle.changeLanguage.push(second);
      return translate.lifecycle.changeLanguage.old_trigger_array === legacy && legacy.length === 2 && legacy[0] === first && legacy[1] === second;
    }
  },
  {
    remark: '旧版注册入口给出可继续使用的过时提示',
    test: function () {
      const logs = [];
      translate.log = function (value) { logs.push(value); };
      translate.lifecycle.changeLanguage.trigger = [];
      translate.lifecycle.changeLanguage.old_trigger_array = [];
      translate.lifecycle.changeLanguage.push(function () {});
      return logs.length === 1 && typeof logs[0] === 'string' && logs[0].includes('已过时') && logs[0].includes('依旧生效');
    }
  },
  // 注册后触发是否只执行一次需要核对：源码注释写只加入旧版列表，当前实现同时加入新旧列表。
  ...[
    { label: '先注册旧签名、后注册对象签名', legacyFirst: true },
    { label: '先注册对象签名、后注册旧签名', legacyFirst: false }
  ].map(input => ({
    remark: '参数组合：' + input.label + '时每次切换均按各自约定只通知一次',
    input,
    test: function ({ legacyFirst }) {
      const events = translate.lifecycle.changeLanguage;
      events.trigger = []; events.old_trigger_array = [];
      const oldTargets = [], newEvents = [];
      const registerOld = () => events.push(value => oldTargets.push(value));
      const registerNew = () => events.trigger.push(data => newEvents.push(data));
      if (legacyFirst) { registerOld(); registerNew(); } else { registerNew(); registerOld(); }
      const first = { to: 'french' }, second = { to: 'english' };
      events.trigger_Trigger(first); events.trigger_Trigger(second);
      return oldTargets.length === 2 && oldTargets[0] === 'french' && oldTargets[1] === 'english' &&
        newEvents.length === 2 && newEvents[0] === first && newEvents[1] === second;
    }
  }))
]);
