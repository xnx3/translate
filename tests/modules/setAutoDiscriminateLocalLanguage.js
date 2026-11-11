'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "初始未启用时启用自动语种判断",
    test: function () {
      translate.autoDiscriminateLocalLanguage = false;
      translate.setAutoDiscriminateLocalLanguage();
      return translate.autoDiscriminateLocalLanguage === true;
    }
  },
  {
    remark: "重复启用仍保持布尔 true",
    test: function () {
      translate.setAutoDiscriminateLocalLanguage();
      translate.setAutoDiscriminateLocalLanguage();
      return translate.autoDiscriminateLocalLanguage === true;
    }
  },
  {
    remark: "启用时保留显式配置的本地和目标语种",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.to = 'english';
      const result = translate.setAutoDiscriminateLocalLanguage();
      return result === undefined && translate.language.local === 'chinese_simplified' && translate.to === 'english';
    }
  }
]);
