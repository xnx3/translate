chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {  
  const tab = tabs[0]; // 获取当前活动标签页  
  console.log(tab.url); // 打印当前标签页的URL  
  
  // 向内容脚本发送消息  
  chrome.scripting.sendMessage(tab.id, {greeting: "hello"}, function(response) {  
    console.log(response); // 打印内容脚本返回的响应  
  });  
});