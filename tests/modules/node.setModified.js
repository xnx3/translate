'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '首次追加时自动创建 modified 数组',
    test: function () {
      const node = document.createTextNode('你好');
      const record = { originalText: '你好' };
      translate.node.set(node, record);
      const result = translate.node.setModified(node, '第一次修改');
      return result === undefined && Array.isArray(record.modified) && record.modified.length === 1 && record.modified[0] === '第一次修改';
    }
  },
  {
    remark: '已有修改记录按调用顺序追加且保留数组引用',
    test: function () {
      const node = document.createTextNode('你好');
      const modified = ['最早'];
      const record = { modified: modified };
      translate.node.set(node, record);
      translate.node.setModified(node, '第二次');
      translate.node.setModified(node, '第三次');
      return record.modified === modified && JSON.stringify(modified) === JSON.stringify(['最早', '第二次', '第三次']);
    }
  },
  {
    remark: '空字符串备注仍作为一条修改记录保存',
    test: function () {
      const node = document.createElement('div');
      translate.node.set(node, {});
      translate.node.setModified(node, '');
      return translate.node.get(node).modified.length === 1 && translate.node.get(node).modified[0] === '';
    }
  },
  {
    remark: '中文换行和 emoji 备注保持完整',
    test: function () {
      const node = document.createTextNode('');
      translate.node.set(node, {});
      translate.node.setModified(node, '中文\n😀');
      return translate.node.get(node).modified[0] === '中文\n😀';
    }
  },
  {
    remark: '未保存记录的节点不会被意外新建记录',
    test: function () {
      const node = document.createTextNode('未记录');
      const result = translate.node.setModified(node, '修改');
      return result === undefined && translate.node.get(node) === undefined;
    }
  },
  {
    remark: '追加修改只影响目标节点且保留其他历史字段',
    test: function () {
      const first = document.createTextNode('一');
      const second = document.createTextNode('二');
      translate.node.set(first, { resultText: 'one' });
      translate.node.set(second, { modified: ['原记录'] });
      translate.node.setModified(first, '更新');
      return translate.node.get(first).resultText === 'one' && translate.node.get(second).modified.length === 1;
    }
  }
]);
