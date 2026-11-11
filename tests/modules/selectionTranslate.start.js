'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "启用选区翻译创建提示节点并显示启用标记",
    test: function () {
      translate.selectionTranslate.start();
      const tooltip=document.getElementById("translateTooltip");
      return translate.selectionTranslate.use===true && tooltip!==null && tooltip.textContent==="";
    }
  },
  {
    remark: "重复启用保持一个提示节点",
    test: function () {
      translate.selectionTranslate.start();
      const node=document.getElementById("translateTooltip");
      translate.selectionTranslate.start();
      return document.querySelectorAll("#translateTooltip").length===1 && document.getElementById("translateTooltip")===node;
    }
  },
  {
    remark: "真实mouseup事件调用一次翻译回调",
    test: function () {
      let count=0;
      translate.selectionTranslate.callTranslate=()=>{count++;};
      translate.selectionTranslate.start();
      translate.selectionTranslate.start();
      document.dispatchEvent(new MouseEvent('mouseup'));
      return count===1;
    }
  },
  {
    remark: "真实点击隐藏提示节点",
    test: function () {
      translate.selectionTranslate.start();
      document.dispatchEvent(new MouseEvent('click'));
      return document.getElementById('translateTooltip').style.display==='none';
    }
  }
]);
