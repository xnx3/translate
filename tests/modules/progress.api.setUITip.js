'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "传入true启用提示标记",
    test: function () {
      translate.progress.api.setUITip(true);
      return translate.progress.api.isTip===true;
    }
  },
  {
    remark: "传入false禁用提示标记",
    test: function () {
      translate.progress.api.setUITip(false);
      return translate.progress.api.isTip===false;
    }
  },
  {
    remark: "连续切换以最后一次设置为准",
    test: function () {
      translate.progress.api.setUITip(false);
      translate.progress.api.setUITip(true);
      return translate.progress.api.isTip===true;
    }
  },
  {
    remark: "设置提示标记不提前注册生命周期或创建样式",
    test: function () {
      const count=translate.lifecycle.execute.translateNetworkBefore.length;
      translate.progress.api.setUITip(false);
      return translate.lifecycle.execute.translateNetworkBefore.length===count && document.getElementById('translatejs-mask-layer-animation')===null;
    }
  }
]);
