
<h1 align="center">
    translate.js
</h1>
<h4 align="center">
    两行js实现html全自动翻译
</h4> 
<h4 align="center">
    当前为中文文档 |  <a href="doc/README.cn.md">see english documents</a>
</h4> 


# 介绍
网页自动翻译，页面无需另行改造，加入两行js即可让你的网页快速具备多国语言切换能力。   

# 特性
* **使用简单易用。** 几行代码即可拥有多过语言切换能力
* **不增加工作量。** 无需另行改造页面本身
* **极其灵活扩展。** 您可指定它只翻译某些指定区域、切换语言时显示下拉框还是通过摆放多个切换语言按钮进行、可指定某些特定的元素不进行翻译忽略……
* **自动匹配语种。** 自动根据用户所在的国家切换其国家所使用的语种
* **瞬间翻译能力。** 内置缓存预加载机制，只要翻译过的网页，再次看时会达到瞬间翻译的效果，给用户的感觉就是，这个页面本来就是这种语言的，而不是经过第三方翻译的。
* **永久免费使用。** 本人热衷开源，有开源项目二三十个，这个项目的初衷也不是捞钱的，所以您无需担心收费问题！当然如果您项目比较大，日访问量到了百万级千万级的，我们还是建议您私有化部署。


# 在线体验
http://res.zvo.cn/translate/demo.html


# 先拿别人的网站动手试试
![效果](http://cdn.weiunity.com/site/341/news/9a7228aaae28475996da9026b93356c8.gif "")

1. 随便打开一个网页
2. 右键 - 审查元素
3. 粘贴入以下代码：	  
	```` var head= document.getElementsByTagName('head')[0];  var script= document.createElement('script');  script.type= 'text/javascript';  script.src= 'https://res.zvo.cn/translate/inspector.js';  head.appendChild(script);  ````
4. Enter 回车键 ， 执行
5. 在当前网页的左上角，就出现了一个大大的切换语言，切换试试看。

# 快速使用
在网页最末尾， ````</html>```` 之前，加入以下代码，一般在页面的最底部就出现了选择语言的 select 切换标签。 其实就这么简单：

````
<script src="https://res.zvo.cn/translate/translate.js"></script>
<script>
translate.setUseVersion2(); //设置使用v2.x 版本
translate.execute();//进行翻译 
</script>
````

# 更多扩展用法

### 指定切换语言的select选择框的位置
你想在你页面什么地方显示，就吧下面这个放到哪即可。

````
<div id="translate"></div>
````

主要是这个 id="translate" 切换语言的按钮会自动赋予这个id里面。当然你也不一定非要是div的，也可以这样

````
<span id="translate"></span>
````

### CSS美化切换语言按钮
可使用css来控制切换语言选择的显示位置及美观。如：

````
<style>
.translateSelectLanguage{
	position: absolute;
	top:100px;
	right:100px;
}
</style>
````
这就是控制切换语言的 ``<select>`` 标签

### 设定是否自动出现 select 切换语言

````
/*
 * 是否显示 select选择语言的选择框，true显示； false不显示。默认为true
 * 注意,这行要放到 translate.execute(); 上面
 */
translate.selectLanguageTag.show = false;
translate.execute();
````

使用场景是，如果使用了:  

````
<a href="javascript:translate.changeLanguage('en');">切换为英语</a>
````

这种切换方式，那么 select下拉选择的就用不到了，就可以用此方式来不显示。  
当然你也可以使用css的方式来控制其不显示。比如：   

````
<style>
#translate{
	display:none;
}
</style>
````

### 翻译时忽略指定的tag标签

````
translate.ignore.tag.push('span'); //翻译时追加上自己想忽略不进行翻译的tag标签，凡是在这里面的，都不进行翻译。
````
翻译时追加上自己想忽略不进行翻译的tag标签，凡是在这里面的，都不进行翻译。  
如果你想查看当前忽略哪些tag标签，可直接执行 ```` console.log(translate.ignore.tag); ```` 进行查看
**注意，这行要放到 translate.execute(); 上面**

### 翻译时忽略指定的class值

````
translate.ignore.class.push('test');	//翻译时追加上自己想忽略不进行翻译的class标签，凡是在这里面的，都不进行翻译。
````
翻译时追加上自己想忽略不进行翻译的class标签，凡是在这里面的，都不进行翻译。  
如果你想查看当前忽略哪些tag标签，可直接执行 ```` console.log(translate.ignore.class); ```` 进行查看  
**注意，这行要放到 translate.execute(); 上面**

### 翻译指定的区域

````
var documents = [];
documents.push(document.getElementById('test1'));
documents.push(document.getElementById('test2'));
documents.push(document.getElementById('test3'));
translate.setDocuments(documents); //指定要翻译的元素的集合,可传入一个或多个元素。如果不设置，默认翻译整个网页
````

可使用 translate.setDocuments(...) 指定要翻译的元素的集合,可传入一个或多个元素。如果不设置此，默认翻译整个网页。  
**注意，这行要放到 translate.execute(); 上面**

### js主动切换语言
比如点击某个链接显示英文界面

````
<a href="javascript:translate.changeLanguage('english');" class="ignore">切换为英语</a>
````

