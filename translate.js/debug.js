/*
	针对 translate.js 的调试模式
	使用遇到异常，进行调试时，进行使用
*/


if(typeof(translate) === 'undefined'){
	throw new Error('ERROR! translate.js not find!');
}

if(typeof(msg) !== 'object' || typeof(msg.version) === 'undefined'){
	var msg={version:1.14,errorIcon:'<svg style="width: 3rem; height:3rem; padding: 1.5rem; padding-bottom: 1.1rem; box-sizing: content-box;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6977"><path d="M696.832 326.656c-12.8-12.8-33.28-12.8-46.08 0L512 465.92 373.248 327.168c-12.8-12.8-33.28-12.8-46.08 0s-12.8 33.28 0 46.08L466.432 512l-139.264 139.264c-12.8 12.8-12.8 33.28 0 46.08s33.28 12.8 46.08 0L512 558.08l138.752 139.264c12.288 12.8 32.768 12.8 45.568 0.512l0.512-0.512c12.8-12.8 12.8-33.28 0-45.568L557.568 512l139.264-139.264c12.8-12.8 12.8-33.28 0-46.08 0 0.512 0 0 0 0zM512 51.2c-254.464 0-460.8 206.336-460.8 460.8s206.336 460.8 460.8 460.8 460.8-206.336 460.8-460.8-206.336-460.8-460.8-460.8z m280.064 740.864c-74.24 74.24-175.104 116.224-280.064 115.712-104.96 0-205.824-41.472-280.064-115.712S115.712 616.96 115.712 512s41.472-205.824 116.224-280.064C306.176 157.696 407.04 115.712 512 116.224c104.96 0 205.824 41.472 280.064 116.224 74.24 74.24 116.224 175.104 115.712 280.064 0.512 104.448-41.472 205.312-115.712 279.552z" fill="#ffffff" p-id="6978"></path></svg>',currentWindowsId:0,id:{idArray:new Array,create:function(){var t=(new Date).getTime()+"";return msg.id.idArray[msg.id.idArray.length]=t,t},delete:function(t=""){var i="";if(""==t)i=msg.id.idArray[msg.id.idArray.length-1],msg.id.idArray.pop();else{i=t;for(var e=0;e<msg.id.idArray.length;e++)if(msg.id.idArray[e]==t)return msg.id.idArray.splice(e,1),t}return i},tishiIdArray:new Array},success:function(t,i){this.closeAllSimpleMsg();var e=this.show(t,'<svg style="width: 3rem; height:3rem; padding: 1.5rem; padding-bottom: 1.1rem; box-sizing: content-box;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2351"><path d="M384 887.456L25.6 529.056 145.056 409.6 384 648.544 878.944 153.6 998.4 273.056z" p-id="2352" fill="#ffffff"></path></svg>');return msg.id.tishiIdArray[msg.id.tishiIdArray.length]=e,this.delayClose(1800,i,e),e},getElementDistanceToTop:function(t){var i=t.getBoundingClientRect(),e=window.pageYOffset||document.documentElement.scrollTop;return i.top+e},showTip:function(t){var i=document.getElementById(t.id);if(!(i&&i instanceof Element))return void console.error("找不到id为 "+t.id+" 的元素");var e=i.getBoundingClientRect(),n=this.getElementDistanceToTop(i),o=e.x,d=i.offsetWidth,l=i.offsetHeight,r=window.innerHeight,g=window.innerWidth,s=r-n-i.offsetHeight,a=g-o-d;const m="20px";if(t.background||(t.background="#10a6a8"),t.color||(t.color="#FFFFFF"),t.width||(t.width="200px"),t.height||(t.height="auto"),t.direction||(t.direction="right"),"left"!==t.direction&&"right"!==t.direction&&"top"!==t.direction&&"bottom"!==t.direction)return console.log("请输入正确的tips方向");var c=msg.id.create();if(null!=document.getElementsByTagName("body")&&document.getElementsByTagName("body").length>0&&i instanceof Element){var u=document.createElement("div");u.id="wangmarket_popup_"+c,u.style=`position:absolute;padding:10px;border-radius:2px;\n\t\t\t\t${"left"==t.direction||"right"==t.direction?`top: ${n}px;`:""}\n\t\t\t\t${"left"==t.direction?`right: calc(${a}px + ${d}px + ${parseInt(m)/2}px);`:""}\n\t\t\t\t${"right"==t.direction?`left: calc(${o}px + ${d}px + ${parseInt(m)/2}px);`:""}\n\n\t\t\t\t${"top"==t.direction||"bottom"==t.direction?`left:${o}px;`:""}\n\t\t\t\t${"top"==t.direction?`bottom: calc(${s}px + ${l}px + ${parseInt(m)/2}px);`:""}\n\t\t\t\t${"bottom"==t.direction?`top: calc(${n}px + ${l}px + ${parseInt(m)/2}px);`:""}\n\t\t\t\tbackground:${t.background};\n\t\t\t\tz-index: 2147483647;width: ${t.width};\n\t\t\t\tbox-shadow: 0px 3px 10px 0px rgba(143, 140, 140, 0.31);\n\t\t\t\theight:${t.height};box-sizing:border-box`,u.style.transform="scale(0.8)",u.style.transition="transform 0.1s ease-in-out",u.innerHTML=`<div id="tip" style="font-size:12px;line-height:18px;text-align:left;color:${t.color};white-space: initial">`+t.text+"</div>",u.classList.add("_custom_deng");var I=`\n\t\t\t\tcontent: " ";\n\t\t\t    position: absolute;\n\t\t\t\t${"left"==t.direction||"right"==t.direction?"top: 13px;":""}\n\t\t\t\t${"top"==t.direction||"bottom"==t.direction?"left: 10%;":""}\n\t\t\t    ${t.direction}: 100%;\n\t\t\t    border: ${parseInt(m)/4}px solid transparent;\n\t\t\t\tborder-${t.direction}: ${parseInt(m)/2}px solid ${t.background};\n\t\t\t`,h=document.getElementById("_custom_deng_style");if(h)h.innerText=`._custom_deng::before { ${I} }`;else{var p=document.createElement("style");p.type="text/css",p.id="_custom_deng_style",p.innerText=`._custom_deng::before { ${I} }`,document.head.appendChild(p)}setTimeout((function(){u.style.transform="scale(1)"}),10),document.body.appendChild(u),"number"==typeof t.time&&setTimeout((function(){msg.close(c)}),t.time)}else alert("提示，body中没有子元素，无法显示 msg.js 的提示");return c},showTips:function(t){return msg.showTip(t)},tip:function(t){if(!t||!t.id||!t.text)return console.log("msg.tip()方法中请传入基本的选项(包括id和显示文本)");var i,e=document.getElementById(t.id);return e?(e.addEventListener("mouseenter",(e=>{e.stopPropagation(),this.closeAllSimpleMsg(),i=this.showTips(t),msg.id.tishiIdArray[msg.id.tishiIdArray.length]=i})),e.addEventListener("mouseleave",(()=>{this.close(i)})),i):""},failure:function(t,i){this.closeAllSimpleMsg();var e=this.show(t,this.errorIcon);return msg.id.tishiIdArray[msg.id.tishiIdArray.length]=e,this.delayClose(1800,i,e),e},info:function(t,i){this.closeAllSimpleMsg();var e=this.show(t,'<svg style="width: 3rem; height:3rem; padding: 1.5rem; padding-bottom: 1.1rem; box-sizing: content-box;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7996"><path d="M509.979 959.316c-247.308 0-447.794-200.486-447.794-447.794S262.671 63.728 509.979 63.728s447.794 200.486 447.794 447.794-200.485 447.794-447.794 447.794z m0-814.171c-202.346 0-366.377 164.031-366.377 366.377s164.031 366.377 366.377 366.377c202.342 0 366.377-164.031 366.377-366.377S712.321 145.145 509.979 145.145z m-40.708 610.628c-40.709 0-40.709-40.708-40.709-40.708l40.709-203.543s0-40.709-40.709-40.709c0 0-40.709 0-40.709-40.709h122.126s40.709 0 40.709 40.709-40.709 162.834-40.709 203.543 40.709 40.709 40.709 40.709h40.709c-0.001 0-0.001 40.708-122.126 40.708z m81.417-407.085c-22.483 0-40.709-18.225-40.709-40.709s18.225-40.709 40.709-40.709 40.709 18.225 40.709 40.709-18.226 40.709-40.709 40.709z" p-id="7997" fill="#ffffff"></path></svg>');return msg.id.tishiIdArray[msg.id.tishiIdArray.length]=e,this.delayClose(1800,i,e),e},closeAllSimpleMsg:function(){for(var t=0;t<msg.id.tishiIdArray.length;t++)msg.close(msg.id.tishiIdArray[t])},confirm:function(t){return confirm(t)},loading:function(t){return this.show(t,'<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjlGOUY5Ij4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjMiIHI9IjAiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSIwOzM7MDswIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoNDUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjEyNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoOTAgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjI1cyIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSB0cmFuc2Zvcm09InJvdGF0ZSgxMzUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjM3NXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMTgwIDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC41cyIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSB0cmFuc2Zvcm09InJvdGF0ZSgyMjUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjYyNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMjcwIDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC43NXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMzE1IDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC44NzVzIiBrZXlTcGxpbmVzPSIwLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuOCIgY2FsY01vZGU9InNwbGluZSIgLz4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIHRyYW5zZm9ybT0icm90YXRlKDE4MCAxNiAxNikiIGN4PSIxNiIgY3k9IjMiIHI9IjAiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSIwOzM7MDswIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAuNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgo8L3N2Zz4K" style="width: 3rem; height:3rem; padding: 1.5rem; padding-bottom: 1.1rem; box-sizing: content-box;" />')},close:function(t=""){this.currentWindowsId=0;var i=msg.id.delete(t),e=document.getElementById("wangmarket_popup_"+i);if(null!=e){var n=e.parentNode;null!=n&&n.removeChild(e)}},delayClose:function(t,i,e=""){var n=parseInt(1e5*Math.random());this.currentWindowsId=n;var o=this;setTimeout((function(){o.currentWindowsId==n&&msg.close(e),null!=i&&i()}),t)},show:function(t,i){var e=!1;null!=t&&t.length>10&&(e=!0);var n=msg.id.create();if(null!=document.getElementsByTagName("body")&&document.getElementsByTagName("body").length>0){var o=document.createElement("div");o.id="wangmarket_popup_"+n,o.style="position: fixed;z-index: 2147483647;margin: 0 auto;text-align: center;width: 100%;",o.innerHTML='<div id="loading" style="position: fixed;top: 30%;text-align: center;font-size: 1rem;color: #dedede;margin: 0px auto;left: 50%;margin-left: -'+(e?"9":"3.5")+'rem;"><div style="width: 7rem;background-color: #2e2d3c;border-radius: 0.3rem; filter: alpha(Opacity=80); -moz-opacity: 0.8; opacity: 0.8; min-height: 4.8rem;'+(e?"width: 18rem;":"")+'"><div'+(e?' style="float:left;height: 20rem; margin-top: -0.6rem; position: fixed;"':"")+">"+i+'</div><div style="width: 100%;padding-bottom: 1.4rem; font-size: 1.1rem; padding-left: 0.3rem;padding-right: 0.3rem; box-sizing: border-box;line-height: 1.2rem;color: white;'+(e?"padding: 1rem; text-align: left; padding-right: 0.3rem; line-height: 1.5rem;margin-left: 4.8rem; padding-right: 5.5rem; padding-top: 0.7rem;":"")+'">'+t+"</div></div>",document.getElementsByTagName("body")[0].appendChild(o)}else alert("提示，body中没有子元素，无法显示 msg.js 的提示");return n},popups:function(t){var i=!1,e=!1;if(void 0===t?t={}:"string"==typeof t&&(t={text:t}),null==t&&(t={}),null!=t.left&&(i=!0),null==t.top&&null==t.bottom||(e=!0),null!=t.url){null!=t.text&&console.log("友好提醒：您已经设置了 attribute.url ，但是您又设置了 attribute.text ，根据优先级， 将采用 attribute.url ，而 attribute.text 设置无效。 ");var n="msg_popups_loading_"+(new Date).getTime();t.text='<iframe src="'+t.url+'" frameborder="0" style="width:100%;height:100%; display:none;" onload="document.getElementById(\''+n+"').style.display='none'; this.style.display='';\"></iframe><div id=\""+n+'" style="width: 100%; height: 100%; text-align: center; padding-top: 30%; font-size: 1.4rem; box-sizing: border-box; overflow: hidden; ">加载中...</div>'}null==t.text&&(t.text="您未设置text的值，所以这里出现提醒文字。您可以这样用: <pre>msg.popups('我是提示文字');</pre>"),null!=t.height&&null!=t.bottom&&console.log("msg.js -- function popups() : 友情提示:您同时设置了height、bottom两个属性，此时height属性生效，bottom属性将会不起作用"),null==t.close&&(t.close=!0),null==t.top&&(t.top="auto"),(null==t.bottom||t.bottom.length<1)&&(t.bottom="auto"),null==t.background&&(t.background="#2e2d3c"),null==t.opacity&&(t.opacity=92),null==t.height&&(t.height="auto"),null==t.left&&(t.left="5%"),null==t.width&&(t.width="90%"),null==t.padding&&(t.padding="1rem");var o=msg.id.create(),d=document.createElement("div");if(d.id="wangmarket_popup_"+o,d.style="position: fixed; z-index: 2147483647; margin: 0px auto; text-align: center; width: 100%; ",d.innerHTML='<div style="position: fixed; top:'+t.top+"; bottom:"+t.bottom+"; text-align: center;font-size: 1rem;color: #dedede;margin: 0px auto;width: "+t.width+";left: "+t.left+"; height: "+t.height+'; overflow-y: initial; overflow-x: initial;"><div style="padding:0rem;height: 100%;"><div style="width: 100%;background-color: '+t.background+";border-radius: 0.3rem;filter: alpha(Opacity="+t.opacity+");-moz-opacity: "+t.opacity/100+";opacity: "+t.opacity/100+';min-height: 4.8rem; height: 100%;"><div style=" width: 100%; font-size: 1rem; box-sizing: border-box; line-height: 1.3rem; color: white; text-align: left; padding: '+t.padding+'; overflow-y: auto; height: 100%; border-radius: 0.4rem;">'+t.text+"</div>"+(t.close?'<div class="msg_close" style="top: -0.8rem;position: absolute;right: -0.6rem;background-color: aliceblue;border-radius: 50%;height: 2rem;width: 2rem; z-index: 2147483647;" onclick="msg.close(\''+o+'\');"><svg style="width: 2rem; height:2rem; cursor: pointer;" t="1601801323865" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4482" width="48" height="48"><path d="M512.001 15.678C237.414 15.678 14.82 238.273 14.82 512.86S237.414 1010.04 512 1010.04s497.18-222.593 497.18-497.18S786.589 15.678 512.002 15.678z m213.211 645.937c17.798 17.803 17.798 46.657 0 64.456-17.798 17.797-46.658 17.797-64.456 0L512.001 577.315 363.241 726.07c-17.799 17.797-46.652 17.797-64.45 0-17.804-17.799-17.804-46.653 0-64.456L447.545 512.86 298.79 364.104c-17.803-17.798-17.803-46.657 0-64.455 17.799-17.798 46.652-17.798 64.45 0l148.761 148.755 148.755-148.755c17.798-17.798 46.658-17.798 64.456 0 17.798 17.798 17.798 46.657 0 64.455L576.456 512.86l148.756 148.755z m0 0" fill="'+t.background+'" p-id="4483"></path></svg></div>':"")+"</div></div></div>",null!=document.getElementsByTagName("body")&&document.getElementsByTagName("body").length>0){document.getElementsByTagName("body")[0].appendChild(d);var l=document.getElementById("wangmarket_popup_"+o).firstChild;if(!i)try{var r=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,g=l.clientWidth||l.offsetWidth;l.style.left=(r-g)/2+"px"}catch(t){console.log(t)}if(!e)try{var s=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,a=l.clientHeight||l.offsetHeight;l.style.top=a>s?"20px":(s-a)/2+"px"}catch(t){console.log(t)}return o}alert("提示，body中没有子元素，无法显示 msg.js 的提示")},confirm:function(t,i){if("string"==typeof t&&((t={text:t}).buttons={"确定":i,"取消":function(){}}),null==t.buttonStyle&&(t.buttonStyle="padding-left:0.6rem; padding-right:0.6rem; font-size: 0.9rem;"),null==t.text)t.text="您未设置text的值，所以这里出现提醒文字。您可以这样用: <pre>msg.popups('我是提示文字');</pre>";else{null==t.buttons&&(t.text="您还未设置 buttons 属性");var e=0;for(let i in t.buttons)e++;var n="";for(let i in t.buttons){e--;var o=i+"_"+(new Date).getTime();window.msg.confirm[o]=function(){msg.close(),t.buttons[i]()},n=n+"<button onclick=\"window.msg.confirm['"+o+'\']();" style="'+t.buttonStyle+'">'+i+"</button>"+(e>0?"&nbsp;&nbsp;":"")}t.text='<div style="line-height: 1.4rem; width:100%; padding-right: 0.2rem;">'+t.text+'<div style=" display: inherit; width: 100%; text-align: right;margin-top: 1rem;">'+n+"</div></div>"}return null==t.close&&(t.close=!1),null==t.width&&(t.width="17rem"),msg.popups(t)},alert:function(t){return msg.confirm({text:t,buttons:{"确定":function(){}}})},input:function(t,i,e,n=!1){(void 0!==e&&null!=e||(e=""),"string"==typeof t)&&(t={text:t+""});if(void 0===t.type&&(t.type=1==n?"textarea":"input"),void 0===t.defaultValue&&(t.defaultValue=e),void 0===t.okFunc&&(t.okFunc=i),void 0===t.okButtonText&&(t.okButtonText="确定"),void 0===t.close&&(t.close=!0),void 0!==t.okFunc&&null!=t.okFunc){void 0===t.width&&(t.width="20rem"),void 0===t.height&&(t.height="auto");var o='<input type="text" id="msg_input_id" style="width: 100%; line-height: 1.6rem; margin-right: 1rem; box-sizing: border-box;  height:'+t.height+';" value="'+t.defaultValue+'" >';"textarea"==t.type&&(o='<textarea id="msg_input_id" style="width: 100%; line-height: 1.1rem; margin-right: 1rem; box-sizing: border-box; height:'+t.height+';">'+t.defaultValue+"</textarea>");var d="msg_input_enterButtonId_"+(new Date).getTime(),l='<div style="width: 100%; height:auto;"><div style=" padding-bottom: 0.8rem; font-size: 1.2rem; line-height: 1.7rem;">'+t.text+"</div><div>"+o+'</div><div style=" display: inherit; width: 100%; text-align: right;margin-top: 1rem;"><button id='+d+' style="padding-left:0.8rem; padding-right:0.8rem; font-size: 1rem;">'+t.okButtonText+"</button></div></div>",r=msg.popups({text:l,width:t.width,height:"auto",close:t.close});return document.getElementById(d).onclick=function(){var i=document.getElementById("msg_input_id").value;msg.close(),t.okFunc(i)},r}msg.failure("请传入点击确定按钮要执行的方法")},textarea:function(t,i,e){return msg.input(t,i,e,!0)}};
}

