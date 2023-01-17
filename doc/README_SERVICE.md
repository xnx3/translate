# 简介
这里是在浏览器载入之前进行的翻译，针对网页源代码本身进行翻译的，可直接用于搜索引擎收录。  
而 [translate.js](https://github.com/xnx3/translate) 是在浏览器载入完毕后进行的翻译，要是查看网页源代码，其本身是不被翻译的。

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
http://service.translate.zvo.cn/translate.json?language=english&url=https://www.huaweicloud.com/solution/implementations/build-a-cms-based-on-open-source-wangmarket.html

# 说明
该能力是不同于 [translate.js](https://github.com/xnx3/translate) 的另一款产品服务。  
translate.js 基于js对页面进行自动化翻译，以供用户查阅，但如果查看网页源代码，会发现还是原本的。但大部分场景也足够了。  
而此能力是再其之上的本质的提升，直接作用于网页源代码，也可以理解为在你原本网站基础上，在用户跟你网站之间，增加了一个CDN层，我们就是在这一层做的处理。而作为您的网站，你无需做任何操作！用户查看网站时，网站的源码就是已经被翻译过了。因此特性，它非常适合做搜索引擎的收录。无论是用英文搜，还是中文、韩语等搜，都能搜到你相应语言的网站。  

# 合作
本人技术行，别的都不太行，欢迎各种方式的合作，将技术变现。
