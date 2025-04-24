#!/bin/bash
# yum -y install wget && wget https://raw.githubusercontent.com/xnx3/translate/refs/heads/master/deploy/tcdn_upgrade.sh -O ~/upgrade.sh && chmod -R 777 ~/upgrade.sh && sh ~/upgrade.sh
#

# 结束当前tcdn进程
ps -ef | grep -w tcdn | grep root | grep -v grep |awk '{print $2}' | xargs --no-run-if-empty kill -9

# 免得结束不掉在结束一次
pkill tcdn

# 删除备份
echo "删除上次的备份"
rm -rf /mnt/tcdn/bin/tcdn.bak
# 进行备份
cp /mnt/tcdn/bin/tcdn /mnt/tcdn/bin/tcdn.bak
# 删除应用
rm -rf /mnt/tcdn/bin/tcdn


# 下载新版本
yum -y install wget
ARCH=$(uname -m)
if [ "$ARCH" == "x86_64" ]; then
    echo "当前 CPU 架构为 x86_64"
    wget http://down.zvo.cn/translate/tcdn/linux/x86_64/tcdn -O /mnt/tcdn/bin/tcdn
elif [[ "$ARCH" == arm* || "$ARCH" == aarch64 ]]; then
    echo "当前 CPU 架构为 ARM"
    wget http://down.zvo.cn/translate/tcdn/linux/arm64/tcdn -O /mnt/tcdn/bin/tcdn
else
    echo "注意，未知的 CPU 架构 ，安装终止 : $ARCH"
fi


# 赋予 tcdn 可执行文件权限
chmod -x /mnt/tcdn/bin/tcdn
chmod -R 777 /mnt/tcdn/bin/tcdn

# 启动 tcdn
echo "正在启动 tcdn..."
nohup /mnt/tcdn/bin/tcdn > /mnt/tcdn/logs/tcdn.log 2>&1 &
