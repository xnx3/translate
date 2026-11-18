'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '初始化创建的处理函数将完整事件交给当前的 handleMessage，保留模块接收者',
    test: function () {
      const messaging = translate.postMessage;
      messaging.reset();
      messaging.init();
      const handler = messaging._messageHandler;
      const event = new MessageEvent('message', { origin: location.origin, data: { type: 'probe' } });
      let forwarded;
      messaging.handleMessage = function (...args) { forwarded = { owner: this, args }; };
      handler.call(window, event);
      return forwarded.owner === messaging && forwarded.args.length === 1 && forwarded.args[0] === event;
    }
  },
  {
    remark: '真实消息只在监听有效期间转交一次，reset 后的重新初始化接收后续消息',
    test: function () {
      const messaging = translate.postMessage;
      const seen = [];
      messaging.handleMessage = event => seen.push(event.data);
      messaging.reset();
      messaging.init();
      messaging.init();
      window.dispatchEvent(new MessageEvent('message', { data: 1 }));
      messaging.reset();
      window.dispatchEvent(new MessageEvent('message', { data: 2 }));
      messaging.init();
      window.dispatchEvent(new MessageEvent('message', { data: 3 }));
      return seen.length === 2 && seen[0] === 1 && seen[1] === 3;
    }
  }
]);
