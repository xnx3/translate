'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "旧版标记被切换为 v2",
    test: function () {
      translate.useVersion = 'v1';
      translate.setUseVersion2();
      return translate.useVersion === 'v2';
    }
  },
  {
    remark: "重复调用保持 v2",
    test: function () {
      translate.setUseVersion2();
      translate.setUseVersion2();
      return translate.useVersion === 'v2';
    }
  },
  {
    remark: "兼容入口不改动当前目标语种和监听配置",
    test: function () {
      translate.to = 'spanish';
      translate.listener.use = false;
      translate.setUseVersion2();
      return translate.to === 'spanish' && translate.listener.use === false;
    }
  },
  {
    remark: "兼容入口提示包含当前版本，且没有返回值",
    test: function () {
      let message;
      translate.log = value => { message = value; };
      return translate.setUseVersion2() === undefined && typeof message === 'string' && message.includes(translate.version);
    }
  }
]);
