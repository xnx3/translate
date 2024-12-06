
<h1 align="center">
    translate.js
</h1>
<h4 align="center">
    两行js实现html全自动翻译。 <br/>
    无需改动页面、无语言配置文件、无API Key、对SEO友好！
</h4> 
<h4 align="center">
    简体中文 | 
    <a href="http://translate.zvo.cn/4019.html?language=chinese_traditional">繁體中文</a> | 
    <a href="http://translate.zvo.cn/4019.html?language=english">English</a> | 
    <a href="http://translate.zvo.cn/4019.html?language=japanese">しろうと</a> | 
    <a href="http://translate.zvo.cn/4019.html?language=russian">Русский язык</a> | 
    <a href="http://translate.zvo.cn/4019.html?language=german">deutsch</a> | 
    <a href="http://translate.zvo.cn/4019.html?language=french">Français</a> 
</h4> 

# 寻找合作
寻找合作伙伴探讨盈利方式 - 以下全自有技术研发

1. html源码翻译开放API http://doc.zvo.cn/tcdn/api/doc.html
2. 企业级翻译通道代理 http://translate.zvo.cn/43262.html
3. TCDN全自动网站源码级翻译，适合翻译后语种的SEO优化 http://translate.zvo.cn/236896.html

联系：17076012262(微信同号) 我们是纯技术团队，欢迎联系，希望能跟你探讨合作盈利商机，我们专心技术，您来拓展商务销售