//重写垃圾回收，弃用
translate.recycle = function(){}; 

translate.debug = {
	use: function(){
		alert('您已经执行过了，已拦截，无需在执行');
	},
	data:{
		//当前鼠标停留所在位置，它这个元素下可以进行参与翻译的nodes
		currentNodes: [],
	},

	/*
		获取 translate.node 数据
		如果获取到了，则返回 translate.node.data 中的这个具体的node对应的 value
		如果没获取到，则返回 null
	*/
	getNode:function(node){
		if (typeof(translate.node.get(key)) === 'undefined') {
    		return null;
    	}
		if (translate.node.get(key) === null) {
    		return null;
    	}

		if(typeof(translate.node.get(key).originalText) !== 'string'){
			return null;
		}
		
		return translate.node.get(key);
	},


	/*
		根据一个最终的node （没有下级了）
	*/
	findNode:function(node){
		if(node == null || typeof(node) == 'undefined'){
			return;
		}
		if(node.nodeType === 2){  //是属性node，比如 div 的 title 属性的 node
			if(node.ownerElement == null){
				return;
			}
		}else{		//是元素了
			if(node.parentNode == null){
				return;
			}	
		}
		

		/**** 避免中途局部翻译，在判断一下 ****/
		//判断当前元素是否在ignore忽略的tag、id、class name中
		if(translate.ignore.isIgnore(node)){
			//console.log('node包含在要忽略的元素中：');
			//console.log(node);
			return;
		}

		console.log(node)

		//node分析，分析这个node的所有可翻译属性（包含自定义翻译属性 translate.element.tagAttribute ）
		var nodeAnalyChild = translate.element.nodeAnalyse.gets(node);
		console.log(nodeAnalyChild);
		for(var nci = 0; nci < nodeAnalyChild.length; nci++){
			//translate.addNodeToQueue(uuid, nodeAnalyChild[nci].node, nodeAnalyChild[nci].text, '');
			console.log(nodeAnalyChild[nci]);
		}
		
	},
	/*
		扫描 node 下可以拆分出那些子node、子子子子node ...
	*/
	whileNodes:function(node){
		var nodes = [];

		var childNodes = node.childNodes;
		if(childNodes == null || typeof(childNodes) == 'undefined'){
			//当前就已经是最底层的了
			nodes.push(node);
		}else{
			if(childNodes.length > 0){
				for(var i = 0; i<childNodes.length; i++){
					var subNodes = translate.debug.whileNodes(childNodes[i]);
					nodes = nodes.concat(subNodes);
				}
			}else{
				//单个了
				//translate.element.findNode(node);
				nodes.push(node);
			}
		}
		
		return nodes;
	},
	
	/*
		从 translate.nodeQueue 中寻找 node 对应的数据
		如果找不到，则返回的是一个空数组
	*/
	getTranslateNodeQueue: function(node){

		var findNodeArray = []; //要删除的nodeQueue，其中存储的是 uuid
		for(var uuid in translate.nodeQueue){
			if (!translate.nodeQueue.hasOwnProperty(uuid)) {
	    		continue;
	    	}
	    	for(var lang in translate.nodeQueue[uuid]['list']){ //二维数组中，取语言
	    		if (!translate.nodeQueue[uuid]['list'].hasOwnProperty(lang)) {
		    		continue;
		    	}
		    	//二维数组，取hash、value
				for(var hash in translate.nodeQueue[uuid]['list'][lang]){
					if (!translate.nodeQueue[uuid]['list'][lang].hasOwnProperty(hash)) {
			    		continue;
			    	}

			    	for(var node_index = 0; node_index < translate.nodeQueue[uuid]['list'][lang][hash]['nodes'].length; node_index++){
			    		if(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'].isSameNode(node)){
							//发现了这个node的记录
							var nodeData = {
								translateTextHash: hash,
								original: translate.nodeQueue[uuid]['list'][lang][hash].original,
								translateText: translate.nodeQueue[uuid]['list'][lang][hash].translateText,
								lang: lang,
								uuid: uuid,
								node: translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node']
							}
							findNodeArray.push(nodeData);
						}
			    	}	
				}
	    	}

		}
		
		return findNodeArray;
	},

	/*
		如果在 translate.node 中发现 node 的存在，则返回
		如果不存在，则是 null
	*/
	getTranslateNode: function(node){
		var nodeData = translate.node.data.get(node);
		if(typeof(nodeData) === 'undefined' || nodeData === null){
			return null;
		}
		return nodeData;
	},

	/*
		显示debug 的 UI对话界面
	*/
	showUIDialog: function(){
		if(typeof(document.getElementById('translate_debug_showUIDialog')) === 'undefined' || document.getElementById('translate_debug_showUIDialog') === null){
			const styleElement = document.createElement('style');
			styleElement.type = 'text/css';
			styleElement.id = 'translate_debug_showUIDialog';
			styleElement.innerHTML = `
			  #translate_service_key {
			    width: 100%;
			    min-height: 80px;
			    padding: 8px;
			    border: 1px solid #ddd;
			    border-radius: 4px;
			    font-size: 14px;
			    box-sizing: border-box;
			  }
			  #translate_service_key:focus {
			    border-color: #4CAF50;
			    outline: none;
			  }
			  .debug-button {
			    background: #4CAF50;
			    color: white;
			    border: none;
			    padding: 10px 24px;
			    font-size: 14px;
			    border-radius: 4px;
			    cursor: pointer;
			    margin-top: 10px;
			  }
			  .debug-button:hover {
			    background: #45a049;
			  }
			  #checkResult {
			    max-height: 450px;
			    overflow-y: auto;
			    margin-top: 15px;
			    padding: 10px;
			    background: #f9f9f9;
			    border-radius: 4px;
				display:none; 
			  }
			  #checkResult > h2 {
			    margin: 15px 0 5px 0;
			    font-size: 16px;
			    padding-top: 10px;
			    border-top: 1px solid #eee;
			  }
			  #checkResult > h2:first-child {
			    margin-top: 0;
			    border-top: none;
			  }
			  #checkResult > .warn {
			    color: #d32f2f;
			  }
			`;
			document.head.appendChild(styleElement);
		}

		msg.popups({
		    text:'<div class="ignore" style="background-color: white; color: black; width: 100%; height: 100%; overflow: auto; padding: 20px; box-sizing: border-box; border: 1px solid #dfe2e5;"><h2 style="margin-top: 0;">私有部署的 translate.service 服务检测</h2><div style="margin: 15px 0;">translate.service 服务的授权码:</div><textarea id="translate_service_key" placeholder="请输入您的授权码..."></textarea><button class="debug-button" onclick="window.translate.debug.check.privateDeploymentCheckButton();">开始检测</button><div id="checkResult"></div></div>',
		    padding:'0px',
			opacity: 100,
		    height:'85%'
		});

		var translate_service_key = sessionStorage.getItem('translate_service_key');
		if(typeof(translate_service_key) === 'string' && translate_service_key.trim().length > 0){
			document.getElementById('translate_service_key').value = translate_service_key;
		}
	},

	/*
		自动检测相关
	*/
	check:{
		/*
			发送翻译请求
			url post请求的url
			data post 发送的form-data数据，传入格式如：
					{
						token:'123',
						abc:'123'
					}
	
			return  {
						xhr: xhr请求结果的对象
						result: 翻译结果，  1成功，0失败。  成功便是接口响应的http响应码是200 就是成功，其余全是失败
						info: 如果翻译失败，这里是失败原因
						json: result为1成功时，返回数据转为json格式
					}
		*/
		sendTranslateRequest: function(url, data){
			var xhr = translate.request.send(url, data, data, function(result, response, xhr){
				//console.log(result)
				//console.log(response)
				//console.log(xhr.getResponseHeader('Server'))
				
			}, 'post', false, {
				'Content-Type':'application/x-www-form-urlencoded'
			}, function(xhr){
				console.log(xhr);
			}, true);


			var result = true; //是否成功，true是
			var info = ''; //如果失败，失败原因是什么，文字说明
			var json = {};
			if(xhr.status === 200){
				//成功
	        	if(typeof(xhr.responseText) == 'undefined' || xhr.responseText == null){
	        		//相应内容为空
	        		result = false;
	        		info = '响应文本为空';
	        	}else{
	        		//响应内容有值
	        		if(xhr.responseText.indexOf('{') > -1 && xhr.responseText.indexOf('}') > -1){
		        		//应该是json格式
		        		try{
			        		json = JSON.parse(xhr.responseText);
			        		if(json.result === 1){
			        			result = true;
			        		}else{
			        			result = false;
			        			info = json.info;
			        		}
			        	}catch(e){
			        		translate.log(e);
			        		result = false;
			        		info = '翻译接口响应非json格式，异常：'+e+' , 响应内容：'+xhr.responseText;
			        	}
		        	}else{
		        		result = false;
			        	info = '翻译接口响应异常，非json格式, 响应内容：'+xhr.responseText;
		        	}
	        	}
	        	
			    //成功
			}else{
				//翻译失败
				result = false;
				info = '翻译接口http响应码异常，非 200 正常响应，响应码：'+xhr.status+', 响应内容:'+xhr.responseText;
			}

			return {
				xhr: xhr,
				result: result === true? 1:0,
				info: info,
				json: json
			};
			//console.log(xhr.getResponseHeader('Filecachehit'))
		},
		// 获取 xhr 请求中的响应头 header 中某个key的值
		getResponseHeaderByXhr:function(xhr, key){
			try{
				return xhr.getResponseHeader(key);
			}catch(e){
				return null;
			}
		},
		privateDeploymentCheckButton: function(){
			document.getElementById("checkResult").innerHTML = "checking ...";
			document.getElementById("checkResult").style.display = 'block';
			setTimeout(translate.debug.check.privateDeployment, 200);
		},
		/*
			私有部署的翻译服务接入检测

		*/
		privateDeployment: function(){
			var translate_service_key = document.getElementById('translate_service_key').value;
			if(typeof(translate_service_key) === 'string' && translate_service_key.trim().length > 0){
				sessionStorage.setItem('translate_service_key', translate_service_key);
			}

			var checkResultDom = document.getElementById("checkResult");

			//取得当前配置
			var config = translate.config.get();
			checkResultDom.innerHTML = '<h2>当前翻译服务域名检测</h2>'+String(config.request.api.host);
			if('https://api.translate.zvo.cn/' === config.request.api.host[0]){	
				checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><span class="warn">注意，当前使用的是开源通道，并不是私有部署通道！设置<a href="https://translate.zvo.cn/4068.html" target="_black">私有部署通道</a>的方式点此查看</b> </span>';
			}else{
				/*
				var queren = confirm('请确认 '+config.request.api.host[0]+' 是否是你私有部署的 translate.service ?');
				console.log(queren);
				if(queren === false){
					translate_service_key = '';  //清空掉这个授权码，避免泄露
				}
				*/
			}

			//检测当前的翻译通道是否是私有部署的，并且跟授权码是一致的
			var translate_service_config;
			try{
				translate_service_config = translate.debug.check.sendTranslateRequest(config.request.api.host[0]+'admin/system/config.json', {token: translate_service_key});
			}catch(e){
				checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><span class="warn">失败，连通异常，请确认设置的 '+config.request.api.host[0]+' 是否能正常连通? 是否有对某些请求做了拦截？ <br/> 当前post连接 '+config.request.api.host[0]+'admin/system/config.json 失败: '+e+'</span>';
				console.log(e);
				return;
			}
			console.log(translate_service_config)
			checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><h2>验证当前网页接入私有部署的 translate.service </h2>';
			if(translate_service_config.result === 1 && translate_service_config.json.result === 1){
				checkResultDom.innerHTML = checkResultDom.innerHTML + '成功，已成功对接！';
			}else{
				checkResultDom.innerHTML = checkResultDom.innerHTML + '<span class="warn">失败，未正常对接</span>';
			}
			if (translate_service_config.result === 1){
				if(translate_service_config.json.result === 0){
					if(translate_service_config.json.info.toLowerCase().indexOf('authorize code error') > -1){
						checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><span class="warn">可能一：您这里填写的 私有部署的translate.service 的授权码错误 <br/>可能二：私有部署的translate.service 中，config.properties 配置文件中，未正确 <a href="https://translate.zvo.cn/549775.html" target="_black">配置授权码</a>！</span>';
					}else{
						checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><span class="warn">验证授权异常：'+translate_service_config.json.info+'</span>';
					}
					return;
				}else{
					//
					//checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><br/>验证当前网页接入私有部署的 translate.service 成功，已成功对接！';
				}
			}else{
				checkResultDom.innerHTML = checkResultDom.innerHTML +'<br/><span class="warn">'+translate_service_config.info+'</span>';
				return;
			}



			//整体翻译
			checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><h2>当前整体翻译是否启用</h2>'+(config.whole.enableAll? '启用':'<span class="warn">未启用</span>')+'<br/>'+(config.whole.enableAll? '启用整体翻译，可提高阅读通畅，此项设置检测达标。':'<span class="warn">启用整体翻译，可提高阅读通畅。当前未启用，建议设置 <a href="http://translate.zvo.cn/4078.html" target="_black">translate.whole.enableAll();</a> 启用</span>');

			//私有部署的数据库是否启用
			checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><h2>私有部署的数据库是否启用</h2>'+(translate_service_config.json.useDatabase === 1? '启用':'未启用');
			if(translate_service_config.json.useDatabase === 1){
				'<br/><span class="warn">启用数据库能力后，可开启私有部署管理控制台的 术语库、译文管理 的功能，建议启用，参考文档： <a href="http://translate.zvo.cn/509578.html" target="_black">http://translate.zvo.cn/509578.html</a></span>'
			}
			

			//私有部署的频率控制
			checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><h2>私有部署的翻译接口请求频率控制</h2>';
			checkResultDom.innerHTML = checkResultDom.innerHTML + '当前为 maxRequests:'+translate_service_config.json.translateJsonNumberMaxRequests+', cycleTime:'+translate_service_config.json.translateJsonNumberCycleTime;
			if(translate_service_config.json.translateJsonNumberCycleTime === 0){
				checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/>已设置，当前已关闭请求频率控制能力（需注意，别被人恶意利用消耗翻译通道的tokens）';
			}else{
				var translateJsonNumberMaxRequests_tishimessage = ''; //未设置时的提示开头信息
				if(translate_service_config.json.translateJsonNumberMaxRequests === 2 && translate_service_config.json.translateJsonNumberCycleTime === 2000){
					translateJsonNumberMaxRequests_tishimessage = '尚未设置过！';
				}else{
					if(translate_service_config.json.translateJsonNumberMaxRequests * 1000 / translate_service_config.json.translateJsonNumberCycleTime > 10){
						checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/>已设置，且每秒的请求数大于10';
					}else{
						translateJsonNumberMaxRequests_tishimessage = '<br/>待优化，您当前设置的请求控制策略，每秒的请求数小于10，当<a href="http://translate.zvo.cn/479742.html" target="_black">禁用翻译排队能力</a>后，页面的某些动态改变等导致的请求频率高时，可能会触发私有部署翻译服务的拦截，导致偶发的高频翻译请求会被拦截无法被翻译。';
					}
				}

				if(translateJsonNumberMaxRequests_tishimessage.length > 2){
					checkResultDom.innerHTML = checkResultDom.innerHTML + '<span class="warn">'+translateJsonNumberMaxRequests_tishimessage+'<br/>强烈建议放宽它的请求频率限制，比如2秒20次，配合<a href="http://translate.zvo.cn/479742.html" target="_black">禁用翻译排队能力</a>，以提高用户翻译体验。设置参考：<a href="http://translate.zvo.cn/413975.html" target="_black">http://translate.zvo.cn/413975.html</a></span>';
				}
			}
			
		
			//翻译排队执行
			checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><h2>翻译排队能力</h2>'+(config.request.waitingExecute? '<span class="warn">开启，尚未禁用。强烈建议禁用排队等待，提高多语言切换速度。参考：<a href="http://translate.zvo.cn/479742.html" target="_black">http://translate.zvo.cn/479742.html</a></span>':'已禁用（正常，加速页面翻译）');
			

			//文本翻译测试
			var data = {
				from: "chinese_simplified",
				to: "english",
				text: encodeURIComponent(JSON.stringify(['你好','世界'])),
				browserDefaultLanguage: "chinese_simplified"
			};

			//翻译通道检测-进行文本翻译
			var xhr_trans_test = translate.debug.check.sendTranslateRequest(translate.request.api.host[0]+translate.request.api.translate, data);
			checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><h2>翻译通道检测-是否配置</h2>中译英翻译测试'+(xhr_trans_test.result === 1? '成功':'<span class="warn">失败</span>');
			if(xhr_trans_test.result === 0){
				checkResultDom.innerHTML = checkResultDom.innerHTML + '<span class="warn">'+xhr_trans_test_failure_info+'<br/>你可以再次测试，如果还是这样，请检查你配置的 <a href="http://translate.zvo.cn/391752.html" target="_black">翻译通道</a> 是否正常</span>';
			}
			


			//文件缓存测试是否启用
			var xhr_trans_test_fileCache = translate.debug.check.sendTranslateRequest(translate.request.api.host[0]+translate.request.api.translate, data);
			var xhr_trans_test_fileCache_use = false; //true开启
			var xhr_trans_test_fileCache_Filecachehit = xhr_trans_test_fileCache.xhr.getResponseHeader('Filecachehit');
			if(typeof(xhr_trans_test_fileCache_Filecachehit) !== 'undefined' && xhr_trans_test_fileCache_Filecachehit !== null && xhr_trans_test_fileCache_Filecachehit === 'true'){
				xhr_trans_test_fileCache_use = true;
			}
			checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><h2>翻译通道检测-文件缓存</h2>私有部署的服务端文件缓存能力：'+(xhr_trans_test_fileCache_use? '开启':'未开启');


			//内存缓存测试是否启用
			setTimeout(function(){
				data.text = encodeURIComponent(JSON.stringify(['你好','世界',''+new Date().getTime()]));
				var xhr_trans_test_memoryCache = translate.debug.check.sendTranslateRequest(translate.request.api.host[0]+translate.request.api.translate, data);
				var xhr_trans_test_memoryCache_use = false; //true开启
				var xhr_trans_test_memoryCache_hitnumber = translate.debug.check.getResponseHeaderByXhr(xhr_trans_test_memoryCache.xhr, 'Memorycachehitsnumber');
				if(typeof(xhr_trans_test_memoryCache_hitnumber) !== 'undefined' && xhr_trans_test_memoryCache_hitnumber !== null && xhr_trans_test_memoryCache_hitnumber > 0){
					xhr_trans_test_memoryCache_use = true;
				}
				checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/><h2>私有部署的服务端内存缓存能力</h2>'+(xhr_trans_test_memoryCache_use? '已开启':'<span class="warn">未开启，强烈建议开启，加速翻译，降低tokens消耗。详细参考：<a href="http://translate.zvo.cn/391130.html" target="_black">http://translate.zvo.cn/391130.html</a> </span>');
				if(xhr_trans_test_memoryCache.result === 0){
					checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/>'+xhr_trans_test_failure_info;
				}
			}, 2300);
			



			//检查是否是内存缓存没启用
			var xhr_admin_yiwen_domain_status_find = translate.debug.check.sendTranslateRequest(translate.request.api.host[0]+'admin/domain/getDomainStatus.json', {token: translate_service_key, domain:domain});	
			console.log(xhr_admin_yiwen_domain_status_find)


			
			//译文管理 检测是否能正常产生译文
			if(translate_service_config.json.useDatabase === 1){
				checkResultDom.innerHTML = checkResultDom.innerHTML + '<h2>私有部署-译文管理-检测</h2>';
				if(window.location.hostname === ''){
					checkResultDom.innerHTML = checkResultDom.innerHTML + '<span class="warn">您的网址不是正常网址，请使用 http、https 的方式访问本页面</span>';
				}else{

					//首先发起测试翻译文本
					var xhr_trans_yiwen_test_text = '你好'+new Date().getTime()+'世界';
					data.text = encodeURIComponent(JSON.stringify([xhr_trans_yiwen_test_text]));
					var xhr_trans_yiwen_test = translate.debug.check.sendTranslateRequest(translate.request.api.host[0]+translate.request.api.translate, data);
					checkResultDom.innerHTML = checkResultDom.innerHTML + '&nbsp&nbsp&nbsp&nbsp 发起测试翻译文本 - 翻译'+(xhr_trans_yiwen_test.result === 1? '成功':'<span class="warn">失败: '+xhr_trans_yiwen_test.info+'</span>');
					
					//去私有部署翻译服务检测，译文管理中是否有了这条文本的译文记录
					//window.location.hostname
					var domain = window.location.hostname;
					//domain = 'cf2577e313014e8ab86ac4e1fadda175';
					var xhr_admin_yiwen = translate.debug.check.sendTranslateRequest(translate.request.api.host[0]+'admin/cache/getCacheTextList.json', {token: translate_service_key, domain:domain, to:'english', originalText: encodeURIComponent(xhr_trans_yiwen_test_text)});
					console.log(xhr_admin_yiwen)
					checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/>&nbsp&nbsp&nbsp&nbsp 获取译文管理记录 - ';
					if((xhr_admin_yiwen.result === 1 && xhr_admin_yiwen.json.list.length === 1)){
						checkResultDom.innerHTML = checkResultDom.innerHTML + '成功<br/>&nbsp&nbsp&nbsp&nbsp 译文管理测试完毕，正常';
					}else{
						checkResultDom.innerHTML = checkResultDom.innerHTML + '<span class="warn">失败</span>';

						if(xhr_admin_yiwen.result === 0){
							if(xhr_admin_yiwen.info.indexOf('请先配置 domain.json 文件，将域名') > -1){
								xhr_admin_yiwen.info = '<a href="http://translate.zvo.cn/391130.html" target="_black">'+xhr_admin_yiwen.info+'</a>'
							}
							checkResultDom.innerHTML = checkResultDom.innerHTML + '&nbsp;&nbsp;<span class="warn">'+xhr_admin_yiwen.info+'</span>';
						}else if(xhr_admin_yiwen.json.list.length === 0){
							checkResultDom.innerHTML = checkResultDom.innerHTML + '<span class="warn">译文管理中，没有找到这条测试翻译的记录！您当前的网页域名：'+domain+'</span>';

							//进行检测这个域名是否在 domain.json 中存在
							var xhr_admin_yiwen_domain_find = translate.debug.check.sendTranslateRequest(translate.request.api.host[0]+'admin/domain/getDomainList.json', {token: translate_service_key, domain:domain, domainFuzzySearch:0});
							console.log(xhr_admin_yiwen_domain_find);
							checkResultDom.innerHTML = checkResultDom.innerHTML + '<br/>&nbsp&nbsp&nbsp&nbsp 检查域名 '+domain+'是否已经设置到 domain.json';
							if(xhr_admin_yiwen_domain_find === 1 && xhr_admin_yiwen_domain_find.json.list.length === 1){
								checkResultDom.innerHTML = checkResultDom.innerHTML + '已正常设置';

								/*
									正常存在于 domain.json 中了，但是译文中没有增加，继续检测：
									检查是否是内存缓存没启用
									检查此域名是否内存缓存已满

									这两项检测基本不存在于刚私有部署的情况，所以先不检测了
								*/

								//检查是否是内存缓存没启用
								//var xhr_admin_yiwen_domain_find = translate.debug.check.sendTranslateRequest(translate.request.api.host[0]+'admin/domain/getDomainStatus.json', {token: translate_service_key, domain:domain});	



							}else{
								//不正常
								if(xhr_admin_yiwen_domain_find === 0){
									checkResultDom.innerHTML = checkResultDom.innerHTML + '<span class="warn">失败：'+xhr_admin_yiwen_domain_find.info+'</span>';
								}else if(xhr_admin_yiwen_domain_find.json.list.length !== 1){
									checkResultDom.innerHTML = checkResultDom.innerHTML + '<span class="warn">domain.json 中未发现 '+domain+' ，请将 '+domain+' 加入 domain.json ， 详细参考：<a href="http://translate.zvo.cn/391130.html" target="_black">http://translate.zvo.cn/391130.html</a> </span>';
								}
							}



						}
					}
					
					

				}

				


			}else{
				checkResultDom.innerHTML = checkResultDom.innerHTML + '<h2>私有部署-译文管理-检测</h2><span class="warn">未启用数据库能力，译文管理功能无效。</span>';
			}

			//检测是否网络中专导致回源host丢失

		}
	},
	mouseTracking: {
		use: function(){
			// 绑定全局事件，粘贴后立即生效
			document.addEventListener('mousemove', translate.debug.mouseTracking.highlightCurrentElement);
			document.addEventListener('mouseout', translate.debug.mouseTracking.removeHighlight);
			document.addEventListener('mouseleave', translate.debug.mouseTracking.removeHighlight);

			document.addEventListener('keydown', function(e) {
				// e.key === 'Control' 确认按下的是Ctrl键本身，排除组合键
				if (e.ctrlKey && e.key === 'Control') {
			    	console.log(translate.debug.data.nodes);
			    	for(var ni = 0; ni < translate.debug.data.nodes.length; ni++){
			    		var finds = translate.debug.getTranslateNodeQueue(translate.debug.data.nodes[ni]);
			    		var fnode = translate.debug.getTranslateNode(translate.debug.data.nodes[ni]);
			    		console.log(finds);
			    		console.log(fnode);
			    	}
				}
			});

			// 控制台提示生效状态
			console.log('鼠标跟踪已启用，鼠标移入后，按下 ctrl 键 即可获取鼠标所在的node节点的翻译数据信息');
		},

		// 存储上一个被标记的元素，用于后续移除样式
		lastHighlightEl:null,
		// 鼠标移动事件：实时标记当前元素（内部红框，不影响布局）
		highlightCurrentElement: function(e) {
		    const currentEl = e.target;
		    // 避免重复操作同一个元素，提升性能
		    if (currentEl === translate.debug.mouseTracking.lastHighlightEl) return;

		    // 移除上一个元素的标记样式
		    if (translate.debug.mouseTracking.lastHighlightEl) {
		        translate.debug.mouseTracking.lastHighlightEl.style.outline = ''; // 清空outline，恢复原有样式
		        // 若使用box-shadow方案，此处改为 translate.debug.mouseTracking.lastHighlightEl.style.boxShadow = ''
		    }

		    // 给当前元素添加【内部1px红框】：outline不占用布局空间，向内渲染
		    currentEl.style.outline = '1px solid red';
		    // 备选方案：使用box-shadow（同样不占用布局空间），效果一致
		    // currentEl.style.boxShadow = 'inset 0 0 0 1px red';

		    // 更新上一个标记元素
		    translate.debug.mouseTracking.lastHighlightEl = currentEl;

		    translate.debug.data.nodes = translate.debug.whileNodes(e.target);

		},
		// 鼠标离开/移出事件：移除所有标记
		removeHighlight: function() {
		    if (translate.debug.mouseTracking.lastHighlightEl) {
		        translate.debug.mouseTracking.lastHighlightEl.style.outline = '';
		        // 若使用box-shadow方案，此处改为 translate.debug.mouseTracking.lastHighlightEl.style.boxShadow = ''
		        translate.debug.mouseTracking.lastHighlightEl = null; // 重置变量
		    }
		}
	}
}









