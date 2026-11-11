'use strict';

require('../helpers/module')(__filename, [
  {
    remark: 'reset 清空处理函数和初始化标记，返回 undefined',
    test: function () {
      translate.postMessage.init();
      const result = translate.postMessage.reset();
      return result === undefined && translate.postMessage.initialized === false &&
        translate.postMessage._messageHandler === null;
    }
  },
  {
    remark: '重复 reset 保持未初始化状态且不抛异常',
    test: function () {
      translate.postMessage.reset();
      translate.postMessage.reset();
      return translate.postMessage.initialized === false && translate.postMessage._messageHandler === null;
    }
  },
  {
    remark: '移除监听时使用初始化注册的同一个处理函数',
    test: function () {
      translate.postMessage.reset();
      translate.postMessage.init();
      const handler = translate.postMessage._messageHandler;
      const original = window.removeEventListener;
      let removed = false;
      window.removeEventListener = function (type, fn, options) {
        if (type === 'message' && fn === handler && options === false) removed = true;
        return original.call(this, type, fn, options);
      };
      translate.postMessage.reset();
      return removed;
    }
  },
  {
    remark: 'reset 后派发消息不再转交已移除的处理器',
    test: function () {
      translate.postMessage.reset();
      let count = 0;
      translate.postMessage.handleMessage = function () { count++; };
      translate.postMessage.init();
      translate.postMessage.reset();
      window.dispatchEvent(new MessageEvent('message', { origin: location.origin }));
      return count === 0;
    }
  },
  {
    remark: 'reset 后允许重新 init 并恢复事件处理',
    test: function () {
      translate.postMessage.reset();
      let count = 0;
      translate.postMessage.handleMessage = function () { count++; };
      translate.postMessage.init();
      translate.postMessage.reset();
      translate.postMessage.init();
      window.dispatchEvent(new MessageEvent('message', { origin: location.origin }));
      return count === 1;
    }
  }
]);
