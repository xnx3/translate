'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "启用企业通道并降低主节点时间权重",
    test: function () {
      translate.enterprise.isUse = false;
      translate.enterprise.use();
      return translate.enterprise.isUse === true && translate.request.speedDetectionControl.hostMasterNodeCutTime === 300;
    }
  },
  {
    remark: "客户端edge被企业服务接管",
    test: function () {
      translate.service.name='client.edge';
      translate.enterprise.use();
      return translate.service.name==='translate.service';
    }
  },
  {
    remark: "普通服务启用后仍保持当前通道名称",
    test: function () {
      translate.service.name='translate.service';
      translate.enterprise.use();
      return translate.service.name==='translate.service' && translate.request.api.host.length===6 && translate.request.api.host.every(host=>host.startsWith('https://'));
    }
  },
  {
    remark: "保留自定义企业key且不直接发送网络请求",
    test: function () {
      translate.enterprise.key='custom-key';
      let called=false;
      translate.request.send=()=>{called=true;};
      translate.enterprise.use();
      return translate.enterprise.key==='custom-key' && called===false;
    }
  },
  {
    remark: "重复启用不会累积重复主机",
    test: function () {
      translate.enterprise.use();
      const first=translate.request.api.host.slice();
      translate.enterprise.use();
      return JSON.stringify(translate.request.api.host)===JSON.stringify(first);
    }
  }
]);
