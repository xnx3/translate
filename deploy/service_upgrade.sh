#!/bin/bash
#
# wget https://gitee.com/mail_osc/translate/raw/master/deploy/service_upgrade.sh -O ~/upgrade.sh && chmod -R 777 ~/upgrade.sh && sh ~/upgrade.sh
#

# 删除所有 down.zvo.cn 的条目
sed -i '/[[:space:]]down\.zvo\.cn$/d' /etc/hosts
# 添加新的记录
echo "125.208.20.35 down.zvo.cn" >> /etc/hosts
service nscd restart
systemctl restart network

# 设置 tcdn 可执行文件的路径
TCDN_EXEC="/mnt/service/bin/translate.service"
LOG_FILE="/mnt/service/logs/translate.service.log"

echo "更新 translate.service 到最新版本..."

# 检查是否已经在运行
echo "检查是否有正在运行的 进程..."

# 使用 pgrep 查找所有与 tcdn 相关的进程 ID，并存储在数组中
TCDN_PIDS=($(pgrep -f "$TCDN_EXEC"))

if [ ${#TCDN_PIDS[@]} -gt 0 ]; then
  echo "检测到 tanslate.service 正在运行，PID 为 ${TCDN_PIDS[*]}。"
  
  # 逐一终止所有匹配的 应用 进程
  for PID in "${TCDN_PIDS[@]}"; do
    echo "正在停止 应用 进程 $PID..."
    kill -9 "$PID"
    
    # 检查单个进程是否成功终止
    if [ $? -eq 0 ]; then
      echo "进程 $PID 已成功停止。"
    else
      echo "无法停止进程 $PID，请检查权限。"
    fi
  done
else
  echo "未检测到 应用 正在运行。"
fi

# 免得结束不掉在结束一次
pkill translate.service

# 删除
echo "删除 translate.service"
rm -rf /mnt/service/bin/translate.service

# 启动 tcdn
echo "下载最新 translate.service ..."

wget http://down.zvo.cn/translate/translate.service/linux_x86_64/translate.service -O /mnt/service/bin/translate.service

# ip2region.xdb
# 定义文件路径
IP_FILE="/mnt/service/bin/ip2region.xdb"
# 判断文件是否存在
if [ ! -f "$FILE" ]; then
    echo "文件 $FILE 不存在，开始下载..."
    wget http://down.zvo.cn/translate/translate.service/ip2region.xdb -O "$IP_FILE"
else
    echo "文件 $IP_FILE 已存在，跳过"
fi


# 赋予 tcdn 可执行文件权限
chmod -R 777 $TCDN_EXEC

nohup $TCDN_EXEC > $LOG_FILE 2>&1 &

# 检查启动是否成功
if [ $? -eq 0 ]; then
  echo "更新并启动成功，日志输出到 $LOG_FILE"
else
  echo "启动失败，请检查日志以获取更多信息。"
  exit 1
fi

