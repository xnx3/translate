## 简介
针对网页源代码直接进行翻译，可直接用于搜索引擎收录。  

# 应用：
例如，你有一个中文网站，百度通过中文能搜索到你。你通过此可直接生成一个英文网站，google可以收录你的英文网站，用户可通过使用google搜索英文时搜索到你。同样，可生成韩语的网站，韩国用户搜索韩语的关键词能在韩国搜索引擎搜到你网站...

# 开放服务
当前只是开放一个测试api地址提供对外的测试。

````
http://service.translate.zvo.cn/translate.json?language=korean&url=https://www.huaweicloud.com
````

### 参数说明
* **language** 要将其翻译为哪种语种，可传入如：  english、korean、chinese_simplified、chinese_traditional
* **url** 目标页面，要翻译的页面，传入完整带协议的格式，如 https://www.leimingyun.com/index.html

### 示例

比如如下几种示例  

http://service.translate.zvo.cn/translate.json?language=korean&url=https://www.huaweicloud.com  
http://service.translate.zvo.cn/translate.json?language=chinese_traditional&url=https://www.leimingyun.com/index.html  

# 说明
该能力是在 [translate.js](https://github.com/xnx3/translate) 的企业收费版服务。 
translate.js 基于js对页面进行自动化翻译，以供用户查阅，但如果查看网页源代码，会发现还是原本的。但大部分场景也足够了。  
而此能力是再其之上的提升，直接作用于网页源代码，也可以理解为在你原本网站基础上，在用户跟你网站之间，增加了一个CDN层，我们就是在这一层做的处理。而作为您的网站，你无需做任何操作！
