'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "首次启用初始化弱引用缓存和两类钩子",
    test: function () {
      const change=translate.lifecycle.changeLanguage.trigger.length;
      const execute=translate.lifecycle.execute.start.length;
      translate.faultTolerance.documentCreateTextNode.use();
      return translate.faultTolerance.documentCreateTextNode.node instanceof WeakMap && translate.lifecycle.changeLanguage.trigger.length===change+1 && translate.lifecycle.execute.start.length===execute+1;
    }
  },
  {
    remark: "重复启用不重复注册生命周期",
    test: function () {
      translate.faultTolerance.documentCreateTextNode.use();
      const change=translate.lifecycle.changeLanguage.trigger.length;
      const execute=translate.lifecycle.execute.start.length;
      translate.faultTolerance.documentCreateTextNode.use();
      return translate.lifecycle.changeLanguage.trigger.length===change && translate.lifecycle.execute.start.length===execute;
    }
  },
  {
    remark: "切换到本地语种时禁用容错包装",
    test: function () {
      translate.language.local='chinese_simplified';
      translate.faultTolerance.documentCreateTextNode.use();
      translate.faultTolerance.documentCreateTextNode.enable();
      translate.lifecycle.changeLanguage.trigger_Trigger({to:'chinese_simplified'});
      return translate.faultTolerance.documentCreateTextNode.originalCreateTextNode===null;
    }
  }
]);
