网页自动翻译，页面无需另行改造，加入两行js即可让你的网页快速具备多国语言切换能力。  

## 注意，本项目的开源仓库已合并入主仓库 https://github.com/xnx3/translate 后续更新会在主仓库进行更新
 
## 特性
* **使用极其简单。** 无需任何前期准备，直接加入几行代码即可拥有多种语言全自动切换能力。
* **不增加工作量。** 无需另行改造页面本身，也没有各种语言都要单独配置的语言文件，更不需要你对页面本身要显示的文字区域进行代码调用，我认为那样对技术人员实在是太不友好了。而且它也不需要你到某某网站申请什么key，它本身就是开放的，拿来即用。
* **极其灵活扩展。** 您可指定它只翻译某些指定区域、切换语言时显示下拉框还是通过摆放多个切换语言按钮进行、可指定某些特定的元素不进行翻译忽略……
* **自动匹配语种。** 自动根据用户所在的国家切换其国家所使用的语种
* **瞬间翻译能力。** 内置缓存预加载机制，只要翻译过的网页，再次看时会达到瞬间翻译的效果，给用户的感觉就是，这个页面本来就是这种语言的，而不是经过第三方翻译的。
* **永久免费使用。** 本人热衷开源，有开源项目二三十个，这个项目的初衷就是使网页传播打破语言界限，世界是一家！当然如果您项目比较大，日访问量到了百万级千万级的，我们还是建议您私有化部署。
* **搜索引擎友好。** 完全不影响你本身网站搜索引擎的收录。爬虫所爬取的网页源代码，它不会对其进行任何改动，你可完全放心。
* **后端翻译开源。** 在某些政府机关及大集团内部项目中，对数据隐私及安全保密有强要求场景、或您对自有客户希望提供自建高可靠翻译服务场景时，您可将后端翻译接口进行私有化部署，不走我们公开开放的翻译接口，以做到安全保密及后端服务全部自行掌控。 


## 在线体验

