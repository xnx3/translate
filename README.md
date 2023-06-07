
<h1 align="center">
    translate.js
</h1>
<h4 align="center">
    Two lines of js realize automatic html translation. <br/>
    No need to change the page, no language configuration file, no API key, SEO friendly!
</h4> 
<h4 align="center">
    Current English DOC  |  <a href="doc/README.cn.md">查阅中文文档</a>
</h4> 


# Characteristic
* **Easy to use.** Without any preliminary preparation, you can directly add a few lines of code to have the ability to automatically switch multiple languages.
* **No additional workload.** There is no need to modify the page itself, no language files that need to be configured separately for all languages, and no need for you to call the code of the text area to be displayed on the page itself. I think that is too unfriendly for technicians. Moreover, it doesn't need you to apply for any key to XXX website. It is open and ready to use.
* **Extremely flexible and scalable.** You can specify whether it will only translate certain specified areas, display the drop-down box when switching languages, or place multiple language switching buttons, and specify that certain specific elements will not be translated and ignored
* **Automatically match languages.** Automatically switch the language used in the user's country according to the user's country
* **Instant translation ability.** Built-in cache preloading mechanism, as long as the translated page is viewed again, it will achieve instant translation effect, giving the user the impression that the page is originally in this language, not translated by a third party.
* **Free for permanent use.** With the Apache - 2.0 open source protocol, you can use it for free forever.
* **Search engine friendly.** It does not affect the inclusion of your own website search engine. The source code of the webpage crawled by the crawler will not be changed. You can rest assured.
* **Back-end translation is open source.** In some government agencies and internal projects of large groups, when there are strong requirements for data privacy and security, or you want to provide self-built highly reliable translation services for your own customers, you can privatize the deployment of the back-end translation interface instead of our open translation interface, so as to achieve full control of security and back-end services.

