'use strict';

require('../helpers/module')(__filename, [
  { remark: '省略 iframe 时直接返回 undefined', args: [], expected: undefined },
  { remark: 'null iframe 时直接返回 undefined', args: [null], expected: undefined },
  {
    remark: 'iframe 没有 contentWindow 时不发送消息',
    test: function () {
      let calls = 0;
      translate.postMessage.send = function () { calls++; };
      return translate.postMessage.ping({ contentWindow: null }) === undefined && calls === 0;
    }
  },
  {
    remark: '有效 iframe 发送 PING 到其 contentWindow 和对应 origin',
    test: function () {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      let received;
      translate.postMessage.send = function (target, type, payload, origin) { received = [target, type, payload, origin]; };
      const result = translate.postMessage.ping(iframe);
      return result === undefined && received[0] === iframe.contentWindow &&
        received[1] === translate.postMessage.TYPES.PING && Object.keys(received[2]).length === 0 &&
        received[3] === location.origin;
    }
  },
  {
    remark: '函数回调按引用保存以供 PONG 调用',
    test: function () {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      translate.postMessage.send = function () {};
      const callback = function () {};
      translate.postMessage.ping(iframe, callback);
      return translate.postMessage._pingCallback === callback;
    }
  },
  {
    remark: 'null 回调不会被保存为可调用处理器',
    test: function () {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      translate.postMessage.send = function () {};
      translate.postMessage._pingCallback = null;
      translate.postMessage.ping(iframe, null);
      return translate.postMessage._pingCallback === null;
    }
  },
  {
    remark: '后一次有效心跳回调替换先前回调',
    test: function () {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      translate.postMessage.send = function () {};
      const first = function () {};
      const second = function () {};
      translate.postMessage.ping(iframe, first);
      translate.postMessage.ping(iframe, second);
      return translate.postMessage._pingCallback === second;
    }
  }
]);
