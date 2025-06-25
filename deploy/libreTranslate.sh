#!/bin/bash
# centos7.4 一键安装命令
# yum -y install wget && wget https://gitee.com/mail_osc/translate/raw/master/deploy/libreTranslate.sh -O ~/install.sh && chmod -R 777 ~/install.sh && sh ~/install.sh
# 
# 其中它默认只是包含中文互译，如果加入其他中法、中俄、英俄互译等，可在启动docker容器时，修改其中的 --load-only en,zh 参数即可。
# docker run -d \
#   --restart unless-stopped \
#   --name libretranslate \
#   --cpu-shares="700" \
#   --memory 4096m \
#   -p 5353:5000 \
#   libretranslate/libretranslate \
#   --load-only en,zh 
# 

# 更新 yum
yum -y update

# 部署 docker
# 卸载旧版本（如果之前安装过的话）
yum remove docker  docker-common docker-selinux docker-engine

# yum 安装 gcc 相关
yum -y install gcc
yum -y install gcc-c++

# 安装需要的软件包
yum install -y yum-utils

# 设置国内的镜像仓库
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 更新 yum 软件包索引
yum makecache fast

# 安装 docker engine
yum -y install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 docker
systemctl start docker

# 设置开机启动
systemctl enable docker.service

#  部署 docker compose安装

# github速度太慢，换成了自己的
# curl -L "https://github.com/docker/compose/releases/download/v2.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
curl -L "http://down.zvo.cn/centos/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# 测试
docker-compose version

# 安装LibreTranslate
docker pull libretranslate/libretranslate
# 启动LibreTranslate
docker run -d \
   --restart unless-stopped \
   --name libretranslate \
   --cpu-shares="700" \
   --memory 4096m \
   -p 5353:5000 \
   libretranslate/libretranslate \
   --load-only en,zh

#关闭防火墙
sudo systemctl stop firewalld
sudo systemctl disable firewalld