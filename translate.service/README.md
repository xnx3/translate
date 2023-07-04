translate.js 的后端翻译服务接口。  
在某些政府机关及大集团内部项目中，对数据隐私及安全保密有强要求场景、以及您对自有客户希望提供高可靠翻译服务场景时，您可将翻译服务接口进行私有化部署，不走我们公开开放的翻译接口，以做到安全保密及后端服务全部自行掌控。    

# 特性
* **超低部署成本** 仅需1核1G服务器即可完美承载，同时对CPU消耗底，像是轻量级服务器、T6级服务器等即可部署使用。
* **内置缓存能力** 采用文件形式缓存，规避使用redis等缓存服务时还要单独安装吃内存，利用当前云服务的磁盘高IO能力，提供给力支撑。
* **翻译接口限流** 对翻译的结果数据进行缓存，下次在翻译同样的内容时，直接从缓存中取，不需要再去请求翻译服务接口，降低大量的翻译接口请求次数。如果使用收费版翻译接口时，省钱方面尤为明显。
* **极其精简小巧** 对三方依赖低，其中[文件缓存采用FileUpload](https://github.com/xnx3/FileUpload)、[网络请求采用Http.java](https://github.com/xnx3/http.java)、[日志输出采用log.java](https://github.com/xnx3/log) 从而使得项目运行包非常精简小巧，从而在超低配服务器也可完美运行。

# 部署
### 1. 购买服务器

* 核心：1核
* 内存：1G
* 区域：新加坡
* 操作系统：CentOS 7.4
* 系统盘：默认的系统盘就行。无需数据盘
* 弹性公网IP：按流量计费（带宽大小10MB） （如果你是新用户首次购买活动折扣方式购买的服务器，那种默认的1MB也没问题，只不过如果使用量非常大时，效果不如按流量计费的那么好）
* 其他的未注明的，都按照怎么省钱怎么来选即可。

**备注**  
1. 这里会有多个型号，比如什么s3、s6、t6的，你就选最便宜的就行。（一般t6是最便宜的，选它就行）  
1. 安全组：要开放22、80这两个端口


### 2. 一键安装
服务器购买后，不要装别的环境，直接登陆进去执行一下代码进行安装。  
**再强调一下，别装别的杂七杂八的东西，像是宝塔了啥的都别装**  
执行shell命令进行一键部署安装

````
wget 码raw/master/install/install.sh -O install.sh && chmod -R 777 install.sh && sh ./install.sh
````

# 使用

在 ````translate.execute();```` 之前，加入一行代码，如下所示：

````
translate.request.api.host='http://121.121.121.121/'; //将这里面的ip地址换成你服务器的ip，注意开头，及结尾还有个 / 别拉下
translate.execute();
````

如此，翻译请求接口就会走您自己服务器了。

# 扩展
### https场景
如果你网站使用的是https协议，那翻译接口你也要变为https协议，不然会请求不到。  
比如可以使用华为云的全站加速服务，然后在此服务中配置SSL证书使之支持https  
将http变为https方式很多，这里只是提的一种比较方便的方式，其他具体的可以自行尝试，也或者我们出技术人员帮您操作，收几百人工费。

### 采用华为云翻译提供翻译服务
首先，您要通过上面命令已安装部署好。  
进入华为云翻译的控制台，网址： [https://console.huaweicloud.com/nlp/#/nlp/call-guide/call-api](https://console.huaweicloud.com/nlp/#/nlp/call-guide/call-api) 
![](https://cdn.weiunity.com/site/341/news/64da512a4a8746b8938ee90aacd89bf4.png)  
获取到 Token 认证中的 username、domainname、projectname 的值
然后将下面的username、domainname、projectname、password这四个参数请填上你当前自己的参数。  

````
# 将上面获取到的 username、domainname、projectname 的值填入
export username=hw012345678
export domainname=hw012345678
export projectname=cn-north-4
# 你当前华为云账号登录的密码
export password=1234567890
# 注意 ，请将上面四个参数填上你当前的参数。
# 

cd ~
wget https://gitee.com/mail_osc/translate_service/raw/master/install/huaweicloud_config.sh -O huaweicloud_config.sh && chmod -R 777 huaweicloud_config.sh && sh ./huaweicloud_config.sh
````
运行后完成设置，等待两分钟重启服务，然后测试一下，完成。

### 其他翻译服务的接入
可对接任意的翻译接口进行非常方便的扩展。比如百度翻译、华为云翻译、谷歌翻译、以及对接开源翻译引擎等等。  
扩展时，有以下几点需要注意：
1. 将扩展的翻译服务对接的实现，都要放到 cn.zvo.translate.service 这个包下。比如对接华为云翻译，那就建立一个 cn.zvo.translate.service 包，在这个包下建立一个名为 ServiceInterfaceImplement.java 的类
2. ServiceInterfaceImplement 要实现 cn.zvo.translate.core.service.interfaces.ServiceInterface 接口
3. 在跟翻译服务对接时，网络请求这块使用 cn.zvo.http.Http 这个，其使用说明参见 [https://github.com/xnx3/http.java](https://github.com/xnx3/http.java),  这样不至于引入很多杂七杂八的支持包进去。当然如果单纯就只是你自己用，你可以直接吧对方SDK，通过修改 pom.xml 中加入，来引入一堆的三方jar包。  
4. 要有一个构造方法，构造方法需要传入Map，具体代码如下
````
public ServiceInterfaceImplement(Map<String, String> config) {
	//可以使用 config.get('username') 获取 application.peroperties 中设置的 translate.service.huawei.username 的值
}
````
5. application.peroperties 中的配置项，按照上面所示的 translate.service.huawei.username ，其中:  
	1. translate.service 是固定的，
	1. huawei 是在 cn.zvo.translate.service 包下所建立的针对华为云翻译所建立的包名
	1. username 是自己定义的一个参数名，这里叫username，那么在 ServiceInterfaceImplement 的构造方法中获取时，也要用 config.get("username") 来取
  
这里已内置了两个翻译服务的对接示例，一个是google翻译、一个是华为云翻译，可以参考华为云翻译的实现 cn.zvo.translate.service.huawei.ServiceInterfaceImplement.java