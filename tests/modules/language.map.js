'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '首次调用从语言体系建立可查询的 Map',
    test: function () {
      translate.language.map_data = null;
      const result = translate.language.map();
      return result instanceof Map && result.get('english').system === 'latin' && result.get('japanese').system === 'chinese';
    }
  },
  {
    remark: '连续查询复用同一个已初始化 Map',
    test: function () {
      translate.language.map_data = null;
      const first = translate.language.map();
      return translate.language.map() === first;
    }
  },
  {
    remark: '显式提供已有缓存时直接返回该缓存',
    test: function () {
      const existing = new Map([['custom', { system: 'test' }]]);
      translate.language.map_data = existing;
      return translate.language.map() === existing && translate.language.map().get('custom').system === 'test';
    }
  },
  {
    remark: '清空缓存后重新根据新的体系配置生成结果',
    test: function () {
      translate.language.map();
      translate.language.systems = { custom: { languages: ['newLanguage'] } };
      translate.language.map_data = null;
      const result = translate.language.map();
      return result.size === 1 && result.get('newLanguage').system === 'custom';
    }
  }
]);