[https://res.zvo.cn/translate/else/layui_exts/demo.html](https://res.zvo.cn/translate/else/layui_exts/demo.html)


## 快速使用

在你的网页中加入以下js  

````
layui.extend({
	translate: '{/}https://res.zvo.cn/translate/else/layui_exts/translate/translate' // {/}的意思即代表采用自有路径，即不跟随 base 路径
})
//使用拓展模块
layui.use(['translate'], function(){
	var translate = layui.translate;
	
	//设置本地语种
	translate.language.setLocal('chinese_simplified');
	//设置翻译通道
	translate.service.use('client.edge');

	//更多设置项，可以参考  https://translate.zvo.cn/4019.html  可以更灵活的配置你的项目
	
	//当页面加载完后执行翻译操作
	window.onload = function () {
		translate.execute();
	};  
});
````


## 实际使用场景示例
#### 普通网站中点击某个语言进行切换
如下图所示，网站中的某个位置要有几种语言切换  
![](http://cdn.weiunity.com/site/341/news/43b838ea6ad041898037eaaaf5802776.png)  
直接在其html代码末尾的位置加入以下代码：  

````
<!-- 增加某种语言切换的按钮。注意 ul上加了一个 class="ignore" 代表这块代码不会被翻译到 -->
<ul class="ignore">
	<li><a href="javascript:translate.changeLanguage('english');">English</a></li>|
	<li><a href="javascript:translate.changeLanguage('chinese_simplified');">简体中文</a></li>|
	<li><a href="javascript:translate.changeLanguage('chinese_traditional');">繁體中文</a></li>
</ul>

<script>
	layui.extend({
		translate: '{/}https://res.zvo.cn/translate/else/layui_exts/translate/translate' // {/}的意思即代表采用自有路径，即不跟随 base 路径
	})
	//使用拓展模块
	layui.use(['translate'], function(){
		var translate = layui.translate;
		translate.selectLanguageTag.show = false; //不出现的select的选择语言
		translate.service.use('client.edge'); //设置翻译通道
		//当页面加载完后执行翻译操作
		window.onload = function () {
			translate.execute();
		};  
	});
</script>

````

## 更多扩展用法及其他说明，请参考主项目 

github: [https://github.com/xnx3/translate](https://github.com/xnx3/translate)  
gitee: [https://gitee.com/mail_osc/translate](https://gitee.com/mail_osc/translate) 



## 开源项目

致力于开源基础化信息建设，如有需要，可直接拿去使用。这里列出了我部分开源项目：

| 项目| star数量 | 简介 |  
| --- | --- | --- |
|[wangmarket CMS](https://gitee.com/mail_osc/wangmarket) | ![](https://gitee.com/mail_osc/wangmarket/badge/star.svg?theme=white) | [私有部署自己的SAAS建站系统](https://gitee.com/mail_osc/wangmarket)  |
|[obs-datax-plugins](https://gitee.com/HuaweiCloudDeveloper/obs-datax-plugins) | ![](https://gitee.com/HuaweiCloudDeveloper/obs-datax-plugins/badge/star.svg?theme=white) | [Datax 的 华为云OBS 插件](https://gitee.com/HuaweiCloudDeveloper/obs-datax-plugins) |
| [templatespider](https://gitee.com/mail_osc/templatespider) | ![](https://gitee.com/mail_osc/templatespider/badge/star.svg?theme=white) | [扒网站工具，所见网站皆可为我所用](https://gitee.com/mail_osc/templatespider) |
|[FileUpload](https://gitee.com/mail_osc/FileUpload)| ![](https://gitee.com/mail_osc/FileUpload/badge/star.svg?theme=white ) | [文件上传，各种存储任意切换](https://gitee.com/mail_osc/FileUpload) |
| [cms client](https://gitee.com/HuaweiCloudDeveloper/huaweicloud-obs-website-wangmarket-cms) | ![](https://gitee.com/HuaweiCloudDeveloper/huaweicloud-obs-website-wangmarket-cms/badge/star.svg?theme=white) | [云服务深度结合无服务器建站](https://gitee.com/HuaweiCloudDeveloper/huaweicloud-obs-website-wangmarket-cms)  |
| [kefu.js](https://gitee.com/mail_osc/kefu.js) | ![](https://gitee.com/mail_osc/kefu.js/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/kefu.js | [在线聊天的前端框架](https://gitee.com/mail_osc/kefu.js)  | 
| [msg.js](https://gitee.com/mail_osc) | ![](https://gitee.com/mail_osc/msg/badge/star.svg?theme=white ) | [轻量级js消息提醒组件](https://gitee.com/mail_osc)  | 
| [translate.js](https://gitee.com/mail_osc/translate) | ![](https://gitee.com/mail_osc/translate/badge/star.svg?theme=white )  | [三行js实现 html 全自动翻译](https://gitee.com/mail_osc/translate)  | 
| [WriteCode](https://gitee.com/mail_osc/writecode) | ![](https://gitee.com/mail_osc/writecode/badge/star.svg?theme=white ) | [代码生成器，自动写代码](https://gitee.com/mail_osc/writecode)  | 
| [log](https://gitee.com/mail_osc/log) | ![](https://gitee.com/mail_osc/log/badge/star.svg?theme=white ) | [Java日志存储及读取](https://gitee.com/mail_osc/log) | 
| [layui translate](https://gitee.com/mail_osc/translate_layui) |  ![](https://gitee.com/mail_osc/translate_layui/badge/star.svg?theme=white ) | [Layui的国际化支持组件](https://gitee.com/mail_osc/translate_layui) |
| [http.java](https://gitee.com/mail_osc/http.java) |  ![](https://gitee.com/mail_osc/http.java/badge/star.svg?theme=white ) | [Java8轻量级http请求类](https://gitee.com/mail_osc/http.java) |
| [xnx3](https://gitee.com/mail_osc/xnx3) |  ![](https://gitee.com/mail_osc/xnx3/badge/star.svg?theme=white ) | [Java版按键精灵，游戏辅助开发](https://gitee.com/mail_osc/xnx3) |  
| [websocket.js](https://gitee.com/mail_osc/websocket.js)  | ![](https://gitee.com/mail_osc/websocket.js/badge/star.svg?theme=white ) | [js的WebSocket框架封装](https://gitee.com/mail_osc/websocket.js) |
| [email.java](https://gitee.com/mail_osc/email.java) | ![](https://gitee.com/mail_osc/email.java/badge/star.svg?theme=white ) | [邮件发送](https://gitee.com/mail_osc/email.java) | 
| [notification.js](https://gitee.com/mail_osc/notification.js) | ![](https://gitee.com/mail_osc/notification.js/badge/star.svg?theme=white ) | [浏览器通知提醒工具类](https://gitee.com/mail_osc/notification.js) | 
| [pinyin.js](https://gitee.com/mail_osc/pinyin.js) | ![](https://gitee.com/mail_osc/pinyin.js/badge/star.svg?theme=white ) | [JS中文转拼音工具类](https://gitee.com/mail_osc/pinyin.js) |
| [xnx3_weixin](https://gitee.com/mail_osc/xnx3_weixin) | ![](https://gitee.com/mail_osc/xnx3_weixin/badge/star.svg?theme=white ) | [Java 微信常用工具类](https://gitee.com/mail_osc/xnx3_weixin) |
| [xunxian](https://gitee.com/mail_osc/xunxian) | ![](https://gitee.com/mail_osc/xunxian/badge/star.svg?theme=white ) | [QQ寻仙的游戏辅助软件](https://gitee.com/mail_osc/xunxian) | 
| [wangmarket_shop](https://gitee.com/leimingyun/wangmarket_shop) | ![](https://gitee.com/leimingyun/wangmarket_shop/badge/star.svg?theme=white ) | [私有化部署自己的 SAAS 商城](https://gitee.com/leimingyun/wangmarket_shop) |
| [wm](https://gitee.com/leimingyun/wm) | ![](https://gitee.com/leimingyun/wm/badge/star.svg?theme=white ) | [Java开发框架及规章约束](https://gitee.com/leimingyun/wm) |
| [yunkefu](https://gitee.com/leimingyun/yunkefu) | ![](https://gitee.com/leimingyun/yunkefu/badge/star.svg?theme=white ) | [私有化部署自己的SAAS客服系统](https://gitee.com/leimingyun/yunkefu) |
| [javadoc](https://gitee.com/leimingyun/javadoc) | ![](https://gitee.com/leimingyun/javadoc/badge/star.svg?theme=white) | [根据标准的 JavaDoc 生成接口文档 ](https://gitee.com/leimingyun/javadoc) |
| [elasticsearch util](https://gitee.com/leimingyun/elasticsearch) | ![](https://gitee.com/leimingyun/elasticsearch/badge/star.svg?theme=white ) | [用sql方式使用Elasticsearch](https://gitee.com/leimingyun/elasticsearch) |
| [AutoPublish](https://gitee.com/leimingyun/sftp-ssh-autopublish) | ![](https://gitee.com/leimingyun/sftp-ssh-autopublish/badge/star.svg?theme=white ) | [Java应用全自动部署及更新](https://gitee.com/leimingyun/sftp-ssh-autopublish) |
| [aichat](https://gitee.com/leimingyun/aichat) | ![](https://gitee.com/leimingyun/aichat/badge/star.svg?theme=white ) | [智能聊天机器人](https://gitee.com/leimingyun/aichat) | 
| [yunbackups](https://gitee.com/leimingyun/yunbackups) | ![](https://gitee.com/leimingyun/yunbackups/badge/star.svg?theme=white ) | [自动备份文件到云存储及FTP等](https://gitee.com/leimingyun/yunbackups) |
| [chatbot](https://gitee.com/leimingyun/chatbot) | ![](https://gitee.com/leimingyun/chatbot/badge/star.svg?theme=white) | [智能客服机器人](https://gitee.com/leimingyun/chatbot) |
| [java print](https://gitee.com/leimingyun/printJframe) | ![](https://gitee.com/leimingyun/printJframe/badge/star.svg?theme=white ) | [Java打印及预览的工具类](https://gitee.com/leimingyun/printJframe) |
…………