'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "优先采用浏览器语种 english 且不请求IP接口",
    test: function () {
      let changed;let requests=0;
      translate.util.browserDefaultLanguage=()=>"english";
      translate.changeLanguage=value=>{changed=value;};
      translate.request.post=()=>{requests++;};
      translate.executeByLocalLanguage();
      return changed==="english" && requests===0;
    }
  },
  {
    remark: "优先采用浏览器语种 japanese 且不请求IP接口",
    test: function () {
      let changed;let requests=0;
      translate.util.browserDefaultLanguage=()=>"japanese";
      translate.changeLanguage=value=>{changed=value;};
      translate.request.post=()=>{requests++;};
      translate.executeByLocalLanguage();
      return changed==="japanese" && requests===0;
    }
  },
  {
    remark: "优先采用浏览器语种 spanish 且不请求IP接口",
    test: function () {
      let changed;let requests=0;
      translate.util.browserDefaultLanguage=()=>"spanish";
      translate.changeLanguage=value=>{changed=value;};
      translate.request.post=()=>{requests++;};
      translate.executeByLocalLanguage();
      return changed==="spanish" && requests===0;
    }
  },
  {
    remark: "浏览器无匹配且IP配置不可用时不执行：''",
    test: function () {
      translate.util.browserDefaultLanguage=()=>'';
      translate.request.api.ip='';
      let called=0;
      translate.request.post=()=>{called++;};
      translate.execute=()=>{called++;};
      translate.executeByLocalLanguage();
      return called===0;
    }
  },
  {
    remark: "浏览器无匹配且IP配置不可用时不执行：null",
    test: function () {
      translate.util.browserDefaultLanguage=()=>'';
      translate.request.api.ip=null;
      let called=0;
      translate.request.post=()=>{called++;};
      translate.execute=()=>{called++;};
      translate.executeByLocalLanguage();
      return called===0;
    }
  },
  {
    remark: "浏览器无匹配且IP配置不可用时不执行：undefined",
    test: function () {
      translate.util.browserDefaultLanguage=()=>'';
      translate.request.api.ip=undefined;
      let called=0;
      translate.request.post=()=>{called++;};
      translate.execute=()=>{called++;};
      translate.executeByLocalLanguage();
      return called===0;
    }
  },
  {
    remark: "浏览器无匹配且IP配置不可用时不执行：42",
    test: function () {
      translate.util.browserDefaultLanguage=()=>'';
      translate.request.api.ip=42;
      let called=0;
      translate.request.post=()=>{called++;};
      translate.execute=()=>{called++;};
      translate.executeByLocalLanguage();
      return called===0;
    }
  },
  {
    remark: "IP接口成功后保存目标并执行一次翻译",
    test: function () {
      translate.util.browserDefaultLanguage=()=>'';
      translate.request.api.ip='ip.json';
      let executed=0;
      translate.execute=()=>{executed++;};
      translate.request.post=(url,data,callback)=>callback({result:1,language:'spanish'});
      translate.executeByLocalLanguage();
      return translate.to==='spanish' && translate.storage.get('to')==='spanish' && executed===1;
    }
  },
  {
    remark: "IP识别失败时保持原语种并不执行翻译",
    test: function () {
      translate.util.browserDefaultLanguage=()=>'';
      translate.request.api.ip='ip.json';
      translate.to='english';
      let executed=0;
      translate.execute=()=>{executed++;};
      translate.request.post=(url,data,callback)=>callback({result:0,info:'offline'});
      translate.executeByLocalLanguage();
      return translate.to==='english' && executed===0;
    }
  },
  {
    remark: "IP接口未启用的返回信息不会误触发翻译",
    test: function () {
      translate.util.browserDefaultLanguage=()=>'';
      translate.request.api.ip='ip.json';
      let executed=0;
      translate.execute=()=>{executed++;};
      translate.request.post=(url,data,callback)=>callback({result:0,info:'file not find'});
      translate.executeByLocalLanguage();
      return executed===0;
    }
  }
]);
