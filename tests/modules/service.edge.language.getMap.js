'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '标准语种映射到 Edge 所要求的服务标识',
    test: function () {
      const map = translate.service.edge.language.getMap();
      return map.english === 'en' && map.spanish === 'es' && map.japanese === 'ja' &&
        map.chinese_simplified === 'zh-CHS' && map.chinese_traditional === 'zh-CHT';
    }
  },
  {
    remark: '映射包含语种表中的每一条有效声明',
    test: function () {
      const map = translate.service.edge.language.getMap();
      const list = translate.service.edge.language.json;
      return list.length > 0 && list.every(item => map[item.id] === item.serviceId);
    }
  },
  {
    remark: '重复读取复用已建立的映射对象',
    test: function () {
      const first = translate.service.edge.language.getMap();
      return translate.service.edge.language.getMap() === first;
    }
  },
  {
    remark: '不存在的语种不产生伪造服务标识',
    test: function () {
      return translate.service.edge.language.getMap()['not-a-language'] === undefined;
    }
  },
  {
    remark: '首次构建支持自定义语种表而不修改原始记录',
    test: function () {
      delete translate.service.edge.language.map;
      const input = [{ id: 'custom', name: '自定义', serviceId: 'xx' }];
      translate.service.edge.language.json = input;
      const map = translate.service.edge.language.getMap();
      return map.custom === 'xx' && input.length === 1 && input[0].name === '自定义';
    }
  },
  {
    remark: '空语种表构建为空映射',
    test: function () {
      delete translate.service.edge.language.map;
      translate.service.edge.language.json = [];
      return Object.keys(translate.service.edge.language.getMap()).length === 0;
    }
  }
]);
