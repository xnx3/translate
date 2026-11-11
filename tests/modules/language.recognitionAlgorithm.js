'use strict';

require('../helpers/module')(__filename, [
  { remark: '只有英语且没有其他语种计数时保持英语', args: ['hello', { languageName: 'english', languageArray: {} }, { english: 5 }, 5], expected: { languageName: 'english', languageArray: {} } },
  { remark: '日语比例超过百分之八时覆盖原有主语种', args: ['あ', { languageName: 'english', languageArray: {} }, { english: 91, japanese: 9 }, 100], expected: { languageName: 'japanese', languageArray: {} } },
  { remark: '日语比例恰好百分之八时不触发覆盖', args: ['あ', { languageName: 'english', languageArray: {} }, { english: 92, japanese: 8 }, 100], expected: { languageName: 'english', languageArray: {} } },
  { remark: '日语比例低于百分之八时保持原语种', args: ['あ', { languageName: 'english', languageArray: {} }, { english: 93, japanese: 7 }, 100], expected: { languageName: 'english', languageArray: {} } },
  { remark: '原本已是日语时不更改分类', args: ['あ', { languageName: 'japanese', languageArray: {} }, { japanese: 100 }, 100], expected: { languageName: 'japanese', languageArray: {} } },
  { remark: '中文与英语比例超过百分之五时识别为中文', args: ['你好', { languageName: 'english', languageArray: {} }, { english: 100, chinese_simplified: 6 }, 106], expected: { languageName: 'chinese_simplified', languageArray: {} } },
  { remark: '中文与英语比例恰好百分之五时保持英语', args: ['你好', { languageName: 'english', languageArray: {} }, { english: 100, chinese_simplified: 5 }, 105], expected: { languageName: 'english', languageArray: {} } },
  { remark: '中文与英语比例低于百分之五时保持英语', args: ['你好', { languageName: 'english', languageArray: {} }, { english: 100, chinese_simplified: 4 }, 104], expected: { languageName: 'english', languageArray: {} } },
  { remark: '繁体字比例明显高于简体时识别为繁体', args: ['龍', { languageName: 'chinese_simplified', languageArray: {} }, { chinese_simplified: 10, chinese_traditional: 10 }, 20], expected: { languageName: 'chinese_traditional', languageArray: {} } },
  { remark: '繁体字比例明显低于简体时保持简体', args: ['龍', { languageName: 'chinese_simplified', languageArray: {} }, { chinese_simplified: 1000, chinese_traditional: 1 }, 1001], expected: { languageName: 'chinese_simplified', languageArray: {} } },
  {
    remark: '足量罗曼语族字符与英语混合时按法语特征识别',
    test: function () {
      translate.language.local = 'chinese_simplified';
      const result = translate.language.recognitionAlgorithm('café', { languageName: 'english', languageArray: {} }, { english: 3, romance: 1 }, 4);
      return result.languageName === 'french';
    }
  },
  {
    remark: '已明确设置本地法语时优先使用该罗曼语族语种',
    test: function () {
      translate.language.local = 'french';
      const result = translate.language.recognitionAlgorithm('café', { languageName: 'english', languageArray: {} }, { english: 3, romance: 1 }, 4);
      return result.languageName === 'french';
    }
  },
  { remark: '罗曼语族比例等于阈值时仍保持英语', args: ['é', { languageName: 'english', languageArray: {} }, { english: 1000, romance: 8 }, 1008], expected: { languageName: 'english', languageArray: {} } }
]);
