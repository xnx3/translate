require('../helpers/module')(__filename, [
  { remark: '将接口路径拼接到选中的主机并附带当前版本', test: function () {
    translate.request.speedDetectionControl.hostQueue = [{ host: 'https://one.example/' }];
    translate.request.speedDetectionControl.hostQueueIndex = 0;
    return translate.request.getUrl('translate.json') === 'https://one.example/translate.json?v=' + translate.version;
  } },
  { remark: '空路径仍保留主机及版本参数', test: function () {
    translate.request.speedDetectionControl.hostQueue = [{ host: 'https://one.example/' }];
    translate.request.speedDetectionControl.hostQueueIndex = 0;
    return translate.request.getUrl('') === 'https://one.example/?v=' + translate.version;
  } },
  { remark: '切换队列下标后使用对应备用主机', test: function () {
    translate.request.speedDetectionControl.hostQueue = [{ host: 'https://one.example/' }, { host: 'https://two.example/' }];
    translate.request.speedDetectionControl.hostQueueIndex = 1;
    return translate.request.getUrl('language.json') === 'https://two.example/language.json?v=' + translate.version;
  } },
  { remark: '嵌套路径完整保留', test: function () {
    translate.request.speedDetectionControl.hostQueue = [{ host: location.origin + '/' }];
    translate.request.speedDetectionControl.hostQueueIndex = 0;
    return translate.request.getUrl('api/v1/translate.json') === location.origin + '/api/v1/translate.json?v=' + translate.version;
  } }
]);
