'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "没有目标语种且省略参数",
    test: function () {
      translate.to = "";
      translate.language.local = "chinese_simplified";
      translate.language.translateLocal = false;
      translate.node.data.clear();
      return translate.isTranslateExecute() === false;
    }
  },
  {
    remark: "当前语种与本地相同",
    test: function () {
      translate.to = "chinese_simplified";
      translate.language.local = "chinese_simplified";
      translate.language.translateLocal = false;
      translate.node.data.clear();
      return translate.isTranslateExecute() === false;
    }
  },
  {
    remark: "当前语种与本地不同",
    test: function () {
      translate.to = "english";
      translate.language.local = "chinese_simplified";
      translate.language.translateLocal = false;
      translate.node.data.clear();
      return translate.isTranslateExecute() === true;
    }
  },
  {
    remark: "显式检查本地语种",
    test: function () {
      translate.to = "english";
      translate.language.local = "chinese_simplified";
      translate.language.translateLocal = false;
      translate.node.data.clear();
      return translate.isTranslateExecute('chinese_simplified') === false;
    }
  },
  {
    remark: "显式检查另一语种",
    test: function () {
      translate.to = "";
      translate.language.local = "chinese_simplified";
      translate.language.translateLocal = false;
      translate.node.data.clear();
      return translate.isTranslateExecute('spanish') === true;
    }
  },
  {
    remark: "强制翻译本地语种",
    test: function () {
      translate.to = "";
      translate.language.local = "chinese_simplified";
      translate.language.translateLocal = true;
      translate.node.data.clear();
      return translate.isTranslateExecute('chinese_simplified') === true;
    }
  },
  {
    remark: "空字符串参数使用当前目标",
    test: function () {
      translate.to = "english";
      translate.language.local = "chinese_simplified";
      translate.language.translateLocal = false;
      translate.node.data.clear();
      return translate.isTranslateExecute('') === true;
    }
  },
  {
    remark: "undefined参数使用当前目标",
    test: function () {
      translate.to = "english";
      translate.language.local = "chinese_simplified";
      translate.language.translateLocal = false;
      translate.node.data.clear();
      return translate.isTranslateExecute(undefined) === true;
    }
  },
  {
    remark: "null参数使用当前目标",
    test: function () {
      translate.to = "english";
      translate.language.local = "chinese_simplified";
      translate.language.translateLocal = false;
      translate.node.data.clear();
      return translate.isTranslateExecute(null) === true;
    }
  },
  {
    remark: "非字符串参数使用当前目标",
    test: function () {
      translate.to = "english";
      translate.language.local = "chinese_simplified";
      translate.language.translateLocal = false;
      translate.node.data.clear();
      return translate.isTranslateExecute(0) === true;
    }
  },
  {
    remark: "显式检查不依赖历史节点数量",
    test: function () {
      translate.to = "";
      translate.language.local = "chinese_simplified";
      translate.language.translateLocal = false;
      translate.node.data.clear();
      return translate.isTranslateExecute('english') === true;
    }
  }
]);
