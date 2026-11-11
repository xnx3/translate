'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '不存在记录的节点返回 false',
    test: function () {
      return translate.node.find(document.createElement('p')) === false;
    }
  },
  {
    remark: '已记录的文本节点返回 true',
    test: function () {
      const node = document.createTextNode('你好');
      translate.node.set(node, { originalText: '你好' });
      return translate.node.find(node) === true;
    }
  },
  {
    remark: '空对象记录也属于存在的记录',
    test: function () {
      const node = document.createElement('div');
      translate.node.set(node, {});
      return translate.node.find(node) === true;
    }
  },
  {
    remark: '相同内容的两个节点独立判断',
    test: function () {
      const first = document.createTextNode('你好');
      const second = document.createTextNode('你好');
      translate.node.set(first, {});
      return translate.node.find(first) === true && translate.node.find(second) === false;
    }
  },
  {
    remark: '删除记录后由 true 变为 false',
    test: function () {
      const node = document.createElement('div');
      translate.node.set(node, {});
      const before = translate.node.find(node);
      translate.node.delete(node);
      return before === true && translate.node.find(node) === false;
    }
  }
]);
