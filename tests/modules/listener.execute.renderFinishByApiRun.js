'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '未注册回调时正常返回 undefined',
    test: function () {
      translate.listener.execute.renderFinishByApi = [];
      return translate.listener.execute.renderFinishByApiRun('uuid-😀', 'chinese_simplified', 'english') === undefined;
    }
  },
  {
    remark: '回调收到完整标识和语种且实参数量正确',
    test: function () {
      let received;
      translate.listener.execute.renderFinishByApi = [function () { received = Array.from(arguments); }];
      translate.listener.execute.renderFinishByApiRun('uuid-😀', 'chinese_simplified', 'english');
      return JSON.stringify(received) === JSON.stringify(['uuid-😀', 'chinese_simplified', 'english']);
    }
  },
  {
    remark: '多个回调按注册先后顺序全部执行',
    test: function () {
      const order = [];
      translate.listener.execute.renderFinishByApi = [function () { order.push(1); }, function () { order.push(2); }, function () { order.push(3); }];
      translate.listener.execute.renderFinishByApiRun('uuid-😀', 'chinese_simplified', 'english');
      return JSON.stringify(order) === '[1,2,3]';
    }
  },
  {
    remark: '空字符串标识和语种原样传递',
    test: function () {
      let received;
      translate.listener.execute.renderFinishByApi = [function () { received = Array.from(arguments); }];
      translate.listener.execute.renderFinishByApiRun('', '', '');
      return received.length === 3 && received.every(value => value === '');
    }
  },
  {
    remark: '前一个回调抛错不妨碍后一个回调并记录原异常',
    test: function () {
      const failure = new Error('有意验证回调隔离');
      const logged = [];
      let count = 0;
      translate.log = function (value) { logged.push(value); };
      translate.listener.execute.renderFinishByApi = [function () { throw failure; }, function () { count++; }];
      translate.listener.execute.renderFinishByApiRun('uuid-😀', 'chinese_simplified', 'english');
      return count === 1 && logged.length === 1 && logged[0] === failure;
    }
  },
  {
    remark: '回调返回 false 不会阻止该通知的后续回调',
    test: function () {
      let count = 0;
      translate.listener.execute.renderFinishByApi = [function () { count++; return false; }, function () { count++; }];
      const result = translate.listener.execute.renderFinishByApiRun('uuid-😀', 'chinese_simplified', 'english');
      return result === undefined && count === 2;
    }
  }
]);
