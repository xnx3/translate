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
    //translate.service.use('client.edge');
    //开启html页面变化的监控
    translate.listener.start();    

    //translate.request.api.host='https://glm-api-translate.zvo.cn/'; //将这里面的ip地址换成你服务器的ip，注意开头，及结尾还有个 / 别拉下

    //translate.request.listener.start();

    //更多设置项，可以参考  https://translate.zvo.cn/4019.html  可以更灵活的配置你的项目

    //渲染加载出select切换语言选择框
    translate.selectLanguageTag.render();

    //当页面DOM跟外部JS加载执行完后，执行翻译触发
    const intervalId = setInterval(function(){
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            console.log(translate.ignore.id);
            translate.execute();
            //清除定时器，终止
            clearInterval(intervalId);
        }
    }, 50);
 
  });
  /* 追加样式，主要针对中文翻译为英文后，英文字符长度要远大于中文，造成撑破布局 */
  const cssCode = `
      /* 扩展农历组件 iframe/views/component/laydate/special-demo.html */
      .laydate-theme-lunar .date-cell-inner i {
          overflow: hidden;
          height: 14px;
      }
      .layui-laydate .layui-laydate-footer .layui-laydate-preview .preview-inner > *:not(:first-child){
            display: none;
      }
  `;
  const styleTag = `<style>${cssCode}</style>`;
  // 将样式插入到 body 元素的末尾
  document.body.insertAdjacentHTML('beforeend', styleTag);
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