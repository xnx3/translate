
## 介绍
国际化，网页自动翻译，在谷歌翻译的基础上进行了优化，同谷歌浏览器自动翻译的效果，适用于html网页。  
网页无需另行改造，增加两行js即可实现多国语言切换的能力。  

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

## 快速使用体验
在网页最末尾， ````</html>```` 之前，加入以下代码，一般在页面的最底部就出现了选择语言的 select 切换标签。 其实就这么简单：

````
<script src="//res.zvo.cn/translate/translate.js"></script>
<script> translate.execute();//进行翻译 </script>
````

## 更多扩展用法

##### 指定切换语言的select选择框的位置
你想在你页面什么地方显示，就吧下面这个放到哪即可。
````
<div id="translate"></div>
````

主要是这个 id="translate" 切换语言的按钮会自动赋予这个id里面。当然你也不一定时非要是div的，也可以这样

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

##### 设定 select 切换语言，支持哪些语言可切换

````
<script>
	translate.selectLanguageTag.languages = 'zh-CN,zh-TW,en';  //注意要放到 translate.execute(); 上面
	translate.execute();
</script>
````


默认不设置此，则支持 简体中文、繁体中文、英语 三种。
可设置的语言包括：

````
de,hi,lt,hr,lv,ht,hu,zh-CN,hy,uk,mg,id,ur,mk,ml,mn,af,mr,uz,ms,el,mt,is,it,my,es,et,eu,ar,pt-PT,ja,ne,az,fa,ro,nl,en-GB,no,be,fi,ru,bg,fr,bs,sd,se,si,sk,sl,ga,sn,so,gd,ca,sq,sr,kk,st,km,kn,sv,ko,sw,gl,zh-TW,pt-BR,co,ta,gu,ky,cs,pa,te,tg,th,la,cy,pl,da,tr
````

##### 设定是否自动出现 select 切换语言

````
<script>
	/*
	 * 是否显示 select选择语言的选择框，true显示； false不显示。默认为true
	 * 注意,这行要放到 translate.execute(); 上面
	 */
	translate.selectLanguageTag.show = false;
	translate.execute();
</script>
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


##### 手动执行页面翻译


````
<script>
	translate.execute();
</script>
````
对于一些网页需要通过ajax请求来加载数据的情况，当加载完数据时，手动执行此方法，使刚加载的信息也进行翻译

##### js主动切换语言
比如点击某个链接显示英文界面

````
<a href="javascript:translate.changeLanguage('en');">切换为英语</a>
````

## 实际使用场景示例
#### 普通网站中点击某个语言进行切换
如下图所示，网站中的某个位置要有几种语言切换  
![](http://cdn.weiunity.com/site/341/news/43b838ea6ad041898037eaaaf5802776.png)  
直接在其html代码的位置加入以下代码：  

````
<!-- 引入多语言切换的js -->
<script src="//res.zvo.cn/translate/translate.js"></script>
<script>
	translate.selectLanguageTag.show = false; //不出现的select的选择语言
	translate.execute();//进行翻译
</script>

<!-- 增加某种语言切换的按钮 -->
<ul class="translate_switch">
	<li><a class="english" href="javascript:translate.changeLanguage('en');"><!-- 英语 --></a></li>|
	<li><a class="chinese" href="javascript:translate.changeLanguage('zh-CN');"><!-- 简体中文 --></a></li>|
	<li><a class="chinese_tw" href="javascript:translate.changeLanguage('zh-TW');"><!-- 繁体中文 --></a></li>
</ul>
<!-- 采用css的content 来赋予显示的语言文字，目的是防止自动翻译时，这里也被一块翻译了 -->
<style>
	.translate_switch li{ display: inline;padding-right: 4px; }
	.translate_switch .english:after{ content:'English' }
	.translate_switch .chinese:after{ content:'简体中文' }
	.translate_switch .chinese_tw:after{ content:'繁体中文' }
</style>
````

## 交流
作者微信：xnx3com  
交流QQ群:181781514  （建议加群，使用中问题，以及异常可以在群里随时交流）