只需传入翻译的目标语言，即可快速切换到指定语种。具体有哪些语言，可查阅： [http://api.translate.zvo.cn/doc/language.json.html](http://api.translate.zvo.cn/doc/language.json.html)  
其中 ````class="ignore"```` 加了这个class，代表这个a标签将不会被翻译 

### 自动根据用户所在的国家切换其语种

用户第一次打开网页时，自动判断当前用户所在国家使用的是哪种语言，来自动进行切换为用户所在国家的语种。  
如果用户手动切换了别的语种，再使用时，那就优先以用户所选择的为主，这个就不管用了。  

````
translate.setAutoDiscriminateLocalLanguage();	//设置用户第一次用时，自动识别其所在国家的语种进行切换
````

### 设置本地语种（当前网页的语种）

````
translate.language.setLocal('chinese_simplified'); //设置本地语种（当前网页的语种）。如果不设置，默认就是 chinese_simplified 简体中文 
````
具体有哪些语言，可查阅： [http://api.translate.zvo.cn/doc/language.json.html](http://api.translate.zvo.cn/doc/language.json.html)  
如果不设置，默认是简体中文 : chinese_simplified  
这个会在出现 select 选择语言时，如果第一次使用，默认选中的就是这里设置的本地语种。

**注意，这行要放到 translate.execute(); 上面**

### 为ajax动态加载的数据渲染展示情况进行适配

正常情况下，极大可能会有这种需求：
1. 页面中需要通过ajax请求后端服务器获取数据，然后再将数据渲染展示出来。
2. 页面中的弹出提示 （就比如 [msg.js](https://gitee.com/mail_osc/msg) 的 ````msg.info('你好');```` ） 这个提示是js加载出来的，提示文字也需要一并进行翻译的情况
您可加入下面一行代码，来实现以上需求。  

````
translate.listener.start();	//开启html页面变化的监控，对变化部分会进行自动翻译。注意，这里变化区域，是指使用 translate.setDocuments(...) 设置的区域。如果未设置，那么为监控整个网页的变化
````
建议放在 translate.execute() 这行之前

# 实际使用场景示例
### 普通网站中点击某个语言进行切换
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

<!-- 引入多语言切换的js -->
<script src="https://res.zvo.cn/translate/translate.js"></script>
<script>
	translate.setUseVersion2(); //设置使用v2.x 版本
	translate.selectLanguageTag.show = false; //不出现的select的选择语言
	translate.execute();
</script>
````

# 版本
注意，v1.x 跟 v2.x 使用上略有差别，可使用 ````console.log(translate.version);```` 查看当前使用的版本。  
另外 v1.x 版本的相关说明参见： [使用说明](v1.md) | [在线demo](https://res.zvo.cn/translate/demo_v1.html)

### v1.0
2022.2月发布，提供多语言支持能力，使网页无需改动快速具备多语言切换能力。

### v2.0
2022.12月发布，增加更多的扩展方法。  
1. 可自定义忽略的Tag标签，进行翻译时会忽略之
2. 可自定义忽略的class，进行翻译时会忽略之
3. 默认内置 class="ignore" 为忽略的class，可在某个标签上增加此属性，即可使其跳过不进行翻译。
4. 增加缓存机制，翻译一次后会将结果进行缓存，翻译过后，再查看，会达到秒翻译的结果，极大提高体验度。
5. 增加局部翻译的能力，可支持自定义翻译的区域。
6. 优化 input 输入框的 placeholder 的内容不翻译的问题
7. 优化本地使用（file协议）时无法测试的问题。现在本地也能正常使用及测试了。
8. 修复翻译时会莫名其妙多了无数层font标签的问题
9. 修复翻译时，像是中文翻译为韩语，鼠标多经过几次会将其翻译的韩语重复翻译导致翻译结果不准确的问题。
10. 开放翻译云服务平台接口 http://api.translate.zvo.cn/doc/index.html

### v2.1
...

# 优秀开源项目及社区推荐
[LinkWeChat](https://gitee.com/LinkWeChat/link-wechat) LinkWeChat 是基于企业微信的开源 SCRM 系统，是企业私域流量管理与营销的综合解决方案。  
[IoTSharp](https://gitee.com/IoTSharp) IoTSharp 是一个 基于.Net Core 开源的物联网基础平台， 支持 HTTP、MQTT 、CoAp 协议  
[流之云](https://gitee.com/ntdgg) 信息化、数字化服务提供商  
[translate.js](https://gitee.com/mail_osc/translate) 网页自动翻译，页面无需另行改造，加入两行js即可让你的网页快速具备多国语言切换能力！  



# 其他说明
当前v2.0版本还处于优化期，并非完美稳定版本，当前只测试了大部分网站能完美适配，但肯定会有遗漏，随着使用的网站不断增加，会逐步修复发现的bug。稳定版本预计将会再之后的三到四个月后发布。当前您使用v2版本时，可直接用我们的js源即可，如果您有本地化的需求，可再后面稳定版本发布后再进行本地化放置。  
本人热爱开源这件事，如果您是某款开源框架的作者，想要在您开源项目中加入此多语言切换能力，但接入时遇到了困难，欢迎加入下面的QQ群，说明您是哪个开源软件的作者，我必将全力协助。愿意开源的朋友，都是值得尊敬且支持的。  
本云服务器平台可私有化部署，如果您有这方面需求，也可以联系我，但这个部署耗时几小时到半天，我们也需要给同事发工资，疫情三年都比较艰难，所以部署这块没法无偿帮助了，提供有偿部署，收个几百的人工费，还望能理解。  

# 交流
如果您在使用过程中遇到任何异常情况，请详细说一下您遇到的问题。如果可以，请写下您的网站，以便我们可以更全面地测试，以便快速找到问题所在  
作者微信：xnx3com  
交流QQ群:181781514 
