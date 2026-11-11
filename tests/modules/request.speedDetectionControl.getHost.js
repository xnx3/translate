require('../helpers/module')(__filename, [
  { remark: '零下标选择第一个主机', test: function () {
    translate.request.speedDetectionControl.hostQueue = [{ host: 'one' }, { host: 'two' }];
    translate.request.speedDetectionControl.hostQueueIndex = 0;
    return translate.request.speedDetectionControl.getHost() === 'one';
  } },
  { remark: '有效的备用下标选择对应主机', test: function () {
    translate.request.speedDetectionControl.hostQueue = [{ host: 'one' }, { host: 'two' }, { host: 'three' }];
    translate.request.speedDetectionControl.hostQueueIndex = 1;
    return translate.request.speedDetectionControl.getHost() === 'two';
  } },
  { remark: '越界下标回落到最后一个主机', test: function () {
    translate.request.speedDetectionControl.hostQueue = [{ host: 'one' }, { host: 'last' }];
    translate.request.speedDetectionControl.hostQueueIndex = 20;
    return translate.request.speedDetectionControl.getHost() === 'last';
  } },
  { remark: '单主机队列在下标越界时仍选择唯一主机', test: function () {
    translate.request.speedDetectionControl.hostQueue = [{ host: 'only' }];
    translate.request.speedDetectionControl.hostQueueIndex = 1;
    return translate.request.speedDetectionControl.getHost() === 'only';
  } },
  { remark: '字符串形式的持久化下标也能选择对应主机', test: function () {
    translate.request.speedDetectionControl.hostQueue = [{ host: 'one' }, { host: 'two' }];
    translate.request.speedDetectionControl.hostQueueIndex = '1';
    return translate.request.speedDetectionControl.getHost() === 'two';
  } }
]);
