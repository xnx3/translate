'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "没有翻译Cookie时使用配置的本地语种",
    test: function () {
      translate.localLanguage = 'zh-CN';
      return translate.currentLanguage() === 'zh-CN';
    }
  },
  {
    remark: "从Cookie /zh-CN/en 取得最后一个语种段",
    test: function () {
      document.cookie = "googtrans=/zh-CN/en";
      return translate.currentLanguage() === "en";
    }
  },
  {
    remark: "从Cookie /en/zh-TW 取得最后一个语种段",
    test: function () {
      document.cookie = "googtrans=/en/zh-TW";
      return translate.currentLanguage() === "zh-TW";
    }
  },
  {
    remark: "从Cookie /en/english 取得完整的长语种名称",
    test: function () {
      document.cookie = "googtrans=/en/english";
      return translate.currentLanguage() === "english";
    }
  },
  {
    remark: "从Cookie /a/b/c 取得最后一个语种段",
    test: function () {
      document.cookie = "googtrans=/a/b/c";
      return translate.currentLanguage() === "c";
    }
  },
  {
    remark: "从Cookie /en/ 取得最后一个语种段",
    test: function () {
      document.cookie = "googtrans=/en/";
      return translate.currentLanguage() === "";
    }
  },
  {
    remark: "空翻译Cookie回退到本地配置",
    test: function () {
      translate.localLanguage = 'ja';
      document.cookie = 'googtrans=';
      return translate.currentLanguage() === 'ja';
    }
  }
]);
