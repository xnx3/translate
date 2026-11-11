'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '首个任务保存文档引用并建立一个半秒调度器',
    test: function () {
      const docs = [document.body];
      const timers = [];
      // 只控制时钟依赖，保留 add 内真正创建的调度回调并由后续用例主动推进。
      window.setInterval = function (callback, delay) { timers.push({ callback: callback, delay: delay }); return 71; };
      const result = translate.waitingExecute.add(docs);
      return result === undefined && translate.waitingExecute.queue.length === 1 && translate.waitingExecute.queue[0] === docs && timers.length === 1 && timers[0].delay === 500 && translate.waitingExecute.intervalId === 71;
    }
  },
  {
    remark: '连续入队只建立一个调度器且保持先后顺序',
    test: function () {
      let created = 0;
      window.setInterval = function () { created++; return 72; };
      const first = [document.body];
      const second = [];
      translate.waitingExecute.add(first);
      translate.waitingExecute.add(second);
      return created === 1 && translate.waitingExecute.queue.length === 2 && translate.waitingExecute.queue[0] === first && translate.waitingExecute.queue[1] === second;
    }
  },
  {
    remark: '翻译忙碌时不取出任务直到状态恢复空闲',
    test: function () {
      let tick;
      window.setInterval = function (callback) { tick = callback; return 73; };
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      const docs = [document.body];
      translate.state = 20;
      translate.waitingExecute.add(docs);
      tick();
      const waiting = calls.length === 0 && translate.waitingExecute.queue.length === 1;
      translate.state = 0;
      tick();
      return waiting && calls.length === 1 && calls[0] === docs && translate.waitingExecute.queue.length === 0;
    }
  },
  {
    remark: '空闲时每次调度只按先进先出执行一个任务',
    test: function () {
      let tick;
      window.setInterval = function (callback) { tick = callback; return 74; };
      const first = [document.createElement('div')];
      const second = [document.createElement('span')];
      const calls = [];
      translate.execute = function (docs) { calls.push(docs); };
      translate.state = 0;
      translate.waitingExecute.add(first);
      translate.waitingExecute.add(second);
      tick();
      const afterFirst = calls.length === 1 && calls[0] === first && translate.waitingExecute.queue.length === 1;
      tick();
      return afterFirst && calls.length === 2 && calls[1] === second && translate.waitingExecute.queue.length === 0;
    }
  },
  {
    remark: '执行中的任务变忙时后续调度不得越过忙碌状态',
    test: function () {
      let tick;
      window.setInterval = function (callback) { tick = callback; return 75; };
      let count = 0;
      translate.execute = function () { count++; translate.state = 20; };
      translate.state = 0;
      translate.waitingExecute.add([document.body]);
      translate.waitingExecute.add([]);
      tick();
      tick();
      tick();
      return count === 1 && translate.waitingExecute.queue.length === 1;
    }
  },
  {
    remark: '队列清空后的下一次调度释放定时器并清除标记',
    test: function () {
      let tick;
      const cleared = [];
      window.setInterval = function (callback) { tick = callback; return 76; };
      window.clearInterval = function (id) { cleared.push(id); };
      translate.execute = function () {};
      translate.state = 0;
      translate.waitingExecute.add([]);
      tick();
      tick();
      return cleared.length === 1 && cleared[0] === 76 && translate.waitingExecute.intervalId === null && translate.waitingExecute.queue.length === 0;
    }
  },
  {
    remark: '先前调度器已释放后新任务能够重新建立调度器',
    test: function () {
      const ticks = [];
      window.setInterval = function (callback) { ticks.push(callback); return 80 + ticks.length; };
      window.clearInterval = function () {};
      translate.execute = function () {};
      translate.state = 0;
      translate.waitingExecute.add([]);
      ticks[0]();
      ticks[0]();
      const docs = [document.body];
      translate.waitingExecute.add(docs);
      return ticks.length === 2 && translate.waitingExecute.intervalId === 82 && translate.waitingExecute.queue.length === 1 && translate.waitingExecute.queue[0] === docs;
    }
  }
]);
