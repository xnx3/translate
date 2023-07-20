package cn.zvo.translate.tcdn.api.util;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.xnx3.BaseVO;
import com.xnx3.DateUtil;
import com.xnx3.Lang;
import com.xnx3.Log;
import com.xnx3.StringUtil;
import com.xnx3.UrlUtil;
import com.xnx3.j2ee.util.ConsoleUtil;

import cn.zvo.log.framework.springboot.LogUtil;
import cn.zvo.translate.tcdn.api.vo.TranslateVO;

public class TranslateUtil {
	static ChromeUtil chrome;
//	static String newdomain = "service.translate.zvo.cn"; //传入如 www.xxxx.com:80
	static {
		chrome = new ChromeUtil();
	}
	static String currentExecuteUrl = ""; //当前正在执行的url
	
	/**
	 * 获取缓存的 http://wwww.xxxx.com/
	 * @param request
	 * @return
	 */
	public static String getDomain(HttpServletRequest request) {
		//取到如 http://www.zvo.cn
		Object domainObj = request.getSession().getAttribute("domain");
		if(domainObj != null) {
			String domain = domainObj.toString();
			if(domain.length() < 1) {
				return "请传入要翻译的目标url";
			}
			
			//组合url
			if(request.getRequestURI().toString().indexOf("/") > 0) {
				domain = domain + "/";
			}
			return domain;
		}
		return "";
	}
	
	/**
	 * 获取目标资源的url
//	 * @param sourceDomain 目标站点，源站的url，格式如 http://xxxx.com
	 * @return
	 */
	public static String targetUrl(String sourceDomain, HttpServletRequest request) {
		String url = "";
		//取到如 http://www.zvo.cn
//		Object domainObj = request.getSession().getAttribute("domain");
//		if(domainObj != null) {
//			String domain = domainObj.toString();
			if(sourceDomain.length() < 1) {
				return "请传入要翻译的目标url";
			}
			
			//组合url
//			if(sourceDomain.indexOf("/") > 0) {
//				sourceDomain = sourceDomain + "/";
//			}
			url = sourceDomain + request.getRequestURI();
			if(request.getQueryString() != null && request.getQueryString().length() > 0) {
				url = url + "?" + request.getQueryString();
			}
			return url;
//		}
//		return "";
	}
	
	/**
	 * 
	 * @param sourceDomain 目标站点，源站的url，格式如 http://xxxx.com
	 * @param newDomain 翻译后的使用的新域名，传入格式如 http://newdomain.zvo.cn  如果传入null，则代表不启用这个规则。
	 * @param url 要打开的目标页面的url，要访问，也就是要翻译的目标页面的url，绝对地址
	 * @param dynamic 貌似无效了
	 * @param language 要翻译为什么语言
	 * @param executeJs 在执行页面翻译的操作时，额外执行的js。这个只是在翻译的过程中进行执行，影响的是输出的翻译结果 
	 * @param request
	 * @return
	 */
	public static BaseVO trans(String sourceDomain, String newDomain, String url, String dynamic, String language,String executeJs, HttpServletRequest request) {
		TranslateVO vo = new TranslateVO();
		
		if(url.length() == 0) {
			//第二次或以后使用
			url = targetUrl(sourceDomain, request);
//			dynamic = (String)request.getSession().getAttribute("dynamic");
//			language = (String)request.getSession().getAttribute("language");
		}else {
			//第一次访问，传入了，那么进行缓存入session
			String domain = UrlUtil.getDomain(url);
			String protocols = UrlUtil.getProtocols(url);
			Log.info("domain:"+domain+", protocols:"+protocols+", dynamic:"+dynamic+", language:"+language);
			
			request.getSession().setAttribute("domain", protocols+"://"+domain);
//			request.getSession().setAttribute("dynamic", dynamic);
//			request.getSession().setAttribute("language", language);
		}
//		
		if(dynamic == null || !dynamic.equalsIgnoreCase("true")) {
			dynamic = "false";
		}
		if(language == null || language.equalsIgnoreCase("null") || language.length() < 1) {
			language = "english";
		}
		
		long exeTime = 0;
//		currentExecuteUrl = url; //赋予
		TranslateVO transVO = null;
		try {
			long startTime = DateUtil.timeForUnix13();
			//翻译
			ConsoleUtil.debug("url"+url+", language:"+language+", dynamic:"+dynamic);
			transVO = chrome.execute(url, language, newDomain, executeJs);
			vo.setResult(transVO.getResult());
			vo.setInfo(transVO.getInfo());
			long endTime = DateUtil.timeForUnix13();
			exeTime = endTime - startTime;	//执行时间
		}catch (Exception e) {
			e.printStackTrace();
			return BaseVO.failure(e.getMessage());
		}
//		currentExecuteUrl = null; //清理
		
		
		//添加一条数据到日志
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("url", url);
		params.put("time", DateUtil.timeForUnix13());
		params.put("exetime", exeTime);
		LogUtil.add(params);
		if(vo.getResult() == BaseVO.SUCCESS && dynamic.equals("true")) {
			String dynamicStr = "<script src=\"https://res.zvo.cn/translate/translate.js\"></script><script> translate.setUseVersion2(); translate.selectLanguageTag.show = false; translate.language.setLocal('"+transVO.getLocalLanguage()+"'); translate.to = '"+language+"'; translate.execute(); setTimeout(function(){translate.execute(); translate.listener.start(); },1500);</script>";
			vo.setInfo(vo.getInfo()+dynamicStr);
		}
//		return vo;
		return vo;
	}
	
	public static String[] noStaticFileSuffixs = {"html","htm","do","jsp","php","asp","aspx"}; //非静态资源的后缀
	/**
	 * 如果是静态资源（不需要进行翻译的网页），则返回true
	 * @param requestUri
	 * @return
	 */
	public static boolean isStaticFile(String requestUri) {
		System.out.println(requestUri);
		if(requestUri.indexOf("?") > -1) {
			requestUri = StringUtil.subString(requestUri, "", "?", 2);
		}
		String suffix = Lang.findFileSuffix(requestUri);
		//System.out.println("requestUri:"+requestUri+", suffix:"+suffix);
		boolean result = true;
		if(suffix == null || suffix.length() == 0) {
			result = false;
		}
		
		for (int i = 0; i < noStaticFileSuffixs.length; i++) {
			if(noStaticFileSuffixs[i].equalsIgnoreCase(suffix)) {
				result = false;
				break;
			}
		}
		
		return result;
	}
	
	public static void main(String[] args) {
		
		System.out.println(isStaticFile("https://tool.oschina.net/uploads/apidocs/css3/a.jpg"));
		
	}
}
