'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "省略配置时创建样式并注册前后网络钩子",
    test: function () {
      const before=translate.lifecycle.execute.translateNetworkBefore.length;
      const after=translate.lifecycle.execute.translateNetworkAfter.length;
      translate.progress.api.startUITip(undefined);
      return translate.progress.api.use===true && document.querySelectorAll("#translatejs-text-element-hidden").length===1 && document.querySelectorAll("#translatejs-mask-layer-animation").length===1 && translate.lifecycle.execute.translateNetworkBefore.length===before+1 && translate.lifecycle.execute.translateNetworkAfter.length===after+1;
    }
  },
  {
    remark: "空配置时创建样式并注册前后网络钩子",
    test: function () {
      const before=translate.lifecycle.execute.translateNetworkBefore.length;
      const after=translate.lifecycle.execute.translateNetworkAfter.length;
      translate.progress.api.startUITip({});
      return translate.progress.api.use===true && document.querySelectorAll("#translatejs-text-element-hidden").length===1 && document.querySelectorAll("#translatejs-mask-layer-animation").length===1 && translate.lifecycle.execute.translateNetworkBefore.length===before+1 && translate.lifecycle.execute.translateNetworkAfter.length===after+1;
    }
  },
  {
    remark: "自定义小数宽度阈值时创建样式并注册前后网络钩子",
    test: function () {
      const before=translate.lifecycle.execute.translateNetworkBefore.length;
      const after=translate.lifecycle.execute.translateNetworkAfter.length;
      translate.progress.api.startUITip({maskLayerMinWidth:4.5});
      return translate.progress.api.use===true && document.querySelectorAll("#translatejs-text-element-hidden").length===1 && document.querySelectorAll("#translatejs-mask-layer-animation").length===1 && translate.lifecycle.execute.translateNetworkBefore.length===before+1 && translate.lifecycle.execute.translateNetworkAfter.length===after+1;
    }
  },
  {
    remark: "重复启用不重复注册或创建样式",
    test: function () {
      translate.progress.api.startUITip();
      const before=translate.lifecycle.execute.translateNetworkBefore.length;
      const after=translate.lifecycle.execute.translateNetworkAfter.length;
      translate.progress.api.startUITip();
      return translate.lifecycle.execute.translateNetworkBefore.length===before && translate.lifecycle.execute.translateNetworkAfter.length===after && document.querySelectorAll("#translatejs-mask-layer-animation").length===1;
    }
  },
  {
    remark: "关闭提示标记后不注册网络提示回调",
    test: function () {
      translate.progress.api.setUITip(false);
      const before=translate.lifecycle.execute.translateNetworkBefore.length;
      translate.progress.api.startUITip();
      return translate.progress.api.use===true && translate.lifecycle.execute.translateNetworkBefore.length===before;
    }
  },
  {
    remark: "遮罩宽度边界：元素9，阈值10",
    test: function () {
      const node=document.createElement('span');
      node.textContent='原文';
      node.style.cssText='display:inline-block;width:9px;height:20px';
      document.body.append(node);
      translate.node.set(node.firstChild,{originalText:'原文',resultText:'text',attribute:''});
      translate.progress.api.startUITip({maskLayerMinWidth:10});
      const callback=translate.lifecycle.execute.translateNetworkBefore.at(-1);
      callback({nodes:[node.firstChild]});
      return node.classList.contains('translatejs-text-element-hidden') && node.classList.contains('translate_api_in_progress')===false;
    }
  },
  {
    remark: "遮罩宽度边界：元素10，阈值10",
    test: function () {
      const node=document.createElement('span');
      node.textContent='原文';
      node.style.cssText='display:inline-block;width:10px;height:20px';
      document.body.append(node);
      translate.node.set(node.firstChild,{originalText:'原文',resultText:'text',attribute:''});
      translate.progress.api.startUITip({maskLayerMinWidth:10});
      const callback=translate.lifecycle.execute.translateNetworkBefore.at(-1);
      callback({nodes:[node.firstChild]});
      return node.classList.contains('translatejs-text-element-hidden') && node.classList.contains('translate_api_in_progress')===true;
    }
  },
  {
    remark: "遮罩宽度边界：元素11，阈值10",
    test: function () {
      const node=document.createElement('span');
      node.textContent='原文';
      node.style.cssText='display:inline-block;width:11px;height:20px';
      document.body.append(node);
      translate.node.set(node.firstChild,{originalText:'原文',resultText:'text',attribute:''});
      translate.progress.api.startUITip({maskLayerMinWidth:10});
      const callback=translate.lifecycle.execute.translateNetworkBefore.at(-1);
      callback({nodes:[node.firstChild]});
      return node.classList.contains('translatejs-text-element-hidden') && node.classList.contains('translate_api_in_progress')===true;
    }
  },
  {
    remark: "遮罩宽度边界：元素4.4，阈值4.5",
    test: function () {
      const node=document.createElement('span');
      node.textContent='原文';
      node.style.cssText='display:inline-block;width:4.4px;height:20px';
      document.body.append(node);
      translate.node.set(node.firstChild,{originalText:'原文',resultText:'text',attribute:''});
      translate.progress.api.startUITip({maskLayerMinWidth:4.5});
      const callback=translate.lifecycle.execute.translateNetworkBefore.at(-1);
      callback({nodes:[node.firstChild]});
      return node.classList.contains('translatejs-text-element-hidden') && node.classList.contains('translate_api_in_progress')===false;
    }
  },
  {
    remark: "遮罩宽度边界：元素4.5，阈值4.5",
    test: function () {
      const node=document.createElement('span');
      node.textContent='原文';
      node.style.cssText='display:inline-block;width:4.5px;height:20px';
      document.body.append(node);
      translate.node.set(node.firstChild,{originalText:'原文',resultText:'text',attribute:''});
      translate.progress.api.startUITip({maskLayerMinWidth:4.5});
      const callback=translate.lifecycle.execute.translateNetworkBefore.at(-1);
      callback({nodes:[node.firstChild]});
      return node.classList.contains('translatejs-text-element-hidden') && node.classList.contains('translate_api_in_progress')===true;
    }
  },
  {
    remark: '混合片段文本与正常文本时，前后提示钩子只修改并恢复真实元素',
    test: function () {
      // 调用真实提示钩子，既检查非元素不被写入 className，也检查后续元素仍隐藏并恢复。
      const fragment = document.createDocumentFragment(), fragmentText = document.createTextNode('片段原文');
      fragment.append(fragmentText);
      const element = document.createElement('span');
      element.textContent = '正常原文';
      element.style.cssText = 'display:inline-block;width:20px;height:20px';
      document.body.append(element);
      const text = element.firstChild, nodes = [fragmentText, text];
      translate.progress.api.startUITip();
      const before = translate.lifecycle.execute.translateNetworkBefore.at(-1);
      const after = translate.lifecycle.execute.translateNetworkAfter.at(-1);
      before({ nodes: nodes });
      const hidden = element.classList.contains('translatejs-text-element-hidden') &&
        element.classList.contains('translate_api_in_progress') && !Object.hasOwn(fragment, 'className');
      after({ nodes: nodes });
      return hidden && !element.classList.contains('translatejs-text-element-hidden') &&
        !element.classList.contains('translate_api_in_progress') && !Object.hasOwn(fragment, 'className') &&
        fragmentText.parentNode === fragment && fragmentText.nodeValue === '片段原文' &&
        element.firstChild === text && text.nodeValue === '正常原文';
    }
  }
]);
