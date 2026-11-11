'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "移除后代遮罩并保留其他类和文本：<span class=\"translate_api_in_progress keep\">x</span>",
    test: function () {
      const root=document.createElement("div");
      root.className="translate_api_in_progress root";
      root.innerHTML="<span class=\"translate_api_in_progress keep\">x</span>";
      const before=root.textContent;
      translate.progress.api.removeChildClass(root,1);
      return root.classList.contains("translate_api_in_progress") && root.querySelector(".translate_api_in_progress")===null && root.textContent===before && root.querySelector(".keep")!==null;
    }
  },
  {
    remark: "移除后代遮罩并保留其他类和文本：<span><i><b class=\"translate_api_in_progress keep\">x</b></i></span>",
    test: function () {
      const root=document.createElement("div");
      root.className="translate_api_in_progress root";
      root.innerHTML="<span><i><b class=\"translate_api_in_progress keep\">x</b></i></span>";
      const before=root.textContent;
      translate.progress.api.removeChildClass(root,1);
      return root.classList.contains("translate_api_in_progress") && root.querySelector(".translate_api_in_progress")===null && root.textContent===before && root.querySelector(".keep")!==null;
    }
  },
  {
    remark: "移除后代遮罩并保留其他类和文本：text<!--comment--><span class=\"keep\">x</span>",
    test: function () {
      const root=document.createElement("div");
      root.className="translate_api_in_progress root";
      root.innerHTML="text<!--comment--><span class=\"keep\">x</span>";
      const before=root.textContent;
      translate.progress.api.removeChildClass(root,1);
      return root.classList.contains("translate_api_in_progress") && root.querySelector(".translate_api_in_progress")===null && root.textContent===before && root.querySelector(".keep")!==null;
    }
  },
  {
    remark: "层级大于一时也清理当前节点",
    test: function () {
      const node=document.createElement('span');
      node.className='keep translate_api_in_progress';
      translate.progress.api.removeChildClass(node,2);
      return node.classList.contains('keep') && !node.classList.contains('translate_api_in_progress');
    }
  },
  {
    remark: "文本和注释节点不产生异常",
    test: function () {
      const root=document.createElement('div');
      root.append('text',document.createComment('comment'));
      translate.progress.api.removeChildClass(root,1);
      return root.textContent==='text' && root.childNodes.length===2;
    }
  },
  {
    remark: "重复清理保持DOM节点及已有类",
    test: function () {
      const root=document.createElement('div');
      root.innerHTML='<span class="keep translate_api_in_progress">x</span>';
      const child=root.firstChild;
      translate.progress.api.removeChildClass(root,1);
      translate.progress.api.removeChildClass(root,1);
      return root.firstChild===child && child.classList.contains('keep');
    }
  }
]);
