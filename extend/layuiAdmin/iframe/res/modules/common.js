/**
 * common demo
 */
 
layui.define(function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,laytpl = layui.laytpl
  ,setter = layui.setter
  ,view = layui.view
  ,admin = layui.admin
  
  //公共业务的逻辑处理可以写在此处，切换任何页面都会执行
  //……
  

  /* AI i18n start */
  layui.use(['translate'], function(){
    var translate = layui.translate;
    
    //设置本地语种
    translate.language.setLocal('chinese_simplified');
    //设置翻译通道
    translate.service.use('client.edge');
    //开启html页面变化的监控
    translate.listener.start();    
    //开启ajax请求监控
    translate.request.listener.start();

    //当页面DOM跟外部JS加载执行完后，执行翻译触发
    const intervalId = setInterval(function(){
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            //console.log(translate.ignore.id);
            translate.execute();

            //判断是否已经加载了form模块，如果有加载form模块，那么要重新渲染 select ，select渲染也会只渲染一次
            if(typeof(layui.form) != 'undefined'){
                setTimeout(function(){
                    layui.form.render('select');
                    translate.execute(document.getElementsByTagName('input')); //这个得作用是，当select渲染后，如果select显示的文本（input标签）有 placeholder ，它会被还原回原本的文字，需要在对他进行处理翻译。
                    translate.execute(document.getElementsByClassName('layui-select-tips')); //这个得作用是，当select渲染完毕后，点击后出现下拉框时，这个select下拉框第一项的提示文字
                },"500");   //渲染 select 选择框，延迟执行
            }
            //setTimeout(function(){ translate.execute(); }, 500);
            //清除定时器，终止
            clearInterval(intervalId);
        }
    }, 50);
 
  });
  /* AI i18n end */

  
  //退出
  admin.events.logout = function(){
    //执行退出接口
    admin.req({
      url: layui.setter.paths.base + 'json/user/logout.js'
      ,type: 'get'
      ,data: {}
      ,done: function(res){ //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行
        
        //清空本地记录的 token，并跳转到登入页
        admin.exit(function(){
          location.href = 'user/login.html';
        });
      }
    });
  };

  
  //对外暴露的接口
  exports('common', {});
});