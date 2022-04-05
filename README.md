
## 介绍
国际化，网页自动翻译，在谷歌翻译的基础上进行了优化，同谷歌浏览器自动翻译的效果，适用于html网页


## 快速使用
#### 第一步，在想显示切换语言按钮的位置加入这个

````
<div id="translate"></div>
````

主要是这个 id="translate" 切换语言的按钮会自动赋予这个id里面

#### 第二步，在网页最末尾引入js

````
<script src="http://res.zvo.cn/translate/translate.js"></script>
<script>
//进行翻译
translate.execute();
</script>
````

比如加到 ``</body>`` 跟 ``</html>`` 中间。当然也不一定非得最末尾，尽量别加 ``<head>`` 里就行

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

#### 设定当前支持哪些语言可切换

````
<script>
	translate.includedLanguages = 'zh-CN,zh-TW,en';  //注意要放到 translate.execute(); 上面
	translate.execute();
</script>
````

默认不设置此，则支持 简体中文、繁体中文、英语 三种。
可设置的语言包括：

````
de,hi,lt,hr,lv,ht,hu,zh-CN,hy,uk,mg,id,ur,mk,ml,mn,af,mr,uz,ms,el,mt,is,it,my,es,et,eu,ar,pt-PT,ja,ne,az,fa,ro,nl,en-GB,no,be,fi,ru,bg,fr,bs,sd,se,si,sk,sl,ga,sn,so,gd,ca,sq,sr,kk,st,km,kn,sv,ko,sw,gl,zh-TW,pt-BR,co,ta,gu,ky,cs,pa,te,tg,th,la,cy,pl,da,tr
````


#### 手动执行页面翻译


````
<script>
	translate.execute();
</script>
````
对于一些网页需要通过ajax请求来加载数据的情况，当加载完数据时，手动执行此方法，使刚加载的信息也进行翻译


