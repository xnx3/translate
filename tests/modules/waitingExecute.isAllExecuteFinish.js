'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '唯一成功请求完成后发布原参数并恢复空闲及增加完成次数',
    test: function () {
      const texts = ['你好', '世界'];
      const nodes = [document.body];
      translate.request.data.u = { list: { chinese_simplified: { english: { texts: texts, nodes: nodes } } } };
      translate.translateRequest.u = { chinese_simplified: { executeFinish: 1 } };
      translate.state = 20;
      translate.executeNumber = 7;
      let after;
      let finish;
      let api;
      translate.lifecycle.execute.translateNetworkAfter = [function (data) { after = data; }];
      translate.lifecycle.execute.renderFinish = [function () { finish = Array.from(arguments); }];
      translate.listener.execute.renderFinishByApi = [function () { api = Array.from(arguments); }];
      const result = translate.waitingExecute.isAllExecuteFinish('u', 'chinese_simplified', 'english', 1, '成功');
      return result === undefined && translate.state === 0 && translate.executeNumber === 8 && after.uuid === 'u' && after.from === 'chinese_simplified' && after.to === 'english' && after.texts === texts && after.nodes === nodes && after.result === 1 && after.info === '成功' && JSON.stringify(finish) === '["u","english"]' && JSON.stringify(api) === '["u","chinese_simplified","english"]';
    }
  },
  {
    remark: '请求失败也发布失败原因并完成本轮状态收尾',
    test: function () {
      translate.request.data.u = { list: { english: { japanese: { texts: [], nodes: [] } } } };
      translate.translateRequest.u = { english: { executeFinish: 1 } };
      translate.state = 20;
      translate.executeNumber = 0;
      let after;
      let finished = 0;
      translate.lifecycle.execute.translateNetworkAfter = [function (data) { after = data; }];
      translate.lifecycle.execute.renderFinish = [function () { finished++; }];
      translate.waitingExecute.isAllExecuteFinish('u', 'english', 'japanese', 0, '网络不可用😀');
      return after.result === 0 && after.info === '网络不可用😀' && after.texts.length === 0 && after.nodes.length === 0 && translate.state === 0 && translate.executeNumber === 1 && finished === 1;
    }
  },
  {
    remark: '其他语种仍未完成时只发布当前请求结果而不结束整轮',
    test: function () {
      translate.request.data.u = { list: { english: { japanese: { texts: ['Hello'], nodes: [] } } } };
      translate.translateRequest.u = { english: { executeFinish: 1 }, chinese_simplified: { executeFinish: 0 } };
      translate.state = 20;
      translate.executeNumber = 3;
      let after = 0;
      let all = 0;
      let api = 0;
      translate.lifecycle.execute.translateNetworkAfter = [function () { after++; }];
      translate.lifecycle.execute.renderFinish = [function () { all++; }];
      translate.listener.execute.renderFinishByApi = [function () { api++; }];
      translate.waitingExecute.isAllExecuteFinish('u', 'english', 'japanese', 1);
      return after === 1 && api === 1 && all === 0 && translate.state === 20 && translate.executeNumber === 3;
    }
  },
  {
    remark: '多个语种全部完成时只结束本轮一次并保留请求记录',
    test: function () {
      const requests = { english: { executeFinish: 1 }, chinese_simplified: { executeFinish: 1 }, russian: { executeFinish: 1 } };
      translate.request.data.u = { list: { english: { japanese: { texts: ['Hello'], nodes: [] } } } };
      translate.translateRequest.u = requests;
      translate.executeNumber = 4;
      let count = 0;
      translate.lifecycle.execute.renderFinish = [function () { count++; }];
      translate.waitingExecute.isAllExecuteFinish('u', 'english', 'japanese', 1);
      return count === 1 && translate.executeNumber === 5 && translate.translateRequest.u === requests && requests.english.executeFinish === 1;
    }
  },
  {
    remark: '分发顺序为当前 API 完成网络响应后钩子整轮完成钩子',
    test: function () {
      translate.request.data.u = { list: { english: { japanese: { texts: [], nodes: [] } } } };
      translate.translateRequest.u = { english: { executeFinish: 1 } };
      const order = [];
      translate.listener.execute.renderFinishByApi = [function () { order.push('api'); }];
      translate.lifecycle.execute.translateNetworkAfter = [function () { order.push('after'); }];
      translate.lifecycle.execute.renderFinish = [function () { order.push('all'); }];
      translate.waitingExecute.isAllExecuteFinish('u', 'english', 'japanese', 1);
      return JSON.stringify(order) === '["api","after","all"]';
    }
  },
  {
    remark: '完成判定不把原型上附带的未完成条目当成真实请求',
    test: function () {
      translate.request.data.u = { list: { english: { japanese: { texts: [], nodes: [] } } } };
      const requests = Object.create({ inherited: { executeFinish: 0 } });
      requests.english = { executeFinish: 1 };
      translate.translateRequest.u = requests;
      translate.state = 20;
      let count = 0;
      translate.lifecycle.execute.renderFinish = [function () { count++; }];
      translate.waitingExecute.isAllExecuteFinish('u', 'english', 'japanese', 1);
      return count === 1 && translate.state === 0;
    }
  },
  {
    remark: '省略可选 info 时网络响应钩子保持 undefined',
    test: function () {
      translate.request.data.u = { list: { english: { japanese: { texts: [], nodes: [] } } } };
      translate.translateRequest.u = { english: { executeFinish: 1 } };
      let received;
      translate.lifecycle.execute.translateNetworkAfter = [function (data) { received = data; }];
      translate.lifecycle.execute.renderFinish = [];
      translate.waitingExecute.isAllExecuteFinish('u', 'english', 'japanese', 1);
      return Object.hasOwn(received, 'info') && received.info === undefined;
    }
  }
]);
