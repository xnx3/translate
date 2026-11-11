'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "传递自定义脚本路径并在完成后显示调试面板",
    test: function () {
      let observed;let called=0;
      translate.debug.showUIDialog=()=>{called++;};
      translate.debug.loadDebugJs=(callback,path)=>{observed=path;callback();};
      translate.debug.use('/local/debug.js');
      return observed==='/local/debug.js' && called===1;
    }
  },
  {
    remark: "省略路径时沿用加载器默认值",
    test: function () {
      let observed=1;let called=0;
      translate.debug.showUIDialog=()=>{called++;};
      translate.debug.loadDebugJs=(callback,path)=>{observed=path;callback();};
      translate.debug.use();
      return observed===undefined && called===1;
    }
  }
]);