# Online experience
[http://res.zvo.cn/translate/demo.html](http://res.zvo.cn/translate/demo.html)

# Try using other people's websites first
![效果](http://cdn.weiunity.com/site/341/news/9a7228aaae28475996da9026b93356c8.gif "")

1. Open a webpage at random  
2. Right click - review elements  
3. Paste the following code:
	```` var head= document.getElementsByTagName('head')[0];  var script= document.createElement('script');  script.type= 'text/javascript';  script.src= 'https://res.zvo.cn/translate/inspector_v2.js';  head.appendChild(script);  ````
4. Enter to execute  
5. At the top left corner of the current page, there is a big language switch. Try switching.  

# Quick use
At the end of the page, ````</html>```` before, Add the following code. Generally, the select switch tab for selecting language appears at the bottom of the page. In fact, it is so simple

````
<script src="https://res.zvo.cn/translate/translate.js"></script>
<script>
translate.setUseVersion2(); //Set to use v2.x version
translate.language.setLocal('chinese_simplified'); //Set the local language (the language of the current page). If not set, the language of the text displayed on the current page will be automatically recognized by default. Can be filled in, such as 'english'、'chinese_simplified' , please refer to the description below the document.
translate.execute(); // Translate
</script>
````

# More extended usage

### Specify the location of the select selection box for switching languages
Where you want to display on your page, just put the following one.

````
<div id="translate"></div>
````

Mainly this ```` id="translate" ```` The button for switching languages will be automatically assigned to this ID. Of course, you don't have to be div, you can

````
<span id="translate"></span>
````

### CSS beautification switch language button
Css can be used to control the display position and beauty of switching language selection. For example:

````
<style>
.translateSelectLanguage{
	position: absolute;
	top:100px;
	right:100px;
}
</style>
````
This is the ````<select>```` tag that controls the switching language

### Set whether the select switch language will appear automatically

````
/*
 * Whether to display the selection box of select language, and true to display; False does not display. Default is true
 * Note that this line should be placed in translate.execute(); above
 */
translate.selectLanguageTag.show = false;
translate.execute();
````

The usage scenario is, if you use:  

````
<a href="javascript:translate.changeLanguage('en');">Switch to English</a>
````

If this switch mode is used, the selection from the select drop-down box will not be used, and you can use this mode to not display.  
Of course, you can also use css to control its display. For example: 

````
<style>
#translate{
	display:none;
}
</style>
````

### Customize the language supported by the selected switch language

````
translate.selectLanguageTag.languages = 'english,chinese_simplified,korean'; //Each language is divided in English. For example, it supports the switching of English, Simplified Chinese and Korean. Different languages are supported according to different back-end translation services. Specific support can be obtained through http://api.translate.zvo.cn/doc/language.json.html obtain (If you are privately deployed, replace the requested domain name with your own privately deployed domain name)
````
Each language is divided in English. For example, it supports the switching of English, Simplified Chinese and Korean. Different languages are supported according to different back-end translation services.  
Specific support can be obtained through http://api.translate.zvo.cn/doc/language.json.html obtain (If you are privately deployed, replace the requested domain name with your own privately deployed domain name)   
**Note that this line should be placed in translate.execute(); above**
  

### Ignore the specified tag tag during translation

````
translate.ignore.tag.push('span'); //When translating, add the tag that you want to ignore and do not translate. Anything in this tag will not be translated.
````
When translating, add the tag that you want to ignore and do not translate. Anything in this tag will not be translated.  
If you want to see which tag tags are currently ignored, you can directly execute ````console. log (translate. ignore. tag)```` View

**Note that this line should be placed in translate.execute(); above**

### Ignore the specified class value during translation

````
translate.ignore.class.push('test');	//When translating, add the class tag that you want to ignore and do not translate. Anything in this tag will not be translated.
````
When translating, add the class tag that you want to ignore and do not translate. Anything in this tag will not be translated.  
If you want to see which tag tags are currently ignored, you can directly execute ````console. log (translate. ignore. class)```` View
**Note that this line should be placed in translate.execute(); above**



### Ignore the specified id value during translation

````
translate.ignore.id.push('test');	//When translating, add the value of the id that you want to ignore and do not translate.
````
When translating, add the value of the id that you want to ignore and do not translate.  
If you want to see which ids are currently ignored, you can directly execute ```` console.log(translate.ignore.id); ```` View  
**Note that this line should be placed in translate.execute(); above**

### Translate the specified area

````
var documents = [];
documents.push(document.getElementById('test1'));
documents.push(document.getElementById('test2'));
documents.push(document.getElementById('test3'));
translate.setDocuments(documents); //Specifies the collection of elements to be translated. One or more elements can be passed in. If not set, the entire page will be translated by default
````
You can use translate.setDocuments(...) to specify the collection of elements to be translated, and you can pass in one or more elements. If this is not set, the entire page will be translated by default.
**Note that this line should be placed in translate.execute(); above**


### Js active language switching
For example, click a link to display the English interface

````
<a href="javascript:translate.changeLanguage('english');" class="ignore">Switch to English</a>
````

You can quickly switch to the specified language by passing in the target language of the translation. Specific languages can be consulted: [http://api.translate.zvo.cn/doc/language.json.html](http://api.translate.zvo.cn/doc/language.json.html)  
Where ```` class="ignore" ```` adds this class, which means that the a tag will not be translated

### Automatically switch users' languages according to their country

When the user first opens the web page, the language of the current user's country will be automatically determined to switch to the language of the user's country.  
If the user manually switches to another language, and then uses it again, the user's choice will prevail.

````
translate.setAutoDiscriminateLocalLanguage();	//Set the language of the user's country to switch automatically when the user uses it for the first time
````

### Set the local language (the language of the current page)

````
translate.language.setLocal('chinese_simplified'); //Set the local language (the language of the current page). If not set, the language of the text displayed on the current page will be automatically recognized by default.
````
The local languages currently supported are:  
* **chinese_simplified** Simplified Chinese
* **chinese_traditional** Traditional Chinese
* **english** English  
If not set, the text of the current web page will be automatically recognized by default, and the language with the highest frequency of occurrence in the current web page text will be taken as the default language.   
This will default to the selected language when the select language appears.  

**Note that this line should be placed in translate.execute(); above**

### Adapt the rendering display of data dynamically loaded by ajax

Under normal circumstances, there is a great possibility of such demand:  
1. In the page, you need to request the back-end server to obtain data through ajax, and then render and display the data.  
2. Pop-up prompt in the page （such as [msg.js](https://gitee.com/mail_osc/msg) Medium ````msg.info('Hello');```` ）This prompt is loaded by js. The prompt text also needs to be translated, You can add the following line of code to meet the above requirements.

````
translate.listener.start();	//Enable the monitoring of html page changes, and automatically translate the changes. Note that the change area here refers to the area set using translate.setDocuments(...) . If it is not set, it is necessary to monitor the change of the whole page
````
It is recommended to put it before the line translate.execute()

##### matters needing attention
If you manually set ````translate.setDocuments(...)```` , you will not listen to the entire page, but only listen to changes in the area set by ````setDocuments(...)```` .


### Privatization deployment translation service interface
In some government agencies and internal projects of large groups, when there are strong requirements for data privacy and security, and you want to provide highly reliable translation services for your own customers, you can privatize the translation service interface and do not go through our open translation interface, so as to achieve full control of security and back-end services.      
For the actual deployment method, please refer to: [https://github.com/xnx3/translate_service](https://github.com/xnx3/translate_service)  
After deployment, click ````translate.execute();```` Before, add a line of code as follows:

````
translate.request.api.host='http://121.121.121.121/'; //Replace the IP address in this with the IP address of your server. Pay attention to the beginning and the end
translate.execute();
````

In this way, the translation request interface will go to your own server.


### Automatically execute after translation
When the translation is completed, a method will be automatically triggered for you to customize the extension. such as [Translation component of layui](https://gitee.com/mail_osc/translate_layui) This ability is used to redraw the selected item after translation.

````
translate.listener.renderTaskFinish = function(task){
	console.log('Execute once');
}
````
  
This is triggered every time a rendering task (translation) is completed during translation. Note that one page translation will trigger multiple rendering tasks. Generally, one page translation may trigger two or three rendering tasks. (Because there may be multiple languages on a web page, each language is a translation task.)  
In addition, if there is ajax interaction information in the page, each time the ajax information is refreshed, it will also be translated, which is also a translation task.  
Of course, the translation task here is triggered only after the implementation of the translation task.


### Custom translation terms
If you feel that some translations are inaccurate, you can define the translation results of certain words and customize the termbase. The methods used are:  

````
translate.nomenclature.append(from, to, properties);
````

Explanation of incoming parameters:
* **from** The language to be converted, pass in such as "chinese_simplified"
* **to** Translate to the target language, pass in such as "english"
* **properties** Configure the table, the format is the format of properties, one rule per line, each before and after is separated by an equal sign, before the equal sign is the word or sentence to be translated, after the equal sign is the custom translation result. Incoming such as:  

````
你好=Hello
世界=ShiJie	
````

For example, to customize the results of the words "online market cloud website building system" and "internationalization" Chinese Simplified translated into English, you can write like this:  

````
translate.nomenclature.append('chinese_simplified','english',`
网市场云建站系统=wangmarket CMS
国际化=GuoJiHua
`);
````

This custom termbase can be defined by a separate js file, so defined once, used in similar projects, you can directly copy the previously defined js termbase file to introduce it for convenience.  
Currently under optimization, if the original language is Chinese, Korean is okay, such as English results will be inaccurate, if you use it in the project, when you find an abnormality, you can contact me, free of charge to help you debug the good while improving the project.  
**Note that this line should be placed in translate.execute(); above**  

##### DEMO
Here is an example for reference, link address: [https://res.zvo.cn/translate/doc/demo_nomenclature.html](https://res.zvo.cn/translate/doc/demo_nomenclature.html)  
You can view the page source code after opening it to see how it is set.

# Examples of actual use scenarios
### Click a language to switch in a common website
As shown in the figure below, there should be several language switches at a certain location in the website
![](http://cdn.weiunity.com/site/341/news/43b838ea6ad041898037eaaaf5802776.png)  
Add the following code directly at the end of its html code:  

````
<!-- Add a language switch button. Note that a class="ignore" added to ul means that this code will not be translated -->
<ul class="ignore">
	<li><a href="javascript:translate.changeLanguage('english');">English</a></li>|
	<li><a href="javascript:translate.changeLanguage('chinese_simplified');">简体中文</a></li>|
	<li><a href="javascript:translate.changeLanguage('chinese_traditional');">繁體中文</a></li>
</ul>

<!-- Js introducing multi-language switching -->
<script src="https://res.zvo.cn/translate/translate.js"></script>
<script>
	translate.setUseVersion2(); //Set to use v2. x version
	translate.selectLanguageTag.show = false; //The selection language of the non-existent select
	translate.execute();
</script>
````

# Participate in
You can fork the project directly. Note that it is the github warehouse [https://github.com/xnx3/translate](https://github.com/xnx3/translate）, non-gitee warehouse  
If you have changed any code, please note your name and your personal home page in it, which is your participation and contribution. For example, Mr. Chen participated in the character judgment of Japanese translation, which can be as follows:

````
/*
	If it contains Japanese, return true: contains
	Participant: Chen https://www.chenmouren.com/xxxxx.html
*/
japanese:function(str){
	if(/.*[\u0800-\u4e00]+.*$/.test(str)){ 
		return true
	} else {
		return false;
	}
},

````

# Version
Note that v1.x is slightly different from v2.x. You can use ```` console. log (translate. version)```` View the version currently used.
In addition, for the relevant description of v1.x version, see: [instructions](doc/v1.md) | [online demo](https://res.zvo.cn/translate/demo_v1.html)

### v1.0
It will be released in February 2022, providing multilingual support, enabling the webpage to quickly switch languages without changing.

### v2.0
It will be released in December 2022, adding more extension methods.
1. Ignorable tag tags can be customized and will be ignored during translation  
2. Ignorable classes can be customized, which will be ignored during translation  
3. The default built-in class="ignore" is the ignored class. You can add this attribute to a tag to make it skip translation.  
4. Add a caching mechanism. The results will be cached after a translation. After the translation, the results will be translated in seconds and the experience will be greatly improved.  
5. Increase the ability of local translation, and support the customized translation area.  
6. Optimize the problem that the content of the placeholder in the input box is not translated  
7. Problems that cannot be tested when optimizing local use (file protocol). Now the local can also be used and tested normally.  
8. Fix the problem that countless layers of font labels will be added during translation  
9. When repairing translation, such as Chinese translation into Korean, the mouse will repeatedly translate the translated Korean after several times, resulting in inaccurate translation results.
10. Open translation cloud service platform interface http://api.translate.zvo.cn/doc/index.html


### v2.1
1. The local language is assigned to use v2 version translation by default
1. Add ````translate.language.connector()```` to adapt the connector of the sentence independently
1. Add an area annotated by ````<!-- -->````  and do not translate it
1. Add English README document
1. Increase the translation of alt, meta keywords and descriptions of pictures
1. Optimize and judge whether the local language is the same as the target language to be translated. If it is the same, then no translation is required
1. Add ````translate.listener.start()```` It can automatically translate the changed areas of the current page, such as rendering after loading data with ajax
1. ````translate.execute(...)```` Add a translation area that can be imported. The imported area is only used for one-time translation and will not affect the value of ````setDocuments(...)````
1. The task queue mechanism is added to completely solve the problem that there is a very small probability of text omission during translation.
1. Add ````translate.setAutoDiscriminateLocalLanguage();```` When users use it for the first time, they can automatically identify the language of their country for switching

### v2.2
1. Open the private one-click deployment of the back-end translation service interface and open source.  
2. Greatly optimize the accuracy of sentence translation to the extent of Baidu Translation and Google Translation  
3. Add a configurable id for an element, ignore it and do not translate it  
4. Add separate judgment for connector recognition to improve translation accuracy  
5. Add the ability to configure separately for translate.request.api.host for private deployment
6. Add inspector_v2.js is used for the quick conversion experience of v2 version, and the quick experience in readme is to use this v2 version by default.
8. Add translate.language.autoRecognitionLocalLanguage(); If the language of the current page is not set manually, the language will be recognized automatically
9. Add translate.language.getLocal() The user obtains the language of the current page (if not set, the language will be automatically recognized according to the text currently displayed on the page)  
10. Add translate.selectLanguageTag.selectOnChange Used to provide override of select onchange event for better extension  
11. Some unexpected problems in translation when optimizing Chinese-English mixing
12. optimization meta、keywords Replacement problems
13. If there is', such as let's' in English when optimizing to English
14. Optimize ignore's judgment on how many cases the class name is ignored
15. Open the back-end translation service interface document for better expansion and use
16. Fix the problem that tag sometimes fails, such as local translation in listening status

### v2.3
1. Add translate.nomenclature for custom terminology support
1. Add translate.listener.renderTaskFinish (renderTask); For better expansion
1. Add translate.language.wordBlankConnector() to determine whether a space is required as a conjunction for language adaptation, and add adaptations for more than ten languages
1. Add translate.element.getNodeName for global use
1. Add instructions for using Vue and Uniapp
3. Add translate.element.nodeAnalysis for element analysis and rendering
4. Increase support for input tags with type=button type
1. Increase support for input tags with type="submit"
1. Add translation adaptation for the title attribute of the a tag
1. Optimize the judgment of ignoring classes, tags, IDs, etc. to make it more accurate
1. Add the setting of translate. selectLanguageTag. languages for v2.0
1. Optimization: When the current language is not translated, switch to another language without reloading the current page
2. Modify the fifth dimension of nodeQueue and add translateText
1. Optimizing the issue of custom terminology exceptions when converting English to other languages
1. Optimize tags that ignore translation and add textarea
2. In response to feedback from trendy media that certain pages cannot be used, relevant judgments should be added for fault tolerance to avoid blocking the overall operation.
1. Remove the img tag from the default ignore tag tag tag. Also translate IMG's alt
1. Sort the translation queue and place the original string with the longer ones first to avoid situations where some parts are not translated (a bug is when the shorter ones are translated first, causing the longer ones to be interrupted and unable to be adapted)
1. Fix the issue of missing some Chinese characters at the end and not translating them if there are multiple Chinese characters separated by special characters in a sentence

# These open source projects are being used
The ability of automatic translation has been put into the following open source projects:  
[kefu.js](https://gitee.com/mail_osc/kefu.js) H5 online customer service, introduce a line of js code to use immediately! Support mobile phones, computers, APP, and applets. One-click deployment of your own private SAAS cloud customer service platform  
[Pear Admin Layui](https://gitee.com/pear-admin/Pear-Admin-Layui) Pearl Admin is an out-of-the-box front-end development template that extends the native UI style of Layui, integrates third-party open source components, provides a convenient and rapid development method, and continues LayuiAdmin   
[Layui](https://gitee.com/mail_osc/translate_layui) Translation component
...  

# Outstanding open source projects and community recommendations
[Featbit](https://github.com/featbit/featbit) A 100% open-source feature flags management platform
[LinkWeChat](https://gitee.com/LinkWeChat/link-wechat) LinkWeChat It is an open source SCRM system based on enterprise WeChat, and a comprehensive solution for enterprise private domain traffic management and marketing.  
[IoTSharp](https://gitee.com/IoTSharp) IoTSharp is an open source Internet of Things basic platform based on. Net Core, supporting HTTP, MQTT and CoAp protocols  
[Cloud of flow](https://gitee.com/ntdgg) Information and digital service providers


# Other instructions
The current version of v2.0 is still in the optimization stage and is not a perfect and stable version. Currently, only most websites have been tested for perfect adaptation, but there will be omissions. As the number of websites used increases, the bugs found will be gradually fixed. The stable version is expected to be released in the next three to four months. When you use the v2 version, you can directly use our js source. If you have localization requirements, you can place localization after the stable version is released later.  
I love open source. If you are the author of an open source framework and want to add this multilingual switching capability to your open source project, but encounter difficulties when accessing it, welcome to join the QQ group below to explain which open source software author you are, and I will fully assist you. Friends who are willing to open source are worthy of respect and support.  
This cloud server platform can be deployed privately. If you have any needs in this regard, you can also contact me. But this deployment takes several hours to half a day, and we also need to pay our colleagues. The epidemic has been relatively difficult for three years, so there is no way to help with the deployment free of charge. It will cost hundreds of labor costs to provide paid deployment. I hope you can understand.  

# communication
If you encounter any abnormal situation during use, please mention the issues and write down the problems you encounter in detail. If you can, please also write down your website, so that we can test more fully to quickly locate the problem  
Author WeChat:xnx3com  
Email: 921153866@qq.com  
Communication QQ group:181781514  
github: [https://github.com/xnx3/translate](https://github.com/xnx3/translate)  
gitee:  [https://gitee.com/mail_osc/translate](https://gitee.com/mail_osc/translate)

# VIP service
[Currently, translate.js is based on js to translate the current html, and most scenarios are sufficient. However, if you view the page source code, you will find that the source code does not change and is in an untranslated state. If you want to translate the page source code directly, you can click here to view our extended version](doc/README_SERVICE.md)
