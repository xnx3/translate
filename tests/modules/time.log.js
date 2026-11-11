'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '默认关闭时不记录耗时也不输出',
    test: function () {
      translate.time.use = false;
      let calls = 0;
      translate.log = function () { calls++; };
      const before = translate.time.temp_lasttime;
      return translate.time.log('closed') === undefined && calls === 0 && translate.time.temp_lasttime === before;
    }
  },
  {
    remark: '启用后首次记录间隔为零并包含中文备注',
    test: function () {
      translate.time.use = true;
      translate.time.printTime = 0;
      delete translate.time.temp_lasttime;
      const messages = [];
      translate.log = function (value) { messages.push(String(value)); };
      translate.time.log('测试😀');
      return messages.some(message => message.includes(' 0 -> 测试😀')) && Number.isFinite(translate.time.temp_lasttime);
    }
  },
  {
    remark: '已知前次时间时按当前时刻减前次时刻计算间隔',
    test: function () {
      translate.time.use = true;
      translate.time.printTime = 0;
      translate.time.temp_lasttime = 1000;
      const NativeDate = Date;
      window.Date = class extends NativeDate { constructor(...args) { super(...(args.length ? args : [1250])); } };
      const messages = [];
      translate.log = function (value) { messages.push(String(value)); };
      translate.time.log('elapsed');
      return messages.some(message => message.includes(' 250 -> elapsed')) && translate.time.temp_lasttime === 1250;
    }
  },
  {
    remark: '小于输出阈值时不打印，但更新时间基准',
    test: function () {
      translate.time.use = true;
      translate.time.printTime = 300;
      translate.time.temp_lasttime = 1000;
      const NativeDate = Date;
      window.Date = class extends NativeDate { constructor(...args) { super(...(args.length ? args : [1250])); } };
      let calls = 0;
      translate.log = function () { calls++; };
      translate.time.log('suppressed');
      return calls === 0 && translate.time.temp_lasttime === 1250;
    }
  },
  {
    remark: '间隔恰好等于阈值时仍打印',
    test: function () {
      translate.time.use = true;
      translate.time.printTime = 250;
      translate.time.temp_lasttime = 1000;
      const NativeDate = Date;
      window.Date = class extends NativeDate { constructor(...args) { super(...(args.length ? args : [1250])); } };
      const messages = [];
      translate.log = function (value) { messages.push(String(value)); };
      translate.time.log('boundary');
      return messages.some(message => message.includes(' 250 -> boundary'));
    }
  },
  {
    remark: '省略备注时方法仍返回 undefined 而不抛异常',
    test: function () {
      translate.time.use = true;
      translate.time.printTime = 0;
      delete translate.time.temp_lasttime;
      const messages = [];
      translate.log = function (value) { messages.push(String(value)); };
      return translate.time.log() === undefined && messages.some(message => message.includes(' -> undefined'));
    }
  }
]);
