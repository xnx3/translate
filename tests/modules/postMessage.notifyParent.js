'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '顶层窗口不向自身发送语言通知',
    test: function () {
      let calls = 0;
      translate.postMessage.send = function () { calls++; };
      const result = translate.postMessage.notifyParent('english');
      return result === undefined && calls === 0;
    }
  },
  {
    remark: '子窗口发送语种和 child 标记到真实父窗口',
    test: async function () {
      const source = Array.from(document.scripts).find(script => /\/translate(?:\.min)?\.js$/.test(script.src));
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      // 子窗口加载当前测试实际选择的整份发布文件，不能固定加载源码而漏测压缩版。
      await new Promise(function (resolve, reject) {
        const script = iframe.contentDocument.createElement('script');
        script.src = source.src;
        script.onload = resolve;
        script.onerror = function () { reject(new Error('子窗口测试库加载失败')); };
        iframe.contentDocument.head.appendChild(script);
      });
      const child = iframe.contentWindow.translate;
      let received;
      child.postMessage.send = function (target, type, payload, origin) { received = [target, type, payload, origin]; };
      child.postMessage.getParentOrigin = function () { return location.origin; };
      const result = child.postMessage.notifyParent('english');
      return result === undefined && received[0] === window && received[1] === child.postMessage.TYPES.CHANGE_LANGUAGE &&
        received[2].language === 'english' && received[2].fromParent === false &&
        received[2].source === 'child' && received[3] === location.origin;
    }
  },
  {
    remark: '子窗口处于父通知抑制状态时不反向发送消息',
    test: async function () {
      const source = Array.from(document.scripts).find(script => /\/translate(?:\.min)?\.js$/.test(script.src));
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      await new Promise(function (resolve, reject) {
        const script = iframe.contentDocument.createElement('script');
        script.src = source.src;
        script.onload = resolve;
        script.onerror = function () { reject(new Error('子窗口测试库加载失败')); };
        iframe.contentDocument.head.appendChild(script);
      });
      const child = iframe.contentWindow.translate;
      let calls = 0;
      child.postMessage._suppressParentNotify = true;
      child.postMessage.send = function () { calls++; };
      child.postMessage.notifyParent('spanish');
      return calls === 0;
    }
  },
  {
    remark: '子窗口发送消息失败时不向调用方传播异常',
    test: async function () {
      const source = Array.from(document.scripts).find(script => /\/translate(?:\.min)?\.js$/.test(script.src));
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      await new Promise(function (resolve, reject) {
        const script = iframe.contentDocument.createElement('script');
        script.src = source.src;
        script.onload = resolve;
        script.onerror = function () { reject(new Error('子窗口测试库加载失败')); };
        iframe.contentDocument.head.appendChild(script);
      });
      let calls = 0;
      const child = iframe.contentWindow.translate;
      child.postMessage.send = function () { calls++; throw new Error('send failed'); };
      return child.postMessage.notifyParent('english') === undefined && calls === 1;
    }
  }
]);
