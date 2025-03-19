
# 介绍说明
对接 智谱AI 的大模型，来提供文本翻译的能力，并开放标准API接口调用、使你原本网站具有切换几十个语种的能力。  

### 1. 为你直接输出标准的文本翻译API接口

它以 智谱AI 作为基础支撑，通过 translate.service 作为中间调度。你完全不需要去了解 大模型 是什么以及怎么使用。

### 2. 使你原有的网站及后台支持几十个语种切换能力

让你原有的网站或后台能出现个语言切换按钮，支持几十个语种随意切换。  
而做到这个，仅需要十分钟，加入两行js，其他的有 智谱AI 帮你完成。


# 行业痛点

1. 文本翻译API，国内比较好的厂家，比如某牛翻译50元/100万字符、某度翻译是49元/百万字符
2. 网站或者后台管理系统，用传统i18n的方式做多语言适配，工作量相当大，而且维护及后续开发对接的人工成本巨高，极其造成某次升级功能，多语种的i18n的某个地方忘记配了！前端开发工程师是技术人员，成本浪费在这种完全没技术含量的逐个定位复制粘贴上严重损耗技术的热情。

# 准备知识

需要懂的linux命令行： wget 、 vi 两个基本命令的使用  
如果要对你原有网站植入语种切换能力，你还有稍微懂那么一点点 JavaScript 知道吧我们提供的两行JS放到什么位置。


# 模型优化
它对大模型在文本翻译领域的实际应用场景应用使用进行了深度调优，以达到高可用能力  
1. **注意力机制方面优化**。比如原文是疑问句时，结果成了答案的译文的情况
1. **不规则内容的高容错支持**。多个语种混合的句子、内容不通顺的句子都可以支持
1. **上下文理解偏差方面优化**。比如翻译时，个别文字没有被翻译的情况。
1. **文本生成中的循环陷阱问题优化**。比如英文翻译为中文时，出现无限循环、无标点输出的现象，模型生成失控（DeepSeek出现，智谱目前还未发现，但也已增加）
1. **翻译精确度优化**。对译文的精确度进行处理优化，自动修复精确度不达标的译文，进行更正。
1. **多模型混用及自动调度机制**。正常翻译有免费的Flash小模型进行，当精度不足时大模型才介入修复。
1. **多线程并发能力支持**。大模型的输出速度是有上限的，比如输出速度为 50字/秒，那你翻译100个句子，每个句子50个字，你需要 100 秒才能拿到翻译结果。而如果你开启了线程池的能力，启用最大 100 个线程的话，只需要1秒。 
1. **针对网址的处理能力**。杂乱不规则文本中，精确识别网址，不破坏网址构造。


说句人话，就是可以针对各种不规则的句子、多语种混合的句子、前后各种不通顺的句子进行翻译，同时还能达到传统文本翻译的极速响应，花的钱却是远低于传统文本翻译的钱。甚至你不要求高精度，你就可以白嫖智谱AI了。  

### 价格优势
1. 充分使用 智谱AI的 GLM-4-Flash 免费模型来提供，你可以做到完全不花一分钱，你的 智谱AI 账号不用冲钱就能用。
1. 它还可以提供极其精准的翻译能力，超过传统的文本翻译水平。（要花一点点的钱，低于传统文本翻译的花费）
  
测试数据： 中文翻译英文场景，每秒翻译 120 字符，一天翻译 120 * 60 * 60 * 24 = 1千万字符  
开180个线程，也就是1天能不花一分钱免费翻译18亿个字符。

# 翻译效果
这里跟某度翻译进行了简单比较：

| 原文  | 某度翻译的译文  | translate.js (智谱AI)的译文  |
| ------------ | ------------ | ------------ |
|  Annexe 2 : Formulaire de soumission dune offre | 附件2：沙丘防火公式  |  附件2：投标书提交表格 |
| RFQ_Provision of electrical cables for power supply to “Benardina Qerraxhia” Pro  | RFQ_为“Benardina Qerraxhia”Pro提供电源电缆  | 询价：为“Benardina Qerraxhia”项目提供电力供应电缆  |
|  formulation de la Stratégie Nationale d’Intelligence Artificielle | 制定国家智能技术战略  | 国家人工智能战略制定  |
|  Annexe 7 :Guide de l’UNGM | 附件7:UNGM指南  |  附件7：联合国全球管理手册 |
| RECRUTEMENT ENTREPRISE POUR AMÉNAGEMENT LOCAL DE LA MARIE DE CAPOTILLE | La Marie de Capotille当地装修公司招聘 | 企业招聘，为卡波蒂勒的玛丽改善当地环境 |

