'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '没有子 iframe 时返回 undefined 且不发送消息',
    test: function () {
      let calls = 0;
      translate.postMessage.send = function () { calls++; };
      return translate.postMessage.notifyChildren('english') === undefined && calls === 0;
    }
  },
  {
    remark: '同源子窗口已有不同目标语种时直接切换',
    test: function () {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      let language;
      iframe.contentWindow.translate = {
        version: 'fixture', to: 'spanish', changeLanguage: function (value) { language = value; }
      };
      let sent = 0;
      translate.postMessage.send = function () { sent++; };
      translate.postMessage.notifyChildren('english');
      return language === 'english' && sent === 0;
    }
  },
  {
    remark: '同源子窗口目标语种已相同时不重复切换',
    test: function () {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      let calls = 0;
      iframe.contentWindow.translate = {
        version: 'fixture', to: 'english', changeLanguage: function () { calls++; }
      };
      translate.postMessage.notifyChildren('english');
      return calls === 0;
    }
  },
  {
    remark: '多个同源兄弟 iframe 分别收到切换，不遗漏后一个',
    test: function () {
      const received = [];
      for (let index = 0; index < 3; index++) {
        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.contentWindow.translate = {
          version: 'fixture', to: 'spanish',
          changeLanguage: function (value) { received.push([index, value]); }
        };
      }
      translate.postMessage.notifyChildren('english');
      return received.length === 3 && received[0][0] === 0 && received[1][0] === 1 &&
        received[2][0] === 2 && received.every(item => item[1] === 'english');
    }
  },
  {
    remark: '同源直接切换异常时回退发送带 parent 标记的消息',
    test: function () {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      iframe.contentWindow.translate = {
        version: 'fixture', to: 'spanish', changeLanguage: function () { throw new Error('switch failed'); }
      };
      let received;
      translate.postMessage.send = function (target, type, payload, origin) { received = [target, type, payload, origin]; };
      translate.postMessage.notifyChildren('english');
      return received[0] === iframe.contentWindow && received[1] === translate.postMessage.TYPES.CHANGE_LANGUAGE &&
        received[2].language === 'english' && received[2].fromParent === true &&
        received[2].source === 'parent' && received[3] === location.origin;
    }
  },
  {
    remark: '无法同源读取的子窗口走 postMessage 分支',
    test: function () {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      // 模拟浏览器跨域访问 document 被拒绝的边界，不依赖真实外部网站。
      Object.defineProperty(iframe, 'contentDocument', {
        configurable: true, get: function () { throw new DOMException('blocked', 'SecurityError'); }
      });
      let received;
      translate.postMessage.send = function (target, type, payload) { received = [target, type, payload]; };
      translate.postMessage.notifyChildren('spanish');
      return received[0] === iframe.contentWindow && received[1] === translate.postMessage.TYPES.CHANGE_LANGUAGE &&
        received[2].language === 'spanish' && received[2].fromParent === true;
    }
  },
  {
    remark: '同源兄弟中某个切换异常不妨碍后续兄弟切换',
    test: function () {
      const first = document.createElement('iframe');
      const second = document.createElement('iframe');
      document.body.append(first, second);
      first.contentWindow.translate = {
        version: 'fixture', to: 'spanish', changeLanguage: function () { throw new Error('first failed'); }
      };
      let language;
      second.contentWindow.translate = {
        version: 'fixture', to: 'spanish', changeLanguage: function (value) { language = value; }
      };
      translate.postMessage.send = function () {};
      translate.postMessage.notifyChildren('english');
      return language === 'english';
    }
  }
]);
