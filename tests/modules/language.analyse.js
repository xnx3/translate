'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '第一个英文字符建立片段并返回实际存储语种',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      const result = translate.language.analyse('english', [], [], [], 'a');
      return result.storage_language === 'english' && result.langStrs.english[0].text === 'a' &&
        result.langStrs.english[0].beforeText === '' && result.langStrs.english[0].afterText === '';
    }
  },
  {
    remark: '相邻同语种字符追加到已有片段',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const data = { english: [{ text: 'ab', beforeText: '', afterText: '' }] };
      const result = translate.language.analyse('english', data, { storage_language: 'english', language: 'english', charstr: 'b' }, {}, 'c');
      return result.langStrs === data && data.english.length === 1 && data.english[0].text === 'abc';
    }
  },
  {
    remark: '空格连接符追加到前一个英文片段',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const data = { english: [{ text: 'hello', beforeText: '', afterText: '' }] };
      const result = translate.language.analyse('specialCharacter', data, { storage_language: 'english', language: 'english', charstr: 'o' }, {}, ' ');
      return result.storage_language === 'english' && data.english[0].text === 'hello ';
    }
  },
  {
    remark: '数字连接符追加到前一个中文片段',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      const data = { chinese_simplified: [{ text: '第', beforeText: '', afterText: '' }] };
      const result = translate.language.analyse('number', data, { storage_language: 'chinese_simplified', language: 'chinese_simplified', charstr: '第' }, {}, '1');
      return result.storage_language === 'chinese_simplified' && data.chinese_simplified[0].text === '第1';
    }
  },
  {
    remark: '中文后紧邻英文时为中文片段记录后置空格',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      const data = { chinese_simplified: [{ text: '你', beforeText: '', afterText: '' }] };
      const result = translate.language.analyse('english', data, { storage_language: 'chinese_simplified', language: 'chinese_simplified', charstr: '你' }, {}, 'a');
      return result.storage_language === 'english' && data.chinese_simplified[0].afterText === ' ' && data.english[0].text === 'a';
    }
  },
  {
    remark: '英文后紧邻中文时为中文片段记录前置空格',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      const data = { english: [{ text: 'a', beforeText: '', afterText: '' }] };
      translate.language.analyse('chinese_simplified', data, { storage_language: 'english', language: 'english', charstr: 'a' }, {}, '你');
      return data.chinese_simplified[0].text === '你' && data.chinese_simplified[0].beforeText === ' ';
    }
  }
]);
