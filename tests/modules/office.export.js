'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '旧导出接口仅给出改用 offline.export 的提示',
    test: function () {
      let message;
      console.log = function (value) { message = value; };
      const result = translate.office.export();
      return result === undefined && message.includes('translate.offline.export');
    }
  },
  {
    remark: '旧导出接口不会触发真实下载或调用新导出接口',
    test: function () {
      let called = false;
      translate.offline.export = function () { called = true; };
      translate.office.export();
      return called === false && document.querySelector('a[download]') === null;
    }
  }
]);
