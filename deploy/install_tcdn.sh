#!/bin/bash 

# 加载资源文件下载路径
cd ~
wget https://gitee.com/HuaweiCloudDeveloper/huaweicloud-solution-build-wangmarketcms/raw/master/shell/file.sh -O file.sh
chmod -R 777 file.sh
source ./file.sh
echo "加载资源文件下载路径完毕"

# 1. 安装 mysql
#### Mysql 安装后输出的root的登录密码，自己安装就用这种随机生成，要是资源编排安装那应该传入到~/install.properties 中，在去获取出来 ####
mysql_pwd=`openssl rand -base64 12`@wM1
# 数据库名称
db_name=translate
#############
# 安装mysql
wget https://gitee.com/HuaweiCloudDeveloper/huaweicloud-solution-build-wangmarketcms/raw/master/shell/mysql.sh -O mysql.sh
chmod -R 777 mysql.sh
source ./mysql.sh
echo "加载mysql.sh完毕"

############# 创建translate数据库并导入sql文件开始 #################
# Mysql安装的一些变量设置等。translate数据库是特定的，只有mysql安装在本身服务器才有的
# 创建 translate 数据库
mysql -uroot -p$mysql_pwd -e "create database IF NOT EXISTS ${db_name}"
# 导入sql
cd /root
wget https://gitee.com/mail_osc/translate/raw/master/deploy/translate.sql -O translate.sql
mysql -uroot -p$mysql_pwd $db_name -e "source /root/translate.sql"
sleep 3
############# 导入sql文件结束 #################


# 2. 安装JDK、Tomcat
##### JDK、Tomcat安装开始####
wget https://gitee.com/HuaweiCloudDeveloper/huaweicloud-solution-build-wangmarketcms/raw/master/shell/tomcat.sh -O tomcat.sh
chmod -R 777 tomcat.sh
source ./tomcat.sh
echo "加载tomcat.sh完毕"
##### JDK、Tomcat安装结束####
# 结束Tomcat的进程
ps -ef | grep java | grep root | grep -v grep |awk '{print $2}' | xargs --no-run-if-empty kill -9


# 3. 部署 api html文件转换的api
# 复制tomcat
cd /mnt/
cp -r tomcat8/ api/
# 更改tomcat 端口
sed -i "s#^<Server port=\"8005\" shutdown=\"SHUTDOWN\">#<Server port=\"8170\" shutdown=\"SHUTDOWN\">#g" /mnt/api/conf/server.xml
sed -i "s#^.*port=\"80\" protocol=\"org.apache.coyote.http11.Http11NioProtocol\"# port=\"8070\" protocol=\"org.apache.coyote.http11.Http11NioProtocol\"#g" /mnt/api/conf/server.xml
sed -i "s#^.*redirectPort=\"8443\"# redirectPort=\"8470\" #g" /mnt/api/conf/server.xml

# 安装translate.api应用
cd /mnt/api/webapps/ROOT/
wget http://down.zvo.cn/translate/translate.api.war -O translate.api.war
unzip translate.api.war
rm -rf translate.api.war

# 安装 chrome
cd ~  
wget http://down.zvo.cn/translate/google-chrome-stable_current_x86_64.rpm
yum install -y google-chrome-stable_current_x86_64.rpm  
ln -s /usr/bin/google-chrome /usr/bin/chrome  
yum -y install libxcb  
yum -y install GConf2 
#查看chrome版本
#chrome --version
cd /mnt/api/
mkdir chrome  
cd chrome  
# 这个版本跟上面是能对起来的。如果不对，可以去这个下载地址要换成去 https://chromedriver.chromium.org/downloads 查看的相应版本的
wget https://chromedriver.storage.googleapis.com/114.0.5735.90/chromedriver_linux64.zip  
unzip chromedriver_linux64.zip  
chmod +x chromedriver  

# 创建 chromehtml 缓存文件夹，ChormeUtil 用到
cd /mnt/api/
mkdir chromehtml

# 创建 fileupload 文件夹，用于文件存放
cd /mnt/api/
mkdir fileupload

# 防火墙打开8070端口
firewall-cmd --zone=public --add-port=8070/tcp --permanent
firewall-cmd --reload

