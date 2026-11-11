'use strict';

require('../helpers/module')(__filename, [
  { remark: '默认允许向父页面通知', args: [], expected: true },
  {
    remark: '抑制标记为 true 时不允许通知',
    test: function () {
      translate.postMessage._suppressParentNotify = true;
      return translate.postMessage.shouldNotifyParent() === false;
    }
  },
  {
    remark: '抑制标记为 false 时允许通知',
    test: function () {
      translate.postMessage._suppressParentNotify = false;
      return translate.postMessage.shouldNotifyParent() === true;
    }
  },
  {
    remark: '抑制标记从 true 恢复 false 后重新允许通知',
    test: function () {
      translate.postMessage._suppressParentNotify = true;
      if (translate.postMessage.shouldNotifyParent() !== false) return false;
      translate.postMessage._suppressParentNotify = false;
      return translate.postMessage.shouldNotifyParent() === true;
    }
  }
]);
