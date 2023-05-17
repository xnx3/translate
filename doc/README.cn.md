
<h1 align="center">
    translate.js
</h1>
<h4 align="center">
    两行js实现html全自动翻译。 <br/>
    无需改动页面、无语言配置文件、无API Key、对SEO友好！
</h4> 
<h4 align="center">
    当前为中文文档 |  <a href="../README.md">See English Documents</a>
</h4> 


# 特性
* **使用极其简单。** 无需任何前期准备，直接加入几行代码即可拥有多种语言全自动切换能力。
* **不增加工作量。** 无需另行改造页面本身，也没有各种语言都要单独配置的语言文件，更不需要你对页面本身要显示的文字区域进行代码调用，我认为那样对技术人员实在是太不友好了。而且它也不需要你到某某网站申请什么key，它本身就是开放的，拿来即用。
* **极其灵活扩展。** 您可指定它只翻译某些指定区域、切换语言时显示下拉框还是通过摆放多个切换语言按钮进行、可指定某些特定的元素不进行翻译忽略……
* **自动匹配语种。** 自动根据用户所在的国家切换其国家所使用的语种
* **瞬间翻译能力。** 内置缓存预加载机制，只要翻译过的网页，再次看时会达到瞬间翻译的效果，给用户的感觉就是，这个页面本来就是这种语言的，而不是经过第三方翻译的。
* **永久免费使用。** 采用Apache-2.0开源协议，您可永久免费使用。
* **搜索引擎友好。** 完全不影响你本身网站搜索引擎的收录。爬虫所爬取的网页源代码，它不会对其进行任何改动，你可完全放心。
* **后端翻译开源。** 在某些政府机关及大集团内部项目中，对数据隐私及安全保密有强要求场景、或您对自有客户希望提供自建高可靠翻译服务场景时，您可将后端翻译接口进行私有化部署，不走我们公开开放的翻译接口，以做到安全保密及后端服务全部自行掌控。 


# 在线体验
http://res.zvo.cn/translate/demo.html