#
# 修改配置文件中的一些配置
#
# 连接的账密
java -cp ~/properties.jar Properties -path=/mnt/api/webapps/ROOT/WEB-INF/classes/application.properties -set database.name=$db_name
java -cp ~/properties.jar Properties -path=/mnt/api/webapps/ROOT/WEB-INF/classes/application.properties -set database.ip=127.0.0.1
java -cp ~/properties.jar Properties -path=/mnt/api/webapps/ROOT/WEB-INF/classes/application.properties -set spring.datasource.username=root
java -cp ~/properties.jar Properties -path=/mnt/api/webapps/ROOT/WEB-INF/classes/application.properties -set spring.datasource.password=$mysql_pwd
# fileupload
java -cp ~/properties.jar Properties -path=/mnt/api/webapps/ROOT/WEB-INF/classes/application.properties -set fileupload.storage.local.path=/mnt/api/fileupload/
# log
java -cp ~/properties.jar Properties -path=/mnt/api/webapps/ROOT/WEB-INF/classes/application.properties -set log.datasource.file.path=/mnt/api/logs/

# 加入开机启动文件
echo '/mnt/api/bin/startup.sh'>>/etc/rc.d/rc.local
# 赋予可执行权限
chmod +x /mnt/api/bin/startup.sh
chmod +x /etc/rc.d/rc.local

# 启动tomcat
echo "启动api - tomcat"
/mnt/api/bin/startup.sh


# 4. 部署 admin 网站及域名管理后台
# 复制tomcat
cd /mnt/
cp -r tomcat8/ admin/
# 更改tomcat 端口
sed -i "s#^<Server port=\"8005\" shutdown=\"SHUTDOWN\">#<Server port=\"8188\" shutdown=\"SHUTDOWN\">#g" /mnt/admin/conf/server.xml
sed -i "s#^.*port=\"80\" protocol=\"org.apache.coyote.http11.Http11NioProtocol\"# port=\"8088\" protocol=\"org.apache.coyote.http11.Http11NioProtocol\"#g" /mnt/admin/conf/server.xml
sed -i "s#^.*redirectPort=\"8443\"# redirectPort=\"8488\" #g" /mnt/admin/conf/server.xml

# 安装translate.admin应用
cd /mnt/admin/webapps/ROOT/
wget http://down.zvo.cn/translate/translate.admin.war -O translate.admin.war
unzip translate.admin.war
rm -rf translate.admin.war

# 创建 fileupload 文件夹，用于文件存放
cd /mnt/admin/
mkdir fileupload

# 防火墙打开8088端口
firewall-cmd --zone=public --add-port=8088/tcp --permanent
firewall-cmd --reload

#
# 修改配置文件中的一些配置
#
# 连接的账密
java -cp ~/properties.jar Properties -path=/mnt/admin/webapps/ROOT/WEB-INF/classes/application.properties -set database.name=$db_name
java -cp ~/properties.jar Properties -path=/mnt/admin/webapps/ROOT/WEB-INF/classes/application.properties -set database.ip=127.0.0.1
java -cp ~/properties.jar Properties -path=/mnt/admin/webapps/ROOT/WEB-INF/classes/application.properties -set spring.datasource.username=root
java -cp ~/properties.jar Properties -path=/mnt/admin/webapps/ROOT/WEB-INF/classes/application.properties -set spring.datasource.password=$mysql_pwd
# fileupload
java -cp ~/properties.jar Properties -path=/mnt/admin/webapps/ROOT/WEB-INF/classes/application.properties -set fileupload.storage.local.path=/mnt/admin/fileupload/
# translate.service domain
java -cp ~/properties.jar Properties -path=/mnt/admin/webapps/ROOT/WEB-INF/classes/application.properties -set translate.tcdn.service.domain=http://api.translate.zvo.cn/
# translate.api domain
java -cp ~/properties.jar Properties -path=/mnt/admin/webapps/ROOT/WEB-INF/classes/application.properties -set translate.tcdn.api.domain=http://127.0.0.1:8070/
# log
java -cp ~/properties.jar Properties -path=/mnt/admin/webapps/ROOT/WEB-INF/classes/application.properties -set log.datasource.file.path=/mnt/admin/logs/
# 加入开机启动文件
echo '/mnt/admin/bin/startup.sh'>>/etc/rc.d/rc.local
# 赋予可执行权限
chmod +x /mnt/admin/bin/startup.sh
chmod +x /etc/rc.d/rc.local

# 启动tomcat
echo "启动admin - tomcat"
/mnt/admin/bin/startup.sh


# 5. 部署 user 用户访问
# 复制tomcat
cd /mnt/
cp -r tomcat8/ user/

# 安装translate.user应用
cd /mnt/user/webapps/ROOT/
wget http://down.zvo.cn/translate/translate.user.war -O translate.user.war
unzip translate.user.war
rm -rf translate.user.war

