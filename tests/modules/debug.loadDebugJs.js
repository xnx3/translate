'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "按参数选择调试脚本路径：undefined",
    test: function () {
      let script;
      const append=document.head.appendChild;
      document.head.appendChild=node=>{script=node;return node;};
      try {
        let called=0;
        translate.debug.loadDebugJs(()=>{called++;},undefined);
        script.onload();
        return script.src==="https://translate.zvo.cn/static/debug.min.js" && called===1;
      } finally { document.head.appendChild=append; }
    }
  },
  {
    remark: "按参数选择调试脚本路径：''",
    test: function () {
      let script;
      const append=document.head.appendChild;
      document.head.appendChild=node=>{script=node;return node;};
      try {
        let called=0;
        translate.debug.loadDebugJs(()=>{called++;},'');
        script.onload();
        return script.src==="https://translate.zvo.cn/static/debug.min.js" && called===1;
      } finally { document.head.appendChild=append; }
    }
  },
  {
    remark: "按参数选择调试脚本路径：null",
    test: function () {
      let script;
      const append=document.head.appendChild;
      document.head.appendChild=node=>{script=node;return node;};
      try {
        let called=0;
        translate.debug.loadDebugJs(()=>{called++;},null);
        script.onload();
        return script.src==="https://translate.zvo.cn/static/debug.min.js" && called===1;
      } finally { document.head.appendChild=append; }
    }
  },
  {
    remark: "按参数选择调试脚本路径：12",
    test: function () {
      let script;
      const append=document.head.appendChild;
      document.head.appendChild=node=>{script=node;return node;};
      try {
        let called=0;
        translate.debug.loadDebugJs(()=>{called++;},12);
        script.onload();
        return script.src==="https://translate.zvo.cn/static/debug.min.js" && called===1;
      } finally { document.head.appendChild=append; }
    }
  },
  {
    remark: "按参数选择调试脚本路径：'/local/debug.js'",
    test: function () {
      let script;
      const append=document.head.appendChild;
      document.head.appendChild=node=>{script=node;return node;};
      try {
        let called=0;
        translate.debug.loadDebugJs(()=>{called++;},'/local/debug.js');
        script.onload();
        return script.src===location.origin + "/local/debug.js" && called===1;
      } finally { document.head.appendChild=append; }
    }
  },
  {
    remark: "已经加载调试数据时不再次插入脚本",
    test: function () {
      translate.debug.data={};
      let calls=0;
      const append=document.head.appendChild;
      document.head.appendChild=node=>{calls++;return node;};
      try { translate.debug.loadDebugJs(()=>{});return calls===0; } finally {document.head.appendChild=append;}
    }
  }
]);
