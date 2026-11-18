'use strict';

require('../helpers/module')(__filename, [
  { remark: '空字符串返回空主语种及空分类结果', args: [''], expected: { languageName: '', languageArray: {} } },
  { remark: '纯数字不作为需要识别翻译的语种', args: ['12345'], expected: { languageName: '', languageArray: {} } },
  {
    remark: '英文句子识别为英文并保留原片段',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const result = translate.language.recognition('Hello world');
      return result.languageName === 'english' && result.languageArray.english.number === 11 && result.languageArray.english.list[0].text === 'Hello world';
    }
  },
  {
    remark: '简体中文短句识别为简体中文',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const result = translate.language.recognition('你好世界');
      return result.languageName === 'chinese_simplified' && result.languageArray.chinese_simplified.number === 4;
    }
  },
  {
    remark: '日文假名短句识别为日语',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const result = translate.language.recognition('こんにちは');
      return result.languageName === 'japanese' && result.languageArray.japanese.number === 5;
    }
  },
  {
    remark: '韩文音节短句识别为韩语',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const result = translate.language.recognition('안녕하세요');
      return result.languageName === 'korean' && result.languageArray.korean.number === 5;
    }
  },
  {
    remark: '中文夹杂英文时保留两个语种的片段',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const result = translate.language.recognition('你好hello');
      return result.languageName === 'chinese_simplified' && result.languageArray.chinese_simplified.list[0].text === '你好' &&
        result.languageArray.english.list[0].text === 'hello';
    }
  },
  {
    remark: '含有法语特征的文本经过识别策略得到法语',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      return translate.language.recognition('café').languageName === 'french';
    }
  },
  {
    remark: '重复切换简体和英文后，每种语言分段有序且按字符数累计',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      const { languageName, languageArray } = translate.language.recognition('甲cat乙dogs');
      const zh = languageArray.chinese_simplified;
      const en = languageArray.english;
      return languageName === 'chinese_simplified' && Object.keys(languageArray).length === 2 &&
        zh.number === 2 && zh.list.length === 2 && zh.list[0].text === '甲' && zh.list[1].text === '乙' &&
        en.number === 7 && en.list.length === 2 && en.list[0].text === 'cat' && en.list[1].text === 'dogs';
    }
  },
  {
    remark: '含日文假名的汉字句子保留简繁分类和字符数',
    test: function () {
      const { languageName, languageArray } = translate.language.recognition('日本語かな');
      return languageName === 'japanese' && languageArray.chinese_simplified.number === 2 &&
        languageArray.chinese_traditional.number === 1 && languageArray.japanese.number === 2 &&
        languageArray.japanese.list[0].text === 'かな';
    }
  },
  {
    remark: '分解假名的浊点随原字归入日语并保留原来的两个码元',
    test: function () {
      const raw = 'か\u3099';
      const result = translate.language.recognition(raw);
      const ja = result.languageArray.japanese;
      return result.languageName === 'japanese' && ja.number === 2 && ja.list.length === 1 && ja.list[0].text === raw;
    }
  },
  {
    remark: '希伯来文基字和组合元音组成同一片段且顺序不变',
    test: function () {
      const raw = '\u05D1\u05B0';
      const result = translate.language.recognition(raw);
      const he = result.languageArray.hebrew;
      return result.languageName === 'hebrew' && he.number === 2 && he.list.length === 1 && he.list[0].text === raw;
    }
  },
  {
    remark: '阿拉伯文基本区、组合元音和补充区字符共同组成一个片段',
    test: function () {
      const raw = '\u0628\u064E\u0750';
      const result = translate.language.recognition(raw);
      const ar = result.languageArray.arabic;
      return result.languageName === 'arabic' && ar.number === 3 && ar.list.length === 1 && ar.list[0].text === raw;
    }
  }
]);
