'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '浏览器语种 zh 映射为 chinese_simplified',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: "zh" });
      return translate.util.browserDefaultLanguage() === "chinese_simplified";
    }
  },
  {
    remark: '浏览器语种 zh-CN 映射为 chinese_simplified',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: "zh-CN" });
      return translate.util.browserDefaultLanguage() === "chinese_simplified";
    }
  },
  {
    remark: '浏览器语种 zh-TW 映射为 chinese_traditional',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: "zh-TW" });
      return translate.util.browserDefaultLanguage() === "chinese_traditional";
    }
  },
  {
    remark: '浏览器语种 zh-HK 映射为 chinese_traditional',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: "zh-HK" });
      return translate.util.browserDefaultLanguage() === "chinese_traditional";
    }
  },
  {
    remark: '浏览器语种 en 映射为 english',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: "en" });
      return translate.util.browserDefaultLanguage() === "english";
    }
  },
  {
    remark: '浏览器语种 en-US 映射为 english',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: "en-US" });
      return translate.util.browserDefaultLanguage() === "english";
    }
  },
  {
    remark: '浏览器语种 ja 映射为 japanese',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: "ja" });
      return translate.util.browserDefaultLanguage() === "japanese";
    }
  },
  {
    remark: '浏览器语种 ko 映射为 korean',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: "ko" });
      return translate.util.browserDefaultLanguage() === "korean";
    }
  },
  {
    remark: '浏览器语种 fr 映射为 french',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: "fr" });
      return translate.util.browserDefaultLanguage() === "french";
    }
  },
  {
    remark: '未知浏览器语种 xx-UNKNOWN 返回空字符串',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: "xx-UNKNOWN" });
      return translate.util.browserDefaultLanguage() === "";
    }
  },
  {
    remark: '没有 language 时回退读取 userLanguage',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: '' });
      Object.defineProperty(navigator, 'userLanguage', { configurable: true, value: 'ja' });
      return translate.util.browserDefaultLanguage() === 'japanese';
    }
  },
  {
    remark: '两个浏览器语种字段均为空时返回空字符串',
    test: function () {
      Object.defineProperty(navigator, 'language', { configurable: true, value: '' });
      Object.defineProperty(navigator, 'userLanguage', { configurable: true, value: '' });
      return translate.util.browserDefaultLanguage() === '';
    }
  }
]);