# 先拿别人的网站动手试试
![效果](http://cdn.weiunity.com/site/341/news/9a7228aaae28475996da9026b93356c8.gif "")

1. 随便打开一个网页
2. 右键 - 审查元素
3. 粘贴入以下代码：	  
	```` var head= document.getElementsByTagName('head')[0];  var script= document.createElement('script');  script.type= 'text/javascript';  script.src= 'https://res.zvo.cn/translate/inspector_v2.js';  head.appendChild(script);  ````
4. Enter 回车键 ， 执行
5. 在当前网页的左上角，就出现了一个大大的切换语言，切换试试看。

# 快速使用
在网页最末尾， ````</html>```` 之前，加入以下代码，一般在页面的最底部就出现了选择语言的 select 切换标签。 其实就这么简单：

````
<script src="https://res.zvo.cn/translate/translate.js"></script>
<script>
translate.setUseVersion2(); //设置使用v2.x 版本
translate.language.setLocal('chinese_simplified'); //设置本地语种（当前网页的语种）。如果不设置，默认自动识别当前网页显示文字的语种。 可填写如 'english'、'chinese_simplified' 等，具体参见文档下方关于此的说明。
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

### 自定义出现的 select 切换语言所支持的语种

````
translate.selectLanguageTag.languages = 'english,chinese_simplified,korean'; //每个语种之间用英文,分割。比如这里设置的是支持英语、简体中文、韩语 的切换。根据后端翻译服务不同，支持的语言也不同。具体支持哪些，可通过 http://api.translate.zvo.cn/doc/language.json.html 获取 （如果您私有部署的，将请求域名换为您自己私有部署的域名）
````
每个语种之间用英文,分割。比如这里设置的是支持英语、简体中文、韩语 的切换。根据后端翻译服务不同，支持的语言也不同。  
具体支持哪些，可通过 http://api.translate.zvo.cn/doc/language.json.html 获取 （如果您私有部署的，将请求域名换为您自己私有部署的域名）  
**注意，这行要放到 translate.execute(); 上面**

### 翻译时忽略指定的tag标签

````
translate.ignore.tag.push('span'); //翻译时追加上自己想忽略不进行翻译的tag标签，凡是在这里面的，都不进行翻译。
````
翻译时追加上自己想忽略不进行翻译的tag标签，凡是在这里面的，都不进行翻译。  
如果你想查看当前忽略哪些tag标签，可直接执行 ```` console.log(translate.ignore.tag); ```` 进行查看
**注意，这行要放到 translate.execute(); 上面**

### 翻译时忽略指定的class值

````
translate.ignore.class.push('test');	//翻译时追加上自己想忽略不进行翻译的class name的值，凡是在这里面的，都不进行翻译。
````
翻译时追加上自己想忽略不进行翻译的class标签，凡是在这里面的，都不进行翻译。  
如果你想查看当前忽略哪些class，可直接执行 ```` console.log(translate.ignore.class); ```` 进行查看  
**注意，这行要放到 translate.execute(); 上面**

### 翻译时忽略指定的id值

````
translate.ignore.id.push('test');	//翻译时追加上自己想忽略不进行翻译的id的值，凡是在这里面的，都不进行翻译。
````
翻译时追加上自己想忽略不进行翻译的id的值，凡是在这里面的，都不进行翻译。  
如果你想查看当前忽略哪些id，可直接执行 ```` console.log(translate.ignore.id); ```` 进行查看  
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
当前支持的本地语种有：  
* **chinese_simplified** 简体中文
* **chinese_traditional** 繁体中文
* **english** 英语  
如果不设置，默认会自动识别当前网页的文本，取当前网页文本中，出现频率最高的语种为默认语种。  
这个会在出现 select 选择语言时，默认选中的语种。  

**注意，这行要放到 translate.execute(); 上面**

### 对页面动态渲染的文本进行自动翻译

正常情况下，极大可能会有这种需求：
1. 页面中需要通过ajax请求后端服务器获取数据，然后再将数据渲染展示出来。
2. 页面中的弹出提示 （就比如 [msg.js](https://gitee.com/mail_osc/msg) 的 ````msg.info('你好');```` ） 这个提示是js加载出来的，提示文字也需要一并进行翻译的情况
您可加入下面一行代码，来实现以上需求。  

````
translate.listener.start();	//开启html页面变化的监控，对变化部分会进行自动翻译。注意，这里变化区域，是指使用 translate.setDocuments(...) 设置的区域。如果未设置，那么为监控整个网页的变化
````
建议放在 translate.execute() 这行之前。
##### 注意事项
如果你手动设置了 ````translate.setDocuments(...)```` ，那么监听的就不是整个页面了，而是单纯只监听 ````setDocuments(...)````  所设置的区域的改动。

### 私有化部署翻译服务接口
在某些政府机关及大集团内部项目中，对数据隐私及安全保密有强要求场景、以及您对自有客户希望提供高可靠翻译服务场景时，您可将翻译服务接口进行私有化部署，不走我们公开开放的翻译接口，以做到安全保密及后端服务全部自行掌控。    
实际部署方式，可参考：[https://github.com/xnx3/translate_service](https://github.com/xnx3/translate_service)  
部署好后，在 ````translate.execute();```` 之前，加入一行代码，如下所示：

````
translate.request.api.host='http://121.121.121.121/'; //将这里面的ip地址换成你服务器的ip，注意开头，及结尾还有个 / 别拉下
translate.execute();
````

如此，翻译请求接口就会走您自己服务器了。

### 翻译完后自动执行
当翻译完成后会自动触发执行某个方法，以便您来做自定义扩展。比如 [layui的翻译组件](https://gitee.com/mail_osc/translate_layui) 便是使用了此能力在翻译完成后重新绘制 select 选中项。

````
translate.listener.renderTaskFinish = function(task){
	console.log('执行完一次');
}
````
  
进行翻译时每当执行完一次渲染任务（翻译）时会触发此。注意页面一次翻译会触发多个渲染任务。普通情况下，一次页面的翻译可能会触发两三次渲染任务。（因为一个网页上可能有多种语言，每种语言都是一次翻译任务。）  
另外如果页面中有ajax交互方面的信息时，每次ajax信息刷新后，也会进行翻译，也是一次翻译任务。  
当然，这里的翻译任务是确实有进行了翻译的前提下，执行完才会触发此。  

### 自定义翻译术语
如果你感觉某些翻译不准确，可进行针对性的定义某些词的翻译结果，进行自定义术语库。使用的方法为：

````
translate.nomenclature.append(from, to, properties);
````
传入参数解释：  
* **from** 要转换的语种，传入如 chinese_simplified
* **to** 翻译至的目标语种，传入如 english
* **properties** 配置表，格式便是properties的格式，每行一个规则，每个前后用等号分割，等号前是要翻译的词或句子，等号后是自定义的翻译结果。传入如:  

````
你好=Hello
世界=ShiJie	
````

比如，要自定义 “网市场云建站系统” 、 “国际化” 这两个词有简体中文翻译为英文的结果，可以这么写：  

````
translate.nomenclature.append('chinese_simplified','english',`
网市场云建站系统=wangmarket CMS
国际化=GuoJiHua
`);
````

这个自定义术语库的可以单独用一个js文件来定义，如此定义一次，在类似的项目中有使用，可直接将之前定义的js术语库文件复制来引入即可方便使用。  
当前正在优化中，如果原语种是中文、韩文还可以，像是英语结果会不准，如果您项目中用到了，发现异常时，可联系我，免费帮您调试好的同时还能完善本项目。  
**注意，这行要放到 translate.execute(); 上面**

##### 示例
这里给出一个示例用于参考，链接地址： [https://res.zvo.cn/translate/doc/demo_nomenclature.html](https://res.zvo.cn/translate/doc/demo_nomenclature.html)  
您可打开后查看页面源代码，即可看到它是如何设置的。  

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

# 参与
您可直接 fork 本项目，注意，是github仓库 [https://github.com/xnx3/translate](https://github.com/xnx3/translate) ，非 gitee 的仓库  
如果您改动了哪些代码，请在其中备注上自己的姓名、以及自己的个人主页，是您参与付出的留名。比如，陈某人参与了日语翻译的字符判断，那可以这样：  

````
/*
	是否包含日语，返回true:包含
	参与完善者：陈某人 https://www.chenmouren.com/xxxxx.html
*/
japanese:function(str){
	if(/.*[\u0800-\u4e00]+.*$/.test(str)){ 
		return true
	} else {
		return false;
	}
},

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
1. 本地语种时默认赋予使用v2版本翻译
1. 增加 ````translate.language.connector()```` 对句子的连接符单独进行适配
1. 增加如果是被 ````<!-- -->```` 注释的区域，不进行翻译
1. 增加英文 README 文档
1. 增加对图片alt、meta关键词及描述的翻译
1. 优化判断本地语种跟要翻译的目标语种是否一样，如果是一样，那就不需要进行任何翻译
1. 增加 ````translate.listener.start()```` 可对当前页面变化的区域进行自动翻译，比如ajax加载数据后进行渲染
1. ````translate.execute(...)```` 增加可传入翻译区域，传入的区域只是单纯做一次性翻译，不会影响 ````setDocuments(...)```` 的值
1. 加入任务队列机制，彻底解决翻译时非常小概率有文字遗漏不翻译的问题。
1. 增加 ````translate.setAutoDiscriminateLocalLanguage();```` 用户第一次用时，可自动识别其所在国家的语种进行切换

### v2.2
1. 开放后端翻译服务接口的私有化一键部署，并开源。
2. 大幅优化句子翻译的准确性，达到百度翻译、谷歌翻译的程度
3. 增加可配置对某个元素指定id忽略其不进行翻译
4. 增加单独针对连接符识别判断，以提高翻译准确度
5. 增加可针对 translate.request.api.host 单独配置，以私有化部署
6. 增加 inspector_v2.js ，用于v2版本的快速转换体验，并将readme中的快速体验默认便是使用此v2版本。
8. 增加 translate.language.autoRecognitionLocalLanguage(); 如果未手动设置当前网页的语种，会自动识别语种
9. 增加 translate.language.getLocal() 用户获取当前网页的语种（如果未设置，自动根据网页当前显示的文字进行识别语种）
10. 增加 translate.selectLanguageTag.selectOnChange 用于提供重写select onchange 事件，以便更好扩展
11. 优化中英文混合时翻译的一些意外问题
12. 优化meta - keywords 替换的问题
13. 优化转英文时如果英文有'，比如 let's 这种的情况
14. 优化 ignore 对忽略class name有多情况下的判断
15. 开放后端翻译服务接口文档，以便更好自有扩展及使用
16. 修复tag有时失效的问题，比如监听状态下局部翻译情况

# 这些开源项目正在使用
如下开源项目中已置入自动化翻译的能力：  
[kefu.js](https://gitee.com/mail_osc/kefu.js) H5在线客服，引入一行js代码拿来即用！支持手机、电脑、APP、小程序。可一键部署自己私有SAAS云客服平台  
[Pear Admin Layui](https://gitee.com/pear-admin/Pear-Admin-Layui) Pear Admin 是一款开箱即用的前端开发模板，扩展Layui原生UI样式，整合第三方开源组件，提供便捷快速的开发方式，延续LayuiAdmin  
[Layui](https://gitee.com/mail_osc/translate_layui) 翻译组件 
...  

# 优秀开源项目及社区推荐
[Featbit](https://github.com/featbit/featbit) 一个100%开源的 Feature flags / Feature Management 平台工具
[LinkWeChat](https://gitee.com/LinkWeChat/link-wechat) LinkWeChat 是基于企业微信的开源 SCRM 系统，是企业私域流量管理与营销的综合解决方案。  
[IoTSharp](https://gitee.com/IoTSharp) IoTSharp 是一个 基于.Net Core 开源的物联网基础平台， 支持 HTTP、MQTT 、CoAp 协议  
[流之云](https://gitee.com/ntdgg) 信息化、数字化服务提供商  


# 我的其他开源项目

这里列出了我部分开源项目：

| 开源项目 | star数量 | 仓库 |
| --- | --- | --- |
| 可私有部署 SAAS 建站系统  |  ![](https://gitee.com/mail_osc/wangmarket/badge/star.svg?theme=white) | https://gitee.com/mail_osc/wangmarket |
| Datax 的 华为云OBS 插件 | ![](https://gitee.com/HuaweiCloudDeveloper/obs-datax-plugins/badge/star.svg?theme=white) | https://gitee.com/HuaweiCloudDeveloper/obs-datax-plugins |
| 扒网站工具 | ![](https://gitee.com/mail_osc/templatespider/badge/star.svg?theme=white)  |  https://gitee.com/mail_osc/templatespider | 
| 文件上传工具类，OBS存储  | ![](https://gitee.com/mail_osc/FileUpload/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/FileUpload |
| 智能客服机器人  | ![](https://gitee.com/leimingyun/chatbot/badge/star.svg?theme=white ) | https://gitee.com/leimingyun/chatbot |
| 结合云存储做网站无需服务器  | ![](https://gitee.com/HuaweiCloudDeveloper/huaweicloud-obs-website-wangmarket-cms/badge/star.svg?theme=white ) | [huaweicloud-obs-website-wangmarket-cms](https://gitee.com/HuaweiCloudDeveloper/huaweicloud-obs-website-wangmarket-cms) |
| kefu.js 在线聊天的前端  | ![](https://gitee.com/mail_osc/kefu.js/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/kefu.js |
| 轻量级js消息提醒组件  | ![](https://gitee.com/mail_osc/msg/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/msg |
| js 实现 html 全自动翻译  | ![](https://gitee.com/mail_osc/translate/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/translate |
| 代码生成器，自动写代码  | ![](https://gitee.com/mail_osc/writecode/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/writecode |
| Java日志存储及读取 | ![](https://gitee.com/mail_osc/log/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/log |
| Layui的国际化支持组件 | ![](https://gitee.com/mail_osc/translate_layui/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/translate_layui |
| Java8轻量级http请求类 | ![](https://gitee.com/mail_osc/http.java/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/http.java |
| Java版按键精灵，游戏辅助开发 | ![](https://gitee.com/mail_osc/xnx3/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/xnx3 |
| js的WebSocket框架封装 | ![](https://gitee.com/mail_osc/websocket.js/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/websocket.js |
| js邮件发送模块 | ![](https://gitee.com/mail_osc/email.java/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/email.java |
| WEB 端浏览器通知提醒工具类 | ![](https://gitee.com/mail_osc/notification.js/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/notification.js |
| JS中文转拼音工具类 | ![](https://gitee.com/mail_osc/pinyin.js/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/pinyin.js |
| Java-微信常用工具类 | ![](https://gitee.com/mail_osc/xnx3_weixin/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/xnx3_weixin |
| QQ寻仙的游戏辅助软件 | ![](https://gitee.com/mail_osc/xunxian/badge/star.svg?theme=white ) | https://gitee.com/mail_osc/xunxian |
| 私有化部署 SAAS商城 | ![](https://gitee.com/leimingyun/wangmarket_shop/badge/star.svg?theme=white ) | https://gitee.com/leimingyun/wangmarket_shop |
| Java开发框架及规章约束 | ![](https://gitee.com/leimingyun/wm/badge/star.svg?theme=white ) | https://gitee.com/leimingyun/wm |
| SAAS客服系统 | ![](https://gitee.com/leimingyun/yunkefu/badge/star.svg?theme=white ) | https://gitee.com/leimingyun/yunkefu |
| 根据标准的 JavaDoc 生成接口文档 | ![](https://gitee.com/leimingyun/javadoc/badge/star.svg?theme=white) | https://gitee.com/leimingyun/javadoc |
| 用sql方式使用Elasticsearch | ![](https://gitee.com/leimingyun/elasticsearch/badge/star.svg?theme=white ) | https://gitee.com/leimingyun/elasticsearch |
| Java应用全自动部署及更新 | ![](https://gitee.com/leimingyun/sftp-ssh-autopublish/badge/star.svg?theme=white ) | https://gitee.com/leimingyun/sftp-ssh-autopublish |
| 智能聊天机器人 | ![](https://gitee.com/leimingyun/aichat/badge/star.svg?theme=white ) | https://gitee.com/leimingyun/aichat |
| 自动备份文件到华为云 OBS | ![](https://gitee.com/leimingyun/yunbackups/badge/star.svg?theme=white ) | https://gitee.com/leimingyun/yunbackups |
| Java打印及预览的工具类 | ![](https://gitee.com/leimingyun/printJframe/badge/star.svg?theme=white ) | https://gitee.com/leimingyun/printJframe |
…………

# 其他
当前v2.0版本还处于优化期，并非完美稳定版本，当前只测试了大部分网站能完美适配，但肯定会有遗漏，随着使用的网站不断增加，会逐步修复发现的bug。稳定版本预计将会再之后的三到四个月后发布。当前您使用v2版本时，可直接用我们的js源即可，如果您有本地化的需求，可再后面稳定版本发布后再进行本地化放置。  
本人热爱开源这件事，如果您是某款开源框架的作者，想要在您开源项目中加入此多语言切换能力，但接入时遇到了困难，欢迎加入下面的QQ群，说明您是哪个开源软件的作者，我必将全力协助。愿意开源的朋友，都是值得尊敬且支持的。  
本云服务器平台可私有化部署，如果您有这方面需求，也可以联系我，但这个部署耗时几小时到半天，我们也需要给同事发工资，疫情三年都比较艰难，所以部署这块没法无偿帮助了，提供有偿部署，收个几百的人工费，还望能理解。  

# 交流
如果您在使用过程中遇到任何异常情况，请详细说一下您遇到的问题。如果可以，请写下您的网站，以便我们可以更全面地测试，以便快速找到问题所在  
作者微信：xnx3com  
交流QQ群:181781514  
github: [https://github.com/xnx3/translate](https://github.com/xnx3/translate)  
gitee:  [https://gitee.com/mail_osc/translate](https://gitee.com/mail_osc/translate)

# 高级服务
[当前translate.js是基于js来对当前html进行翻译，绝大多数场景足够使用。但如果你查看页面源代码，会发现源代码并不会变，处于未翻译状态。如果你想针对页面源代码本身直接进行翻译，可以点此查阅我们这个扩展版本](README_SERVICE.md)