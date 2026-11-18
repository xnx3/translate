'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '启动后保存原生 value 描述符并安装一个 setter',
    test: function () {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      translate.listener.input.start();
      const installed = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      return translate.listener.input.originalValueDescriptor.set === descriptor.set && installed.get === descriptor.get && installed.set !== descriptor.set && installed.configurable === descriptor.configurable;
    }
  },
  {
    remark: '真实 input 值改变时保留原生赋值并请求翻译该元素',
    test: function () {
      const input = document.createElement('input');
      const calls = [];
      // execute 仅作观察出口，输入框赋值和原型 setter 均运行真实实现。
      translate.execute = function (docs) { calls.push(docs); };
      translate.listener.input.start();
      input.value = '你好😀';
      return input.value === '你好😀' && calls.length === 1 && calls[0].length === 1 && calls[0][0] === input;
    }
  },
  {
    remark: '重复赋相同字符串不会再次触发翻译',
    test: function () {
      const input = document.createElement('input');
      input.value = '相同';
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.input.start();
      input.value = '相同';
      return count === 0 && input.value === '相同';
    }
  },
  {
    remark: '非空字符串改为空字符串仍触发一次变化',
    test: function () {
      const input = document.createElement('input');
      input.value = '原内容';
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.input.start();
      input.value = '';
      return count === 1 && input.value === '';
    }
  },
  {
    remark: '重复启动保持同一个 setter 且每次修改只通知一次',
    test: function () {
      const input = document.createElement('input');
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.input.start();
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      translate.listener.input.start();
      input.value = '新值';
      return Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set === setter && count === 1;
    }
  },
  {
    remark: '外部改值清除过时翻译记录以便重新扫描',
    test: function () {
      const input = document.createElement('input');
      input.value = 'Hello';
      translate.node.set(input, { lastTranslateRenderTime: Date.now() - 1000 });
      let existsWhenExecute = true;
      translate.execute = function () { existsWhenExecute = translate.node.find(input); };
      translate.listener.input.start();
      input.value = '你好';
      return !translate.node.find(input) && existsWhenExecute === false;
    }
  },
  {
    remark: '刚由翻译渲染的输入框改值保留记录',
    test: function () {
      const now = Date.now();
      Date.now = function () { return now; };
      const input = document.createElement('input');
      const record = { lastTranslateRenderTime: now - 10 };
      translate.node.set(input, record);
      let count = 0;
      translate.execute = function () { count++; };
      translate.listener.input.start();
      input.value = 'Hello';
      return translate.node.get(input) === record && count === 1;
    }
  },
  {
    remark: '没有渲染时间戳的旧记录在外部改值时删除',
    test: function () {
      const input = document.createElement('input');
      translate.node.set(input, { originalText: '旧值' });
      translate.execute = function () {};
      translate.listener.input.start();
      input.value = '新值';
      return !translate.node.find(input);
    }
  },
  {
    remark: '不同输入框的变更各自通知且内容不相互覆盖',
    test: function () {
      const first = document.createElement('input');
      const second = document.createElement('input');
      const nodes = [];
      translate.execute = function (docs) { nodes.push(docs[0]); };
      translate.listener.input.start();
      first.value = '第一个';
      second.value = '第二个';
      return nodes.length === 2 && nodes[0] === first && nodes[1] === second && first.value === '第一个' && second.value === '第二个';
    }
  },
  ...[
    { type: 'text', before: '12', assigned: 12, remark: '数值 12 转成已有文本 12' },
    { type: 'text', before: '', assigned: null, remark: 'null 转成已有空字符串' },
    { type: 'number', before: '', assigned: 'abc', remark: '数字输入框把无效数字转成已有空值' },
    { type: 'range', before: '100', assigned: '150', remark: '范围输入框将越界赋值限制为已有上限' }
  ].map(({ remark, ...input }) => ({
    remark: remark + '时保留历史且不重复请求翻译',
    input,
    test: function ({ type, before, assigned }) {
      const input = document.createElement('input');
      input.type = type;
      input.value = before;
      document.body.append(input);
      const record = { originalText: before, resultText: before };
      translate.node.set(input, record);
      const calls = [];
      translate.execute = docs => calls.push(docs);
      translate.listener.input.start();
      input.value = assigned;
      if (input.value !== before) throw new Error('浏览器的最终 value 与初始值不同');
      if (calls.length) throw new Error('最终 value 不变，仍发起翻译 ' + calls.length + ' 次');
      return translate.node.get(input) === record;
    }
  })),
  {
    remark: '文件输入框拒绝非空赋值时传播原生异常并保留值、历史和通知状态',
    test: function () {
      const input = document.createElement('input');
      input.type = 'file';
      const record = {};
      translate.node.set(input, record);
      let calls = 0, error;
      translate.execute = () => { calls++; };
      translate.listener.input.start();
      try { input.value = 'example.txt'; } catch (caught) { error = caught; }
      return error instanceof DOMException && error.name === 'InvalidStateError' &&
        calls === 0 && input.value === '' && translate.node.get(input) === record;
    }
  }
]);
