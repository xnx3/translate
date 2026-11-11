'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '收到有效语种后转交 executeChangeLanguage，并保留来自父页标记',
    test: function () {
      let received;
      translate.postMessage.executeChangeLanguage = function (language, fromParent) { received = [language, fromParent]; };
      const result = translate.postMessage.onReceiveChangeLanguage('english', true);
      return result === undefined && received[0] === 'english' && received[1] === true;
    }
  },
  {
    remark: '来自子页的 false 标记不被转换为 true',
    test: function () {
      let received;
      translate.postMessage.executeChangeLanguage = function (language, fromParent) { received = [language, fromParent]; };
      translate.postMessage.onReceiveChangeLanguage('spanish', false);
      return received[0] === 'spanish' && received[1] === false;
    }
  },
  {
    remark: '省略来自父页标记时保持 undefined 转交',
    test: function () {
      let received;
      translate.postMessage.executeChangeLanguage = function (language, fromParent) { received = [language, fromParent]; };
      translate.postMessage.onReceiveChangeLanguage('english');
      return received[0] === 'english' && received[1] === undefined;
    }
  },
  {
    remark: '当前目标语种相同但尚无已翻译节点时仍执行切换',
    test: function () {
      translate.to = 'english';
      translate.node.data = new Map();
      let calls = 0;
      translate.postMessage.executeChangeLanguage = function (language) {
        if (language === 'english') calls++;
      };
      translate.postMessage.onReceiveChangeLanguage('english', true);
      return calls === 1;
    }
  },
  {
    remark: '当前语种相同且已有翻译节点时跳过重复切换',
    test: function () {
      translate.to = 'english';
      translate.node.data = new Map([[document.createTextNode('Hello'), {}]]);
      let calls = 0;
      translate.postMessage.executeChangeLanguage = function () { calls++; };
      const result = translate.postMessage.onReceiveChangeLanguage('english', true);
      return result === undefined && calls === 0;
    }
  },
  {
    remark: '已有翻译节点但目标语种不同时仍执行切换',
    test: function () {
      translate.to = 'english';
      translate.node.data = new Map([[document.createTextNode('Hello'), {}]]);
      let received;
      translate.postMessage.executeChangeLanguage = function (language) { received = language; };
      translate.postMessage.onReceiveChangeLanguage('spanish', false);
      return received === 'spanish';
    }
  }
]);
