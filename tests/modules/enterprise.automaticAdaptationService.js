'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "未启用企业服务时保持原服务",
    test: function () {
      translate.enterprise.isUse=false;
      translate.service.name='translate.service';
      translate.request.speedDetectionControl.disableTime=100;
      translate.request.speedDetectionControl.getHostQueue=()=>[{time:999999}];
      translate.enterprise.automaticAdaptationService();
      return translate.service.name==="translate.service";
    }
  },
  {
    remark: "无可用主机记录时不切换服务",
    test: function () {
      translate.enterprise.isUse=true;
      translate.service.name='translate.service';
      translate.request.speedDetectionControl.disableTime=100;
      translate.request.speedDetectionControl.getHostQueue=()=>[];
      translate.enterprise.automaticAdaptationService();
      return translate.service.name==="translate.service";
    }
  },
  {
    remark: "最快节点仍可用时保持企业通道",
    test: function () {
      translate.enterprise.isUse=true;
      translate.service.name='translate.service';
      translate.request.speedDetectionControl.disableTime=100;
      translate.request.speedDetectionControl.getHostQueue=()=>[{time:50},{time:999}];
      translate.enterprise.automaticAdaptationService();
      return translate.service.name==="translate.service";
    }
  },
  {
    remark: "最快节点到达不可用阈值时切换edge",
    test: function () {
      translate.enterprise.isUse=true;
      translate.service.name='translate.service';
      translate.request.speedDetectionControl.disableTime=100;
      translate.request.speedDetectionControl.getHostQueue=()=>[{time:100}];
      translate.enterprise.automaticAdaptationService();
      return translate.service.name==="client.edge";
    }
  },
  {
    remark: "阈值前一毫秒加一恰好等于阈值时仍保留当前通道",
    test: function () {
      translate.enterprise.isUse=true;
      translate.service.name='translate.service';
      translate.request.speedDetectionControl.disableTime=100;
      translate.request.speedDetectionControl.getHostQueue=()=>[{time:99}];
      translate.enterprise.automaticAdaptationService();
      return translate.service.name==="translate.service";
    }
  },
  {
    remark: "阈值前两毫秒不切换",
    test: function () {
      translate.enterprise.isUse=true;
      translate.service.name='translate.service';
      translate.request.speedDetectionControl.disableTime=100;
      translate.request.speedDetectionControl.getHostQueue=()=>[{time:98}];
      translate.enterprise.automaticAdaptationService();
      return translate.service.name==="translate.service";
    }
  }
]);