# 创建 htmlCache 文件夹，用于html缓存文件存放
cd /mnt/user/
mkdir htmlCache

# 防火墙打开80端口
firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --reload

#
# 修改配置文件中的一些配置
#
# 连接的账密
java -cp ~/properties.jar Properties -path=/mnt/user/webapps/ROOT/WEB-INF/classes/application.properties -set database.name=$db_name
java -cp ~/properties.jar Properties -path=/mnt/user/webapps/ROOT/WEB-INF/classes/application.properties -set database.ip=127.0.0.1
java -cp ~/properties.jar Properties -path=/mnt/user/webapps/ROOT/WEB-INF/classes/application.properties -set spring.datasource.username=root
java -cp ~/properties.jar Properties -path=/mnt/user/webapps/ROOT/WEB-INF/classes/application.properties -set spring.datasource.password=$mysql_pwd
# 翻译API
java -cp ~/properties.jar Properties -path=/mnt/user/webapps/ROOT/WEB-INF/classes/application.properties -set translate.tcdn.api.domain=http\://127.0.0.1:8070/
# 日志
java -cp ~/properties.jar Properties -path=/mnt/user/webapps/ROOT/WEB-INF/classes/application.properties -set log.tableName=useraction
java -cp ~/properties.jar Properties -path=/mnt/user/webapps/ROOT/WEB-INF/classes/application.properties -set log.datasource.file.path=/mnt/user/logs/
# 加入开机启动文件
echo '/mnt/user/bin/startup.sh'>>/etc/rc.d/rc.local
# 赋予可执行权限
chmod +x /mnt/user/bin/startup.sh
chmod +x /etc/rc.d/rc.local

# 启动tomcat
echo "启动user - tomcat"
/mnt/user/bin/startup.sh


# 6. 部署 service
# 复制tomcat
cd /mnt/
cp -r tomcat8/ service/
# 更改tomcat 端口
sed -i "s#^<Server port=\"8005\" shutdown=\"SHUTDOWN\">#<Server port=\"8160\" shutdown=\"SHUTDOWN\">#g" /mnt/service/conf/server.xml
sed -i "s#^.*port=\"80\" protocol=\"org.apache.coyote.http11.Http11NioProtocol\"# port=\"8060\" protocol=\"org.apache.coyote.http11.Http11NioProtocol\"#g" /mnt/service/conf/server.xml
sed -i "s#^.*redirectPort=\"8443\"# redirectPort=\"8460\" #g" /mnt/service/conf/server.xml

# 安装translate.service 应用
cd /mnt/service/webapps/ROOT/
rm -rf ./*
wget http://down.zvo.cn/translate/translate.service.war -O translate.service.war
unzip translate.service.war
rm -rf translate.service.war

# 初始化创建相关文件夹
mkdir /mnt/service/fileupload/
# 设置application.properties配置
java -cp ~/properties.jar Properties -path=/mnt/service/webapps/ROOT/WEB-INF/classes/application.properties -set log.datasource.file.path=/mnt/service/logs/
java -cp ~/properties.jar Properties -path=/mnt/service/webapps/ROOT/WEB-INF/classes/application.properties -set fileupload.storage.local.path=/mnt/service/fileupload/

# 防火墙打开8060端口
firewall-cmd --zone=public --add-port=8060/tcp --permanent
firewall-cmd --reload

# 加入开机启动文件
echo '/mnt/service/bin/startup.sh'>>/etc/rc.d/rc.local
# 赋予可执行权限
chmod +x /mnt/service/bin/startup.sh
chmod +x /etc/rc.d/rc.local

# 启动tomcat
echo "启动service - tomcat"
/mnt/service/bin/startup.sh

# translate.admin 设置它的配置文件，设置翻译服务来源是服务器本身
# java -cp ~/properties.jar Properties -path=/mnt/admin/webapps/ROOT/WEB-INF/classes/application.properties -set translate.tcdn.service.domain=http://api.translate.zvo.cn/
# translate.api 设置它的配置文件，设置翻译服务来源是服务器本身
# java -cp ~/properties.jar Properties -path=/mnt/api/webapps/ROOT/WEB-INF/classes/application.properties -set translate.tcdn.service.domain=http://127.0.0.1:8060/

#### 最后，安装完成后的一些清理
# 删除默认加入的 /mnt/tomcat8
rm -rf /mnt/tomcat8/
# 打印信息
echo '您已成功安装。请注意，请打开您服务器安全组的这几个端口：80、8070、8088'