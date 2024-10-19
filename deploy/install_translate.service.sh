#!/bin/bash 
# 
# 常规方式安装translate.js的后端翻译接口服务，比如可以在阿里云、腾讯云、等别的云服务上进行安装本系统。在 CentOS 7.4 (没7.4的话7.6等应该也行) 
#

# properties.jar 操作properties使用。说明：https://gitee.com/mail_osc/properties 
export propertiesDownUrl=http://down.zvo.cn/properties/properties-1.0.1.jar


yum -y install wget
yum -y install gzip
yum -y install zip
yum -y install unzip


# 校验down.zvo.cn下载源的通畅
cd ~
wget https://gitee.com/HuaweiCloudDeveloper/huaweicloud-solution-build-wangmarketcms/raw/master/shell/hosts.sh -O hosts.sh
chmod -R 777 hosts.sh
source ./hosts.sh
echo "校验down.zvo.cn下载源的通畅 - 校验完毕"
rm -rf ~/hosts.sh

##### JDK、Tomcat安装开始####
wget https://gitee.com/HuaweiCloudDeveloper/huaweicloud-solution-build-wangmarketcms/raw/master/shell/tomcat.sh -O tomcat.sh
chmod -R 777 tomcat.sh
source ./tomcat.sh
echo "加载tomcat.sh完毕"
##### JDK、Tomcat安装结束####

####### 安装应用包 #########
cd /mnt/tomcat8/webapps/ROOT/
wget http://down.zvo.cn/translate/translate.service.war -O translate.war
unzip translate.war
rm -rf translate.war


# 初始化创建相关文件夹
mkdir /mnt/tomcat8/fileupload/
# 设置application.properties配置
java -cp ~/properties.jar Properties -path=/mnt/tomcat8/webapps/ROOT/WEB-INF/classes/application.properties -set log.datasource.file.path=/mnt/tomcat8/logs/
java -cp ~/properties.jar Properties -path=/mnt/tomcat8/webapps/ROOT/WEB-INF/classes/application.properties -set fileupload.storage.local.path=/mnt/tomcat8/fileupload/

# 删除 tomcat.sh 等通用模块
rm -rf /root/tomcat.sh
systemctl stop firewalld.service
# 启动tomcat
echo "启动tomcat"
/mnt/tomcat8/bin/startup.sh
#看启动日志
#echo "看启动日志"

# 加入每天凌晨3点自动重启服务器的定时任务
# 建立服务器启动后自动执行的shell文件
mkdir /mnt/crontab/
#每天凌晨三点重启
echo "0 3 * * * sudo reboot" > /mnt/crontab/run.txt
# 设置定时命令
crontab /mnt/crontab/run.txt

# 安装CPU限制，避免1核1G规格卡死
yum -y install epel-release
yum -y install cpulimit
# 开机启动时清空缓存文件
echo 'cpulimit -l 10 rm -rf /mnt/tomcat8/fileupload/* &'>>/etc/rc.d/rc.local

# 同步时区，设为 UTC/GMT  格林威治时间
sudo timedatectl set-timezone UTC
# 增加时间自动同步  
sudo yum -y install ntp
sudo systemctl start ntpd
sudo systemctl enable ntpd
sudo systemctl status ntpd
sudo ntpd -gq

# 输出提示
echo "自动部署完成，您可以正常使用了！打开浏览器，访问ip即可使用"