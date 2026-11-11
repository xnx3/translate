'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '旧 set 方法提示改用 append 且不覆盖已有术语',
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      let message;
      window.alert = function (value) { message = value; };
      const result = translate.nomenclature.set({ ignored: true });
      return result === undefined && message.includes('append') &&
        translate.nomenclature.get().chinese_simplified.english['你好'] === 'Hello';
    }
  },
  {
    remark: '旧方法省略参数时仍给出迁移提示而不阻塞测试',
    test: function () {
      let calls = 0;
      window.alert = function (value) { if (value.includes('append')) calls++; };
      return translate.nomenclature.set() === undefined && calls === 1;
    }
  },
  {
    remark: '旧方法传入 null 时保持仅提示行为',
    test: function () {
      let calls = 0;
      window.alert = function () { calls++; };
      return translate.nomenclature.set(null) === undefined && calls === 1;
    }
  }
]);
