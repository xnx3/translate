'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '保存完整节点记录并保留原对象引用',
    test: function () {
      const node = document.createTextNode('你好');
      const record = { originalText: '你好', resultText: 'Hello', whole: true, translateTexts: { '你好': 'Hello' } };
      const result = translate.node.set(node, record);
      return result === undefined && translate.node.get(node) === record;
    }
  },
  {
    remark: '同一节点再次设置时替换旧记录',
    test: function () {
      const node = document.createTextNode('你好');
      const old = { originalText: '旧记录' };
      const current = { originalText: '新记录' };
      translate.node.set(node, old);
      translate.node.set(node, current);
      return translate.node.get(node) === current && old.originalText === '旧记录';
    }
  },
  {
    remark: '不同节点保存不同记录且不会按文字内容合并',
    test: function () {
      const first = document.createTextNode('一样');
      const second = document.createTextNode('一样');
      const firstRecord = {};
      const secondRecord = {};
      translate.node.set(first, firstRecord);
      translate.node.set(second, secondRecord);
      return translate.node.get(first) === firstRecord && translate.node.get(second) === secondRecord;
    }
  },
  {
    remark: '元素和其 title 属性分别保存记录',
    test: function () {
      const node = document.createElement('input');
      node.title = '提示';
      const attribute = node.getAttributeNode('title');
      const elementRecord = { attribute: 'value' };
      const attributeRecord = { attribute: 'title' };
      translate.node.set(node, elementRecord);
      translate.node.set(attribute, attributeRecord);
      return translate.node.get(node) === elementRecord && translate.node.get(attribute) === attributeRecord;
    }
  },
  {
    remark: '保存记录不会修改原记录的数组和附加字段',
    test: function () {
      const node = document.createTextNode('');
      const modified = ['初始记录'];
      const record = { originalText: '', modified: modified, custom: '保留😀' };
      translate.node.set(node, record);
      return record.modified === modified && record.modified.length === 1 && record.custom === '保留😀';
    }
  }
]);
