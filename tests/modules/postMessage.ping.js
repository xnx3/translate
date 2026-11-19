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
    remark: '函数回调接收对应 iframe 的 PONG',
    test: function () {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      let request, received;
      translate.postMessage.send = (_, type, payload) => { request = payload; };
      translate.postMessage.ping(iframe, reply => { received = reply; });
      const data = {...request, type: translate.postMessage.TYPES.PONG, version: 'test'};
      translate.postMessage.handleMessage({source: iframe.contentWindow, origin: location.origin, data});
      return received === data;
    }
  },
  {
    remark: 'null 回调不妨碍发送心跳及处理应答',
    test: function () {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      let request;
      translate.postMessage.send = (_, type, payload) => { request = {type, payload}; };
      translate.postMessage.ping(iframe, null);
      translate.postMessage.handleMessage({source: iframe.contentWindow, origin: location.origin,
        data: {...request.payload, type: translate.postMessage.TYPES.PONG}});
      return request.type === translate.postMessage.TYPES.PING;
    }
  },
  {
    remark: '同一 iframe 顺序完成的两个心跳互不干扰',
    test: function () {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      let request;
      const results = [];
      translate.postMessage.send = (_, type, payload) => { request = payload; };
      for (const version of ['one','two']) {
        translate.postMessage.ping(iframe, reply => results.push(reply.version));
        translate.postMessage.handleMessage({source: iframe.contentWindow, origin: location.origin,
          data: {...request, type: translate.postMessage.TYPES.PONG, version}});
      }
      return JSON.stringify(results) === '["one","two"]';
    }
  }
]);
