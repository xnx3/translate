var btn=document.getElementById('buttonProcess');
btn.onclick=saveLanguage;
function saveLanguage() {
  const selectedLanguage = document.getElementById("languageSelect").value;
  //将所选语言存储到 localStorage 或通过扩展插件的消息传递机制发送到后台脚本
  localStorage.setItem("selectedLanguage", selectedLanguage);
  window.close();
}

