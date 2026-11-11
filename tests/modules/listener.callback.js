'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '空变更列表不会请求翻译',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      let count = 0;
      translate.execute = function () { count++; };
      return translate.listener.callback([], translate.listener.observer) === undefined && count === 0;
    }
  },
  {
    remark: '多个新增元素和文本节点按记录顺序一次交给翻译',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const element = document.createElement('span');
      const text = document.createTextNode('你好');
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.callback([{ type: 'childList', addedNodes: [element, text], removedNodes: [] }]);
      return calls.length === 1 && calls[0].length === 2 && calls[0][0] === element && calls[0][1] === text;
    }
  },
  {
    remark: '新增的忽略标签不进入翻译列表但后续普通节点仍加入',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const ignored = document.createElement('code');
      const normal = document.createElement('span');
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.callback([{ type: 'childList', addedNodes: [ignored, normal], removedNodes: [] }]);
      return calls.length === 1 && calls[0].length === 1 && calls[0][0] === normal;
    }
  },
  {
    remark: '只有删除记录时清理历史且不会重新请求翻译',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const removed = document.createTextNode('删除');
      const kept = document.createTextNode('保留');
      translate.node.set(removed, {});
      const keptRecord = {};
      translate.node.set(kept, keptRecord);
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.callback([{ type: 'childList', addedNodes: [], removedNodes: [removed] }]);
      return count === 0 && !translate.node.find(removed) && translate.node.get(kept) === keptRecord;
    }
  },
  {
    remark: '真实记录中节点移动导致的重复项不会漏掉同批后续新节点',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const root = document.createElement('div');
      const first = document.createElement('span');
      const second = document.createElement('span');
      const recorder = new MutationObserver(function () {});
      recorder.observe(root, { childList: true });
      root.append(first);
      const fragment = document.createDocumentFragment();
      fragment.append(first, second);
      root.append(fragment);
      const mutations = recorder.takeRecords();
      recorder.disconnect();
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.callback(mutations);
      return calls.length === 1 && calls[0].length === 2 && calls[0][0] === first && calls[0][1] === second;
    }
  },
  {
    remark: 'title 属性变化传递属性节点并删除旧翻译历史',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const element = document.createElement('div');
      element.title = '新提示';
      const attribute = element.getAttributeNode('title');
      translate.node.set(attribute, { resultText: '旧提示', whole: true });
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.callback([{ type: 'attributes', target: element, attributeName: 'title', oldValue: '旧提示' }]);
      return calls.length === 1 && calls[0].length === 1 && calls[0][0] === attribute && !translate.node.find(attribute);
    }
  },
  {
    remark: 'input 的 placeholder 内置属性允许翻译',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const input = document.createElement('input');
      input.placeholder = '请输入';
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.callback([{ type: 'attributes', target: input, attributeName: 'placeholder' }]);
      return calls.length === 1 && calls[0].length === 1 && calls[0][0] === input.getAttributeNode('placeholder');
    }
  },
  {
    remark: 'img 的 alt 内置属性允许翻译',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const image = document.createElement('img');
      image.alt = '图片说明';
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.callback([{ type: 'attributes', target: image, attributeName: 'alt' }]);
      return calls.length === 1 && calls[0].length === 1 && calls[0][0] === image.getAttributeNode('alt');
    }
  },
  {
    remark: 'class 属性变化直接忽略',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const element = document.createElement('div');
      element.className = '新样式';
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.callback([{ type: 'attributes', target: element, attributeName: 'class' }]);
      return count === 0;
    }
  },
  {
    remark: 'style 属性变化直接忽略',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const element = document.createElement('div');
      element.style.color = 'red';
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.callback([{ type: 'attributes', target: element, attributeName: 'style' }]);
      return count === 0;
    }
  },
  {
    remark: '未配置的自定义属性变化忽略',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const element = document.createElement('div');
      element.setAttribute('data-label', '标签');
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.callback([{ type: 'attributes', target: element, attributeName: 'data-label' }]);
      return count === 0;
    }
  },
  {
    remark: '自定义属性符合标签和条件时加入翻译',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const element = document.createElement('div');
      element.setAttribute('data-label', '标签');
      let checked;
      translate.element.tagAttribute.div = { attribute: ['data-label'], condition: function (node) { checked = node; return true; } };
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.callback([{ type: 'attributes', target: element, attributeName: 'data-label' }]);
      return checked === element && calls.length === 1 && calls[0][0] === element.getAttributeNode('data-label');
    }
  },
  {
    remark: '自定义属性条件不满足时不删除历史也不请求翻译',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const element = document.createElement('div');
      element.setAttribute('data-label', '标签');
      const attribute = element.getAttributeNode('data-label');
      const record = {};
      translate.node.set(attribute, record);
      translate.element.tagAttribute.div = { attribute: ['data-label'], condition: function () { return false; } };
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.callback([{ type: 'attributes', target: element, attributeName: 'data-label' }]);
      return count === 0 && translate.node.get(attribute) === record;
    }
  },
  {
    remark: 'title 属性被删除时不请求翻译',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const removed = document.createElement('div');
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.callback([{ type: 'attributes', target: removed, attributeName: 'title' }]);
      return count === 0;
    }
  },
  {
    remark: 'placeholder 属性变为空白时不请求翻译',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const blank = document.createElement('input');
      blank.placeholder = ' \t ';
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.callback([{ type: 'attributes', target: blank, attributeName: 'placeholder' }]);
      return count === 0;
    }
  },
  {
    remark: '已知翻译结果导致的属性变化不重新翻译并保留历史',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const element = document.createElement('div');
      element.title = 'Hello';
      const attribute = element.getAttributeNode('title');
      const record = { translateResults: { Hello: 0 } };
      translate.node.set(attribute, record);
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.callback([{ type: 'attributes', target: element, attributeName: 'title' }]);
      return count === 0 && translate.node.get(attribute) === record;
    }
  },
  {
    remark: '外部文本变化清理旧历史并只提交文本节点',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const node = document.createTextNode('新文本');
      translate.node.set(node, { whole: true, resultText: '旧文本' });
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.callback([{ type: 'characterData', target: node, oldValue: '旧文本' }]);
      return calls.length === 1 && calls[0].length === 1 && calls[0][0] === node && !translate.node.find(node);
    }
  },
  {
    remark: '空白文本变化不会重新翻译',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const blank = document.createTextNode(' \n　');
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.callback([{ type: 'characterData', target: blank }]);
      return count === 0;
    }
  },
  {
    remark: '已经渲染的文本变化不会重新翻译且保留历史',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const rendered = document.createTextNode('Hello');
      translate.node.set(rendered, { translateResults: { Hello: 1 } });
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.callback([{ type: 'characterData', target: rendered }]);
      return count === 0 && translate.node.find(rendered);
    }
  },
  {
    remark: '新增 iframe 时请求 iframe 注入并保留待扫描节点',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const frame = document.createElement('iframe');
      let requested;
      // 此处只观察跨模块注入请求；注入过程另由 iframe 方法模块独立测试。
      translate.element.iframe.execute = function (node) { requested = node; };
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.callback([{ type: 'childList', addedNodes: [frame], removedNodes: [] }]);
      return requested === frame && calls.length === 1 && calls[0][0] === frame;
    }
  },
  {
    remark: 'iframe src 变化请求重新注入且不会作为普通属性翻译',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const frame = document.createElement('iframe');
      frame.src = '/iframe-blank.html';
      let requested;
      translate.element.iframe.execute = function (node) { requested = node; };
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.callback([{ type: 'attributes', target: frame, attributeName: 'src' }]);
      return requested === frame && count === 0;
    }
  },
  {
    remark: '同一文本节点的多条变更记录只提交一次',
    test: function () {
      translate.listener.addListener();
      translate.listener.observer.disconnect();
      const node = document.createTextNode('最终文本');
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.callback([{ type: 'characterData', target: node }, { type: 'characterData', target: node }]);
      return calls.length === 1 && calls[0].length === 1 && calls[0][0] === node;
    }
  }
]);
