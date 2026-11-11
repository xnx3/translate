'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "HTTP页面自检不提示file协议警告",
    test: function () {
      const messages = [];
      translate.log = value => messages.push(value);
      return translate.check() === undefined && messages.length === 0;
    }
  },
  {
    remark: "重复自检不修改语种、DOM或初始化状态",
    test: function () {
      translate.to = 'spanish';
      const state = translate.init_execute;
      document.body.textContent = '原文';
      translate.check();
      translate.check();
      return translate.to === 'spanish' && translate.init_execute === state && document.body.textContent === '原文';
    }
  }
]);
