require('../helpers/module')(__filename, [
  { remark: '首次使用缺少持久化下标时默认选择零', test: function () {
    translate.request.speedDetectionControl.hostQueueIndex = -1;
    return translate.request.speedDetectionControl.getHostQueueIndex() === 0 && Number(translate.storage.get('speedDetectionControl_hostQueueIndex')) === 0;
  } },
  { remark: '恢复持久化的备用主机下标', test: function () {
    translate.storage.set('speedDetectionControl_hostQueueIndex', 2);
    translate.request.speedDetectionControl.hostQueueIndex = -1;
    return Number(translate.request.speedDetectionControl.getHostQueueIndex()) === 2;
  } },
  { remark: '已经初始化的下标不会被持久化值覆盖', test: function () {
    translate.storage.set('speedDetectionControl_hostQueueIndex', 5);
    translate.request.speedDetectionControl.hostQueueIndex = 1;
    return translate.request.speedDetectionControl.getHostQueueIndex() === 1;
  } },
  { remark: '零下标是有效的已初始化值', test: function () {
    translate.storage.set('speedDetectionControl_hostQueueIndex', 3);
    translate.request.speedDetectionControl.hostQueueIndex = 0;
    return translate.request.speedDetectionControl.getHostQueueIndex() === 0;
  } }
]);
