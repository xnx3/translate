require('../helpers/module')(__filename, [
  { remark: '配置多个主机时保留顺序并切换回标准服务模式', test: function () {
    let checks = 0;
    translate.service.name = 'client.edge';
    translate.request.speedDetectionControl.checkResponseSpeed = function () { checks++; };
    const hosts = ['https://first.example/', 'https://second.example/'];
    translate.request.setHost(hosts);
    return translate.service.name === 'translate.service' && translate.request.api.host === hosts && checks === 1;
  } },
  { remark: '重新配置清除旧的测速队列及初始化标记', test: function () {
    translate.request.speedDetectionControl.hostQueue = [{ host: 'old' }];
    translate.request.speedDetectionControl.checkHostQueue = [{ host: 'old' }];
    translate.temp_request_init = 1;
    translate.storage.set('speedDetectionControl_hostQueue', 'old');
    translate.request.speedDetectionControl.checkResponseSpeed = function () {};
    translate.request.setHost(['https://new.example/']);
    return translate.request.speedDetectionControl.hostQueue.length === 0 && translate.request.speedDetectionControl.checkHostQueue.length === 0 && translate.request.speedDetectionControl.state === 0 && translate.storage.get('speedDetectionControl_hostQueue') === '' && typeof translate.temp_request_init === 'undefined';
  } },
  { remark: '单元素主机数组同样被完整保留', test: function () {
    translate.request.speedDetectionControl.checkResponseSpeed = function () {};
    translate.request.setHost(['https://only.example/']);
    return Array.isArray(translate.request.api.host) && translate.request.api.host.length === 1 && translate.request.api.host[0] === 'https://only.example/';
  } },
  { remark: '设置主机后延迟触发初始化请求', test: async function () {
    let initialized = 0;
    const originalTimeout = window.setTimeout;
    // 只缩短 setHost 明确规定的三秒延迟，不改变初始化调用逻辑。
    window.setTimeout = function (callback, delay, ...args) { return originalTimeout(callback, delay === 3000 ? 0 : delay, ...args); };
    translate.request.speedDetectionControl.checkResponseSpeed = function () {};
    translate.request.initRequest = function () { initialized++; };
    translate.request.setHost(['https://only.example/']);
    await new Promise(resolve => originalTimeout(resolve, 20));
    return initialized === 1;
  } },
  { remark: '旧主机配置为字符串时，新传入的主机数组仍保持一维顺序', test: function () {
    translate.request.api.host = 'https://old.example/';
    translate.request.speedDetectionControl.checkResponseSpeed = function () {};
    var hosts = ['https://first.example/', 'https://second.example/'];
    translate.request.setHost(hosts);
    return translate.request.api.host.length === 2 && translate.request.api.host[0] === hosts[0] && translate.request.api.host[1] === hosts[1] && typeof translate.request.api.host[0] === 'string';
  } }
]);
