'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "普通中文原文和英文译文双向记录",
    test: function () {
      const result = translate.history.translateText.add("你好", "Hello");
      return result === undefined && translate.history.translateText.originalMap.get("你好") === "Hello" &&
        translate.history.translateText.resultMap.get("Hello") === "你好";
    }
  },
  {
    remark: "空原文作为有效字符串键保存",
    test: function () {
      const result = translate.history.translateText.add("", "Hello");
      return result === undefined && translate.history.translateText.originalMap.get("") === "Hello" &&
        translate.history.translateText.resultMap.get("Hello") === "";
    }
  },
  {
    remark: "空译文作为有效字符串键保存",
    test: function () {
      const result = translate.history.translateText.add("你好", "");
      return result === undefined && translate.history.translateText.originalMap.get("你好") === "" &&
        translate.history.translateText.resultMap.get("") === "你好";
    }
  },
  {
    remark: "原文和译文都为空时仍保存记录",
    test: function () {
      const result = translate.history.translateText.add("", "");
      return result === undefined && translate.history.translateText.originalMap.get("") === "" &&
        translate.history.translateText.resultMap.get("") === "";
    }
  },
  {
    remark: "相同原文译文表示不翻译记录",
    test: function () {
      const result = translate.history.translateText.add("same", "same");
      return result === undefined && translate.history.translateText.originalMap.get("same") === "same" &&
        translate.history.translateText.resultMap.get("same") === "same";
    }
  },
  {
    remark: "Unicode 和 emoji 保持完整",
    test: function () {
      const result = translate.history.translateText.add("中文😀", "English😀");
      return result === undefined && translate.history.translateText.originalMap.get("中文😀") === "English😀" &&
        translate.history.translateText.resultMap.get("English😀") === "中文😀";
    }
  },
  {
    remark: "前后空格和换行不被裁剪",
    test: function () {
      const result = translate.history.translateText.add(" A\n原文 ", " B\n译文 ");
      return result === undefined && translate.history.translateText.originalMap.get(" A\n原文 ") === " B\n译文 " &&
        translate.history.translateText.resultMap.get(" B\n译文 ") === " A\n原文 ";
    }
  },
  {
    remark: "原型属性名按 Map 普通键保存",
    test: function () {
      const result = translate.history.translateText.add("__proto__", "constructor");
      return result === undefined && translate.history.translateText.originalMap.get("__proto__") === "constructor" &&
        translate.history.translateText.resultMap.get("constructor") === "__proto__";
    }
  },
  {
    remark: "同一原文更新译文后正向查询返回新译文",
    test: function () {
      translate.history.translateText.add('你好', 'First');
      translate.history.translateText.add('你好', 'Last');
      return translate.history.translateText.originalMap.get('你好') === 'Last' &&
        translate.history.translateText.resultMap.get('Last') === '你好';
    }
  },
  {
    remark: "多个原文记录互相独立",
    test: function () {
      translate.history.translateText.add('你好', 'Hello');
      translate.history.translateText.add('世界', 'World');
      return translate.history.translateText.originalMap.get('你好') === 'Hello' &&
        translate.history.translateText.originalMap.get('世界') === 'World';
    }
  }
]);
