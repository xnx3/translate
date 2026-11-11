'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "没有选中文本时不发送请求",
    test: function () {
      let count=0;
      translate.request.post=()=>{count++;};
      window.getSelection().removeAllRanges();
      translate.selectionTranslate.callTranslate({});
      return count===0;
    }
  },
  {
    remark: "翻译接口配置无效时不发送请求：",
    test: function () {
      document.body.textContent='你好世界';
      const range=document.createRange();
      range.selectNodeContents(document.body);
      window.getSelection().addRange(range);
      translate.request.api.translate="";
      let count=0;
      translate.request.post=()=>{count++;};
      translate.selectionTranslate.callTranslate({});
      return count===0;
    }
  },
  {
    remark: "翻译接口配置无效时不发送请求：null",
    test: function () {
      document.body.textContent='你好世界';
      const range=document.createRange();
      range.selectNodeContents(document.body);
      window.getSelection().addRange(range);
      translate.request.api.translate=null;
      let count=0;
      translate.request.post=()=>{count++;};
      translate.selectionTranslate.callTranslate({});
      return count===0;
    }
  },
  {
    remark: "翻译接口配置无效时不发送请求：42",
    test: function () {
      document.body.textContent='你好世界';
      const range=document.createRange();
      range.selectNodeContents(document.body);
      window.getSelection().addRange(range);
      translate.request.api.translate=42;
      let count=0;
      translate.request.post=()=>{count++;};
      translate.selectionTranslate.callTranslate({});
      return count===0;
    }
  },
  {
    remark: "选中文本按当前语种封装并显示响应结果",
    test: function () {
      translate.selectionTranslate.start();
      const text=document.createTextNode('你好世界');
      document.body.prepend(text);
      const range=document.createRange();
      range.selectNodeContents(text);
      window.getSelection().addRange(range);
      translate.language.local='chinese_simplified';
      translate.to='english';
      window.selectionX=10;window.selectionY=20;
      let observed;
      translate.request.post=(url,data,callback)=>{observed=data;callback({result:1,text:['Hello world']});};
      translate.selectionTranslate.callTranslate({});
      const tooltip=document.getElementById('translateTooltip');
      return observed.from==='chinese_simplified' && observed.to==='english' && JSON.parse(decodeURIComponent(observed.text))[0]==='你好世界' && tooltip.innerText==='Hello world' && tooltip.style.left==='60px' && tooltip.style.top==='40px';
    }
  },
  {
    remark: "接口返回失败时不覆盖已有提示文本",
    test: function () {
      translate.selectionTranslate.start();
      const node=document.createTextNode('hello');
      document.body.prepend(node);
      const range=document.createRange();range.selectNodeContents(node);window.getSelection().addRange(range);
      const tooltip=document.getElementById('translateTooltip');tooltip.innerText='keep';
      translate.request.post=(url,data,callback)=>callback({result:0,info:'offline'});
      translate.selectionTranslate.callTranslate({});
      return tooltip.innerText==='keep';
    }
  }
]);
