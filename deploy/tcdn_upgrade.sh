#!/bin/bash
# yum -y install wget && wget https://gitee.com/mail_osc/translate/raw/master/deploy/tcdn_upgrade.sh -O ~/upgrade.sh && chmod -R 777 ~/upgrade.sh && sh ~/upgrade.sh
#

# 结束当前tcdn进程
ps -ef | grep tcdn | grep root | grep -v grep |awk '{print $2}' | xargs --no-run-if-empty kill -9

# 下载新版本
yum -y install wget
wget http://down.zvo.cn/translate/tcdn/linux/x86_64/tcdn -O /mnt/tcdn/bin/tcdn

# 赋予 tcdn 可执行文件权限
chmod -x /mnt/tcdn/bin/tcdn
chmod -R 777 /mnt/tcdn/bin/tcdn

# 启动 tcdn
echo "正在启动 tcdn..."
nohup /mnt/tcdn/bin/tcdn > /mnt/tcdn/logs/tcdn.log 2>&1 &
