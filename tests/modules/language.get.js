'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '空字符串没有需要翻译的语种片段',
    test: function () {
      return Object.keys(translate.language.get('')).length === 0;
    }
  },
  {
    remark: '整句英文保留单词间的空格',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      const result = translate.language.get('Hello world');
      return result.english.length === 1 && result.english[0].text === 'Hello world';
    }
  },
  {
    remark: '连续简体中文属于同一个片段',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const result = translate.language.get('你好世界');
      return result.chinese_simplified.length === 1 && result.chinese_simplified[0].text === '你好世界';
    }
  },
  {
    remark: '日文假名属于日语片段',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const result = translate.language.get('こんにちは');
      return result.japanese.length === 1 && result.japanese[0].text === 'こんにちは';
    }
  },
  {
    remark: '韩文音节属于韩语片段',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const result = translate.language.get('안녕하세요');
      return result.korean.length === 1 && result.korean[0].text === '안녕하세요';
    }
  },
  {
    remark: '中文与英文相邻时分别保留文本及所需分隔信息',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      const result = translate.language.get('你好world');
      return result.chinese_simplified[0].text === '你好' && result.chinese_simplified[0].afterText === ' ' &&
        result.english[0].text === 'world';
    }
  },
  {
    remark: '纯数字不单独产生待翻译语种',
    test: function () {
      return Object.keys(translate.language.get('12345')).length === 0;
    }
  },
  {
    remark: '纯标点不单独产生待翻译语种',
    test: function () {
      return Object.keys(translate.language.get('，。！？')).length === 0;
    }
  },
  {
    remark: '英文中的标点和数字保留在同一语义片段',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const result = translate.language.get('Hello, world 123!');
      return result.english.length === 1 && result.english[0].text === 'Hello, world 123!';
    }
  }
]);
