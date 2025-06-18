package cn.zvo.customTranslateJs;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Pattern;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;


import com.xnx3.FileUtil;
import com.xnx3.Lang;
import com.xnx3.Log;
import com.xnx3.StringUtil;
import com.xnx3.SystemUtil;
import com.xnx3.UrlUtil;

import cn.zvo.http.Http;
import cn.zvo.http.Response;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/**
 * 对 translate.js 的使用
 * @author 管雷鸣
 *
 */
public class TranslateJsUtil {
	static ScriptEngine engine;
	static Invocable invocable;
	
	/**
	 * 进行自定义js，删除一些不用的代码
	 * @param translateJsPath translate.js 所在的位置
	 * @param items 要删除的
	 * @return
	 */
	public static String custom(String[] items) {
		//String js = FileUtil.read(translateJsPath);
		String url = "https://gitee.com/mail_osc/translate/raw/master/translate.js/translate.js";
		Response res = null;
		try {
			res = new Http().get(url);
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		if(res.getCode() != 200) {
			Log.error("get new translate.js failure, http status code: "+res.getCode()+", "+res.getContent());
			return null;
		}
		String js = res.getContent();
		
        if(js == null || js.length() == 0) {
        	Log.error("js file not find");
        }
        
        for (int i = 0; i < items.length; i++) {
			String item = items[i].trim();
			if(item.length() < 1) {
				continue;
			}
			js = StringUtil.subStringReplace(js, "/*js "+item+" start*/", "/*js "+item+" end*/", "");
		}
        
        // 删除多行注释（/*...*/)
        js = js.replaceAll("/\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/", "");
        
        //删掉  // 双斜杠注释的行
        Pattern commentLinePattern = Pattern.compile("^\\s*//.*$", Pattern.MULTILINE);
        js = commentLinePattern.matcher(js).replaceAll("");
        
     	// 使用正则删除空行（支持跨平台换行符）
        js = js.replaceAll("(?m)^\\s*$\\n?", "");
        js = js.replaceAll("\\r\\n\\r\\n", "\n");
        
        return js;
	}
	
	public static void main(String[] args) throws ScriptException {
		String itemsString = args[1];
		if(itemsString == null || itemsString.trim().length() == 0) {
			Log.error("not find delete js function ， example: java -jar xxxx.jar translate.setUseVersion2,translate.resourcesUrl,translate.localLanguage /User/apple/trans.js");
			return;
		}
		String[] items = itemsString.split(",");
		
		//在  translate.js 后面追加的代码
		String appendJs = "";
		if(args.length > 2) {
			//有追加文件
			String appendJsPath = args[2].trim();
			if(!FileUtil.exists(appendJsPath)) {
				System.err.println("append code file is not file : "+appendJsPath);
				return;
			}
			appendJs = FileUtil.read(appendJsPath, FileUtil.UTF8);
			if(appendJs == null) {
				appendJs = "";
			}
		}
		
		
		String savePath = args[0];
		if(savePath == null || savePath.trim().length() == 0) {
			Log.error("not find save path param");
			return;
		}
		
//		String[] items = {
//				"translate.setUseVersion2",
//				"translate.resourcesUrl",
//				"translate.localLanguage",
//				"translate.googleTranslateElementInit",
//				"translate.execute_v1",
//				"translate.setCookie",
//				"translate.getCookie",
//				"translate.currentLanguage",
//				"translate.check",
//				"translate.util.loadMsgJs",
//				"translate.service.use",
//				"translate.service.edge",
//				"translate.reset",
//				"translate.selectionTranslate",
//				"translate.enterprise",
//				"translate.init",
//				};
		System.out.println("delete : \n"+itemsString);
		String js = custom(items);
		
		//追加
		js = js + appendJs;
		System.out.println("append : \n"+appendJs);
		
		
		boolean write = FileUtil.write(savePath, js);
		if(write) {
			System.out.println("success , file: "+savePath);
		}else {
			System.err.println("ERROR !");
		}
	}	
}
