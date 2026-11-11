require('../helpers/module')(__filename, [
  { remark: '设置单个主机后重建零耗时队列并持久化', test: function () {
    const host = 'https://selected.example/';
    translate.request.speedDetectionControl.setCurrentHost(host);
    const queue = translate.request.speedDetectionControl.hostQueue;
    const saved = JSON.parse(translate.storage.get('speedDetectionControl_hostQueue'));
    return translate.request.api.host === host && queue.length === 1 && queue[0].host === host && queue[0].time === 0 && saved[0].host === host;
  } },
  { remark: '临时切换主机时移除旧测速队列', test: function () {
    translate.request.speedDetectionControl.hostQueue = [{ host: 'https://old.example/', time: 10 }];
    translate.request.speedDetectionControl.checkHostQueue = [{ host: 'https://old.example/', time: 10 }];
    translate.request.speedDetectionControl.setCurrentHost('https://new.example/');
    return translate.request.speedDetectionControl.hostQueue.length === 1 && translate.request.speedDetectionControl.hostQueue[0].host === 'https://new.example/';
  } },
  { remark: '连续切换后只保留最后一次指定的主机', test: function () {
    translate.request.speedDetectionControl.setCurrentHost('https://first.example/');
    translate.request.speedDetectionControl.setCurrentHost('https://second.example/');
    return translate.request.speedDetectionControl.getHost() === 'https://second.example/' && translate.request.speedDetectionControl.hostQueue.length === 1;
  } }
]);
