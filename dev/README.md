translate.js 原本是不支持npm用的，感谢  https://github.com/Lruihao  全程参与 npm 自动发布的指导及手把手教授，让translate.js 能自动将新版本发布到npm ！！！ npm中使用：
````npm i i18n-jsautotranslate````

## 准备
#### 下载 node.js 安装 
安装完后 npm 能出东西了
#### https://git-scm.com/ 下载安装git命令
	下载后要添加环境变量 PATH  添加一个 H:\Program Files\Git\bin\
	然后新开一个 powershell 输入git就能出东西了

#### github仓库中，开启 Actions
 Settings -> Actions -> General -> 
  
Actions permissions ->  选择 Allow all actions and reusable workflows -> 保存，这样在仓库主页顶部就出来 Actions 这一项了：
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

  
Workflow permissions 设置为  Read and write permissions


#### github仓库中，设置 NPM_TOKEN
 Settings -> Actions -> Secrets and variables -> Actions  

Repository secrets -> New respository srcret  
名字是 NPM_TOKEN
值是 https://www.npmjs.com/settings/zvo/tokens 这里创建的token， 创建token参考： https://github.com/xnx3/translate/pull/45



## 设置版本号
#### 方式一（不使用）
powershell   
进入 G:\git\translate  
npm version 3.11.2 
会吧 package.json 、 translate.js 的版本更改

#### 方式二（使用）
dev/update-version.bat 直接执行，按提示输入版本号
````
Please enter the version number, there is no 'v' before it, in the format of 3.11.2  :3.12.0

> version
> node dev/update-version.js


> postversion
> git push && git push --tags
````
便会做到方式一的效果

#### 提交发布
github客户端吧更改提交git  
然后正常添加 https://github.com/xnx3/translate/releases 后就会自动往 npm 推送更新了