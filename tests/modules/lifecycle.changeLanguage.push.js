'use strict';

require('../helpers/module')(__filename, [
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
  }
  // 注册后触发是否只执行一次需要核对：源码注释写只加入旧版列表，当前实现同时加入新旧列表。
]);
