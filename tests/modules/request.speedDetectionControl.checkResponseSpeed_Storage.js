require('../helpers/module')(__filename, [
  { remark: '首个测速结果加入队列并记录检测时间', test: function () {
    translate.request.speedDetectionControl.checkHostQueue = [];
    const before = Date.now();
    translate.request.speedDetectionControl.checkResponseSpeed_Storage('https://one.example/', 12);
    const queue = translate.request.speedDetectionControl.hostQueue;
    return queue.length === 1 && queue[0].host === 'https://one.example/' && queue[0].time === 12 && Number(translate.storage.get('speedDetectionControl_lasttime')) >= before;
  } },
  { remark: '多个结果按耗时从小到大排列并持久化相同顺序', test: function () {
    translate.request.speedDetectionControl.checkHostQueue = [];
    translate.request.speedDetectionControl.checkResponseSpeed_Storage('slow', 100);
    translate.request.speedDetectionControl.checkResponseSpeed_Storage('fast', 0);
    translate.request.speedDetectionControl.checkResponseSpeed_Storage('middle', 20);
    const saved = JSON.parse(translate.storage.get('speedDetectionControl_hostQueue'));
    return saved.map(item => item.host).join(',') === 'fast,middle,slow' && translate.request.speedDetectionControl.hostQueue.map(item => item.time).join(',') === '0,20,100';
  } },
  { remark: '不可用主机排在正常主机之后', test: function () {
    translate.request.speedDetectionControl.checkHostQueue = [];
    translate.request.speedDetectionControl.checkResponseSpeed_Storage('unavailable', translate.request.speedDetectionControl.disableTime);
    translate.request.speedDetectionControl.checkResponseSpeed_Storage('available', 50);
    return translate.request.speedDetectionControl.hostQueue[0].host === 'available' && translate.request.speedDetectionControl.hostQueue[1].host === 'unavailable';
  } },
  { remark: '小数耗时保留精度并正确排序', test: function () {
    translate.request.speedDetectionControl.checkHostQueue = [];
    translate.request.speedDetectionControl.checkResponseSpeed_Storage('a', 1.5);
    translate.request.speedDetectionControl.checkResponseSpeed_Storage('b', 1.25);
    return translate.request.speedDetectionControl.hostQueue[0].host === 'b' && translate.request.speedDetectionControl.hostQueue[0].time === 1.25;
  } }
]);
