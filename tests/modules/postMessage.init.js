'use strict';

require('../helpers/module')(__filename, [
  {
    remark: 'reset 后初始化注册消息监听并标为已初始化',
    test: function () {
      translate.postMessage.reset();
      const result = translate.postMessage.init();
      return result === undefined && translate.postMessage.initialized === true &&
        typeof translate.postMessage._messageHandler === 'function';
    }
  },
  {
    remark: '重复初始化复用原处理函数，不重复注册事件',
    test: function () {
      translate.postMessage.reset();
      const original = window.addEventListener;
      let calls = 0;
      window.addEventListener = function (type, handler, options) {
        if (type === 'message') calls++;
        return original.call(this, type, handler, options);
      };
      translate.postMessage.init();
      const handler = translate.postMessage._messageHandler;
      translate.postMessage.init();
      return calls === 1 && translate.postMessage._messageHandler === handler;
    }
  },
  {
    remark: '注册的消息事件实际转交 handleMessage 处理',
    test: function () {
      translate.postMessage.reset();
      let received;
      translate.postMessage.handleMessage = function (event) { received = event; };
      translate.postMessage.init();
      const event = new MessageEvent('message', { data: 'probe', origin: location.origin });
      window.dispatchEvent(event);
      return received === event;
    }
  },
  {
    remark: '初始化、reset、重新初始化后事件只处理一次',
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
