对 translate.js 进行定制，比如删除某些根本就不需要的方法代码减小体积

## 打jar
mvn install

## 执行
````
%~dp0jre\bin\java.exe -Dfile.encoding=UTF-8 -jar %~dp0translate.customTranslateJs-1.0.jar %~dp0translate.js  translate.setUseVersion2,translate.resourcesUrl %~dp0append.js
pause;
````

* 第一个参数 %~dp0translate.js 是新生成的translate.js 文件存放的路径
* 第二个参数 translate.setUseVersion2,translate.resourcesUrl,translate.localLanguage 是要删除的方法，多个每个之间用,分割。比如 translate.setUseVersion2 则是删除 translate.js 中 /*js translate.setUseVersion2 start*/ 跟 /*js translate.setUseVersion2 end*/ 中间的代码
* 第三个参数 可传入也可不传入，是向  translate.js 的最后追加代码，这些追加的代码放到一个文本文件里，把这个文件的路径作为第三个参数传入即可