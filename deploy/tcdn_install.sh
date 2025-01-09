#!/bin/bash
# yum -y install wget && wget https://raw.githubusercontent.com/xnx3/translate/refs/heads/master/deploy/tcdn_install.sh -O ~/install.sh && chmod -R 777 ~/install.sh && sh ~/install.sh
#
yum -y install wget
yum -y install unzip

# 校验down.zvo.cn下载源的通畅
wget https://gitee.com/HuaweiCloudDeveloper/huaweicloud-solution-build-wangmarketcms/raw/master/shell/hosts.sh -O ~/hosts.sh && chmod -R 777 ~/hosts.sh &&  sh ~/hosts.sh
rm -rf ~/hosts.sh

# 安装 redis
wget https://gitee.com/HuaweiCloudDeveloper/huaweicloud-solution-build-wangmarketcms/raw/master/shell/redis_no_install.sh -O ~/redis.sh && chmod -R 777 ~/redis.sh &&  sh ~/redis.sh
~/redis.sh

# 下载 TCDN 应用程序
mkdir /mnt 
mkdir /mnt/tcdn
cd /mnt/tcdn/
wget http://down.zvo.cn/translate/tcdn/linux/tcdn.zip -O tcdn.zip
unzip tcdn.zip
chmod -R 777 /mnt/tcdn/start.sh
rm -rf /mnt/tcdn/tcdn.zip
# 根据不同的架构下载不同的tcdn应用包
ARCH=$(uname -m)
if [ "$ARCH" == "x86_64" ]; then
    echo "当前 CPU 架构为 x86_64 正在下载 x86_64 的tcdn应用"
    wget http://down.zvo.cn/translate/tcdn/linux/x86_64/tcdn -O /mnt/tcdn/bin/tcdn
elif [[ "$ARCH" == arm* || "$ARCH" == aarch64 ]]; then
    echo "当前 CPU 架构为 ARM 正在下载 arm64 的 tcdn应用"
    wget http://down.zvo.cn/translate/tcdn/linux/arm64/tcdn -O /mnt/tcdn/bin/tcdn
else
    echo "注意，未知的 CPU 架构 ，安装终止 : $ARCH"
fi

# 加入开机自启动
echo '/mnt/tcdn/start.sh'>>/etc/rc.d/rc.local

# 赋予可执行权限
chmod +x /mnt/tcdn/start.sh
chmod +x /etc/rc.d/rc.local

# 关闭防火墙
systemctl stop firewalld
systemctl disable firewalld

# 启动 TCDN
cd /mnt/tcdn/
./start.sh