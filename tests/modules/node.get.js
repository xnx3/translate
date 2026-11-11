'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '未记录的元素节点返回 undefined',
    test: function () {
      return translate.node.get(document.createElement('div')) === undefined;
    }
  },
  {
    remark: '元素节点按对象身份返回原始记录引用',
    test: function () {
      const node = document.createElement('div');
      const record = { originalText: '你好', whole: true };
      translate.node.set(node, record);
      return translate.node.get(node) === record;
    }
  },
  {
    remark: '文本节点与属性节点的记录互不混淆',
    test: function () {
      const text = document.createTextNode('你好');
      const element = document.createElement('span');
      element.title = '你好';
      const attribute = element.getAttributeNode('title');
      const textRecord = { originalText: '文本' };
      const attributeRecord = { originalText: '属性' };
      translate.node.set(text, textRecord);
      translate.node.set(attribute, attributeRecord);
      return translate.node.get(text) === textRecord && translate.node.get(attribute) === attributeRecord;
    }
  },
  {
    remark: '内容相同的克隆节点不能读取另一个节点的记录',
    test: function () {
      const node = document.createTextNode('相同内容');
      const clone = node.cloneNode(true);
      translate.node.set(node, { originalText: '相同内容' });
      return translate.node.get(clone) === undefined;
    }
  },
  {
    remark: '读取记录保留后续修改且不会复制对象',
    test: function () {
      const node = document.createTextNode('你好');
      const record = { resultText: 'Hello' };
      translate.node.set(node, record);
      record.resultText = 'Bonjour';
      return translate.node.get(node).resultText === 'Bonjour';
    }
  }
]);
