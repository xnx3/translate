'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "兼容入口验证省略参数",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.to = '';
      translate.language.translateLocal = false;
      return translate.isTranslate() === false;
    }
  },
  {
    remark: "兼容入口验证英文",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.to = 'english';
      translate.language.translateLocal = false;
      return translate.isTranslate('english') === true;
    }
  },
  {
    remark: "兼容入口验证本地语种",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.to = 'english';
      translate.language.translateLocal = false;
      return translate.isTranslate('chinese_simplified') === false;
    }
  },
  {
    remark: "兼容入口验证空参数",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.to = 'english';
      translate.language.translateLocal = false;
      return translate.isTranslate('') === true;
    }
  },
  {
    remark: "兼容入口验证null回退",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.to = 'english';
      translate.language.translateLocal = false;
      return translate.isTranslate(null) === true;
    }
  },
  {
    remark: "兼容入口验证强制本地语种",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.to = 'english';
      translate.language.translateLocal = true;
      return translate.isTranslate('chinese_simplified') === true;
    }
  },
  {
    remark: "兼容入口原样委托参数和返回结果",
    test: function () {
      const token = {};
      let observed;
      translate.isTranslateExecute = value => { observed = value; return false; };
      return translate.isTranslate(token) === false && observed === token;
    }
  }
]);
