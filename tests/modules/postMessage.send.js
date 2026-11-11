'use strict';

require('../helpers/module')(__filename, [
  { remark: '缺省目标窗口时返回 undefined', args: [], expected: undefined },
  { remark: 'null 目标窗口时返回 undefined', args: [null, 'probe', {}], expected: undefined },
  {
    remark: '发送的消息包含类型、当前版本和有限时间戳',
    test: function () {
      let received;
      const before = Date.now();
      const target = { postMessage: function (message, origin) { received = { message, origin }; } };
      const result = translate.postMessage.send(target, 'probe', {}, 'https://target.example');
      return result === undefined && received.message.type === 'probe' &&
        received.message.version === translate.version && Number.isFinite(received.message.timestamp) &&
        received.message.timestamp >= before && received.message.timestamp <= Date.now() &&
        received.origin === 'https://target.example';
    }
  },
  {
    remark: 'payload 自有属性包含 false、零和空字符串时原样合并',
    test: function () {
      let message;
      const target = { postMessage: function (value) { message = value; } };
      translate.postMessage.send(target, 'probe', { flag: false, count: 0, text: '' }, '*');
      return message.flag === false && message.count === 0 && message.text === '';
    }
  },
  {
    remark: 'payload 中 Unicode 和嵌套内容不改变',
    test: function () {
      let message;
      const payload = { language: '中文😀', nested: { text: ' A\n' } };
      const target = { postMessage: function (value) { message = value; } };
      translate.postMessage.send(target, 'probe', payload, '*');
      return message.language === '中文😀' && message.nested.text === ' A\n' &&
        payload.type === undefined && payload.timestamp === undefined;
    }
  },
  {
    remark: 'payload 的继承属性不进入消息',
    test: function () {
      let message;
      const payload = Object.create({ inherited: 'excluded' });
      payload.own = 'included';
      const target = { postMessage: function (value) { message = value; } };
      translate.postMessage.send(target, 'probe', payload, '*');
      return message.own === 'included' && !Object.prototype.hasOwnProperty.call(message, 'inherited');
    }
  },
  {
    remark: 'null payload 不影响基础消息发送',
    test: function () {
      let message;
      const target = { postMessage: function (value) { message = value; } };
      translate.postMessage.send(target, 'probe', null, '*');
      return message.type === 'probe' && message.version === translate.version;
    }
  },
  {
    remark: '省略 payload 和 targetOrigin 时仍发送基础消息到星号来源',
    test: function () {
      let received;
      const target = { postMessage: function (message, origin) { received = { message, origin }; } };
      translate.postMessage.send(target, 'probe');
      return received.message.type === 'probe' && received.origin === '*';
    }
  },
  {
    remark: '明确的目标 URL 被规范化为 origin',
    test: function () {
      let origin;
      const target = { postMessage: function (message, value) { origin = value; } };
      translate.postMessage.send(target, 'probe', {}, 'https://EXAMPLE.com:443/path');
      return origin === 'https://example.com';
    }
  },
  {
    remark: '不透明目标来源 null 转换为星号发送',
    test: function () {
      let origin;
      const target = { postMessage: function (message, value) { origin = value; } };
      translate.postMessage.send(target, 'probe', {}, 'null');
      return origin === '*';
    }
  },
  {
    remark: '没有明确目标时使用唯一允许来源',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://allowed.example'];
      let origin;
      const target = { postMessage: function (message, value) { origin = value; } };
      translate.postMessage.send(target, 'probe', {});
      return origin === 'https://allowed.example';
    }
  },
  {
    remark: '目标 postMessage 抛错时不向调用者传播异常',
    test: function () {
      let calls = 0;
      const target = { postMessage: function () { calls++; throw new Error('window closed'); } };
      return translate.postMessage.send(target, 'probe', {}, '*') === undefined && calls === 1;
    }
  }
]);
