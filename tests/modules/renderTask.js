'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '新任务具有空 Map 队列和空节点分组',
    test: function () {
      const task = new translate.renderTask();
      return task.taskQueue instanceof Map && task.taskQueue.size === 0 && Array.isArray(task.nodes) && Object.keys(task.nodes).length === 0;
    }
  },
  {
    remark: '不同实例不共享任务队列或节点分组',
    test: function () {
      const first = new translate.renderTask();
      const second = new translate.renderTask();
      const node = document.createTextNode('你好');
      first.add(node, '你好', 'Hello');
      return first.taskQueue !== second.taskQueue && first.nodes !== second.nodes && second.taskQueue.size === 0 && Object.keys(second.nodes).length === 0;
    }
  },
  {
    remark: '创建实例不修改已有实例的任务或页面文本',
    test: function () {
      const node = document.createTextNode('你好');
      document.body.append(node);
      const first = new translate.renderTask();
      first.add(node, '你好', 'Hello');
      new translate.renderTask();
      return first.taskQueue.get(node).length === 1 && node.nodeValue === '你好';
    }
  }
]);
