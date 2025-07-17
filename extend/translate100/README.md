# translate100
它是m2m100(12B)经过蒸馏small100及各种处理优化后，得到的完全适配 [translate.js](https://gitee.com/mail_osc/translate) 的，可在1核2G服务器上使用的一键部署应用。  
1. 在无GPU场景，对支持量化指令的CPU，会对Linear层进行int8量化，提高运行速度。  
2. 禁用梯度计算、关闭了自动求导引擎的其他功能，进一步提升性能并降低内存占用  
3. 混合精度加速 ，当检测到GPU时，动态选择FP16/FP32精度进行计算，在保持精度的同时减少显存使用并提高吞吐量。  
4. 针对CPU和GPU环境自动切换优化策略，确保在不同硬件上都能获得最佳性能。  
5. 它开放标准的文本翻译接口，一键部署，无需任何配置，在超低配置的云服务器（如1核2G）即可使用。
6. 支持 100 个语种翻译。  
7. 无需指定原文，自识别输入的翻译文本，并输出译文。  
8. 支持一句话中含有多个语种。


# 运行
windows/linux 一键运行应用，即将放出，敬请期待

### 系统环境变量设置
它的一些控制参数，采用使用系统环境变量的方式来进行设置

### TRANSLATE100_PORT
环境变量设置的端口号，默认80
````
TRANSLATE100_PORT=80
````
### TRANSLATE100_USE_GPU
环境变量设置是否使用GPU，默认true  
设置为false则是即使有GPU也不用，强制使用CPU
````
TRANSLATE100_USE_GPU=true
````
### TRANSLATE100_USE_CPU_QUANT
环境变量设置是否使用CPU量化，默认true ，他会自动检测CPU是否支持，如果支持，则会自动启用CPU量化。  
如果设置为false，则即使CPU支持量化，会禁用CPU量化。
````
TRANSLATE100_USE_CPU_QUANT=true
````


# 使用
### /	
首页、健康检查的作用  
可直接访问 http://127.0.0.1 就能看到一个欢迎页，这个欢迎页是一个简单的HTML页面，包含了一些基本的信息，另外如果你需要做负载进行健康检查，也可以用这个来作为健康检查的页面。  

### /language.json 
获取当前支持的语言列表  
CURL请求:

````
curl --request GET \
  --url http://127.0.0.1/language.json 
````
返回响应：
````
{
  "info": "success",
  "list": [
    {
      "id": "afrikaans",
      "name": "\u5357\u975e\u8377\u5170\u8bed",
      "serviceId": "af"
    },
    {
      "id": "amharic",
      "name": "\u963f\u59c6\u54c8\u62c9\u8bed",
      "serviceId": "am"
    },
    {
      "id": "english",
      "name": "\u82f1\u8bed",
      "serviceId": "en"
    },
    {
      "id": "chinese_simplified",
      "name": "\u7b80\u4f53\u4e2d\u6587",
      "serviceId": "zh"
    },
    
    ......

  ],
  "result": 1
}
````
* **result** 1为成功，0为失败。
	如果返回0，失败，可以通过 info 来获取失败信息。
* **list**  语言列表，每个元素为一个语言，包含：
	* **id**  语言标识，如： english
	* **name**  语言名称，如： 英文
* **info**  失败信息，只有当 result 为0时，才会返回。

### /translate.json 
翻译接口  
CRUL请求： 

````
curl --request POST \
  --url http://127.0.0.1/translate.json \
  --data 'text=["你好","世界"]' \
  --data to=english
````
* **text**  待翻译的文本。
	如果是只有一个文本，则支持字符串格式。
	如果是多个文本，则支持数组格式，每个元素为一个待翻译的文本。
* **to**  目标语言，传入如： english 具体有哪些值，可以通过 /language.json 获取

返回响应：

````
{
	"result": 1,
	"text": [
		"Hello",
		"The world"
	],
	"time": 37,
	"to": "english",
	"tokens": 4
}
````
* **result** 1为成功，0为失败。
	如果返回0，失败，可以通过 info 来获取失败信息。
* **text**  翻译后的文本，它始终是数组格式。
* **to** 目标语言，跟传入的 to 对应
* **time**  翻译耗时，单位毫秒。
* **tokens**  翻译传入的内容的token数量。
* **info**  失败信息，只有当 result 为0时，才会返回。


# 性能测试
CPU：intel i7 7700k 4核8线程， 3.6GHz  
GPU：GTX 1050TI 4G显存  
执行任务：翻译250个中文汉字，翻译至英文

|  计算方式 | 是否量化 |  启动时瞬时内存占用  | 运行中内存占用 | 翻译耗时 | 显存使用 |  
| ------------ | ------------ | ------------ | ------------ | ------------ | ------------ |  
| CPU | 未启用 | 970MB | 400MB | 10.4s |  |  
| CPU | 启用 | 2200MB | 1784MB | 3.1s | |  
| GPU | 未启用 | 1410MB | 910MB | 1.8s | 700MB |  
  
最低运行要求：1核2G内存即可运行


