'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '默认扩展钩子返回 undefined 且不修改传入的渲染任务',
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, '你好', 'Hello');
      const queue = task.taskQueue;
      const tasks = queue.get(node);
      const result = translate.listener.renderTaskFinish(task);
      return result === undefined && task.taskQueue === queue && queue.get(node) === tasks && tasks.length === 1 && node.nodeValue === '你好';
    }
  }
]);
