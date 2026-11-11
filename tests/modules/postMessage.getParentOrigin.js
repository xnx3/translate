'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '无 referrer 的独立页面返回空字符串',
    test: function () {
      Object.defineProperty(document, 'referrer', { configurable: true, value: '' });
      return translate.postMessage.getParentOrigin() === '';
    }
  },
  {
    remark: '父页面 HTTPS referrer 只保留协议和主机',
    test: function () {
      Object.defineProperty(document, 'referrer', {
        configurable: true, value: 'https://parent.example/path?x=1#part'
      });
      return translate.postMessage.getParentOrigin() === 'https://parent.example';
    }
  },
  {
    remark: '父页面非默认端口被保留',
    test: function () {
      Object.defineProperty(document, 'referrer', {
        configurable: true, value: 'http://parent.example:8124/path'
      });
      return translate.postMessage.getParentOrigin() === 'http://parent.example:8124';
    }
  },
  {
    remark: '父页面默认端口和主机大小写被规范化',
    test: function () {
      Object.defineProperty(document, 'referrer', {
        configurable: true, value: 'https://PARENT.example:443/path'
      });
      return translate.postMessage.getParentOrigin() === 'https://parent.example';
    }
  },
  {
    remark: '文件 referrer 使用 null 不透明来源标识',
    test: function () {
      Object.defineProperty(document, 'referrer', {
        configurable: true, value: 'file:///tmp/parent.html'
      });
      return translate.postMessage.getParentOrigin() === 'null';
    }
  }
]);
