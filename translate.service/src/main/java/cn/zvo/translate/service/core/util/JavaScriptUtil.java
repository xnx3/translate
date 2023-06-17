package cn.zvo.translate.service.core.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import cn.zvo.http.Http;
import cn.zvo.http.Response;

/**
 * js 相关
 * @author 管雷鸣
 *
 */
public class JavaScriptUtil {
	//key： js url     value: js文件的内容，缓存作用
	public static Map<String, String> jsCache;
	static {
		jsCache = new HashMap<String, String>();
	}
	
	/**
	 * 加载js的资源文件 （url）
	 */
	public static ScriptEngine loadExternalJS(ScriptEngine engine, List<String> jsUrlList) {
		if(jsUrlList == null || jsUrlList.size() == 0) {
			return engine;
		}
		
		for (int i = 0; i < jsUrlList.size(); i++) {
			String url =jsUrlList.get(i).trim();
			String text = "";
			
			if(jsCache.get(url) != null) {
				text = jsCache.get(url);
			}else {
				//没有缓存，那就拉取
				
				//http://res.zvo.cn/pinyin/pinyin.js?form=writecode
				Http http = new Http();
				
				try {
					Response res = http.get(url);
					if(res.getCode() == 200) {
						text = res.getContent();
					}
				} catch (IOException e) {
					e.printStackTrace();
				}
				
				
				if(text.length() == 0) {
					System.err.println("加载外部js资源文件失败:"+url);
				}else {
					//缓存内容
					jsCache.put(url, text);
				}
			}
			
			if(text != null && text.length() > 0) {
				try {
					engine.eval(text);
				} catch (ScriptException e) {
					e.printStackTrace();
				}
			}
		}
		
		return engine;
	}
	
	public static void main(String[] args) {
		String jsUrl = "https://res.zvo.cn/translate/test/translate.js?v=4";
		
		ScriptEngineManager manager = new ScriptEngineManager();
		ScriptEngine engine = manager.getEngineByName("JavaScript");
		try {
			engine.eval("var console = {log:function(){}}");
		} catch (ScriptException e) {
			System.out.println(e.getMessage());
		}
		
		List<String> urlList = new ArrayList<String>();
		urlList.add(jsUrl);
		engine = JavaScriptUtil.loadExternalJS(engine, urlList);  //初始化相关支持
		
		String jsTemplate = "return translate.version;";
		String js = "function translate_java(){ "+jsTemplate+" }";
		Invocable inv = (Invocable) engine;
		try {
			engine.eval(js);
			Object result = (Object) inv.invokeFunction("translate_java");
			System.out.println(result);
		} catch (NoSuchMethodException | ScriptException e) {
			System.out.println("js error :");
			e.printStackTrace();
		}
			
	}
		
		
}
