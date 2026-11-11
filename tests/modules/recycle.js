'use strict';

require('../helpers/module')(__filename, [
  {
    remark: 'expireTime 为负表示常驻队列，回收时应保留',
    test: function () {
      translate.nodeQueue = { permanent: { expireTime: -1 } };
      translate.recycle();
      return Object.hasOwn(translate.nodeQueue, 'permanent');
    }
  },
  {
    remark: "回收翻译队列：超过保留期",
    test: function () {
      const OriginalDate=Date;
      window.Date=class extends OriginalDate{constructor(...args){super(...(args.length?args:[1000]));}};
      try {
        translate.nodeQueue={item:{expireTime:879}};
        translate.recycle();
        return Object.hasOwn(translate.nodeQueue,'item')===false;
      } finally {window.Date=OriginalDate;}
    }
  },
  {
    remark: "回收翻译队列：恰好保留边界",
    test: function () {
      const OriginalDate=Date;
      window.Date=class extends OriginalDate{constructor(...args){super(...(args.length?args:[1000]));}};
      try {
        translate.nodeQueue={item:{expireTime:880}};
        translate.recycle();
        return Object.hasOwn(translate.nodeQueue,'item')===true;
      } finally {window.Date=OriginalDate;}
    }
  },
  {
    remark: "回收翻译队列：尚未过期",
    test: function () {
      const OriginalDate=Date;
      window.Date=class extends OriginalDate{constructor(...args){super(...(args.length?args:[1000]));}};
      try {
        translate.nodeQueue={item:{expireTime:1001}};
        translate.recycle();
        return Object.hasOwn(translate.nodeQueue,'item')===true;
      } finally {window.Date=OriginalDate;}
    }
  },
  {
    remark: "时间记录已结束且超过保留期时删除，未结束保留",
    test: function () {
      const DateOriginal=Date;
      window.Date=class extends DateOriginal{constructor(...args){super(...(args.length?args:[1000]));}};
      try {
        translate.time.execute.data={old:{finishTime:879},edge:{finishTime:880},running:{startTime:0}};
        translate.recycle();
        return !Object.hasOwn(translate.time.execute.data,'old') && Object.hasOwn(translate.time.execute.data,'edge') && Object.hasOwn(translate.time.execute.data,'running');
      } finally {window.Date=DateOriginal;}
    }
  },
  {
    remark: "回收刷新节点记录并保留仍连接的节点",
    test: function () {
      const kept=document.createTextNode('kept');
      const detached=document.createTextNode('detached');
      document.body.append(kept);
      translate.node.set(kept,{originalText:'kept'});
      translate.node.set(detached,{originalText:'detached'});
      translate.recycle();
      return translate.node.data.has(kept) && !translate.node.data.has(detached);
    }
  },
  {
    remark: "回收只处理自身队列属性，继承项不被遍历删除",
    test: function () {
      const queue=Object.create({inherited:{expireTime:0}});
      queue.own={expireTime:Date.now()+1000};
      translate.nodeQueue=queue;
      translate.recycle();
      return queue.inherited.expireTime===0 && Object.hasOwn(queue,'own');
    }
  },
  {
    remark: "空记录回收可以连续执行",
    test: function () {
      translate.nodeQueue={};
      translate.time.execute.data={};
      translate.node.data.clear();
      translate.recycle();
      translate.recycle();
      return Object.keys(translate.nodeQueue).length===0 && translate.node.data.size===0;
    }
  }
]);
