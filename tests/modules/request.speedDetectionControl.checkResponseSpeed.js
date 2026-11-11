require('../helpers/module')(__filename, [
  { remark: '未配置测速路径时不发起请求', test: function () {
    let calls = 0;
    translate.request.api.connectTest = '';
    translate.request.send = function () { calls++; };
    translate.request.speedDetectionControl.checkResponseSpeed();
    return calls === 0;
  } },
  { remark: '对每个配置主机发起测速且使用各自主机路径', test: function () {
    const calls = [];
    translate.request.api.host = ['https://one.example/', 'https://two.example/'];
    translate.request.api.connectTest = 'connectTest.json';
    // 只替换网络边界，测速方法本身及队列排序仍真实执行。
    translate.request.send = function (url, data, attached, success) { calls.push([url, data.host, attached.host]); success({ info: data.host }); };
    translate.request.speedDetectionControl.checkResponseSpeed();
    return calls.length === 2 && calls[0][0] === 'https://one.example/connectTest.json' && calls[1][0] === 'https://two.example/connectTest.json' && calls.every(item => item[1] === item[2]) && translate.request.speedDetectionControl.state === 2;
  } },
  { remark: '字符串主机也只发起一次测速', test: function () {
    let calls = 0;
    translate.request.api.host = 'https://one.example/';
    translate.request.api.connectTest = 'connectTest.json';
    translate.request.send = function (url, data, attached, success) { calls++; success({ info: data.host }); };
    translate.request.speedDetectionControl.checkResponseSpeed();
    return calls === 1 && Array.isArray(translate.request.api.host) && translate.request.speedDetectionControl.hostQueue[0].host === 'https://one.example/';
  } },
  { remark: '主节点耗时扣减后不小于零', test: function () {
    translate.request.api.host = ['https://main.example/'];
    translate.request.api.connectTest = 'connectTest.json';
    translate.request.speedDetectionControl.hostMasterNodeCutTime = 100000;
    translate.request.send = function (url, data, attached, success) { success({ info: data.host }); };
    translate.request.speedDetectionControl.checkResponseSpeed();
    return translate.request.speedDetectionControl.hostQueue[0].time === 0;
  } },
  { remark: '测速失败的主机记录为不可用耗时', test: function () {
    translate.request.api.host = ['https://failed.example/'];
    translate.request.api.connectTest = 'connectTest.json';
    translate.request.send = function (url, data, attached, success, method, async, headers, failure) { failure({ requestURL: url }); };
    translate.request.speedDetectionControl.checkResponseSpeed();
    const queue = translate.request.speedDetectionControl.hostQueue;
    return queue.length === 1 && queue[0].host === 'https://failed.example/' && queue[0].time === translate.request.speedDetectionControl.disableTime && translate.request.speedDetectionControl.state === 2;
  } }
]);
