/*
	极速测试体验，用于审查元素时直接执行的
	1. 随便打开一个网页
	2. 右键-审查元素
	3. 粘贴入一下代码：
		var head= document.getElementsByTagName('head')[0];  var script= document.createElement('script');  script.type= 'text/javascript';  script.src= 'https://res.zvo.cn/translate/inspector.js';  head.appendChild(script); 
	4. Enter 回车键 ， 执行
	5. 在当前网页的左上角，就出现了一个大大的切换语言了	
 */
var head= document.getElementsByTagName('head')[0]; 
var script= document.createElement('script'); 
script.type= 'text/javascript'; 
script.src= 'https://res.zvo.cn/translate/translate.js'; 
script.onload = script.onreadystatechange = function() {
	translate.selectLanguageTag.languages = 'zh-CN,zh-TW,en,ko';
	translate.execute();
	document.getElementById('translate').style.position = 'fixed';
	document.getElementById('translate').style.color = 'red';
	document.getElementById('translate').style.left = '10px';
	document.getElementById('translate').style.top = '10px';
	document.getElementById('translate').style.fontSize = '35px';
	document.getElementById('translate').style.zIndex = '9999999999999';
}
head.appendChild(script); 

