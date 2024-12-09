## 准备
#### 下载 node.js 安装 
安装完后 npm 能出东西了
#### https://git-scm.com/ 下载安装git命令
	下载后要添加环境变量 PATH  添加一个 H:\Program Files\Git\bin\
	然后新开一个 powershell 输入git就能出东西了

#### github仓库中，开启 Actions
 Settings -> Actions -> Actions permissions ->  选择 Allow all actions and reusable workflows -> 保存，这样在仓库主页顶部就出来 Actions 这一项了：
Code
Issues
Pull requests
Discussions
Actions
Projects
Wiki
Security
Insights
Settings

## 设置版本号
powershell   
进入 G:\git\translate  
npm version 3.11.2 
会吧 package.json 、 translate.js 的版本更改
然后github客户端吧更改提交git