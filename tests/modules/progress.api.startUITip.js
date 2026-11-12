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
  },
  {
    remark: '请求成功前文本移到另一元素时，恢复原父元素并保留目标业务样式',
    test: function () {
      // 提示应清理开始时真正隐藏的元素，不能因为 Text 的父级变了而清错对象。
      const source = document.createElement('p'), target = document.createElement('div');
      const text = document.createTextNode('待翻译原文'), kept = document.createTextNode('未参与翻译的文字');
      source.className = 'source-business'; target.className = 'target-business';
      source.style.cssText = 'display:block;width:120px;height:30px';
      source.append(text, kept); document.body.append(source, target);
      const nodes = [text], texts = ['待翻译原文'];
      translate.progress.api.startUITip();
      const before = translate.lifecycle.execute.translateNetworkBefore.at(-1);
      const after = translate.lifecycle.execute.translateNetworkAfter.at(-1);
      before({ uuid: 'move-success', lang: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes });
      const hidden = source.classList.contains('translatejs-text-element-hidden') &&
        source.classList.contains('translate_api_in_progress') &&
        getComputedStyle(source).webkitTextFillColor === 'rgba(0, 0, 0, 0)';
      target.append(text);
      after({ uuid: 'move-success', from: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes, result: 1, info: '' });
      return hidden && !source.classList.contains('translatejs-text-element-hidden') &&
        !source.classList.contains('translate_api_in_progress') && source.classList.contains('source-business') &&
        getComputedStyle(source).webkitTextFillColor !== 'rgba(0, 0, 0, 0)' &&
        target.className === 'target-business' && text.parentNode === target && text.nodeValue === '待翻译原文' &&
        kept.parentNode === source && kept.nodeValue === '未参与翻译的文字';
    }
  },
  {
    remark: '请求期间文本移入 DocumentFragment 后仍清除原父元素提示',
    test: function () {
      const source = document.createElement('p'), fragment = document.createDocumentFragment();
      const text = document.createTextNode('片段移动原文'), kept = document.createTextNode('保留文字');
      source.className = 'source-business'; source.style.cssText = 'display:block;width:120px;height:30px';
      source.append(text, kept); document.body.append(source);
      const nodes = [text], texts = ['片段移动原文'];
      translate.progress.api.startUITip();
      const before = translate.lifecycle.execute.translateNetworkBefore.at(-1);
      const after = translate.lifecycle.execute.translateNetworkAfter.at(-1);
      before({ uuid: 'move-fragment', lang: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes });
      const hidden = source.classList.contains('translatejs-text-element-hidden') &&
        source.classList.contains('translate_api_in_progress');
      fragment.append(text);
      after({ uuid: 'move-fragment', from: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes, result: 1, info: '' });
      return hidden && !source.classList.contains('translatejs-text-element-hidden') &&
        !source.classList.contains('translate_api_in_progress') && source.classList.contains('source-business') &&
        !Object.hasOwn(fragment, 'className') && text.parentNode === fragment && text.nodeValue === '片段移动原文' &&
        kept.parentNode === source && kept.nodeValue === '保留文字';
    }
  },
  {
    remark: '请求期间文本移入 ShadowRoot 后仍恢复原父元素且不修改宿主',
    test: function () {
      const source = document.createElement('p'), host = document.createElement('div');
      const text = document.createTextNode('影子移动原文'), kept = document.createTextNode('保留文字');
      source.className = 'source-business'; host.className = 'host-business';
      source.style.cssText = 'display:block;width:120px;height:30px';
      source.append(text, kept); document.body.append(source, host);
      const shadow = host.attachShadow({ mode: 'open' }), nodes = [text], texts = ['影子移动原文'];
      translate.progress.api.startUITip();
      const before = translate.lifecycle.execute.translateNetworkBefore.at(-1);
      const after = translate.lifecycle.execute.translateNetworkAfter.at(-1);
      before({ uuid: 'move-shadow', lang: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes });
      const hidden = source.classList.contains('translatejs-text-element-hidden') &&
        source.classList.contains('translate_api_in_progress');
      shadow.append(text);
      after({ uuid: 'move-shadow', from: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes, result: 1, info: '' });
      return hidden && !source.classList.contains('translatejs-text-element-hidden') &&
        !source.classList.contains('translate_api_in_progress') && source.classList.contains('source-business') &&
        host.className === 'host-business' && !Object.hasOwn(shadow, 'className') &&
        text.parentNode === shadow && text.nodeValue === '影子移动原文' &&
        kept.parentNode === source && kept.nodeValue === '保留文字';
    }
  },
  {
    remark: '请求期间文本被 remove 断开后仍清除原父元素提示',
    test: function () {
      const source = document.createElement('p');
      const text = document.createTextNode('断开原文'), kept = document.createTextNode('保留文字');
      source.className = 'source-business'; source.style.cssText = 'display:block;width:120px;height:30px';
      source.append(text, kept); document.body.append(source);
      const nodes = [text], texts = ['断开原文'];
      translate.progress.api.startUITip();
      const before = translate.lifecycle.execute.translateNetworkBefore.at(-1);
      const after = translate.lifecycle.execute.translateNetworkAfter.at(-1);
      before({ uuid: 'remove-text', lang: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes });
      const hidden = source.classList.contains('translatejs-text-element-hidden') &&
        source.classList.contains('translate_api_in_progress');
      text.remove();
      after({ uuid: 'remove-text', from: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes, result: 1, info: '' });
      return hidden && !source.classList.contains('translatejs-text-element-hidden') &&
        !source.classList.contains('translate_api_in_progress') && source.classList.contains('source-business') &&
        text.parentNode === null && text.nodeValue === '断开原文' &&
        kept.parentNode === source && kept.nodeValue === '保留文字';
    }
  },
  {
    remark: '请求期间整个父元素被 remove 后仍通过原引用清除提示',
    test: function () {
      // 整个元素离开 document 时，Text 的直接父元素仍存在，不能误当成 Text 已断开。
      const source = document.createElement('p');
      const text = document.createTextNode('离线元素原文'), kept = document.createTextNode('保留文字');
      source.className = 'source-business'; source.style.cssText = 'display:block;width:120px;height:30px';
      source.append(text, kept); document.body.append(source);
      const nodes = [text], texts = ['离线元素原文'];
      translate.progress.api.startUITip();
      const before = translate.lifecycle.execute.translateNetworkBefore.at(-1);
      const after = translate.lifecycle.execute.translateNetworkAfter.at(-1);
      before({ uuid: 'remove-element', lang: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes });
      const hidden = source.classList.contains('translatejs-text-element-hidden') &&
        source.classList.contains('translate_api_in_progress');
      source.remove();
      after({ uuid: 'remove-element', from: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes, result: 1, info: '' });
      return hidden && !source.classList.contains('translatejs-text-element-hidden') &&
        !source.classList.contains('translate_api_in_progress') && source.classList.contains('source-business') &&
        !source.isConnected && source.parentNode === null && text.parentNode === source &&
        text.nodeValue === '离线元素原文' && kept.parentNode === source && kept.nodeValue === '保留文字';
    }
  },
  {
    remark: '请求失败前文本移到另一元素时也必须恢复原父元素',
    test: function () {
      const source = document.createElement('p'), target = document.createElement('div');
      const text = document.createTextNode('失败移动原文'), kept = document.createTextNode('保留文字');
      source.className = 'source-business'; target.className = 'target-business';
      source.style.cssText = 'display:block;width:120px;height:30px';
      source.append(text, kept); document.body.append(source, target);
      const nodes = [text], texts = ['失败移动原文'];
      translate.progress.api.startUITip();
      const before = translate.lifecycle.execute.translateNetworkBefore.at(-1);
      const after = translate.lifecycle.execute.translateNetworkAfter.at(-1);
      before({ uuid: 'move-failure', lang: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes });
      const hidden = source.classList.contains('translatejs-text-element-hidden') &&
        source.classList.contains('translate_api_in_progress');
      target.append(text);
      after({ uuid: 'move-failure', from: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes, result: 0, info: '模拟请求失败' });
      return hidden && !source.classList.contains('translatejs-text-element-hidden') &&
        !source.classList.contains('translate_api_in_progress') && source.classList.contains('source-business') &&
        target.className === 'target-business' && text.parentNode === target && text.nodeValue === '失败移动原文' &&
        kept.parentNode === source && kept.nodeValue === '保留文字';
    }
  },
  {
    remark: '文本移入另一个正在翻译的元素后不能清掉目标已有的进度样式',
    test: function () {
      // 目标已有提示属于其他未结束的请求，本次完成只应恢复自己实际隐藏的原父元素。
      const source = document.createElement('p'), target = document.createElement('div');
      const text = document.createTextNode('移动原文'), kept = document.createTextNode('原父保留文字');
      source.className = 'source-business'; source.style.cssText = 'display:block;width:120px;height:30px';
      target.className = 'target-business translatejs-text-element-hidden translate_api_in_progress';
      const targetClass = target.className;
      target.textContent = '目标仍待翻译'; source.append(text, kept); document.body.append(source, target);
      const nodes = [text], texts = ['移动原文'];
      translate.progress.api.startUITip();
      const before = translate.lifecycle.execute.translateNetworkBefore.at(-1);
      const after = translate.lifecycle.execute.translateNetworkAfter.at(-1);
      before({ uuid: 'preserve-target-progress', lang: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes });
      const hidden = source.classList.contains('translatejs-text-element-hidden') &&
        source.classList.contains('translate_api_in_progress');
      target.append(text);
      after({ uuid: 'preserve-target-progress', from: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes, result: 1, info: '' });
      return hidden && !source.classList.contains('translatejs-text-element-hidden') &&
        !source.classList.contains('translate_api_in_progress') && source.classList.contains('source-business') &&
        target.className === targetClass && target.firstChild.nodeValue === '目标仍待翻译' &&
        text.parentNode === target && text.nodeValue === '移动原文' &&
        kept.parentNode === source && kept.nodeValue === '原父保留文字';
    }
  },
  {
    remark: '请求失败但文本未移动时仍恢复原元素并保留全部原文',
    test: function () {
      const source = document.createElement('p');
      const text = document.createTextNode('未移动失败原文'), kept = document.createTextNode('保留文字');
      source.className = 'source-business'; source.style.cssText = 'display:block;width:120px;height:30px';
      source.append(text, kept); document.body.append(source);
      const nodes = [text], texts = ['未移动失败原文'];
      translate.progress.api.startUITip();
      const before = translate.lifecycle.execute.translateNetworkBefore.at(-1);
      const after = translate.lifecycle.execute.translateNetworkAfter.at(-1);
      before({ uuid: 'stationary-failure', lang: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes });
      const hidden = source.classList.contains('translatejs-text-element-hidden') &&
        source.classList.contains('translate_api_in_progress');
      after({ uuid: 'stationary-failure', from: 'chinese_simplified', to: 'english', texts: texts, nodes: nodes, result: 0, info: '模拟请求失败' });
      return hidden && !source.classList.contains('translatejs-text-element-hidden') &&
        !source.classList.contains('translate_api_in_progress') && source.classList.contains('source-business') &&
        getComputedStyle(source).webkitTextFillColor !== 'rgba(0, 0, 0, 0)' &&
        text.parentNode === source && text.nodeValue === '未移动失败原文' &&
        kept.parentNode === source && kept.nodeValue === '保留文字';
    }
  }
]);
