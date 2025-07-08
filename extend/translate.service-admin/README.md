translate.service 服务私有部署的后台操作界面。  
它使用的是 translate.service 私有部署后的管理API接口来进行的各种功能操作。  
也就是所有的功能都是 translate.service 私有部署后就有的API接口，本项目只是把这个API接口的调用简单化，提供一个界面来操作而已。  

## 说明
其中token、domain 这两个参数是保存到了浏览器本地缓存 localStorage 中，分别对应的着 token 、 domain
