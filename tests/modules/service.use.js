'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "选择 translate.service 时记录服务名",
    test: function () {
      translate.enterprise.isUse = false;
      translate.whole.isEnableAll = false;
      const result = translate.service.use("translate.service");
      return result === undefined && translate.service.name === "translate.service" && translate.whole.isEnableAll === false;
    }
  },
  {
    remark: "选择 client.edge 时记录服务名并启用整段翻译",
    test: function () {
      translate.enterprise.isUse = false;
      translate.whole.isEnableAll = false;
      const result = translate.service.use("client.edge");
      return result === undefined && translate.service.name === "client.edge" && translate.whole.isEnableAll === true;
    }
  },
  {
    remark: "选择 siliconflow 时记录服务名并启用整段翻译",
    test: function () {
      translate.enterprise.isUse = false;
      translate.whole.isEnableAll = false;
      const result = translate.service.use("siliconflow");
      return result === undefined && translate.service.name === "siliconflow" && translate.whole.isEnableAll === true;
    }
  },
  {
    remark: "选择 giteeAI 时记录服务名并启用整段翻译",
    test: function () {
      translate.enterprise.isUse = false;
      translate.whole.isEnableAll = false;
      const result = translate.service.use("giteeAI");
      return result === undefined && translate.service.name === "giteeAI" && translate.whole.isEnableAll === true;
    }
  },
  {
    remark: "giteeAI 名称对应的专用节点组被正确配置",
    test: function () {
      translate.enterprise.isUse = false;
      translate.service.use("giteeAI");
      return translate.request.api.host[0] === "https://giteeai.zvo.cn/";
    }
  },
  {
    remark: "GITEEAI 名称对应的专用节点组被正确配置",
    test: function () {
      translate.enterprise.isUse = false;
      translate.service.use("GITEEAI");
      return translate.request.api.host[0] === "https://giteeai.zvo.cn/";
    }
  },
  {
    remark: "siliconflow 名称对应的专用节点组被正确配置",
    test: function () {
      translate.enterprise.isUse = false;
      translate.service.use("siliconflow");
      return translate.request.api.host[0] === "https://siliconflow.zvo.cn/";
    }
  },
  {
    remark: "SILICONFLOW 名称对应的专用节点组被正确配置",
    test: function () {
      translate.enterprise.isUse = false;
      translate.service.use("SILICONFLOW");
      return translate.request.api.host[0] === "https://siliconflow.zvo.cn/";
    }
  },
  {
    remark: "省略参数 不覆盖当前服务名",
    test: function () {
      translate.service.name = 'translate.service';
      translate.whole.isEnableAll = false;
      translate.service.use();
      return translate.service.name === 'translate.service' && translate.whole.isEnableAll === false;
    }
  },
  {
    remark: "undefined 不覆盖当前服务名",
    test: function () {
      translate.service.name = 'translate.service';
      translate.whole.isEnableAll = false;
      translate.service.use(undefined);
      return translate.service.name === 'translate.service' && translate.whole.isEnableAll === false;
    }
  },
  {
    remark: "null 不覆盖当前服务名",
    test: function () {
      translate.service.name = 'translate.service';
      translate.whole.isEnableAll = false;
      translate.service.use(null);
      return translate.service.name === 'translate.service' && translate.whole.isEnableAll === false;
    }
  },
  {
    remark: "数字 不覆盖当前服务名",
    test: function () {
      translate.service.name = 'translate.service';
      translate.whole.isEnableAll = false;
      translate.service.use(0);
      return translate.service.name === 'translate.service' && translate.whole.isEnableAll === false;
    }
  },
  {
    remark: "布尔值 不覆盖当前服务名",
    test: function () {
      translate.service.name = 'translate.service';
      translate.whole.isEnableAll = false;
      translate.service.use(false);
      return translate.service.name === 'translate.service' && translate.whole.isEnableAll === false;
    }
  },
  {
    remark: "对象 不覆盖当前服务名",
    test: function () {
      translate.service.name = 'translate.service';
      translate.whole.isEnableAll = false;
      translate.service.use({});
      return translate.service.name === 'translate.service' && translate.whole.isEnableAll === false;
    }
  },
  {
    remark: "企业通道启用时不接受普通服务切换",
    test: function () {
      translate.enterprise.isUse = true;
      translate.service.name = 'translate.service';
      const before = translate.request.api.host.slice();
      translate.service.use('client.edge');
      return translate.service.name === 'translate.service' && JSON.stringify(translate.request.api.host) === JSON.stringify(before);
    }
  },
  {
    remark: "切换回 translate.service 不修改已选择的节点配置",
    test: function () {
      translate.enterprise.isUse = false;
      translate.request.api.host = [location.origin + '/'];
      translate.service.use('translate.service');
      return translate.request.api.host.length === 1 && translate.request.api.host[0] === location.origin + '/';
    }
  }
]);