# 特性说明
* **使用极其简单。** 无需任何前期准备，直接加入几行代码即可拥有多种语言全自动切换能力。
* **不增加工作量。** 无需另行改造页面本身，也没有各种语言都要单独配置的语言文件，更不需要你对页面本身要显示的文字区域进行代码调用，我认为那样对技术人员实在是太不友好了。而且它也不需要你到某某网站申请什么key，它本身就是开放的，拿来即用。
* **极其灵活扩展。** 您可指定它[只翻译某些指定区域](http://translate.zvo.cn/41548.html)、切换语言时[显示下拉框](http://translate.zvo.cn/41544.html)还是通过[摆放多个切换语言按钮](http://translate.zvo.cn/41549.html)进行、可指定某些特定的元素不进行翻译忽略……
* [**自动匹配语种。** 自动根据用户所在的国家切换其国家所使用的语种](http://translate.zvo.cn/41550.html)
* [**瞬间翻译能力。** 内置缓存预加载机制，只要翻译过的网页，再次看时会达到瞬间翻译的效果，给用户的感觉就是，这个页面本来就是这种语言的，而不是经过第三方翻译的。](http://translate.zvo.cn/41750.html)
* [**永久免费使用。** 采用Apache-2.0开源协议，您可永久免费使用。](https://github.com/xnx3/translate/blob/master/LICENSE)
* **搜索引擎友好。** 完全不影响你本身网站搜索引擎的收录。爬虫所爬取的网页源代码，它不会对其进行任何改动，你可完全放心。
* [**支持私有部署。** 在某些政府机关及大集团内部项目中，对数据隐私及安全保密有强要求场景、或您对自有客户希望提供自建高可靠翻译服务场景时，您可将后端翻译接口进行私有化部署，不走我们公开开放的翻译接口，以做到安全保密及后端服务全部自行掌控。](http://translate.zvo.cn/41160.html) 
* **多个翻译节点**。每间隔1分钟自动获取一次延迟最小的节点进行接入使用，全面规避全球使用时，某个地域网络波动导致后端翻译接口无法响应的情况发生。自动适配最快节点，做到更好的使用体验！


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
<script src="https://cdn.staticfile.net/translate.js/3.2.1/translate.js"></script>
<script>
translate.language.setLocal('chinese_simplified'); //设置本地语种（当前网页的语种）。如果不设置，默认自动识别当前网页显示文字的语种。 可填写如 'english'、'chinese_simplified' 等，具体参见文档下方关于此的说明。
translate.service.use('client.edge'); //设置机器翻译服务通道，直接客户端本身，不依赖服务端 。相关说明参考 http://translate.zvo.cn/43086.html
translate.execute();//进行翻译 
</script>
````

# 详细使用
* [设置默认翻译为的语种](http://translate.zvo.cn/41556.html)
* [自定义翻译术语](http://translate.zvo.cn/41555.html)
* [翻译完后自动执行](http://translate.zvo.cn/41554.html)
* [指定翻译服务接口](http://translate.zvo.cn/41553.html)
* [监控页面动态渲染的文本进行自动翻译](http://translate.zvo.cn/41552.html)
* [设置本地语种（当前网页的语种）](http://translate.zvo.cn/41551.html)
* [自动根据用户所在的国家切换其语种](http://translate.zvo.cn/41550.html)
* [主动进行语言切换](http://translate.zvo.cn/41549.html)
* [只翻译指定的元素](http://translate.zvo.cn/41548.html)
* [翻译时忽略指定的id](http://translate.zvo.cn/41547.html)
* [翻译时忽略指定的class属性](http://translate.zvo.cn/41546.html)
* [翻译时忽略指定的tag标签](http://translate.zvo.cn/41545.html)
* [翻译时忽略指定的文字不翻译](http://translate.zvo.cn/283381.html)
* [对网页中图片进行翻译](http://translate.zvo.cn/41538.html)
* [设定切换语言所支持的语种](http://translate.zvo.cn/41544.html)
* [设定是否自动出现 select 切换语言](http://translate.zvo.cn/41543.html)
* [CSS美化切换语言按钮](http://translate.zvo.cn/41542.html)
* [指定切换语言选择框在代码中的位置](http://translate.zvo.cn/41541.html)
* [对网页中图片进行翻译](http://translate.zvo.cn/41538.html)
* [鼠标划词翻译](http://translate.zvo.cn/41557.html)
* [获取当前显示的是什么语种](http://translate.zvo.cn/41761.html)
* [根据URL传参控制以何种语种显示](http://translate.zvo.cn/41929.html)
* [离线翻译及自动生成配置](http://translate.zvo.cn/41936.html)
* [手动调用接口进行翻译操作](http://translate.zvo.cn/41961.html)
* [元素的内容整体翻译能力配置](http://translate.zvo.cn/42563.html)
* [翻译接口响应捕获处理](http://translate.zvo.cn/42678.html)
* [清除历史翻译语种的缓存](http://translate.zvo.cn/43070.html)
* [网页ajax请求触发自动翻译](http://translate.zvo.cn/43170.html)
* [设置只对指定语种进行翻译](http://translate.zvo.cn/43133.html)
* [重新绘制 select 语种下拉选择](http://translate.zvo.cn/43129.html)
* [识别字符串语种及分析](http://translate.zvo.cn/43128.html)
* [重写一级缓存（浏览器缓存）](http://translate.zvo.cn/43114.html)
* [设置使用的翻译服务 translate.service.use](http://translate.zvo.cn/43086.html)
* [启用企业级稳定翻译](http://translate.zvo.cn/43262.html)
* [增加对指定标签的属性进行翻译](http://translate.zvo.cn/231504.html)


# 使用示例
**普通网站中点击某个语言进行切换**
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
<script src="https://cdn.staticfile.net/translate.js/3.2.1/translate.js"></script>
<script>
	translate.selectLanguageTag.show = false; //不出现的select的选择语言
    translate.service.use('client.edge'); //设置机器翻译服务通道
	translate.execute();
</script>
````

# 谁在使用
截止 2023.7 月份时，本项目的后端免费翻译服务的请求量就已经达到了 1.5亿次/月 的规模，并且还在非常快速的持续增大，包括一些城投集团像是长沙城投、以及一些政府单位像是环境保障局、企业国际化经营服务平台、海外矿业产业联合、国际潮青联谊年会、人力资源和社会保障局、政务服务网、海外的一些平台如futrom智能住宅、bitheime全球区块链等等都在广泛使用。
这里给出两个使用比较好的网站作为实际示例参考：
  
* [**RICE中国大米展**](https://www.cnrice.com.cn)
* [**北京长城航空集团红十字会**](https://hh.changhang.org.cn)
* [**第十一届国际潮青联谊年会组委会**](https://ityc.org.cn)

另外，很多开源框架及产品也都已将此翻译能力接入了自身系统，赋予自身系统多语言切换能力。


## 这些开源产品已内置本功能
* [Discuz](https://addon.dismall.com/plugins/domi_translate.html)
* [Pear Admin Layui](https://gitee.com/pear-admin/Pear-Admin-Layui/tree/i18n/)
* [kefu.js](https://gitee.com/mail_osc/kefu.js)
* [Layui](https://gitee.com/mail_osc/translate_layui)
* [wangmarket CMS](http://cms.zvo.cn)
* [易优CMS](https://www.eyoucms.com/mall/plus/29751.html)
* [迅睿CMS](https://www.xunruicms.com/shop/1285.html)
* [chanyue-cms](https://gitee.com/yanyutao0402/chanyue-cms)
* [phpok cms](https://gitee.com/phpok/phpok)
* [RPCMS](https://app.rpcms.cn/app/149.html)
* [Masuit.MyBlogs](https://gitee.com/masuit/Masuit.MyBlogs)
* [FixIt](https://github.com/hugo-fixit/cmpt-translate)
...  
如果您有开源项目，比如文档、cms、UI 框架、后台管理框架、等等，需要采用此进行多语言切换，欢迎喊我，无偿提供全程接入讨论及遇到的问题跟随优化，希望我们的开源项目能互相产生作用一起越来越好  


# 哪些能力
#### 能力一：前端翻译
加入一个js文件及两行js代码，即可让你现有页面具有几百种语种切换能力。零门槛！详细参见 [translate.js](http://translate.zvo.cn/4019.html)
#### 能力二：翻译html的能力
传入html源码，指定要范围为什么语种，能将翻译之后的html源码返回。详细参见 [translate.api](http://translate.zvo.cn/41165.html)
#### 能力三：整站翻译及独立绑定域名
将您现有的网站，翻译成全新的小语种网站，可以绑定域名并支持搜索引擎收录和排名。基于现有网站，无需改动源站，翻译全站网页，绑定独立域名，保证搜索收录。
翻译是基于您现有的网站内容，不需要重新建设多语种网站，只需要解析域名到您私有部署的服务器，就可以完成全站翻译。
详细参见 [TCDN](http://translate.zvo.cn/41159.html)


# 开源仓库目录结构
* **deploy** - 部署相关，比如shell文件、sql数据库文件等
* **doc** - 一些文档相关
* **translate.admin** - [TCDN的管理后台,PC端的WEB管理后台，可以通过此添加翻译的源站、绑定别的域名及设置域名所展现的语言、针对翻译的过程中支持使用JavaScript脚本自定义调优，比如设置哪些不被翻译、设置一些自定义术语库等。并且提供了CDN的基本能力，比如根据URL清除缓存、根据域名清除缓存等。](http://translate.zvo.cn/41163.html)
* **translate.api** - [翻译开放接口，他不同于 translate service 的点在于 translate service 开放的是文本翻译接口，而 translate api 开放的是html翻译接口，你传入一个网页的url，它返回的是这个网页被翻译之后源码（此特性非常适合对不同语言上SEO优化）](http://translate.zvo.cn/41165.html)
* **translate.core** - [TCDN的公共模块,无具体功能]
* **translate.js** - [提供了针对html的分析及翻译能力。在现有的html页面中引入一个js可以快速实现当前页面语种切换的能力。且适配面非常广泛！只要是html的，它都能适配（包含VUE、uniapp等），在很多情况下，它是单独进行使用的，在你的老网站中加入几行js代码即可植入，使其快速具备语种切换能力。](http://translate.zvo.cn/4019.html)
* **translate.service** - [翻译服务，它对接了 小牛翻译、google翻译、华为云翻译 等翻译服务，如果需要别的翻译服务或者局域网无网环境下部署，也可以快速对接自有翻译接口。它的作用是开放文本翻译接口，将 translate.js中 需要翻译的文本传入，然后将翻译之后的文本输出。提供批量翻译能力（一个翻译请求可以包含数千段需要翻译的文本）。
并且它开放翻译接口，不止适用于 translate.js，你可以用在任何需要对接翻译接口的地方进行使用。其开放接口，说明参见：http://api.translate.zvo.cn/doc/translate.json.html](http://translate.zvo.cn/41164.html)
* **translate.user** - [TCDN 对用户开放访问的，当在 translate admin 中添加源站，并绑定域名指向某个语种后，用户访问这个域名时，便会访问进此，有此进行网页翻译的调度、缓存的处理等。当用户第一次访问某个页面时，缓存中没有，会通过 translate api 从源站获取网页源码，然后进行翻译，将翻译之后的html源码在此进行缓存，然后返回给用户浏览器进行显示。 当有用户在此访问这个页面时，便会直接从缓存中取。](http://translate.zvo.cn/41166.html)

其中每一个都是可以作为一个单独的项目进行使用，比如 translate.service 便可以作为文本翻译接口进行使用、translate.api 可以作为html文件翻译接口使用、translate.js 可以作为网页端直接嵌入几行js代码就能快速翻译来使用。
另外像是如果你网站已经配置好，不需要在使用 translate.admin 管理后台，你可以将此停掉，从而降低服务器资源的占用。


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
[LinkWeChat](https://gitee.com/LinkWeChat/link-wechat) LinkWeChat 是基于企业微信的开源 SCRM 系统，是企业私域流量管理与营销的综合解决方案。    
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
交流QQ群:181781514  (已满)  
交流QQ群:641047127  
微信公众号：wangmarket  
github: [https://github.com/xnx3/translate](https://github.com/xnx3/translate)  
gitee:  [https://gitee.com/mail_osc/translate](https://gitee.com/mail_osc/translate)

# 有偿帮助
我们位于三线城市，各方面开发成本相对较低，如果您有临时需要技术人员帮助，欢迎联系我们，也算对我们的支持，让我们能持续下去。
* Java开发，5年以上经验，65元每小时
* Java开发，半年经验（主要处理琐碎杂事），25元每小时
* 前端开发，3年经验（vue、uniapp、微信小程序等都可以），50元每小时
* Android开发，7年经验，65元每小时

另外，如果有别编程语言的需要，也可以喊我，我微信 xnx3com  价格绝对实在，诚信第一，不满意不要钱！！


# 感谢赞助
* [指点云](https://www.zhidianyun.cn/?i125cc1) 赞助服务器，用于开放公共、免费API给大家使用。指点云服务器便宜，性能很不错。   
* AO3读者们，赞助美国服务器，部署全球网络加速节点
* 微软  提供 client.edge 方式的翻译通道
*  [小牛翻译](https://niutrans.com/register?userSource=translate-js)  赞助在线翻译接口，小牛翻译提供三百八十多种语种翻译能力，需要的语种，它基本都包含了！  
* [如果您想参与赞助，可点此查看更多](https://gitee.com/mail_osc/translate/issues/I7OXEQ),如果有没列出来的，您感觉可以对本项目有帮助的，也欢迎联系我的，感谢大家的支持

