layui 的 翻译插件


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

