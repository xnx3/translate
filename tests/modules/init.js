'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "已初始化后再次调用不重复创建Map或生命周期",
    test: function () {
      const nodes=translate.node.data;
      const history=translate.history.translateText.originalMap;
      const count=translate.lifecycle.execute.start.length;
      translate.init();
      translate.init();
      return translate.node.data===nodes && translate.history.translateText.originalMap===history && translate.lifecycle.execute.start.length===count;
    }
  },
  {
    remark: "新初始化补齐节点和历史Map并初始化消息监听",
    test: function () {
      delete translate.init_execute;
      translate.node.data=null;
      translate.history.translateText.originalMap=null;
      translate.history.translateText.resultMap=null;
      translate.postMessage.reset();
      translate.init();
      return translate.node.data instanceof Map && translate.history.translateText.originalMap instanceof Map && translate.history.translateText.resultMap instanceof Map && translate.postMessage.initialized===true;
    }
  },
  {
    remark: "初始化不覆盖已经存在的节点数据",
    test: function () {
      const node=document.createTextNode('x');
      translate.node.data.set(node,{originalText:'x'});
      delete translate.init_execute;
      translate.init();
      return translate.node.data.get(node).originalText==='x';
    }
  },
  {
    remark: "首次execute钩子按开关分别启动DOM和请求监听",
    test: function () {
      translate.init_first_trigger_execute=undefined;
      translate.listener.use=true;
      translate.listener.isStart=false;
      translate.request.listener.use=true;
      translate.request.listener.isStart=false;
      let dom=0,request=0;
      translate.listener.addListener=()=>{dom++;};
      translate.request.listener.addListener=()=>{request++;};
      for(const callback of translate.lifecycle.execute.start) callback('uuid','english');
      return dom===1 && request===1;
    }
  },
  {
    remark: "首次execute钩子不会重复启动监听",
    test: function () {
      translate.init_first_trigger_execute=undefined;
      translate.listener.use=true;
      translate.listener.isStart=false;
      let count=0;
      translate.listener.addListener=()=>{count++;};
      for(const callback of translate.lifecycle.execute.start) callback('first','english');
      for(const callback of translate.lifecycle.execute.start) callback('second','english');
      return count===1;
    }
  }
]);
