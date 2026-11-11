'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '旧面板接口给出改用 offline.showPanel 的提示',
    test: function () {
      let message;
      console.log = function (value) { message = value; };
      const result = translate.office.showPanel();
      return result === undefined && message.includes('translate.offline.showPanel');
    }
  },
  {
    remark: '旧面板接口不创建导出面板也不调用新接口',
    test: function () {
      let called = false;
      translate.offline.showPanel = function () { called = true; };
      translate.office.showPanel();
      return called === false && document.getElementById('translate_export') === null;
    }
  }
]);
