'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '未启动监听时 reset 保留原生描述符且正常返回',
    test: function () {
      const before = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      const result = translate.listener.input.reset();
      const after = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      return result === undefined && before.set === after.set && before.get === after.get && translate.listener.input.originalValueDescriptor === null;
    }
  },
  {
    remark: '启动后重置会完整恢复原生访问器及描述符标记',
    test: function () {
      const before = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      translate.listener.input.start();
      translate.listener.input.reset();
      const after = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      return before.set === after.set && before.get === after.get && before.enumerable === after.enumerable && before.configurable === after.configurable && translate.listener.input.originalValueDescriptor === null;
    }
  },
  {
    remark: '重置后值仍能正常改变但不会再请求翻译',
    test: function () {
      const input = document.createElement('input');
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.input.start();
      translate.listener.input.reset();
      input.value = '你好😀';
      return count === 0 && input.value === '你好😀';
    }
  },
  {
    remark: '重复重置无副作用且后续可以重新启动',
    test: function () {
      const input = document.createElement('input');
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.input.start();
      translate.listener.input.reset();
      translate.listener.input.reset();
      translate.listener.input.start();
      input.value = '重启后的值';
      return count === 1 && translate.listener.input.originalValueDescriptor !== null;
    }
  }
]);
