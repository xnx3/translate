'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "快捷入口依次启用核心功能并强制翻译本地语种",
    test: function () {
      const called=[];
      translate.visual.webPageLoadTranslateBeforeHiddenText=()=>called.push('hidden');
      translate.progress.api.startUITip=()=>called.push('progress');
      translate.listener.start=()=>called.push('dom');
      translate.request.listener.start=()=>called.push('request');
      translate.language.setUrlParamControl=()=>called.push('url');
      translate.whole.enableAll=()=>called.push('whole');
      translate.quickUse();
      return called.join(',')==='hidden,progress,dom,request,url,whole' && translate.language.translateLocal===true;
    }
  },
  {
    remark: "快捷入口注册DOM完成后的立即及延迟执行",
    test: function () {
      const callbacks=[];
      const timers=[];
      let count=0;
      const add=document.addEventListener;
      const timeout=window.setTimeout;
      document.addEventListener=function(type,callback){if(type==='DOMContentLoaded')callbacks.push(callback);};
      window.setTimeout=(callback,delay)=>{timers.push({callback,delay});return 1;};
      translate.execute=()=>{count++;};
      try {
        translate.quickUse();
        callbacks[0]();
        const immediate=count===1;
        timers.forEach(item=>item.callback());
        return callbacks.length===1 && immediate && count===3 && timers.map(item=>item.delay).join(',')==='500,2000';
      } finally {document.addEventListener=add;window.setTimeout=timeout;}
    }
  },
  {
    remark: "快捷启用不覆盖已有本地和目标语种",
    test: function () {
      translate.language.local='japanese';
      translate.to='english';
      translate.quickUse();
      return translate.language.local==='japanese' && translate.to==='english';
    }
  }
]);
