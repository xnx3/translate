'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '消息 data 为 null 时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.send = function () { calls++; };
      translate.postMessage.handleMessage({ source: null, origin: location.origin, data: null });
      return calls === 0;
    }
  },
  {
    remark: '消息 data 为 undefined 时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.send = function () { calls++; };
      translate.postMessage.handleMessage({ source: null, origin: location.origin, data: undefined });
      return calls === 0;
    }
  },
  {
    remark: '消息 data 为字符串时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.send = function () { calls++; };
      translate.postMessage.handleMessage({ source: null, origin: location.origin, data: 'not-object' });
      return calls === 0;
    }
  },
  {
    remark: '消息 data 为数值时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.send = function () { calls++; };
      translate.postMessage.handleMessage({ source: null, origin: location.origin, data: 1 });
      return calls === 0;
    }
  },
  {
    remark: '消息 data 为布尔值时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.send = function () { calls++; };
      translate.postMessage.handleMessage({ source: null, origin: location.origin, data: false });
      return calls === 0;
    }
  },
  {
    remark: '消息没有 type 时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.send = function () { calls++; };
      translate.postMessage.handleMessage({ source: null, origin: location.origin, data: {} });
      return calls === 0;
    }
  },
  {
    remark: '消息 type 不是字符串时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.send = function () { calls++; };
      translate.postMessage.handleMessage({ source: null, origin: location.origin, data: { type: 1 } });
      return calls === 0;
    }
  },
  {
    remark: '未知消息类型被忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.send = function () { calls++; };
      translate.postMessage.handleMessage({ source: null, origin: location.origin, data: { type: 'unknown', language: 'english' } });
      return calls === 0;
    }
  },
  {
    remark: '切换语种为空字符串时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.handleMessage({
        source: null, origin: location.origin,
        data: { type: translate.postMessage.TYPES.CHANGE_LANGUAGE, language: '' }
      });
      return calls === 0;
    }
  },
  {
    remark: '切换语种只含空白时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.handleMessage({
        source: null, origin: location.origin,
        data: { type: translate.postMessage.TYPES.CHANGE_LANGUAGE, language: ' \t\n ' }
      });
      return calls === 0;
    }
  },
  {
    remark: '切换语种为 null 时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.handleMessage({
        source: null, origin: location.origin,
        data: { type: translate.postMessage.TYPES.CHANGE_LANGUAGE, language: null }
      });
      return calls === 0;
    }
  },
  {
    remark: '切换语种为数值时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.handleMessage({
        source: null, origin: location.origin,
        data: { type: translate.postMessage.TYPES.CHANGE_LANGUAGE, language: 123 }
      });
      return calls === 0;
    }
  },
  {
    remark: '切换语种为 undefined 时忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.handleMessage({
        source: null, origin: location.origin,
        data: { type: translate.postMessage.TYPES.CHANGE_LANGUAGE, language: undefined }
      });
      return calls === 0;
    }
  },
  {
    remark: '自身窗口发送的有效语言消息也应忽略',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.handleMessage({
        source: window, origin: location.origin,
        data: { type: translate.postMessage.TYPES.CHANGE_LANGUAGE, language: 'english' }
      });
      return calls === 0;
    }
  },
  {
    remark: '非允许来源的语言切换消息不能转交',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://allowed.example'];
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.handleMessage({
        source: null, origin: 'https://denied.example',
        data: { type: translate.postMessage.TYPES.CHANGE_LANGUAGE, language: 'english' }
      });
      return calls === 0;
    }
  },
  {
    remark: '有效语言消息保持 fromParent true',
    test: function () {
      let received;
      translate.postMessage.onReceiveChangeLanguage = function (language, fromParent) { received = [language, fromParent]; };
      translate.postMessage.handleMessage({
        source: null, origin: location.origin,
        data: { type: translate.postMessage.TYPES.CHANGE_LANGUAGE, language: 'english', fromParent: true }
      });
      return received[0] === 'english' && received[1] === true;
    }
  },
  {
    remark: '有效语言消息保持 fromParent false',
    test: function () {
      let received;
      translate.postMessage.onReceiveChangeLanguage = function (language, fromParent) { received = [language, fromParent]; };
      translate.postMessage.handleMessage({
        source: null, origin: location.origin,
        data: { type: translate.postMessage.TYPES.CHANGE_LANGUAGE, language: 'english', fromParent: false }
      });
      return received[0] === 'english' && received[1] === false;
    }
  },
  {
    remark: '有效语言消息省略 fromParent 时保持 undefined',
    test: function () {
      let received;
      translate.postMessage.onReceiveChangeLanguage = function (language, fromParent) { received = [language, fromParent]; };
      translate.postMessage.handleMessage({
        source: null, origin: location.origin,
        data: { type: translate.postMessage.TYPES.CHANGE_LANGUAGE, language: 'english', fromParent: undefined }
      });
      return received[0] === 'english' && received[1] === undefined;
    }
  },
  {
    remark: 'PING 回复到事件来源窗口并带当前版本和语种',
    test: function () {
      const source = {};
      translate.to = 'english';
      let received;
      translate.postMessage.send = function (target, type, payload, origin) { received = [target, type, payload, origin]; };
      translate.postMessage.handleMessage({ source, origin: location.origin, data: { type: translate.postMessage.TYPES.PING } });
      return received[0] === source && received[1] === translate.postMessage.TYPES.PONG &&
        received[2].version === translate.version && received[2].language === 'english' && received[3] === location.origin;
    }
  },
  {
    remark: 'PING 没有来源窗口时不尝试发送回复',
    test: function () {
      let calls = 0;
      translate.postMessage.send = function () { calls++; };
      translate.postMessage.handleMessage({ source: null, origin: location.origin, data: { type: translate.postMessage.TYPES.PING } });
      return calls === 0;
    }
  },
  {
    remark: 'PONG 只调用心跳回调一次并先清空回调引用',
    test: function () {
      let count = 0;
      let received;
      let cleared;
      translate.postMessage._pingCallback = function (data) {
        count++; received = data; cleared = translate.postMessage._pingCallback === null;
      };
      const data = { type: translate.postMessage.TYPES.PONG, language: 'english', version: 'test' };
      const event = { source: null, origin: location.origin, data };
      translate.postMessage.handleMessage(event);
      translate.postMessage.handleMessage(event);
      return count === 1 && received === data && cleared === true;
    }
  },
  {
    remark: 'PONG 没有回调时保持无异常且不触发切换',
    test: function () {
      translate.postMessage._pingCallback = null;
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      const result = translate.postMessage.handleMessage({ source: null, origin: location.origin, data: { type: translate.postMessage.TYPES.PONG } });
      return result === undefined && calls === 0;
    }
  },
  {
    remark: 'LANGUAGE_CHANGED 确认消息不会再次触发语言切换',
    test: function () {
      let calls = 0;
      translate.postMessage.onReceiveChangeLanguage = function () { calls++; };
      translate.postMessage.handleMessage({
        source: null, origin: location.origin,
        data: { type: translate.postMessage.TYPES.LANGUAGE_CHANGED, language: 'english' }
      });
      return calls === 0;
    }
  },
  {
    remark: '心跳回调抛异常时被消息处理器捕获且不保留回调',
    test: function () {
      translate.postMessage._pingCallback = function () { throw new Error('callback failure'); };
      const result = translate.postMessage.handleMessage({ source: null, origin: location.origin, data: { type: translate.postMessage.TYPES.PONG } });
      return result === undefined && translate.postMessage._pingCallback === null;
    }
  }
]);
