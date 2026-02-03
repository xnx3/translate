#!/bin/bash
# yum -y install wget && wget https://raw.githubusercontent.com/xnx3/translate/refs/heads/master/deploy/service_install.sh -O ~/install.sh && chmod -R 777 ~/install.sh && sh ~/install.sh
#

yum -y install unzip


# 校验down.zvo.cn下载源的通畅
# 先删除所有 down.zvo.cn 的条目
sed -i '/[[:space:]]down\.zvo\.cn$/d' /etc/hosts
wget https://gitee.com/HuaweiCloudDeveloper/huaweicloud-solution-build-wangmarketcms/raw/master/shell/hosts.sh -O ~/hosts.sh && chmod -R 777 ~/hosts.sh &&  sh ~/hosts.sh
rm -rf ~/hosts.sh
yum -y install nscd
service nscd restart

# 安装 redis
wget https://gitee.com/HuaweiCloudDeveloper/huaweicloud-solution-build-wangmarketcms/raw/master/shell/redis_no_install.sh -O ~/redis.sh && chmod -R 777 ~/redis.sh &&  sh ~/redis.sh
rm -rf ~/redis.sh

# 准备下载JRE8，构建目录
mkdir /mnt 
mkdir /mnt/service
mkdir /mnt/service/bin
mkdir /mnt/service/bin/jre8

# 根据不同的架构下载不同的tcdn应用包
ARCH=$(uname -m)
if [ "$ARCH" == "x86_64" ]; then
    echo "当前 CPU 架构为 x86_64 正在下载 x86_64 的tcdn应用"
    wget http://down.zvo.cn/translate/translate.service/linux_x86_64/translate.service -O /mnt/service/bin/translate.service
    wget http://down.zvo.cn/centos/jre8.zip -O /mnt/service/bin/jre8/jre8.zip
elif [[ "$ARCH" == arm* || "$ARCH" == aarch64 ]]; then
    #echo "当前 CPU 架构为 ARM 正在下载 arm64 的 tcdn应用"
    #wget http://down.zvo.cn/translate/translate.service/linux_arm64/translate.service -O /mnt/service/bin/translate.service
    echo "注意，当前 CPU 架构为 ARM ，请选择 x86_64 架构的CPU。当前安装终止 : $ARCH"
    exit 1
else
    echo "注意，未知的 CPU 架构 ，安装终止 : $ARCH"
    exit 1
fi

# jre
cd /mnt/service/bin/jre8
unzip jre8.zip
chmod -R 777 /mnt/service/bin/jre8
rm -rf /mnt/service/bin/jre8/jre8.zip
# 应用
chmod -R 777 /mnt/service/bin/translate.service

# 初始化目录
mkdir /mnt/service/logs/
mkdir /mnt/service/cache/

# 配置文件
wget http://down.zvo.cn/translate/translate.service/config.properties -O /mnt/service/config.properties
wget http://down.zvo.cn/translate/translate.service/domain.json -O /mnt/service/domain.json

# ip2region.xdb
# 已经不带服务端判定地址能力了，有浏览器来获取用户所使用的语言。只有开源版本暂时保留着这个，以适配非常老旧的版本进行兼容
#wget http://down.zvo.cn/translate/translate.service/ip2region.xdb -O /mnt/service/bin/ip2region.xdb

# 下载启动文件
cd /mnt/service/
wget http://down.zvo.cn/translate/translate.service/start.sh -O /mnt/service/start.sh
chmod -R 777 /mnt/service/start.sh

# 加入开机自启动
echo '/mnt/service/start.sh'>>/etc/rc.d/rc.local

# 赋予可执行权限
chmod +x /mnt/service/start.sh
chmod +x /etc/rc.d/rc.local

#放开80端口访问权限
firewall-cmd --zone=public --add-port=80/tcp --permanent
#重新载入防火强
firewall-cmd --reload

# 启动 
cd /mnt/service/
./start.sh