'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "未启用时禁用保持原生函数",
    test: function () {
      const native=document.createTextNode;
      translate.faultTolerance.documentCreateTextNode.disable();
      return document.createTextNode===native;
    }
  },
  {
    remark: "禁用恢复准确原生函数并清除包装引用",
    test: function () {
      translate.faultTolerance.documentCreateTextNode.use();
      const native=document.createTextNode;
      translate.faultTolerance.documentCreateTextNode.enable();
      translate.faultTolerance.documentCreateTextNode.disable();
      return document.createTextNode===native && translate.faultTolerance.documentCreateTextNode.originalCreateTextNode===null;
    }
  },
  {
    remark: "重复禁用仍可创建原文节点",
    test: function () {
      translate.faultTolerance.documentCreateTextNode.use();
      translate.executeTriggerNumber=1;
      translate.history.translateText.originalMap.set('original','translated');
      translate.faultTolerance.documentCreateTextNode.enable();
      translate.faultTolerance.documentCreateTextNode.disable();
      translate.faultTolerance.documentCreateTextNode.disable();
      return document.createTextNode('original').nodeValue==='original';
    }
  },
  {
    remark: "禁用后可以重新启用并使用缓存",
    test: function () {
      translate.faultTolerance.documentCreateTextNode.use();
      translate.executeTriggerNumber=1;
      translate.history.translateText.originalMap.set('original','translated');
      translate.faultTolerance.documentCreateTextNode.enable();
      translate.faultTolerance.documentCreateTextNode.disable();
      translate.faultTolerance.documentCreateTextNode.enable();
      return document.createTextNode('original').nodeValue==='translated';
    }
  }
]);
