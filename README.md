
## 介绍
国际化，网页自动翻译，在谷歌翻译的基础上进行了优化，同谷歌浏览器自动翻译的效果，适用于html网页。  
网页无需另行改造，增加两行js即可实现多国语言切换的能力。  

<video controls="controls" src="//down.zvo.cn/video/translate_inspector_demo.mov?t=20220721" style="height:auto; max-width:80%" width="80%">&nbsp;</video>

## 在线体验
http://res.zvo.cn/translate/demo.html

## 快速使用体验
#### 第一步，在 ````<head>```` 中引入js

````
<script src="//res.zvo.cn/translate/translate.js"></script>
````


#### 第二步，在 ````</html>````  之前加入一行js

````
<script> translate.execute();//进行翻译 </script>
````

#### 完成，体验一下吧
语言选择框（select选择框）如果没有额外调整，一般会在页面最底部，可以从最底部找找

## 更多扩展用法

#### CSS美化切换语言按钮
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

#### 设定 select 切换语言，支持哪些语言可切换

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

#### 设定是否自动出现 select 切换语言

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


#### 手动执行页面翻译


````
<script>
	translate.execute();
</script>
````
对于一些网页需要通过ajax请求来加载数据的情况，当加载完数据时，手动执行此方法，使刚加载的信息也进行翻译

#### js主动切换语言
比如点击某个链接显示英文界面

````
<a href="javascript:translate.changeLanguage('en');">切换为英语</a>
````