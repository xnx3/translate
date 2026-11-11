'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '建立真实观察器并配置属性子树文本及旧值监控',
    test: function () {
      translate.listener.addListener();
      const config = translate.listener.config;
      return translate.listener.isStart === true && translate.listener.observer instanceof MutationObserver && typeof translate.listener.callback === 'function' && config.attributes === true && config.childList === true && config.subtree === true && config.characterData === true && config.attributeOldValue === true && config.characterDataOldValue === true;
    }
  },
  {
    remark: '重复启动复用同一观察器和回调避免重复通知',
    test: async function () {
      const root = document.createElement('div');
      document.body.append(root);
      translate.documents = [root];
      const calls = [];
      // 只记录 execute 的调用，真实 MutationObserver 负责生成并分发变化记录。
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.addListener();
      const observer = translate.listener.observer;
      const callback = translate.listener.callback;
      translate.listener.addListener();
      const node = document.createElement('span');
      node.textContent = '新增';
      root.append(node);
      await new Promise(resolve => setTimeout(resolve, 20));
      return translate.listener.observer === observer && translate.listener.callback === callback && calls.length === 1 && calls[0].length === 1 && calls[0][0] === node;
    }
  },
  {
    remark: '只观察指定文档范围而不接收外部节点变动',
    test: async function () {
      const root = document.createElement('div');
      const outside = document.createElement('div');
      document.body.append(root, outside);
      translate.documents = [root];
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.addListener();
      const inside = document.createElement('span');
      inside.textContent = '内部';
      root.append(inside);
      outside.append(document.createTextNode('外部'));
      await new Promise(resolve => setTimeout(resolve, 20));
      return calls.length === 1 && calls[0].length === 1 && calls[0][0] === inside;
    }
  },
  {
    remark: '多个指定文档均监听且 null 项不会妨碍后续文档',
    test: async function () {
      const first = document.createElement('div');
      const second = document.createElement('div');
      document.body.append(first, second);
      translate.documents = [first, null, second];
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.addListener();
      const one = document.createElement('span');
      const two = document.createElement('span');
      one.textContent = '一';
      two.textContent = '二';
      first.append(one);
      second.append(two);
      await new Promise(resolve => setTimeout(resolve, 20));
      return calls.length === 1 && calls[0].length === 2 && calls[0][0] === one && calls[0][1] === two;
    }
  },
  {
    remark: '监控范围内的后代 title 属性和文本变化均能自动通知',
    test: async function () {
      const root = document.createElement('div');
      const child = document.createElement('span');
      child.title = '旧提示';
      child.textContent = '旧文本';
      root.append(child);
      document.body.append(root);
      translate.documents = [root];
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.addListener();
      child.title = '新提示';
      child.firstChild.nodeValue = '新文本';
      await new Promise(resolve => setTimeout(resolve, 20));
      return calls.length === 1 && calls[0].length === 2 && calls[0][0] === child.getAttributeNode('title') && calls[0][1] === child.firstChild;
    }
  },
  {
    remark: '启用 input value 自定义翻译时同步安装值监听',
    test: function () {
      translate.element.tagAttribute.input = { attribute: ['value'], condition: function () { return true; } };
      const input = document.createElement('input');
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.addListener();
      input.value = '动态值';
      return translate.listener.input.originalValueDescriptor !== null && calls.length === 1 && calls[0][0] === input;
    }
  },
  {
    remark: '未启用 input value 翻译时不安装值监听',
    test: function () {
      delete translate.element.tagAttribute.input;
      const before = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      translate.listener.addListener();
      return translate.listener.input.originalValueDescriptor === null && Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set === before;
    }
  }
]);
