'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '显示面板时创建带 ignore 标记的导出容器和按钮',
    test: function () {
      translate.util.loadMsgJs = function () {};
      const result = translate.offline.showPanel();
      const panel = document.getElementById('translate_export');
      return result === undefined && panel !== null && panel.classList.contains('ignore') &&
        panel.parentNode === document.body && panel.querySelectorAll('button').length === 1;
    }
  },
  {
    remark: '面板按钮实际调用离线导出方法',
    test: function () {
      translate.util.loadMsgJs = function () {};
      let calls = 0;
      translate.offline.export = function () { calls++; };
      translate.offline.showPanel();
      document.querySelector('#translate_export button').click();
      return calls === 1;
    }
  },
  {
    remark: '显示导出面板会准备消息提示组件',
    test: function () {
      let calls = 0;
      translate.util.loadMsgJs = function () { calls++; };
      translate.offline.showPanel();
      return calls === 1;
    }
  },
  {
    remark: '显示面板后停止回收缓存，保留导出所需数据',
    test: function () {
      translate.util.loadMsgJs = function () {};
      let calls = 0;
      translate.recycle = function () { calls++; };
      translate.offline.showPanel();
      translate.recycle();
      return calls === 0;
    }
  }
]);
