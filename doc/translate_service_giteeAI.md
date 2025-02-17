# 采用 GiteeAI 提供翻译能力

### 1. 开服务器
核心：1核
内存：1G
操作系统：CentOS 7.4 (这个版本没有可选 7.6)
系统盘：默认的系统盘就行。无需数据盘
弹性公网IP：按流量计费（带宽大小10MB。如果你只是你自己用，翻译的量不大，你完全可以选1MB带宽）
其他的未注明的，都按照怎么省钱怎么来选即可。

备注
这里会有多个型号，比如什么s3、s6、t6的，你就选最便宜的就行。（一般t6是最便宜的，选它就行）
安全组：要开放22、80这两个端口

### 2. 部署
执行shell命令进行一键部署安装
````
wget https://gitee.com/mail_osc/translate/raw/master/deploy/install_translate.service.sh -O install.sh && chmod -R 777 install.sh && sh ./install.sh
````

### 3. 配置 GiteeAI 参数
修改配置文件 /mnt/tomcat8/webapps/ROOT/WEB-INF/classes/application.properties ，在最后增加两个配置

````
# 使用 GiteeAI 上的哪个模型，这里使用的是 DeepSeek-V3 模型。 这里固定就填这个就好，这个的效果感觉最好
translate.service.giteeAI.model=DeepSeek-V3
# GiteeAI 的访问令牌，可通过 https://ai.gitee.com/mail_osc/dashboard/settings/tokens 来创建
translate.service.giteeAI.key=28XPWN4GUQDORDJSPKDSIOXPKPCABxxxxxxx
# 单次最大返回的token数。建议这个就可以了，GiteeAI的上限是4K
# translate.service.giteeAI.max_tokens=3000
````
注意 translate.service.giteeAI.key 这个的值你要换成你自己的，其他的不用改

### 4. 重启tomcat
````
pkill java
sh /mnt/tomcat8/bin/startup.sh
````

### 5. 使用 AI i18n 
直接访问ip，即可看到 demo  示例页面，可以点击底部的切换语言，比如点击切换为英语，它便可以自动扫描当前页面非英文的部分，将其翻译为英语。  
注意，如果你用的是大模型，第一次翻译是有点等待时间的，但是它翻译之后会立即进入内存缓存，第二次在使用时会毫秒级返回，不会再走大模型，也会节省你大模型的tokens消耗，极大降低费用成本。
