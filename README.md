
<h1 align="center">
    translate.js
</h1>
<h4 align="center">
    AI i18n，两行js实现html全自动翻译。 <br/>
    交给AI，无需改动页面、无语言配置文件、无API Key、对SEO友好！
</h4> 
<h4 align="center">
    简体中文 | 
    <a href="http://translate.zvo.cn/index.html?language=chinese_traditional">繁體中文</a> | 
    <a href="http://translate.zvo.cn/index.html?language=english">English</a> | 
    <a href="http://translate.zvo.cn/index.html?language=japanese">日本語</a> | 
    <a href="http://translate.zvo.cn/index.html?language=russian">Русский язык</a> | 
    <a href="http://translate.zvo.cn/index.html?language=german">deutsch</a> | 
    <a href="http://translate.zvo.cn/index.html?language=french">Français</a> 
</h4> 

# 特性说明
* **使用极其简单。** 直接加入几行 JavaScript 代码即可让其拥有上百种语言切换能力。
* **不增加工作量。** 无需改造页面本身植入大量垃圾代码变得臃肿，也不需要配置各种语种的语言文件，因为它会直接扫描你的DOM自动识别并翻译显示，它不需要你到某某网站登录去申请什么key，它是开源开放的，拿来就能用。
* **极其灵活扩展。** 您可指定它[只翻译某些指定区域的元素](http://translate.zvo.cn/4063.html)、[自定义切换语言方式及美化](http://translate.zvo.cn/4056.html)、[某些id、class、tag不被翻译](https://translate.zvo.cn/4061.html)、[自定义翻译术语](https://translate.zvo.cn/4070.html) ...... 只要你想的，它都能做到。做不到的，你找我我来让它做到！
* **自动切换语种。** [自动根据用户的语言喜好及所在的国家切换到这个语种进行浏览](http://translate.zvo.cn/4065.html)
* **极速翻译能力。** [内置三层缓存、预加载机制，毫秒级瞬间翻译的能力。它并不是你理解的大模型蜗牛似的逐个字往外出的那样](http://translate.zvo.cn/4026.html)
* [**永久开源免费。** 采用MIT开源协议，您可永久免费使用](https://github.com/xnx3/translate/blob/master/LICENSE)。[另外你可以用它来做某些系统的三方插件直接售卖盈利](http://translate.zvo.cn/4036.html)、或者你是建站公司用它来做为一项高级功能盈利，我们都是完全认可并支持的，并不需要给我们任何费用！
* **搜索引擎友好。** 完全不影响你本身网站搜索引擎的收录。爬虫所爬取的网页源代码，它不会对其进行任何改动，你可完全放心。[另外我们还有高级版本让你翻译之后的页面也能被搜索引擎收录](http://translate.zvo.cn/236896.html)
* **支持私有部署。** [在某些政府机关及大集团内部项目中，对数据隐私及安全保密有强要求场景、或者完全不通外网的场景，可以自行私有部署翻译API服务](http://translate.zvo.cn/391129.html) 
* **全球网络节点**。美洲、亚洲、欧洲 ... 都有网络节点，它能自动适配最快节点，每间隔1分钟自动获取一次延迟最小的节点进行接入使用，使全球范围使用都可高效稳定。
* **HTML整体翻译**。[提供开放API接口，传入html文件（html源代码）及要翻译为的语言即可拿到翻译后的html源码。完美支持识别各种复杂及不规范html代码，
支持翻译前的微调，比如不翻译某个区域、图片翻译、js语法操作html文件中的元素进行增删改等。](https://translate.zvo.cn/4022.html)
* **源站翻译及域名分发**。[将您现有的网站，翻译成全新的小语种网站，小语种网站可以分别绑定域名并支持搜索引擎收录和排名。而您的源站无需任何改动。也就是你可以将你朋友的网站，翻译为小语种网站，绑定上自己的域名，提供对外访问。而你无需向你朋友取得任何的如账号等相关权限](https://translate.zvo.cn/236896.html)
* **浏览器翻译插件**。[提供整体的浏览器翻译插件的全套方案，您如果是开发者，完全可以拿去将界面美化包装一下，而后直接提交应用市场进行售卖盈利](https://translate.zvo.cn/4037.html)



# 微调指令
它有极其丰富的扩展指令，让你可以对它进行各种精准控制，满足各种难缠客户的各种脑洞要求。（如果满足不了，可提出来，我们加）

* **[切换语言select选择框的自定义设置](https://translate.zvo.cn/41541.html)**，设置切换语言选择框位置、CSS美化、是否出现、显示的语种、触发后的自定义、以及重写等。
* **[设置默认翻译为什么语种进行显示](http://translate.zvo.cn/4071.html)**，用户第一次打开时，默认以什么语种显示。
* **[自定义翻译术语](http://translate.zvo.cn/41555.html)**，如果你感觉某些翻译不太符合你的预期，可进行针对性的定义某些词或句子的翻译结果，进行自定义术语库
* **[翻译完后自动触发执行](http://translate.zvo.cn/4069.html)**，当翻译完成后会自动触发执行您的某个方法，以便您来做自定义扩展。
* **[指定翻译服务接口](http://translate.zvo.cn/4068.html)**，如果你不想用我们开源免费的翻译服务接口，使用您自己私有部署的、或者您自己二次开发对接的某个翻译服务，可通过此来指定自己的翻译接口。
* **[监控页面动态渲染的文本进行自动翻译](http://translate.zvo.cn/4067.html)**，如果页面用 JavaScript 的地方比较多，内容都是随时用JS来控制显示的，比如 VUE、React 等框架做的应用，它可以实时监控DOM中文字的变动，当发生变动后立即识别并进行翻译。
* **[设置本地语种（当前网页的语种）](http://translate.zvo.cn/4066.html)**，手动指定当前页面的语言。如果不设置，它会自动识别当前网页的文本，取当前网页文本中，出现频率最高的语种为默认语种。
* **[自动切换为用户所使用的语种](http://translate.zvo.cn/4065.html)**，用户第一次打开网页时，自动判断当前用户所使用的语种、以及所在的国家，来自动进行切换为这个语种。
* **[主动进行语言切换](http://translate.zvo.cn/4064.html)**，开放一个方法提供程序调用，只需传入翻译的目标语言，即可快速切换到指定语种
* **[只翻译指定的元素](http://translate.zvo.cn/4063.html)**，指定要翻译的元素的集合,可传入一个或多个元素。如果不设置此，默认翻译整个网页。
* **[翻译时忽略指定的id](http://translate.zvo.cn/4062.html)**，翻译时追加上自己想忽略不进行翻译的id的值，凡是在这里面的，都不进行翻译，也就是当前元素以及其子元素都不会被翻译。
* **[翻译时忽略指定的class属性](http://translate.zvo.cn/4061.html)**，翻译时追加上自己想忽略不进行翻译的class标签，凡是在这里面的，都不进行翻译，也就是当前元素以及其子元素都不会被翻译。
* **[翻译时忽略指定的tag标签](http://translate.zvo.cn/4060.html)**，翻译时追加上自己想忽略不进行翻译的tag标签，凡是在这里面的，都不进行翻译，也就是当前元素以及其子元素都不会被翻译。
* **[翻译时忽略指定的文字不翻译](http://translate.zvo.cn/283381.html)**，翻译时追加上自己想忽略不进行翻译的文字(支持配置字符串和正则表达式)，凡是在这里面的，都不进行翻译。
* **[对网页中图片进行翻译](http://translate.zvo.cn/4055.html)**，在进行翻译时，对其中的图片也会一起进行翻译。
* **[鼠标划词翻译](http://translate.zvo.cn/4072.html)**，鼠标在网页中选中一段文字，会自动出现对应翻译后的文本
* **[获取当前显示的是什么语种](http://translate.zvo.cn/4074.html)**，如果用户切换为英语进行浏览，那么这个方法将返回翻译的目标语种。
* **[根据URL传参控制以何种语种显示](http://translate.zvo.cn/41929.html)**，设置可以根据当前访问url的某个get参数来控制使用哪种语言显示。
* **[离线翻译及自动生成配置](http://translate.zvo.cn/4076.html)**，其实它也就是传统 i18n 的能力，有语言配置文件提供翻译结果。
* **[手动调用接口进行翻译操作](http://translate.zvo.cn/4077.html)**，通过JavaScript调用一个方法，传入翻译文本进行翻译，并获得翻译结果
* **[元素的内容整体翻译能力配置](http://translate.zvo.cn/4078.html)**，对node节点的文本拿来进行整体翻译处理，而不再拆分具体语种，提高翻译语句阅读通顺程度
* **[翻译接口响应捕获处理](http://translate.zvo.cn/4079.html)**，对翻译API接口的响应进行捕获，进行一些自定义扩展
* **[清除历史翻译语种的缓存](http://translate.zvo.cn/4080.html)**，清除掉你上个页面所记忆的翻译语种，从而达到切换页面时不会按照上个页面翻译语种自动进行翻译的目的。
* **[网页ajax请求触发自动翻译](http://translate.zvo.cn/4086.html)**，监听当前网页中所有的ajax请求，当请求结束后，自动触发翻译
* **[设置只对指定语种进行翻译](http://translate.zvo.cn/4085.html)**，翻译时只会翻译在这里设置的语种，未在里面的语种将不会被翻译。
* **[识别字符串语种及分析](http://translate.zvo.cn/43128.html)**，对字符串进行分析，识别出都有哪些语种，每个语种的字符是什么、每个语种包含的字符数是多少
* **[重写一级缓存（浏览器缓存）](http://translate.zvo.cn/4082.html)**，你如果不想使用默认的 localStorage 的缓存，您完全可以对其重写，设置自己想使用的缓存方式
* **[设置使用的翻译服务 translate.service.use](http://translate.zvo.cn/4081.html)**，目前有自有的服务器提供翻译API方式、无自己服务器API的方式两种。
* **[启用企业级稳定翻译](http://translate.zvo.cn/4087.html)**，独立于开源版本的翻译通道之外，仅对少数用户开放，提供企业级的稳定、高速、以及更多网络分发节点。
* **[增加对指定标签的属性进行翻译](http://translate.zvo.cn/231504.html)**，可以增加对指定html标签的某个或某些属性进行翻译。比如element、vue 等框架，有些自定义的标签属性，想让其也正常翻译
* **[本地语种也进行强制翻译](http://translate.zvo.cn/289574.html)**，切换为中文时，即使本地语种设置的是中文，网页中只要不是中文的元素，都会被翻译为要显示的语种
* **[自定义通过翻译API进行时的监听事件](http://translate.zvo.cn/379207.html)**，当通过翻译API进行文本翻译时的整个过程进行监听，做一些自定义处理，比如翻译API请求前要做些什么、请求翻译API完成并在DOM渲染完毕后触发些什么。
* **[启用翻译中的遮罩层](http://translate.zvo.cn/407105.html)**，在进行通过翻译API进行翻译时，相关元素上面显示一层加载中的动画效果，让用户知道这段文本正在进行处理中
* **[对JS对象及代码进行翻译](http://translate.zvo.cn/452991.html)**，可对JavaScript 对象、以及 JavaScript 代码进行翻译。
* **[网络请求自定义附加参数](http://translate.zvo.cn/471711.html)**，追加上一些自定义的参数传递到后端翻译服务。主要用于定制扩展使用。
* **[网络请求数据拦截并翻译](http://translate.zvo.cn/479724.html)**，当用户触发网络请求时，它可以针对ajax、fetch请求中的某个参数，进行拦截，并进行翻译，将翻译后的文本赋予这个参数，然后再放开请求。
* **[翻译排队执行](http://translate.zvo.cn/479742.html)**，避免接入时的异常设置，导致非常频繁的去执行扫描及翻译的情况。

# 在线体验
http://res.zvo.cn/translate/demo.html


# 测试效果
先拿别人的网站动手试试效果
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
<script src="https://cdn.staticfile.net/translate.js/3.16.0/translate.js"></script>
<script>
translate.language.setLocal('chinese_simplified'); //设置本地语种（当前网页的语种）。如果不设置，默认自动识别当前网页显示文字的语种。 可填写如 'english'、'chinese_simplified' 等
translate.service.use('client.edge'); //设置机器翻译服务通道，相关说明参考 http://translate.zvo.cn/43086.html
translate.execute();//完成翻译初始化，进行翻译
</script>
````



# 使用示例

## 在浏览器使用

**普通网站中点击某个语言进行切换**
如下图所示，网站中的某个位置要有几种语言切换  
![](doc/resources/uws-demo.png?raw=true)  
直接在其html代码末尾的位置加入以下代码：  

````
<!-- 增加某种语言切换的按钮。注意 ul上加了一个 class="ignore" 代表这块代码不会被翻译到 -->
<ul class="ignore">
	<li><a href="javascript:translate.changeLanguage('english');">English</a></li>|
	<li><a href="javascript:translate.changeLanguage('chinese_simplified');">简体中文</a></li>|
	<li><a href="javascript:translate.changeLanguage('chinese_traditional');">繁體中文</a></li>
</ul>
 
<!-- 引入多语言切换的js -->
<script src="https://cdn.staticfile.net/translate.js/3.16.0/translate.js"></script>
<script>
	translate.selectLanguageTag.show = false; //不出现的select的选择语言
    translate.service.use('client.edge'); //设置翻译服务通道
	translate.execute();
</script>
````

## 在 NPM 中使用

1. Install

    ```bash
    npm i i18n-jsautotranslate
    ```

2. Import

    ```javascript
    import translate from 'i18n-jsautotranslate'
    /* Or */
    const translate = require("i18n-jsautotranslate")
    ```

[详细使用说明](https://translate.zvo.cn/4041.html) |  [Vue2 中使用 translate.js 在线 Demo](https://lruihao.github.io/vue-el-demo/#/translate-js)



# 谁在使用

开源项目：  
* [DzzOffice](http://www.dzzoffice.com/index.php?mod=dzzmarket&op=view&mid=58) 开源办公套件，搭建自己的类似“Google企业应用套件”、“微软Office365”的企业协同办公平台
* [ModStart](https://modstart.com/m/WebTranslate) 基于 Laravel 的模块化全栈开发框架
* [管伊佳ERP](https://gitee.com/jishenghua/JSH_ERP) 国产开源ERP系统关注度第一，专注进销存、生产、总账
* [FixIt](https://github.com/hugo-fixit/cmpt-translate) 一款简洁、优雅且先进的Hugo 博客主题
* [Z-Blog](https://app.zblogcn.com/?id=49226) 易用的博客程序，功能丰富，模板多样，助轻松搭建个性博客。
* [Discuz](https://addon.dismall.com/plugins/domi_translate.html) 知名论坛系统，功能强大，插件众多，打造活跃互动的网络社区。
* [Pear Admin Layui](https://gitee.com/pear-admin/Pear-Admin-Layui/tree/i18n/) Pear Admin Layui 是基于 Layui 的后台管理模板，简洁美观，实用高效。
* [kefu.js](https://gitee.com/mail_osc/kefu.js) 开源js聊天界面插件，方便快捷，助力网站沟通服务。
* [Layui](https://gitee.com/mail_osc/translate_layui) 简洁好用的前端框架，组件丰富，上手容易，广受开发者青睐。
* [wangmarket CMS](http://cms.zvo.cn) 开源的SAAS云建站系统，可私有部署，可通过后台任意开通多个网站，每个网站独立管理
* [易优CMS](https://www.eyoucms.com/mall/plus/29751.html) 功能强大的内容管理系统，操作简便，模板随心选。
* [迅睿CMS](https://www.xunruicms.com/shop/1285.html) 一款功能完善的内容管理系统，性能卓越，易于使用。
* [chanyue-cms](https://gitee.com/yanyutao0402/chanyue-cms) 基于Node、Express、MySQL、Vue3研发的高质量实用型CMS系统
* [phpok cms](https://gitee.com/phpok/phpok) 极其自由的企业站程序，支持各种自定义配置。
* [RPCMS](https://app.rpcms.cn/app/149.html) 轻量型php内容管理系统，小型、轻量，但功能丰富，可扩展性强。
* [Masuit.MyBlogs](https://gitee.com/masuit/Masuit.MyBlogs) 高性能高安全性低占用的个人博客系统

...  
  
|   |   | | | | 
| ------------ | ------------ |------------ |------------ |------------ | 
|  高校 |  清华大学 | 北京理工大学 |  西苏格兰大学 | 中国美术学院 | 亚利桑那州立大学|  
|  集团 |  中国一汽 | 京东 | 中兴 | 中国铁建 | 长城汽车 |    
|  政务 |  湖北省人民检察院 | 云南省药品监督管理局 | 云南省机关事务管理局 | 香港一带一路研究院 | 曲靖市生态环境局 |    
|  科研 |  国家生物信息中心 | 德国科工创新院 | 中科能研电力技术研究院 | 国家新能源汽车技术创新中心 | 北方华创 |  
|  云厂商 |  指点云 | 每刻云 | 雨云 | DOGSSL | 多彩云 |  
|  协会 |  中国国际环保展览会 | 国际研发方法协会 | 中国内燃机学会 | 深圳市智慧城市产业协会 | 山东省社会组织总会 |  
|  平台 |  东盟 | ESG国际服务平台 | 安徽省外贸综合服务平台 | 湖南企业国际化经营服务平台 | 中亚采招网 | 

...

如果您有开源项目，比如文档、cms、UI 框架、后台管理框架、等等，需要采用此进行多语言切换，欢迎喊我，无偿提供全程接入讨论及遇到的问题跟随优化，希望我们的开源项目能互相产生作用一起越来越好。如果你的项目在这个列表中没有，欢迎联系我说明，我给加入进去。如果您不想出现在这里，也联系我，我给隐去。


# TCDN部署
tcdn是translate.js 的高级版本，它的能力是让你原本的网站可以用不同的域名访问到不同的语种。而不同的语种，都可以被收录！它可以免费部署到服务器进行使用。注意，它需要使用个1核2G的服务器进行部署的。    
部署方式有两种： 
### 宝塔部署
首选需要你的宝塔面板需要 9.3.0 及以上版本。 不然你在下一步部署时，是搜索不到我们 TCDN 这个服务的。  
如果你没有安装宝塔面板，可以先去安装宝塔面板： [https://www.bt.cn/new/download.html?r=dk_tcdn](https://www.bt.cn/new/download.html?r=dk_tcdn)  
详细部署步骤可参考：  [https://translate.zvo.cn/302663.html](https://translate.zvo.cn/302663.html)
### 服务器部署
需要一个干净的服务器，不依赖任何环境的情况下进行的部署，需要你懂点linux命令行， 部署方式参考：  [https://translate.zvo.cn/236899.html](https://translate.zvo.cn/236899.html)


# 项目由来
2021年，translate 翻译服务项目创建，最初为简化Google网页翻译JS进行了封装，可以更简单进行使用，但是因为扩展极其有限，文档也没那么好，于是开始了重构。  
2022年初，完全脱离Google网页翻译JS，从底层判断开始进行了全部重构，推出 2.0 版本，在加载js的资源大小上降低了95%，更快加载，同时内置了多层缓存、多种自定义方式等能力，使用更加灵活、翻译速度更加高效，极大提高了用户使用体验。  
同年，后端翻译服务也完全开源，支持在1核1G服务器进行私有部署，翻译服务内置对接Google翻译服务、华为云机器翻译服务，如果需要别的翻译服务或者局域网无网环境下部署，也可以快速对接自有翻译接口。  
同年年底，我们翻译服务的cdn源 translate.js 的月请求次数超过了一千万次。  
2023年，翻译服务再次迎来大的变化，不仅仅只是对网页使用js来进行翻译，它还增加了翻译内容分发的能力，我们暂且简单将其称之为TCDN，它具备了CDN内容分发的一些能力，比如可以通过后台添加一个源站，然后绑定不同的域名，可以设置每个域名对应着源站的哪种语言，这样访问时打开的就直接是翻译后的网页，如果查看网页源代码，会发现html源码本身就是已经被翻译过的，不在局限于js端进行翻译，而是通过服务端主动进行翻译，并进行缓存，用户访问请求时，直接将翻译结果输出给用户展示，极大提高了用户使用体验、每种语种也都可以在相应国家搜索引擎收录、并且系统因具备CDN的基本能力，如果网站有更新，还可以通过后台快速更新源站或者访问目标站点、或者指定访问url的网页翻译缓存。  
同样的能力，我们发现友商收费标注是一个站点20种翻译语种的情况是一万二每年，而我们这个支持七八十种语种（取决于 translaet.service 后端对接的翻译服务支持的语种数量），一台服务器可承载数千个源站提供服务！  
至2023年中旬，我们公开的翻译服务 translate.service 月请求量已达到1.5亿次！并再以非常恐怖的速度在增长。  


# 结构图示
[![](https://cdn.weiunity.com/site/1144/news/70a5b291d9af484999cbee5735f5cd10.png)](http://doc.zvo.cn/translate.js/home.html)

# 优秀开源项目及社区推荐
[Featbit](https://github.com/featbit/featbit) 一个100%开源的 Feature flags / Feature Management 平台工具  
[IoTSharp](https://gitee.com/IoTSharp) IoTSharp 是一个 基于.Net Core 开源的物联网基础平台， 支持 HTTP、MQTT 、CoAp 协议    
[流之云](https://gitee.com/ntdgg) 信息化、数字化服务提供商    


# 我的其他开源项目

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

# 交流
如果您在使用过程中遇到任何异常情况，请详细说一下您遇到的问题。如果可以，请写下您的网站，以便我们可以更全面地测试，以便快速找到问题所在  
作者微信：xnx3com（使用交流可加QQ群进行，我看微信很不及时）    
Telegram : [untran](https://t.me/untran)  
交流QQ群:181781514(已满)  
交流QQ群:641047127(已满)  
交流QQ群:240567964(已满)  
交流QQ群:1034085260  
交流QQ群:1017938586  
作者邮箱：921153866@qq.com  
微信公众号：wangmarket  
github: [https://github.com/xnx3/translate](https://github.com/xnx3/translate)  
gitee:  [https://gitee.com/mail_osc/translate](https://gitee.com/mail_osc/translate)  


# 商业化声明

我完全允许你拿我的开源项目进行商业化包装盈利，而无需给我支付任何费用！  
你能拿来赚钱，那是你的本事。  
而我的开源项目能帮你赚钱，我会很荣幸，我能造福社会。  
你在用它进行商业化盈利的时候，遇到问题也完全可以大方的向我求助，用它赚钱并不是什么偷偷摸摸的事情，技术能用来养家糊口改善生活是值得点赞的。  
而且如果你不放心，我还可以白纸黑字盖章，送你一个定心丸。  
说这么多，是体现一个态度，开源就是开源，我不会想法绑架你。我们可以在一起以最纯粹的状态交流，让生活更美好。
