'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "创建文本 '原文'，有缓存=True，触发过翻译=True",
    test: function () {
      translate.faultTolerance.documentCreateTextNode.use();
      translate.executeTriggerNumber=1;
      translate.history.translateText.originalMap.set("原文",'translated');
      translate.faultTolerance.documentCreateTextNode.enable();
      const node=document.createTextNode("原文");
      return node.nodeValue==="translated" && node.ownerDocument===document;
    }
  },
  {
    remark: "创建文本 '原文'，有缓存=True，触发过翻译=False",
    test: function () {
      translate.faultTolerance.documentCreateTextNode.use();
      translate.executeTriggerNumber=0;
      translate.history.translateText.originalMap.set("原文",'translated');
      translate.faultTolerance.documentCreateTextNode.enable();
      const node=document.createTextNode("原文");
      return node.nodeValue==="原文" && node.ownerDocument===document;
    }
  },
  {
    remark: "创建文本 '未知'，有缓存=False，触发过翻译=True",
    test: function () {
      translate.faultTolerance.documentCreateTextNode.use();
      translate.executeTriggerNumber=1;
      translate.faultTolerance.documentCreateTextNode.enable();
      const node=document.createTextNode("未知");
      return node.nodeValue==="未知" && node.ownerDocument===document;
    }
  },
  {
    remark: "创建文本 ''，有缓存=False，触发过翻译=True",
    test: function () {
      translate.faultTolerance.documentCreateTextNode.use();
      translate.executeTriggerNumber=1;
      translate.faultTolerance.documentCreateTextNode.enable();
      const node=document.createTextNode("");
      return node.nodeValue==="" && node.ownerDocument===document;
    }
  },
  {
    remark: "创建文本 '中文😀'，有缓存=True，触发过翻译=True",
    test: function () {
      translate.faultTolerance.documentCreateTextNode.use();
      translate.executeTriggerNumber=1;
      translate.history.translateText.originalMap.set("中文😀",'translated');
      translate.faultTolerance.documentCreateTextNode.enable();
      const node=document.createTextNode("中文😀");
      return node.nodeValue==="translated" && node.ownerDocument===document;
    }
  },
  {
    remark: "连续启用保留同一包装和原始函数",
    test: function () {
      translate.faultTolerance.documentCreateTextNode.use();
      const native=document.createTextNode;
      translate.faultTolerance.documentCreateTextNode.enable();
      const wrapped=document.createTextNode;
      translate.faultTolerance.documentCreateTextNode.enable();
      return document.createTextNode===wrapped && translate.faultTolerance.documentCreateTextNode.originalCreateTextNode===native;
    }
  },
  {
    remark: "命中翻译缓存时记录原文用于还原",
    test: function () {
      translate.faultTolerance.documentCreateTextNode.use();
      translate.executeTriggerNumber=1;
      translate.history.translateText.originalMap.set('original','translated');
      translate.faultTolerance.documentCreateTextNode.enable();
      const node=document.createTextNode('original');
      return translate.faultTolerance.documentCreateTextNode.node.get(node).originalText==='original' && translate.node.get(node).resultText==='translated';
    }
  }
]);
