'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '失败回调仅通知一次，释放待译节点使重试可行；保留网页另行建立的记录',
    test: function () {
      const uuid = 'retry-group';
      translate.to = 'english';
      const nodes = ['甲', '乙'].map(text => document.createTextNode(text));
      const group = {to: translate.to, nodes, words: nodes.map(node => ({text: node.data, weight: 0}))};
      translate.nodeQueue[uuid] = {groups: [group]};
      translate.request.data[uuid] = {list: {}, groupBatch: {pending: 1, resetCount: translate.group._resetCount}};
      nodes.forEach(node => translate.node.set(node, {originalText: node.data}));
      let notifications = 0;
      translate.lifecycle.execute.translateNetworkAfter.push(() => { notifications++; });
      const replacement = {originalText: '新内容'};
      translate.group._requestGroups = function (id, groups, success, failure) {
        translate.node.set(nodes[1], replacement);
        failure({status: 503, requestURL: '/translate.json'});
        failure({status: 503, requestURL: '/translate.json'});
      };
      translate.group._executeGroups(uuid, [group]);
      const batch = translate.request.data[uuid].groupBatch;
      return notifications === 1 && batch.pending === 0 && batch.task.executeFinish === 1 &&
        !Object.hasOwn(batch.task, 'nodes') && translate.node.get(nodes[0]) == null &&
        translate.node.get(nodes[1]) === replacement;
    }
  }
]);
