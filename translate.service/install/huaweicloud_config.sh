#!/bin/bash 
# 
# 设置华为云翻译的配置
# 
# 这里在执行此shell之前，已定义过：
# export username=hw012345678
# export domainname=hw012345678
# export projectname=cn-north-4
# # 你当前华为云账号登录的密码
# export password=1234567890
#

java -cp ~/properties.jar Properties -path=/mnt/tomcat8/webapps/ROOT/WEB-INF/classes/application.properties -set translate.service.huawei.username=${username}
java -cp ~/properties.jar Properties -path=/mnt/tomcat8/webapps/ROOT/WEB-INF/classes/application.properties -set translate.service.huawei.domainname=${domainname}
java -cp ~/properties.jar Properties -path=/mnt/tomcat8/webapps/ROOT/WEB-INF/classes/application.properties -set translate.service.huawei.projectname=${projectname}
# 设置华为云的登录密码
java -cp ~/properties.jar Properties -path=/mnt/tomcat8/webapps/ROOT/WEB-INF/classes/application.properties -set translate.service.huawei.password=${password}
# 简单一点，直接重启服务器
reboot