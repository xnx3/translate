'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '空队列返回 null 且不创建新元素',
    test: function () {
      translate.waitingExecute.queue = [];
      return translate.waitingExecute.get() === null && translate.waitingExecute.queue.length === 0;
    }
  },
  {
    remark: '取出唯一文档数组时保留引用并清空队列',
    test: function () {
      const docs = [document.body];
      translate.waitingExecute.queue = [docs];
      return translate.waitingExecute.get() === docs && translate.waitingExecute.queue.length === 0;
    }
  },
  {
    remark: '多个任务按先进先出顺序取出且每次只移除一个',
    test: function () {
      const first = [document.createElement('div')];
      const second = [document.createElement('span')];
      const third = [];
      translate.waitingExecute.queue = [first, second, third];
      const one = translate.waitingExecute.get();
      const afterOne = translate.waitingExecute.queue.length;
      const two = translate.waitingExecute.get();
      const three = translate.waitingExecute.get();
      return one === first && afterOne === 2 && two === second && three === third && translate.waitingExecute.queue.length === 0;
    }
  },
  {
    remark: '空文档数组是有效队列元素而不被当成空队列',
    test: function () {
      const docs = [];
      translate.waitingExecute.queue = [docs];
      return translate.waitingExecute.get() === docs;
    }
  },
  {
    remark: '取队列不会修改其中的文档数组内容',
    test: function () {
      const node = document.createElement('div');
      const docs = [node, document.body];
      translate.waitingExecute.queue = [docs];
      translate.waitingExecute.get();
      return docs.length === 2 && docs[0] === node && docs[1] === document.body;
    }
  }
]);
