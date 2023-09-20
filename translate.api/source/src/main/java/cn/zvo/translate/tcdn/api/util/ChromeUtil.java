package cn.zvo.translate.tcdn.api.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.PageLoadStrategy;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import com.xnx3.BaseVO;
import com.xnx3.FileUtil;
import com.xnx3.Log;
import com.xnx3.MD5Util;
import com.xnx3.StringUtil;
import com.xnx3.SystemUtil;
import com.xnx3.UrlUtil;
import com.xnx3.j2ee.util.ApplicationPropertiesUtil;
import cn.zvo.http.Http;
import cn.zvo.http.Response;
import cn.zvo.log.framework.springboot.LogUtil;
import cn.zvo.translate.tcdn.api.Global;
import cn.zvo.translate.tcdn.api.util.bean.Ignore;
import cn.zvo.translate.tcdn.api.vo.TranslateVO;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ChromeUtil {
	static Http http;
	static WebDriver driver;
	static Map<String, String> headers;
	
	public static String translateJs = "var console={ log:function(str){ var consolelogDiv = document.createElement(\"div\");"
			+ "consolelogDiv.className=\"translate_consoleLog ignore\"; consolelogDiv.style.display='none'; consolelogDiv.innerHTML = str; try{ document.getElementsByTagName('html')[0].appendChild(consolelogDiv); }catch (ce){ } } };";
	public static String translateCoverJs = "";
	static {
		http = new Http();
		headers = new HashMap<String, String>();
		headers.put("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36");
		headers.put("Referer", "translate.js");
		
		try {
			translateJs = translateJs + http.get("http://res.zvo.cn/translate/translate.js").getContent();
//			translateJs += http.get("https://gitee.com/mail_osc/translate/raw/master/translate.js/translate.js").getContent();
		} catch (IOException e) {
			e.printStackTrace();
			translateJs = "document.write('网络加载 translate.js失败，请重启服务器中的 translate.api 项目');";
		}
		
		if(SystemUtil.isWindowsOS()) {
			//translateJs += FileUtil.read("G:\\git\\translate\\translate.js");
			translateCoverJs = FileUtil.read("G:\\git\\chrome\\js\\translate_cover.js");
		}else{
			
			translateCoverJs = "translate.requests = new Array();\r\n"
					+ "translate.request.send = function(url, data, func, method, isAsynchronize, headers, abnormalFunc){\r\n"
					+ "	translate.requests.push({\r\n"
					+ "		url:url,\r\n"
					+ "		data:data\r\n"
					+ "	});\r\n"
					+ "};";
		}
		
	}
	
	public static void main(String[] args) throws InterruptedException, IOException {
		Response res = http.get("http://www.zhongbing.zvo.cn");
		
		ChromeUtil chrome = new ChromeUtil();
		TranslateVO vo = chrome.execute("http://www.zhongbing.zvo.cn", "chinese_simplified", "xinyuming", "");
		System.out.println(vo);
		
	}
	
	/**
	 * 
	 * @param targetUrl 要打开的目标页面的url，要访问，也就是要翻译的目标页面的url，绝对地址
	 * @param language
	 * @param newdomain 翻译后的使用的新域名，传入格式如 http://newdomain.zvo.cn   如果传入null，则代表不启用这个规则。
	 * @param executeJs 在执行页面翻译的操作时，额外执行的js。这个只是在翻译的过程中进行执行，影响的是输出的翻译结果 
	 * @return
	 * @throws InterruptedException
	 */
	//synchronized
	public TranslateVO execute(String targetUrl, String language, String newdomain, String executeJs) {
		TranslateVO vo = new TranslateVO();
		String domain = UrlUtil.getDomain(targetUrl);
		String html = "";
		
		
		//不能用这个方式获取源码，会加入动态垃圾代码
//		if(driver == null) {
//			driver = createDriver();
//		}
//		driver.get(targetUrl);
//		html = driver.getPageSource(); //获取源代码
//		driver.quit();
//		driver = null;
		
		/*** 服务器上有时https访问出现 Empty issuer DN not allowed in X509Certificates ****/
		try {
			Response res = http.get(targetUrl);
			if(res.getCode() != 200) {
				vo.setBaseVO(BaseVO.FAILURE, "处理异常, http code :"+res.getCode());
				return vo;
			}
			html = res.getContent();
		} catch (IOException e) {
			e.printStackTrace();
			vo.setBaseVO(BaseVO.FAILURE, "处理异常,"+e.getMessage());
			return vo;
		}
		
		String hash = null; //网页原始源代码的hash
		hash = MD5Util.MD5(html);
		
		String path = "";
		if(SystemUtil.isWindowsOS()) {
			//本地开发调试
			path = ChromeUtil.class.getResource("/").getPath();
		}else {
			path = "/mnt/api/chromehtml/";
		}
		Log.info("path:"+path);
		
		html = "<meta http-equiv=\"content-security-policy\" content=\"script-src 'none'\">"+html;
		FileUtil.write(path+hash+".html", html);
		
		//System.out.println("hash:"+hash);
	
		String localHtml = "file://"+path+hash+".html";
		Log.info("chrome get url : "+localHtml);
		driver = createDriver();
		driver.get(localHtml);
		
		/** 先判断缓存 **/
//		String hash = null; //网页原始源代码的hash
//		String html = driver.getPageSource();
//		hash = MD5Util.MD5(html);
		//String cache = CacheUtil.get(domain, hash, language);
//		String cache = null;
//		Log.info("cache hash:"+hash+", language:"+language);
//		if(cache != null && cache.length() > 0) {
//			
//			JSONObject json = JSONObject.fromObject(cache);
//			vo.setInfo(json.getString("info"));
//			vo.setResult(json.getInt("result"));
//			vo.setLocalLanguage(json.getString("localLanguage"));
//			
//			//添加一条数据到日志
//			Map<String, Object> params = new HashMap<String, Object>();
//			params.put("url", targetUrl);
//			params.put("time", DateUtil.timeForUnix13());
//			params.put("hash", hash);
//			params.put("cache", "true");
//			LogUtil.add(params);
//			
//			driver.quit();
//			driver = null;
//			
//			return vo;
//		}
//		
		
		String htmlLower = html.toLowerCase();
		if(htmlLower.indexOf("</html>") == -1 && htmlLower.indexOf("</body>") == -1) {
			String pageSource = driver.getPageSource();
			vo.setResult(BaseVO.FAILURE);
			vo.setInfo("源站页面 "+targetUrl+" 未发现html、body标签，翻译中止。");
			//缓存
			CacheUtil.set(domain, hash, language, JSONObject.fromObject(vo).toString());
			
			close();
			return vo; 
		}
		
		
		
		JavascriptExecutor js = (JavascriptExecutor) driver;
		//js.executeScript(" document.getElementsByTagName('title')[0].innerHTML = '123'");
		
//		String trans = FileUtil.read("G:\\git\\translate\\translate.js");
//		String trans_cover = FileUtil.read("G:\\git\\chrome\\js\\translate_cover.js");
		
		String execute = "translate.setUseVersion2();";
//		if(ignore != null) {
//			if(ignore.getId().size() > 0) {
//				for(int i = 0; i<ignore.getId().size(); i++) {
//					execute += " translate.ignore.id.push('"+ignore.getId().get(i)+"');";
//				}
//			}
//			if(ignore.getClassName().size() > 0) {
//				for(int i = 0; i<ignore.getClassName().size(); i++) {
//					execute += " translate.ignore.class.push('"+ignore.getClassName().get(i)+"');";
//				}
//			}
//			if(ignore.getTag().size() > 0) {
//				for(int i = 0; i<ignore.getTag().size(); i++) {
//					execute += " translate.ignore.tag.push('"+ignore.getTag().get(i)+"');";
//				}
//			}
//		}
		if(executeJs != null && executeJs.length() > 0) {
			execute += " try { "+executeJs+" \r\n}catch(e_tcdn){ var div = document.createElement('div');\r\n"
					+ "div.innerHTML = e_tcdn;\r\n"
					+ "div.class = 'ignore';\r\n"
					+ "document.body.appendChild(div);\r\n"
					+ " }";
		}
		
		//翻译的请求主机
		String apiUrl = ApplicationPropertiesUtil.getProperty("translate.tcdn.service.domain");
		if(apiUrl == null || apiUrl.length() == 0) {
			apiUrl = "http://api.translate.zvo.cn/";
		}
		
		execute += " translate.request.api.host='"+apiUrl+"'; translate.selectLanguageTag.show = false; translate.to = '"+language+"'; translate.execute(); ";
		execute += "return translate.requests;";
		
		Object objLocalLanguage = js.executeScript(translateJs+" return translate.language.getLocal();");
		if(objLocalLanguage == null) {
			vo.setBaseVO(BaseVO.FAILURE, "处理异常,code:102");
			
			close();
			return vo;
		}else {
			Log.info("local language:"+objLocalLanguage);
		}
		Log.info("execute:");
		Log.info(execute);
		Log.info("translateJs:"+translateJs.length());
		Log.info("translateCoverJs:"+translateCoverJs);
		Object obj = js.executeScript(translateJs +translateCoverJs+ execute);
		if(obj != null) {
			Log.info("fanyi first obj : "+JSONArray.fromObject(obj));
			vo.setLocalLanguage((String) objLocalLanguage);
			fanyi(obj, js);
		}else {
			Log.info("first fanyi obj is null");
			vo.setBaseVO(BaseVO.FAILURE, "处理异常,code:101");
			close();
			return vo;
		}
		
		//在执行一次，避免有单词落下了
		Object obj2 = js.executeScript(translateJs +translateCoverJs+ execute);
//		System.out.println("--------");
//		System.out.println(translateJs +translateCoverJs+ execute);
//		System.out.println("--------");
		
		if(obj2 != null) {
			System.out.println("第2次执行结果：");
			System.out.println(obj2);
			fanyi(obj2, js);
		}
		
//		//最后执行一次，讲落下单词翻译
//		Object obj3 = js.executeScript(trans +trans_cover+ execute);
//		if(obj3 != null) {
//			//fanyi(obj2, js);
//			System.out.println("第三次执行结果：");
//			System.out.println(obj3);
//		}
		
		
		//处理A标签链接
		//获取当前目标网站的domain
		//String domain = UrlUtil.getDomain(targetUrl);
		if(newdomain != null && newdomain.length() > 0) {
			Log.info("domain:"+domain);
			String jsA = "for(var targetDomain=\"//www.zvo.cn\",nowDomain=\"newdomain.zvo.cn\",as=document.getElementsByTagName(\"a\"),asi=0;asi<as.length;asi++){var a=as[asi];if(void 0!==a.href&&a.href.length>0){var domain_index=a.href.indexOf(targetDomain);domain_index>-1&&(a.href=\"http://\"+nowDomain+a.href.substring(domain_index+targetDomain.length),console.log(a.href))}void 0!==a.target&&\"_blank\"==a.target.toLowerCase()&&(a.target=\"\")}";
			jsA = jsA.replace("www.zvo.cn", domain);
			jsA = jsA.replace("newdomain.zvo.cn", newdomain);
			js.executeScript(jsA);
			//Log.info(jsA);
		}
		
//		
		try {
			Thread.sleep(100);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		//FileUtil.write(new File("G:\\git\\chrome\\t.txt"), driver.getPageSource());
		
		String pageSource = driver.getPageSource();
		
		//去掉不执行js的标签
		pageSource = pageSource.replace("<meta http-equiv=\"content-security-policy\" content=\"script-src 'none'\">", "");
		
		vo.setInfo(pageSource);
		
		close();
		
		
		//缓存
		//CacheUtil.set(domain, hash, language, JSONObject.fromObject(vo).toString());
		
		return vo;
	}
	

	public static String getLocalStorageSet(String key, String value) {
//		Log.info(value);
		return "localStorage.setItem(\""+key+"\",\""+value+"\");";
	}
	
	public void close() {
		driver.close();
		driver.quit();
	}
	
	/**
	 * 创建 chrome 的 driver
	 * @return
	 */
	public ChromeDriver createDriver() {
		ChromeOptions options = new ChromeOptions(); // 设置chrome的一些属性
//		options.setPageLoadStrategy(PageLoadStrategy.NONE);
		options.addArguments("--disable-gpu"); //谷歌文档提到需要加上这个属性来规避bug
		options.addArguments("--headless"); //无界面运行 ,开启这个后js会被执行----------
		options.addArguments("--disable-javascript"); //禁用javascript
		options.addArguments("--remote-allow-origins=*");//解决 403 出错问题
		Map<String, Object> prefs = new HashMap<String, Object>();
		prefs.put("profile.managed_default_content_settings.images",2); //禁止下载加载图片
		prefs.put("profile.managed_default_content_settings.javascript",2); //禁止下载加载js文件、执行js文件
		prefs.put("profile.managed_default_content_settings.js",2); //禁止下载加载js文件、执行js文件
		prefs.put("profile.managed_default_content_settings.css",2); //禁止下载加载js文件、执行js文件
		
		
//		Map<String, Object> contentSettings = new HashMap<String, Object>();
//		Map<String, Object> exceptions = new HashMap<String, Object>();
//		exceptions.put("*", "script-src 'none'");
//		contentSettings.put("javascript_content", exceptions);
//		prefs.put("profile.content_settings.exceptions", contentSettings);
		
		options.setExperimentalOption("prefs", prefs);
		options.addArguments("disable-infobars");	//正受到自动测试软件的控制
		
		if(SystemUtil.isWindowsOS()) {
			options.setBinary(Global.projectPath+"\\bin\\chrome\\chrome.exe");
			System.setProperty("webdriver.chrome.driver",Global.projectPath+"\\bin\\chrome\\chromedriver.exe");
			
//			System.setProperty("webdriver.chrome.driver","G:\\git\\translate\\translate.api\\source\\src\\main\\webapp\\lib\\chromedriver-114.0.5735.90.exe");
		}else {
			//centos中是将它放在了 /mnt/translate/chrome/
			System.setProperty("webdriver.chrome.driver","/mnt/api/chrome/chromedriver");
			
			//(unknown error: DevToolsActivePort file doesn't exist)
			options.addArguments("--disable-dev-shm-usage"); // overcome limited resource problems
			options.addArguments("--no-sandbox"); //数是让Chrome在root权限下跑
			
		}
		//这种方式在无头Headless模式下是生效的， 非无头Headless模式下也是生效的。
		options.addArguments("blink-settings=imagesEnabled=false");
		options.addArguments("blink-settings=javascriptEnabled=false");
		//https://chromedriver.storage.googleapis.com/index.html?path=110.0.5481.30/
		
//		options.addArguments("--disable-web-security");
//		options.addArguments("--allow-running-insecure-content");
		Log.info(JSONObject.fromObject(options).toString());
		options.setPageLoadStrategy(PageLoadStrategy.EAGER);
		Log.info("webdriver.chrome.driver:"+System.getProperty("webdriver.chrome.driver"));
		ChromeDriver driver = new ChromeDriver(options);
		return driver;
	}
	
	/**
	 * 翻译
	 * @param obj js执行后的返回
	 * @param js
	 */
	public static void fanyi(Object obj, JavascriptExecutor js){
		JSONArray array = JSONArray.fromObject(JSONArray.fromObject(obj));
//		Log.info(array.toString());
		for(int i = 0; i<array.size(); i++) {
			JSONObject json = array.getJSONObject(i);
			String oritext = StringUtil.urlToString(json.getJSONObject("data").getString("text"));
			//Log.info("fanyi oritext : "+oritext);
			JSONArray oriTextArray = JSONArray.fromObject(oritext); //要翻译的字符数组
			
			Response res = request(json);
			//Log.info(res.toString());
			if(res.code == 200) {
				JSONObject result = JSONObject.fromObject(res.getContent());
				if(result.getString("result").equals("1")) {
					//成功
					
					String to = result.getString("to");
					JSONArray texts = result.getJSONArray("text");
					Log.info("texts size ： "+texts.size());
					StringBuffer sb = new StringBuffer();
					for(int ti = 0; ti < texts.size(); ti++) {
						String text = texts.getString(ti);
						String hash = JavaScriptUtil.hash(oriTextArray.getString(ti));
						String set = getLocalStorageSet("hash_"+to+"_"+hash, text.replaceAll("'", "\\\'").replaceAll("\"", "\\\\\""));
						//js.executeScript("localStorage.setItem('"+ti+to+"','text')");
						sb.append(set);
					}
					
					//执行js
					js.executeScript(sb.toString());
				}
			}
		}
	}
	
	public static Response request(JSONObject json) {
		Response res = null;
		Http http = new Http();
		
		JSONObject data = json.getJSONObject("data");
		Map<String, String> params = new HashMap<String, String>();
		params.put("from", data.getString("from"));
		params.put("text", data.getString("text"));
		params.put("to", data.getString("to"));
		try {
			res = http.post(json.getString("url"), params);
		} catch (IOException e) {
			e.printStackTrace();
			res = new Response();
			res.code = 0;
			res.content = e.getMessage();
		}
		return res;
	}
}
