'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "旧接口提示停用并提供迁移说明",
    test: function () {
      const messages = [];
      translate.log = item => messages.push(item);
      return translate.execute_v1() === undefined && messages.length === 2 && messages[1].includes('2022') && messages[1].includes('V3');
    }
  },
  {
    remark: "旧接口不触发当前翻译或改变目标语种",
    test: function () {
      let called = false;
      translate.execute = () => { called = true; };
      translate.to = 'english';
      translate.execute_v1();
      return !called && translate.to === 'english';
    }
  }
]);
