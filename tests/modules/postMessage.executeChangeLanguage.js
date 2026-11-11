'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '来自父页的切换期间抑制反向通知，完成后恢复原 false 状态',
    test: function () {
      translate.postMessage._suppressParentNotify = false;
      let during;
      let received;
      translate.changeLanguage = function (language) { received = language; during = translate.postMessage.shouldNotifyParent(); };
      const result = translate.postMessage.executeChangeLanguage('english', true);
      return result === undefined && received === 'english' && during === false &&
        translate.postMessage._suppressParentNotify === false;
    }
  },
  {
    remark: '来自子页的切换不额外抑制父页面通知',
    test: function () {
      translate.postMessage._suppressParentNotify = false;
      let during;
      translate.changeLanguage = function () { during = translate.postMessage.shouldNotifyParent(); };
      translate.postMessage.executeChangeLanguage('spanish', false);
      return during === true && translate.postMessage._suppressParentNotify === false;
    }
  },
  {
    remark: '省略 fromParent 参数时不启用抑制',
    test: function () {
      translate.postMessage._suppressParentNotify = false;
      let during;
      translate.changeLanguage = function () { during = translate.postMessage.shouldNotifyParent(); };
      translate.postMessage.executeChangeLanguage('english');
      return during === true && translate.postMessage._suppressParentNotify === false;
    }
  },
  {
    remark: '原本已处于抑制状态时切换后仍恢复为 true',
    test: function () {
      translate.postMessage._suppressParentNotify = true;
      translate.changeLanguage = function () {};
      translate.postMessage.executeChangeLanguage('english', true);
      return translate.postMessage._suppressParentNotify === true;
    }
  },
  {
    remark: 'changeLanguage 抛错也必须在 finally 中恢复原抑制状态',
    test: function () {
      translate.postMessage._suppressParentNotify = false;
      translate.changeLanguage = function () { throw new Error('switch failed'); };
      const result = translate.postMessage.executeChangeLanguage('english', true);
      return result === undefined && translate.postMessage._suppressParentNotify === false;
    }
  },
  {
    remark: '顶层页面完成来自父页标记的切换时不发送语言确认消息给自身',
    test: function () {
      let sent = 0;
      translate.changeLanguage = function () {};
      translate.postMessage.send = function () { sent++; };
      translate.postMessage.executeChangeLanguage('english', true);
      return sent === 0;
    }
  }
]);
