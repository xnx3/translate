'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '首次启动启用监听配置并返回 undefined',
    test: function () {
      delete translate.temp_listenerStartInterval;
      translate.listener.use = false;
      return translate.listener.start() === undefined && translate.listener.use === true;
    }
  },
  {
    remark: '连续启动保持启用状态不会额外建立观察器',
    test: function () {
      delete translate.temp_listenerStartInterval;
      const observer = translate.listener.observer;
      translate.listener.start();
      translate.listener.start();
      return translate.listener.use === true && translate.listener.observer === observer;
    }
  },
  {
    remark: '兼容旧启动标记时不会再次改写监听状态',
    test: function () {
      translate.temp_listenerStartInterval = 123;
      translate.listener.use = false;
      translate.listener.start();
      return translate.listener.use === false && translate.temp_listenerStartInterval === 123;
    }
  }
]);
