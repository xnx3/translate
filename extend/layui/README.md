layui 的 翻译插件


## 在线体验

[https://res.zvo.cn/translate/else/layui_exts/demo.html](https://res.zvo.cn/translate/else/layui_exts/demo.html)


## 快速使用

在你的网页 head 中加入以下代码  

````
<script src="./translate/translate.js"></script>  <!-- 引入 layui 的 translate.js AI翻译模块，自行下载这个js放到你自己项目里。 js下载地址：  https://raw.githubusercontent.com/xnx3/translate/refs/heads/master/extend/layui/layui_exts/translate/translate.js  -->
<script>
translate.language.setLocal('chinese_simplified'); 	//设置本地语种，如果不设置会自动识别 http://translate.zvo.cn/4066.html
translate.service.use('client.edge'); 	//设置翻译通道 http://translate.zvo.cn/4081.html
translate.visual.webPageLoadTranslateBeforeHiddenText(); 	//网页打开时自动隐藏文字，翻译完成后显示译文。 参考文档 http://translate.zvo.cn/549731.html
translate.progress.api.startUITip(); 	//启用翻译中的遮罩层 参考文档 http://translate.zvo.cn/407105.html
window.onload = function () { 	//当页面DOM加载完后执行翻译操作
	translate.execute(); 	//进行翻译的执行
};  
</script>
````



## 重点支持
注意，我们将重点支持layui的适配，如果你是layui项目，使用后遇到任何异常，都可[喊我](https://translate.zvo.cn/4030.html) ，我来给你做配合，让你能完美使用！

## 更多扩展用法及其他说明，请参考主项目 

github: [https://github.com/xnx3/translate](https://github.com/xnx3/translate)  
gitee: [https://gitee.com/mail_osc/translate](https://gitee.com/mail_osc/translate) 

官方网站：[https://translate.zvo.cn](https://translate.zvo.cn)