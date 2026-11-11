'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '删除已存在的文本记录且返回 undefined',
    test: function () {
      const node = document.createTextNode('你好');
      translate.node.set(node, {});
      return translate.node.delete(node) === undefined && translate.node.get(node) === undefined;
    }
  },
  {
    remark: '删除不存在的节点不会影响其他记录',
    test: function () {
      const saved = document.createTextNode('保留');
      const missing = document.createTextNode('未记录');
      const record = {};
      translate.node.set(saved, record);
      translate.node.delete(missing);
      return translate.node.get(saved) === record && translate.node.get(missing) === undefined;
    }
  },
  {
    remark: '重复删除同一节点保持无记录状态',
    test: function () {
      const node = document.createElement('span');
      translate.node.set(node, {});
      translate.node.delete(node);
      translate.node.delete(node);
      return translate.node.find(node) === false;
    }
  },
  {
    remark: '删除元素记录不会连带删除其属性记录',
    test: function () {
      const node = document.createElement('div');
      node.title = '提示';
      const attribute = node.getAttributeNode('title');
      const record = {};
      translate.node.set(node, {});
      translate.node.set(attribute, record);
      translate.node.delete(node);
      return translate.node.get(node) === undefined && translate.node.get(attribute) === record;
    }
  },
  {
    remark: '删除后可以为同一节点重新建立新记录',
    test: function () {
      const node = document.createTextNode('你好');
      translate.node.set(node, { originalText: '旧' });
      translate.node.delete(node);
      const record = { originalText: '新' };
      translate.node.set(node, record);
      return translate.node.get(node) === record;
    }
  }
]);
