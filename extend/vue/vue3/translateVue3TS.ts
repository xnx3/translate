import { nextTick } from 'vue';
import translate from 'i18n-jsautotranslate'

//vue3框架的一些单独设置
translate.vue3 = {
  /*
      是否有 translate.execute() 代码的触发
      有则是true，没有则是false
      false则不会再dom渲染完后自动进行翻译,自然也不会显示 select 选择语言
  */
  isExecute: false, 
  /*
    是否在vue入口文件中 调用了 translateJsVueUseModel 插件 app.use(translateJsVueUseModel) 
    有则是true，没有则是false
  */
  isUse: false,
  /* 
    用户自定义配置，将在 app.use(translateJsVueUseModel)  时触发这个方法的执行
  */
  config: function(app){}
}

//如果 translate.vue3.config 中有 translate.execute() 代码的触发，那么就设置 isExecute 为 true ，同时阻止此次的 translate.execute() 执行，因为此次执行是在vue3的初始化阶段，而不是在dom渲染完毕后触发的，所以这里只是进行一个标记，待 真实 DOM渲染完毕后再来触发。
translate.lifecycle.execute.trigger.push(function(data){
  if(data.executeTriggerNumber === 1){
      translate.vue3.isExecute = true;
      translate.time.log('打开页面后，第一次触发 translate.execute() - 设置  translate.vue3.isExecute = true;');
      return false;  
  }
});

//将 translate 参数挂载到 window 上，方便在全局调用
if(typeof(window.translate) === 'undefined'){
  window.translate = translate;
}
translate.time.log('将 translate 参数挂载到 window 上，方便在全局调用及调试');


const translateJsVueUseModel = {
  install(app) {
    translate.time.log(' app.use(translateJsVueUseModel) ');
    translate.vue3.isUse = true;

    //触发自定义配置
    translate.vue3.config(app);

    // 直接监听应用挂载完成
    const originalMount = app.mount;
    app.mount = function(...args) {
      const root = originalMount.apply(this, args);
      // 应用挂载完成后执行
      // 使用双重nextTick确保DOM完全稳定后再执行翻译
      // 第一个nextTick确保初始DOM渲染完成
      nextTick(() => {
        // 第二个nextTick确保可能的异步更新也完成
        nextTick(() => {
          
          /*
          
              这里有问题，应该是vue的DOM渲染完毕后触发，但是实际打断点测试，DOM还没有渲染完就触发了，这里还需要跟踪优化
          
          
          */

          if(translate.vue3.isExecute){
            translate.time.log('组件渲染完成，触发 translate.execute();');

            //对vue3的某些第三方组件进行容错处理
            translate.faultTolerance.documentCreateTextNode.use(); //对VUE的某些组件频繁渲染dom进行容错
            translate.time.log('对vue3的某些第三方组件进行容错处理 - translate.faultTolerance.documentCreateTextNode.use();');
            translate.execute();
          }else{
            translate.time.log('组件渲染完成，但未发现translate.execute();存在，不进行翻译');
          }
        });
      });
      return root;
    };
  }
};

//export default translateJsVueUseModel;
export { translateJsVueUseModel, translate };
