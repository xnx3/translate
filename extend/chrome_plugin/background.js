// 创建上下文菜单项  
/* chrome.runtime.onInstalled.addListener(async () => {  
  const contextMenuId = "translateSimplifiedChinese";  
  await chrome.action.setContextMenus([{  
    id: contextMenuId,  
    title: "翻译为简体中文",  
    contexts: ["all"]  
  }]);  
});  */ 

// 监听上下文菜单的点击事件  
chrome.contextMenus.onClicked.addListener(async (info, tab) => {  
  if (info.menuItemId === "translateSimplifiedChinese") {  
    // 获取当前活动标签页的HTML内容  
    const [currentTab] = await chrome.tabs.query({active: true, currentWindow: true});  
    const html = await chrome.scripting.executeScript({  
      target: {tabId: currentTab.id},  
      func: () => document.body.innerHTML  
    });  
  
    // 在页面头部添加翻译脚本  
    const script = `  
      var head = document.getElementsByTagName('head')[0];  
      var scriptElement = document.createElement('script');  
      scriptElement.type = 'text/javascript';  
      scriptElement.src = 'https://res.zvo.cn/translate/inspector_v2.js';  
      head.appendChild(scriptElement);  
    `;  
    await chrome.scripting.executeScript({  
      target: {tabId: currentTab.id},  
      code: script  
    }); 

    
   /*  translate.listener.start(); 
    translate.service.use('client.edge');
    translate.to = 'english';
    
    translate.changeLanguage('english');
    translate.execute(); */

  }
});

//chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {  
  
  //if (message === "updateContextMenu") {
   //chrome.contextMenus.update('translateSimplifiedChinese', {title: 'sender.tab'});
  //}
//});