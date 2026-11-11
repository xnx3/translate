'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '构造时保存 iframe 引用和绝对脚本地址且尚未注入',
    test: function () {
      const iframe = document.createElement('iframe');
      const url = location.origin + '/translate.js';
      const injector = new translate.element.iframe.iframeJsInjector(iframe, url);
      return injector.iframe === iframe && injector.translateJsUrl === url && injector.isInjectJs === false;
    }
  },
  {
    remark: '相对脚本地址保持原始值供后续注入解析',
    test: function () {
      const iframe = document.createElement('iframe');
      const injector = new translate.element.iframe.iframeJsInjector(iframe, './translate.js?v=1');
      return injector.iframe === iframe && injector.translateJsUrl === './translate.js?v=1';
    }
  },
  {
    remark: '空地址仅被保存且构造阶段不会插入脚本',
    test: function () {
      const iframe = document.createElement('iframe');
      const before = document.scripts.length;
      const injector = new translate.element.iframe.iframeJsInjector(iframe, '');
      return injector.translateJsUrl === '' && injector.isInjectJs === false && document.scripts.length === before;
    }
  },
  {
    remark: '不同实例的注入标记和目标引用独立',
    test: function () {
      const firstFrame = document.createElement('iframe');
      const secondFrame = document.createElement('iframe');
      const first = new translate.element.iframe.iframeJsInjector(firstFrame, '/one.js');
      const second = new translate.element.iframe.iframeJsInjector(secondFrame, '/two.js');
      first.isInjectJs = true;
      return second.isInjectJs === false && first.iframe === firstFrame && second.iframe === secondFrame && second.translateJsUrl === '/two.js';
    }
  }
]);
