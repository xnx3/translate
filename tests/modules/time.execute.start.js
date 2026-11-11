'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '首次启动设置使用标记并返回 undefined',
    test: function () {
      const result = translate.time.execute.start();
      return result === undefined && translate.time.execute.isUse === true && translate.time.execute.data.isUse === true;
    }
  },
  {
    remark: '启动分别注册开始、网络前和渲染完成生命周期回调',
    test: function () {
      const lifecycle = translate.lifecycle.execute;
      const before = [lifecycle.start.length, lifecycle.translateNetworkBefore.length, lifecycle.renderFinish.length];
      translate.time.execute.start();
      return lifecycle.start.length === before[0] + 1 && lifecycle.translateNetworkBefore.length === before[1] + 1 &&
        lifecycle.renderFinish.length === before[2] + 1;
    }
  },
  {
    remark: '重复启动不重复注册同一组生命周期',
    test: function () {
      translate.time.execute.start();
      const lifecycle = translate.lifecycle.execute;
      const before = [lifecycle.start.length, lifecycle.translateNetworkBefore.length, lifecycle.renderFinish.length];
      translate.time.execute.start();
      return lifecycle.start.length === before[0] && lifecycle.translateNetworkBefore.length === before[1] &&
        lifecycle.renderFinish.length === before[2];
    }
  },
  {
    remark: '开始回调为对应 uuid 记录开始时间',
    test: function () {
      const index = translate.lifecycle.execute.start.length;
      translate.time.execute.start();
      const before = Date.now();
      translate.lifecycle.execute.start[index]('time-test', 'english');
      const value = translate.time.execute.data['time-test'].startTime;
      return Number.isFinite(value) && value >= before && value <= Date.now();
    }
  },
  {
    remark: '多个 uuid 的开始记录保持独立',
    test: function () {
      const index = translate.lifecycle.execute.start.length;
      translate.time.execute.start();
      const callback = translate.lifecycle.execute.start[index];
      callback('first', 'english');
      callback('second', 'spanish');
      return translate.time.execute.data.first !== translate.time.execute.data.second &&
        Number.isFinite(translate.time.execute.data.first.startTime) &&
        Number.isFinite(translate.time.execute.data.second.startTime);
    }
  },
  {
    remark: '完整生命周期记录总耗时、网络前时间及参与翻译文本',
    test: function () {
      const lifecycle = translate.lifecycle.execute;
      const indices = [lifecycle.start.length, lifecycle.translateNetworkBefore.length, lifecycle.renderFinish.length];
      translate.time.execute.start();
      const NativeDate = Date;
      let now = 1000;
      window.Date = class extends NativeDate {
        constructor(...args) { super(...(args.length ? args : [now])); }
      };
      translate.nodeQueue['time-test'] = {
        list: { chinese_simplified: { first: { original: '你好' }, second: { original: '世界' } } }
      };
      lifecycle.start[indices[0]]('time-test', 'english');
      now = 1100;
      lifecycle.translateNetworkBefore[indices[1]]({ uuid: 'time-test' });
      now = 1500;
      lifecycle.renderFinish[indices[2]]('time-test', 'english');
      const data = translate.time.execute.data['time-test'];
      return data.startTime === 1000 && data.translateNetworkBeforeTime === 1100 && data.finishTime === 1500 &&
        data.allTime === 500 && data.translateLanguages[0] === 'chinese_simplified' &&
        data.translateTexts.length === 2 && data.translateTexts[0] === '你好' && data.translateTexts[1] === '世界';
    }
  }
]);
