'use strict';

require('../helpers/module')(__filename, [
  { remark: '省略节点时不触发翻译', args: [], expected: false },
  { remark: '明确传 undefined 不触发翻译', args: [undefined], expected: false },
  { remark: '传 null 不触发翻译', args: [null], expected: false },
  {
    remark: '没有历史的非空文本节点需要翻译',
    test: function () {
      return translate.listener.nodeValueChangeNeedTranslate(document.createTextNode('你好😀')) === true;
    }
  },
  {
    remark: '空文本节点不需要翻译',
    test: function () {
      return translate.listener.nodeValueChangeNeedTranslate(document.createTextNode('')) === false;
    }
  },
  {
    remark: '空格制表符换行及全角空格构成的文本无需翻译',
    test: function () {
      return translate.listener.nodeValueChangeNeedTranslate(document.createTextNode(' \t\r\n　')) === false;
    }
  },
  {
    remark: '包含文字的 title 属性节点需要翻译',
    test: function () {
      const element = document.createElement('div');
      element.title = '提示';
      return translate.listener.nodeValueChangeNeedTranslate(element.getAttributeNode('title')) === true;
    }
  },
  {
    remark: '命中已渲染结果的数字索引零也不会重复翻译',
    test: function () {
      const node = document.createTextNode('Hello');
      translate.node.set(node, { translateResults: { Hello: 0 } });
      return translate.listener.nodeValueChangeNeedTranslate(node) === false;
    }
  },
  {
    remark: '当前文本未命中历史结果时允许重新翻译',
    test: function () {
      const node = document.createTextNode('新内容');
      translate.node.set(node, { translateResults: { Hello: 1 } });
      return translate.listener.nodeValueChangeNeedTranslate(node) === true;
    }
  },
  {
    remark: '整体翻译的当前文本与最终结果相同则不重新翻译',
    test: function () {
      const node = document.createTextNode('Hello');
      translate.node.set(node, { whole: true, resultText: 'Hello' });
      return translate.listener.nodeValueChangeNeedTranslate(node) === false;
    }
  },
  {
    remark: '整体翻译后被外部改成新文本时即使近期渲染也重新翻译',
    test: function () {
      const node = document.createTextNode('新内容');
      translate.node.set(node, { whole: true, resultText: 'Hello', lastTranslateRenderTime: Date.now() });
      return translate.listener.nodeValueChangeNeedTranslate(node) === true;
    }
  },
  {
    remark: '非整体节点刚由翻译修改时抑制重复变化',
    test: function () {
      const now = Date.now();
      Date.now = function () { return now; };
      const node = document.createTextNode('Hello');
      translate.node.set(node, { whole: false, lastTranslateRenderTime: now - 10 });
      return translate.listener.nodeValueChangeNeedTranslate(node) === false;
    }
  },
  {
    remark: '非整体节点的过期渲染时间不再抑制外部变化',
    test: function () {
      const node = document.createTextNode('新内容');
      translate.node.set(node, { whole: false, lastTranslateRenderTime: Date.now() - 1000 });
      return translate.listener.nodeValueChangeNeedTranslate(node) === true;
    }
  },
  {
    remark: '仅有原文而没有结果或时间的记录仍允许翻译',
    test: function () {
      const node = document.createTextNode('你好');
      translate.node.set(node, { originalText: '你好' });
      return translate.listener.nodeValueChangeNeedTranslate(node) === true;
    }
  },
  {
    remark: '属性节点命中已渲染结果时不再重复翻译',
    test: function () {
      const element = document.createElement('input');
      element.placeholder = 'Hello';
      const node = element.getAttributeNode('placeholder');
      translate.node.set(node, { translateResults: { Hello: 3 } });
      return translate.listener.nodeValueChangeNeedTranslate(node) === false;
    }
  }
]);
