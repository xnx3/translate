'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '未创建观察器时重置恢复未启动状态',
    test: function () {
      translate.listener.observer = undefined;
      translate.listener.isStart = true;
      return translate.listener.reset() === undefined && translate.listener.isStart === false;
    }
  },
  {
    remark: '重置真实 MutationObserver 后不再收到 DOM 变化',
    test: async function () {
      const element = document.createElement('div');
      document.body.append(element);
      let notifications = 0;
      translate.listener.observer = new MutationObserver(function () { notifications++; });
      translate.listener.observer.observe(element, { childList: true });
      translate.listener.isStart = true;
      translate.listener.reset();
      element.append(document.createTextNode('变化'));
      await new Promise(resolve => setTimeout(resolve, 20));
      return notifications === 0 && translate.listener.isStart === false;
    }
  },
  {
    remark: '同时还原 input setter 监听',
    test: function () {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      const input = document.createElement('input');
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.input.start();
      translate.listener.reset();
      input.value = '重置后';
      return count === 0 && translate.listener.input.originalValueDescriptor === null && Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set === setter;
    }
  },
  {
    remark: '观察器为 null 或重复重置均正常结束',
    test: function () {
      translate.listener.observer = null;
      translate.listener.reset();
      return translate.listener.reset() === undefined && translate.listener.isStart === false;
    }
  }
]);
