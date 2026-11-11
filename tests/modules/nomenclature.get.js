'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '未设置术语时返回空术语表',
    test: function () {
      const data = translate.nomenclature.get();
      return data !== null && typeof data === 'object' && Object.keys(data).length === 0;
    }
  },
  {
    remark: '返回已追加的来源、目标和术语映射',
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      return translate.nomenclature.get().chinese_simplified.english['你好'] === 'Hello';
    }
  },
  {
    remark: '获取全部目标语种而不是仅当前目标语种',
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      translate.nomenclature.append('chinese_simplified', 'spanish', '你好=Hola');
      translate.to = 'english';
      const data = translate.nomenclature.get();
      return data.chinese_simplified.english['你好'] === 'Hello' &&
        data.chinese_simplified.spanish['你好'] === 'Hola';
    }
  },
  {
    remark: '后续追加后再次 get 能看到新值',
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', '你好=First');
      translate.nomenclature.get();
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Last');
      return translate.nomenclature.get().chinese_simplified.english['你好'] === 'Last';
    }
  },
  {
    remark: 'get 不修改术语表或执行替换',
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const before = translate.nomenclature.data;
      const result = translate.nomenclature.get();
      return translate.nomenclature.data === before && result === before && result.chinese_simplified.english['你好'] === 'Hello';
    }
  }
]);
