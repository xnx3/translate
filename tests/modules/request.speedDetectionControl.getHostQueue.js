require('../helpers/module')(__filename, [
  { remark: '已有内存队列直接返回同一队列且不发起测速', test: function () {
    const queue = [{ host: 'https://cached.example/', time: 12 }];
    let checked = false;
    translate.request.speedDetectionControl.hostQueue = queue;
    translate.request.speedDetectionControl.checkResponseSpeed = function () { checked = true; };
    return translate.request.speedDetectionControl.getHostQueue() === queue && checked === false;
  } },
  { remark: '首次使用按配置的主机优先级建立队列', test: function () {
    translate.request.api.host = ['https://first.example/', 'https://second.example/'];
    translate.request.speedDetectionControl.hostQueue = [];
    translate.storage.set('speedDetectionControl_hostQueue', '');
    translate.storage.set('speedDetectionControl_lasttime', Date.now());
    const queue = translate.request.speedDetectionControl.getHostQueue();
    return queue.length === 2 && queue[0].host === 'https://first.example/' && queue[1].host === 'https://second.example/' && queue.every(item => item.time === 0);
  } },
  { remark: '字符串主机配置被规范为单元素队列', test: function () {
    translate.request.api.host = 'https://only.example/';
    translate.request.speedDetectionControl.hostQueue = [];
    translate.storage.set('speedDetectionControl_lasttime', Date.now());
    const queue = translate.request.speedDetectionControl.getHostQueue();
    return queue.length === 1 && queue[0].host === 'https://only.example/' && Array.isArray(translate.request.api.host);
  } },
  { remark: '持久化队列优先于未经测速的配置顺序', test: function () {
    translate.request.api.host = ['https://configured.example/'];
    translate.request.speedDetectionControl.hostQueue = [];
    translate.storage.set('speedDetectionControl_hostQueue', JSON.stringify([{ host: 'https://fast.example/', time: 1 }, { host: 'https://slow.example/', time: 20 }]));
    translate.storage.set('speedDetectionControl_lasttime', Date.now());
    const queue = translate.request.speedDetectionControl.getHostQueue();
    return queue.length === 2 && queue[0].host === 'https://fast.example/' && queue[1].time === 20;
  } },
  { remark: '过期测速记录在初始化队列时重新测速一次', test: function () {
    let calls = 0;
    translate.request.speedDetectionControl.hostQueue = [];
    translate.storage.set('speedDetectionControl_lasttime', 0);
    translate.request.speedDetectionControl.checkResponseSpeed = function () { calls++; };
    const first = translate.request.speedDetectionControl.getHostQueue();
    const second = translate.request.speedDetectionControl.getHostQueue();
    return calls === 1 && first === second;
  } },
  { remark: '未过期的测速记录不发起新的测速', test: function () {
    let calls = 0;
    translate.request.speedDetectionControl.hostQueue = [];
    translate.storage.set('speedDetectionControl_lasttime', Date.now());
    translate.request.speedDetectionControl.checkResponseSpeed = function () { calls++; };
    return translate.request.speedDetectionControl.getHostQueue().length === 1 && calls === 0;
  } }
]);
