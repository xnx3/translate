
## 介绍
网页自动翻译，页面无需另行改造，加入两行js即可让你的网页快速具备多国语言切换能力。   

## 体验-在网页上几秒增加多语言切换能力：
![效果](http://cdn.weiunity.com/site/341/news/9a7228aaae28475996da9026b93356c8.gif "")

1. 随便打开一个网页
2. 右键 - 审查元素
3. 粘贴入以下代码：	  
	```` var head= document.getElementsByTagName('head')[0];  var script= document.createElement('script');  script.type= 'text/javascript';  script.src= 'https://res.zvo.cn/translate/inspector.js';  head.appendChild(script);  ````
4. Enter 回车键 ， 执行
5. 在当前网页的左上角，就出现了一个大大的切换语言，切换试试看。

## 在线体验
http://res.zvo.cn/translate/demo.html

## 快速使用
在网页最末尾， ````</html>```` 之前，加入以下代码，一般在页面的最底部就出现了选择语言的 select 切换标签。 其实就这么简单：

````
<script src="https://res.zvo.cn/translate/translate.js"></script>
<script>
translate.setUseVersion2(); //设置使用v2.x 版本
translate.execute();//进行翻译 
</script>
````

## 更多扩展用法

##### 指定切换语言的select选择框的位置
你想在你页面什么地方显示，就吧下面这个放到哪即可。

````
<div id="translate"></div>
````

主要是这个 id="translate" 切换语言的按钮会自动赋予这个id里面。当然你也不一定非要是div的，也可以这样

````
<span id="translate"></span>
````

##### CSS美化切换语言按钮
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

##### 设定是否自动出现 select 切换语言

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

#### 翻译时忽略指定的tag标签

````
translate.ignore.tag.push('span'); //翻译时追加上自己想忽略不进行翻译的tag标签，凡是在这里面的，都不进行翻译。
````
翻译时追加上自己想忽略不进行翻译的tag标签，凡是在这里面的，都不进行翻译。  
如果你想查看当前忽略哪些tag标签，可直接执行 ```` console.log(translate.ignore.tag); ```` 进行查看
**注意，这行要放到 translate.execute(); 上面**

#### 翻译时忽略指定的class值

````
translate.ignore.class.push('test');	//翻译时追加上自己想忽略不进行翻译的class标签，凡是在这里面的，都不进行翻译。
````
翻译时追加上自己想忽略不进行翻译的class标签，凡是在这里面的，都不进行翻译。  
如果你想查看当前忽略哪些tag标签，可直接执行 ```` console.log(translate.ignore.class); ```` 进行查看
**注意，这行要放到 translate.execute(); 上面**

#### 翻译指定的区域

````
var documents = [];
documents.push(document.getElementById('test1'));
documents.push(document.getElementById('test2'));
documents.push(document.getElementById('test3'));
translate.setDocuments(documents); //指定要翻译的元素的集合,可传入一个或多个元素。如果不设置，默认翻译整个网页
````

可使用 translate.setDocuments(...) 指定要翻译的元素的集合,可传入一个或多个元素。如果不设置此，默认翻译整个网页。  
**注意，这行要放到 translate.execute(); 上面**

##### ajax请求后进行翻译
对于一些网页需要通过ajax请求来加载数据的情况，当加载完数据时，手动执行此方法，使刚加载的信息也进行翻译

````
translate.execute();
````

##### js主动切换语言
比如点击某个链接显示英文界面

````
<a href="javascript:translate.changeLanguage('english');" class="ignore">切换为英语</a>
````

只需传入翻译的目标语言，即可快速切换到指定语种。具体有哪些语言，可查阅： [http://api.translate.zvo.cn/htmldoc/language.json.html](http://api.translate.zvo.cn/htmldoc/language.json.html)  
其中 ````class="ignore"```` 加了这个class，代表这个a标签将不会被翻译 


## 实际使用场景示例
#### 普通网站中点击某个语言进行切换
如下图所示，网站中的某个位置要有几种语言切换  
![](http://cdn.weiunity.com/site/341/news/43b838ea6ad041898037eaaaf5802776.png)  
直接在其html代码末尾的位置加入以下代码：  

````
<!-- 引入多语言切换的js -->
<script src="https://res.zvo.cn/translate/translate.js"></script>
<script>
	translate.setUseVersion2(); //设置使用v2.x 版本
	translate.selectLanguageTag.show = false; //不出现的select的选择语言
	translate.execute();
</script>

<!-- 增加某种语言切换的按钮。注意 ul上加了一个 class="ignore" 代表这块代码不会被翻译到 -->
<ul class="ignore">
	<li><a href="javascript:translate.changeLanguage('english');">English</a></li>|
	<li><a href="javascript:translate.changeLanguage('chinese_simplified');">简体中文</a></li>|
	<li><a href="javascript:translate.changeLanguage('chinese_traditional');">繁體中文</a></li>
</ul>
````

## 交流
作者微信：xnx3com  
交流QQ群:181781514  （建议加群，使用中问题，以及异常可以在群里随时交流）