# 私有部署

### 1. 买个服务器

服务器规格：  
**CPU**：1核  
**架构**：x86_64 （也就是 Intel 的CPU ）  
**内存**：1G  
**操作系统**：CentOS 7.4 (这个版本没有可选 7.6 、7.2 等，7.x 系列的都可以。另外像是 openEulor 20 也是可以的)  
**系统盘**：默认的系统盘就行。无需数据盘  
**弹性公网IP**：按流量计费（带宽大小10MB。如果你只是你自己用，翻译的量不大，你完全可以选1MB带宽）  
其他的未注明的，都按照怎么省钱怎么来选即可。  
备注  
这里会有多个型号，比如什么s3、s6、t6的，你就选最便宜的就行。（一般t6是最便宜的，选它就行）  
安全组：要开放22、80这两个端口  



### 2. shell命令一键部署

执行以下shell命令进行一键部署。

````
yum -y install wget && wget https://gitee.com/mail_osc/translate/raw/master/deploy/service.sh -O ~/install.sh && chmod -R 777 ~/install.sh && sh ~/install.sh
````

### 3. 去智谱获取 API Key

通过专属通道 [https://zhipuaishengchan.datasink.sensorsdata.cn/t/Vz](https://zhipuaishengchan.datasink.sensorsdata.cn/t/Vz) 进入
如下图所示

![image.png](https://foruda.gitee.com/images/1741830360614577488/8e668537_429922.png)
点击右上角箭头的位置
进入智谱AI的 **项目管理** 下的 **API Keys**
![](https://translate.zvo.cn/fileupload/2025/03/11/29578f8f17f84a47b9970431a0c3d4d6.png)
如上图箭头所示，创建一个 API Key
完事就能得到一个Key，记下来，后面用到。


### 4. 配置智谱AI

首先，找到配置文件 /mnt/service/config.properties 编辑它，找到

````
translate.service.leimingyun.domain=http://api.translate.zvo.cn
````

这个，将它注释掉，然后增加以下配置（注意，以下几种配置是根据你对翻译的质量要求给出的参考。你只需使用其中一个即可。又或者你都不太明白，那你就直接使用第一种完全免费的那个）：  
注意，要将其中的 ````translate.service.glm.key```` 换成你上一步获取到的。其他参数完全不用改动。  

##### 配置一：普通使用，完全不用花钱
````
# 使用哪个大模型。这里的 GLM-4-Flash 是可以免费使用的大模型。默认即可无需改动
translate.service.glm.model=GLM-4-Flash
# 智谱AI 的 API Key
translate.service.glm.key=b907763dab2946d28eb00ede7acd9b31.WaxfiIadf4P81tjW
# 并发线程数。智谱AI的这里，普通用户可以免费使用的并发上限是200，所以填写180就可以了，无需改动。 此参数的具体说明可参考 http://translate.zvo.cn/396728.html
translate.service.thread.number=180
# 大模型翻译的单次翻译字符上限设置。这里可以默认1就行，不要改动。具体说明可参考 http://translate.zvo.cn/396736.html
translate.service.set.requestMaxSize=1
````

##### 配置二：对翻译精准度有一点点要求，但不高，稍微花那么一点点钱
````
# 使用哪个大模型。这里的 GLM-4-Flash 是可以免费使用的大模型。默认即可无需改动
translate.service.glm.model=GLM-4-Flash
# 智谱AI 的 API Key
translate.service.glm.key=b907763dab2946d28eb00ede7acd9b31.WaxfiIadf4P81tjW
# 并发线程数。智谱AI的这里，普通用户可以免费使用的并发上限是200，所以填写180就可以了，无需改动。 此参数的具体说明可参考 http://translate.zvo.cn/396728.html
translate.service.thread.number=180
# 大模型翻译的单次翻译字符上限设置。这里可以默认1就行，不要改动。具体说明可参考 http://translate.zvo.cn/396736.html
translate.service.set.requestMaxSize=1
# 翻译精确度。
# 取值为1~100 ，数值越大说明对翻译精准度要求越高。  
# 注意，设置的数值越高，对精确度要求越高， translate.service.set.repair.service 介入的也就越多，同样 translate.service.set.repair.service 的tokens消耗也就越大。
# 如果不设置，默认是普通的翻译质量 50
translate.service.glm.accuracy=55

# 用于修复精准度的翻译服务通道，采用 glm （智谱AI）的通道
translate.service.set.repair.service=glm
# 用于修复翻译结果的模型。JSON格式。
# model 参数：
# 	如果不设置，则使用 GLM-4-Flash 免费模型
# 	如果要求翻译结果质量很高，这里必须设置 glm-4-plus
# 其实它还可以设置 key、url 等参数，但是 translate.service.set.repair.service 它跟当前使用的 translate.service.glm 通道是同一个，所以其他相同的url、key 直接复用 translate.service.glm.url 、translate.service.glm.key 的，就不用单独设置了
translate.service.set.repair.config={"model":"glm-4-plus"}
````


##### 配置三：对翻译精准度有要求，也愿意花点钱
````
# 使用哪个大模型。这里的 GLM-4-Flash 是可以免费使用的大模型。默认即可无需改动
translate.service.glm.model=GLM-4-Flash
# 智谱AI 的 API Key
translate.service.glm.key=b907763dab2946d28eb00ede7acd9b31.WaxfiIadf4P81tjW
# 并发线程数。智谱AI的这里，普通用户可以免费使用的并发上限是200，所以填写180就可以了，无需改动。 此参数的具体说明可参考 http://translate.zvo.cn/396728.html
translate.service.thread.number=180
# 大模型翻译的单次翻译字符上限设置。这里可以默认1就行，不要改动。具体说明可参考 http://translate.zvo.cn/396736.html
translate.service.set.requestMaxSize=1
# 用于对翻译结果进行准确性检测。默认使用的是 GLM-4-Flash ，可以设置上 glm-4-plus 效果是最好的。
# 如果不设置，此处默认是 GLM-4-Flash
translate.service.glm.checkModel=glm-4-plus
# 翻译精确度。
# 取值为1~100 ，数值越大说明对翻译精准度要求越高。  
# 注意，设置的数值越高，对精确度要求越高， translate.service.set.repair.service 介入的也就越多，同样 translate.service.set.repair.service 的tokens消耗也就越大。
# 如果不设置，默认是普通的翻译质量 50
translate.service.glm.accuracy=70

# 用于修复精准度的翻译服务通道，采用 glm （智谱AI）的通道
translate.service.set.repair.service=glm
# 用于修复翻译结果的模型。JSON格式。
# model 参数：
# 	如果不设置，则使用 GLM-4-Flash 免费模型
# 	如果要求翻译结果质量很高，这里必须设置 glm-4-plus
# 其实它还可以设置 key、url 等参数，但是 translate.service.set.repair.service 它跟当前使用的 translate.service.glm 通道是同一个，所以其他相同的url、key 直接复用 translate.service.glm.url 、translate.service.glm.key 的，就不用单独设置了
translate.service.set.repair.config={"model":"glm-4-plus"}
````


##### 配置四：对翻译精准度非常高，有正常的费用预算
这种场景不适合个人了，适合公司性质，对此有费用预算的情况。

````
# 使用哪个大模型。这里的 GLM-4-Flash 是可以免费使用的大模型。默认即可无需改动
translate.service.glm.model=GLM-4-Flash
# 智谱AI 的 API Key
translate.service.glm.key=b907763dab2946d28eb00ede7acd9b31.WaxfiIadf4P81tjW
# 并发线程数。智谱AI的这里，普通用户可以免费使用的并发上限是200，所以填写180就可以了，无需改动。 此参数的具体说明可参考 http://translate.zvo.cn/396728.html
translate.service.thread.number=180
# 大模型翻译的单次翻译字符上限设置。这里可以默认1就行，不要改动。具体说明可参考 http://translate.zvo.cn/396736.html
translate.service.set.requestMaxSize=1
# 用于对翻译结果进行准确性检测。默认使用的是 GLM-4-Flash ，可以设置上 glm-4-plus 效果是最好的。
# 如果不设置，此处默认是 GLM-4-Flash
translate.service.glm.checkModel=glm-4-plus

# 翻译精确度。
# 取值为1~100 ，数值越大说明对翻译精准度要求越高。  
# 注意，设置的数值越高，对精确度要求越高， translate.service.set.repair.service 介入的也就越多，同样 translate.service.set.repair.service 的tokens消耗也就越大。
# 如果不设置，默认是普通的翻译质量 50
translate.service.set.repair.accuracy=80
# 用于修复精准度的翻译服务通道，采用 glm （智谱AI）的通道
translate.service.set.repair.service=glm
# 用于修复翻译结果的模型。JSON格式。
# model 参数：
# 	如果不设置，则使用 GLM-4-Flash 免费模型
# 	如果要求翻译结果质量很高，这里必须设置 glm-4-plus
# 其实它还可以设置 key、url 等参数，但是 translate.service.set.repair.service 它跟当前使用的 translate.service.glm 通道是同一个，所以其他相同的url、key 直接复用 translate.service.glm.url 、translate.service.glm.key 的，就不用单独设置了
translate.service.set.repair.config={"model":"glm-4-plus"}
````
  
其中 translate.service.glm.accuracy 参数控制翻译的质量。 如果 80 你还不满意，可以往上提。但绝大多数时候，80应该是足够的

### 5. 重启项目
操作完毕后，重启 translate.service 服务，执行重启命令 :

````
/mnt/service/start.sh
````


### 6. 访问测试

直接访问你的服务器 ip ,即可看到效果：  
![](https://oscimg.oschina.net/oscnet/up-7d6ccea7bc664026ee77884439762e3dc4b.png)

随便选个语种切换一下试试

# 实际使用

### 文本翻译API接口
##### API接口说明
**请求URL**：http://你的服务器ip/translate.json  
**请求方式**：POST  
**请求参数**：  
	* **to** 将文本翻译为什么语种。可传入如 english 更多语种可访问 http://你服务器的ip/language.json  就能看到  
	* **text** 需要翻译的语言。格式如 ````["你好","探索星辰大海"]```` 它是json数组格式，支持一次翻译多个不同的文本，每个文本可以分别是不同的语言。  
**响应示例**：  
	````
	{"result":1,"info":"success","to":"english","text":["Hello","World"]}
	````
	
##### curl 翻译示例
为了方便理解上面的API接口使用，这里给出了一个curl请求的示例，另外这个示例你也可以直接复制就能运行使用，看到效果 

````
curl --request POST \
  --url 'http://api.translate.zvo.cn/translate.json' \
  --data to=english \
  --data 'text=["你好","世界"]'
````

### 网页多语言切换
##### 使用方式
在网页最末尾，html结束之前，加入以下代码，一般在页面的最底部就出现了选择语言的 select 切换标签，你可以点击切换语言试试切换效果

````
<script src="https://res.zvo.cn/translate/translate.js"></script>
<script>
translate.language.setLocal('chinese_simplified'); //设置本地语种（当前网页的语种）。如果不设置，默认自动识别当前网页显示文字的语种。 可填写如 'english'、'chinese_simplified' 等，具体参见文档下方关于此的说明。
translate.service.use('translate.service'); //设置采用私有部署的翻译通道，相关说明参考 https://translate.zvo.cn/4081.html
translate.request.api.host='http://121.121.121.121/'; //将这里面的ip地址换成你服务器的ip，注意开头，及结尾还有个 / 别拉下
translate.execute();//进行翻译 
</script>
````

如此，翻译请求接口就会走您自己服务器了。有关这个手动指定翻译接口的详细说明，可参考： http://translate.zvo.cn/4068.html

另外 translate.js 这个js文件你可以自己下载下来放到你自己项目里使用，它没有任何别的依赖，是标准的原生 JavaScript 。而且 translate.js 是完全开源的，你可以从 https://raw.githubusercontent.com/xnx3/translate/refs/heads/master/translate.js/translate.js 下载最新的js，放到你项目里进行使用。

##### 原理说明

它是直接扫描你网页的dom元素进行自动分析识别，然后将文本集中化进行翻译。也就是你要讲这个 translate.execute(); 这行要放在最底部，就是因为上面的渲染完了在执行它，可以直接触发整个页面的翻译。

另外它提供三四十个微调指令，比如切换语言select选择框的自定义及美化、自动识别并切换为用户所使用的语种、 图片翻译、自定义术语、只翻译哪些元素、哪些元素不被翻译、网页中有ajax请求时请求完毕自动触发翻译、网页中dom发生改动后自动触发翻译 ...... 等等，只要你想的，它都能支持你做到！如果做不到，你可以反馈我，我给你扩展上让它能做到。 它支持所有浏览器内使用的场景。什么管理后台、网站、vue、react ...... 都可以。

# 日志查看
你可以从服务器中查看相关日志情况。  
日志存放于 /mnt/service/logs/ 目录下  

### glm_yyyy-MM-dd.log 智谱ai进行文本翻译的日志
比如 glm_2025-03-18.log  
yyyy-MM-dd 是当前的年月日，它按照日期每天都会创建一个日志文件。  
它记录了你所有文本翻译的原文、译文、进行时间、翻译结果审查得分、是否启用了修复机制 等    
它每行都是一个文本翻译记录。  
示例：  

````
{"time":"10:00:12","generalText":"Hello","originalText":"你好","general":100}
{"time":"15:13:36","generalText":"关于电子报价提交的进一步指导可在此找到：","originalText":"Further guidance on electronic offers submission can be found on this:","general":70,"weakRepairText":"电子报价提交的进一步指导可在此找到：","weakRepair":85}
{"time":"2025-03-15 08:54:35","originalText":"in Jordan and it is the ILO employer’s constituent. It is an APEX organization without direct","general":30,"generalText":"在约旦，它是国际劳工组织雇主成员。它是一
个没有直接","weakRepair":60,"weakRepairText":"在约旦，它是国际劳工组织雇主成员。它是一个没有直接隶属关系的APEC组
织。","repairText":"在约旦，它是国际劳工组织雇主的组成部分。它是一个没有直接下属的顶尖组织。"}
````
* **time** 发生时间
* **originalText** 翻译的原文
* **generalText** 普通方式翻译的译文
* **general** 普通方式翻译的译文进行校验后的打分情况。 1~100分，分数越高表示翻译越精准
* **weakRepairText** 普通方式分数不达标，弱修复模式介入后的译文
* **weakRepair** 普通方式分数不达标，弱修复模式介入后的译文打分
* **repairText** 弱修复模式分数不达标，正常修复模式介入后的译文

### translate.service.log 系统运行日志
它存放 translate.service 本身的运行情况的日志

### request_yyyy-MM-dd.log 

它并不是你访问后它就会立即产生日志，而是它有一个日志缓冲，比如当日志达到几百条、或者距离上次将其保存到日志文件超过2分钟，它才会进行将日志信息打包写入到日志文件中。  
这里列出其中两条示例：  

````
{"method":"translate.json","size":4,"ip":"192.168.31.95","domain":"192.168.31.95","memoryCacheHitsSize":5,"time":"2025-03-19 10:22:56","memoryCacheHitsNumber":1,"to":"english"}
{"fileCache":"1845bbcbd9e600fab184b346d82042a9_english.txt","method":"translate.json","size":4,"ip":"192.168.31.95","domain":"192.168.31.95","time":"2025-03-19 10:26:56","to":"english"}
````

* **method** 当前请求的是哪个接口。比如 translate.json 则是请求的文本翻译API接口； language.json 则是请求的获取当前所支持的语言列表接口
* **fileCache** 针对 translate.json 翻译接口的请求，如果有命中文件缓存，则有这个参数，其值是 文件缓存的名字，它是在 ````/mnt/service/cache/```` 内的
* **originalSize** 针对 translate.json 翻译接口的请求，记录当前翻译的字符数（原文的字符数，非译文）
* **size** 针对 translate.json 翻译接口的请求，记录当前翻译的字符数（译文的字符数，非原文）
* **ip** 请求来源的ip
* **domain** 针对 translate.json 翻译接口的请求，如果是网站使用了 translate.js ，那这个则是这个网站的域名（它是自动获取到的）
* **time** 触发的时间
* **to** 针对 translate.json 翻译接口的请求，翻译为什么语种  
* **key** 针对 translate.json 翻译接口的请求，如果是你给对方通过 domain.json 配置设置的文本翻译key，那这个就是记录的key。
* **memoryCacheHitsNumber** 针对 translate.json 翻译接口的请求，如果有命中内存缓存，这里是记录命中内存缓存的条数（translate.json支持同时翻译多条）
* **memoryCacheHitsSize** 针对 translate.json 翻译接口的请求，如果有命中内存缓存，这里是记录命中内存缓存的字符数（译文的字符数，非原文）

