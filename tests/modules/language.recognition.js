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
  }
]);
