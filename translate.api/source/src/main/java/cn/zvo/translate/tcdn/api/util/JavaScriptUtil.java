package cn.zvo.translate.tcdn.api.util;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

/**
 * js 相关
 * @author 管雷鸣
 *
 */
public class JavaScriptUtil {
	static ScriptEngineManager manager;
	static ScriptEngine engine;
	static {
		String hashJS = "function hash(str){if(null==str||\"undefined\"==typeof str)return str;var r,t=0;if(0===str.length)return t;for(r=0;r<str.length;r++)t=(t<<5)-t+str.charCodeAt(r),t|=0;return t+\"\"}";
		manager = new ScriptEngineManager();
		engine = manager.getEngineByName("JavaScript");
		
	}
	
	/**
	 * 对字符串进行hash编码，取唯一码，这个是复制与 translate.util.hash
	 * @param str 要对其进行hash的字符串
	 * @return hash码，如果失败返回null
	 */
	public static String hash(String str) {
		String hashJS = "function hash(str){if(null==str||\"undefined\"==typeof str)return str;var r,t=0;if(0===str.length)return t;for(r=0;r<str.length;r++)t=(t<<5)-t+str.charCodeAt(r),t|=0;return t+\"\"}";
		try {
			engine.eval(hashJS);
		} catch (ScriptException e) {
			e.printStackTrace();
			return null;
		}
		Invocable inv = (Invocable) engine;
		try {
			Object result = (Object) inv.invokeFunction("hash",str);
			return (String) result;
		} catch (NoSuchMethodException | ScriptException e) {
			System.out.println("js error :");
			e.printStackTrace();
			return null;
		}
	}
	
	public static void main(String[] args) throws ScriptException {
		System.out.println(hash("11111"));
		System.out.println(hash("111113"));
		
	}
		
		
}
