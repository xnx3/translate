'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "现代语种 english 切换后持久化并执行翻译",
    test: function () {
      translate.language.local='chinese_simplified';
      translate.selectLanguageTag.show=false;
      let executed=0;
      translate.execute=()=>{executed++;};
      translate.changeLanguage("english");
      return translate.to==="english" && translate.storage.get('to')==="english" && executed===1 && translate.useVersion==='v2';
    }
  },
  {
    remark: "现代语种 spanish 切换后持久化并执行翻译",
    test: function () {
      translate.language.local='chinese_simplified';
      translate.selectLanguageTag.show=false;
      let executed=0;
      translate.execute=()=>{executed++;};
      translate.changeLanguage("spanish");
      return translate.to==="spanish" && translate.storage.get('to')==="spanish" && executed===1 && translate.useVersion==='v2';
    }
  },
  {
    remark: "现代语种 chinese_simplified 切换后持久化并执行翻译",
    test: function () {
      translate.language.local='chinese_simplified';
      translate.selectLanguageTag.show=false;
      let executed=0;
      translate.execute=()=>{executed++;};
      translate.changeLanguage("chinese_simplified");
      return translate.to==="chinese_simplified" && translate.storage.get('to')==="chinese_simplified" && executed===1 && translate.useVersion==='v2';
    }
  },
  {
    remark: "切换前后生命周期按次序收到目标语种",
    test: function () {
      const events=[];
      translate.lifecycle.changeLanguage.trigger=[data=>events.push('before:'+data.to)];
      translate.lifecycle.changeLanguage.old_trigger_array=[];
      translate.lifecycle.changeLanguage.resetAfter=[data=>events.push('after:'+data.to)];
      translate.selectLanguageTag.show=false;
      translate.execute=()=>events.push('execute');
      translate.changeLanguage('english');
      return events.join(',')==='before:english,after:english,execute';
    }
  },
  {
    remark: "连续切换以最后目标为准且不重复保留旧节点",
    test: function () {
      translate.selectLanguageTag.show=false;
      translate.execute=()=>{};
      translate.changeLanguage('english');
      translate.changeLanguage('spanish');
      return translate.to==='spanish' && translate.storage.get('to')==='spanish' && translate.node.data.size===0;
    }
  },
  {
    remark: "旧语种标识走Cookie兼容分支并刷新一次",
    test: function () {
      let refresh=0;let execute=0;
      translate.localLanguage='zh-CN';
      translate.refreshCurrentPage=()=>{refresh++;};
      translate.execute=()=>{execute++;};
      translate.changeLanguage('en');
      return translate.getCookie('googtrans')==='/zh-CN/en' && refresh===1 && execute===0;
    }
  },
  {
    remark: "切换还原已翻译节点后保留DOM身份",
    test: function () {
      translate.selectLanguageTag.show=false;
      const node=document.createTextNode('Hello');
      document.body.append(node);
      translate.node.set(node,{attribute:'',originalText:'你好',resultText:'Hello'});
      translate.execute=()=>{};
      translate.changeLanguage('spanish');
      return document.body.firstChild===node && node.nodeValue==='你好' && translate.node.data.size===0;
    }
  },
  {
    remark: "同源子页面的不同语种通过真实窗口下发",
    test: function () {
      const frame=document.createElement('iframe');
      document.body.append(frame);
      let changed;
      frame.contentWindow.translate={version:'test',to:'spanish',node:{data:new Map()},changeLanguage:value=>{changed=value;}};
      translate.selectLanguageTag.show=false;
      translate.execute=()=>{};
      translate.changeLanguage('english');
      return changed==='english';
    }
  },
  {
    remark: "子页面已同语种且存在翻译记录时不重复切换",
    test: function () {
      const frame=document.createElement('iframe');
      document.body.append(frame);
      let count=0;
      frame.contentWindow.translate={version:'test',to:'english',node:{data:new Map([[1,1]])},changeLanguage:()=>{count++;}};
      translate.selectLanguageTag.show=false;
      translate.execute=()=>{};
      translate.changeLanguage('english');
      return count===0;
    }
  }
]);
