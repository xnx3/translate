package cn.zvo.translate.service.api.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.xnx3.BaseVO;
import com.xnx3.DateUtil;
import com.xnx3.Log;
import com.xnx3.MD5Util;
import com.xnx3.StringUtil;
import com.xnx3.UrlUtil;

import cn.zvo.log.framework.springboot.LogUtil;
import cn.zvo.translate.service.core.pluginManage.interfaces.manage.TranslateManage;
import cn.zvo.translate.service.core.util.CacheUtil;
import cn.zvo.translate.service.core.util.RequestUtil;
import cn.zvo.translate.tcdn.core.service.Language;
import cn.zvo.translate.tcdn.core.service.Service;
import cn.zvo.translate.tcdn.core.service.ServiceInterface;
import cn.zvo.translate.tcdn.core.vo.LanguageListVO;
import cn.zvo.translate.tcdn.core.vo.TranslateResultVO;
import net.sf.json.JSONArray;

/**
 * 
 * 翻译接口
 * @author 管雷鸣
 *
 */
@Controller
@RequestMapping("/")
public class TranslateController{
	
	/**
	 * 当前支持的语言
	 * @return 支持的语言列表
	 * @author 管雷鸣
	 */
	@ResponseBody
	@RequestMapping(value="language.json", method = RequestMethod.POST)
	public LanguageListVO language(HttpServletRequest request) {
		//日志
		String referer = request.getHeader("referer"); 
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("referer", referer);
		params.put("method", "language.json");
		params.put("time", DateUtil.currentDate("yyyy-MM-dd HH:mm:ss"));
		LogUtil.add(params);
		
		/***** 翻译时，插件拦截，获取使用什么翻译 *****/
		ServiceInterface service = null;
		try {
			service = TranslateManage.getServiceInterface(request);
		} catch (InstantiationException | IllegalAccessException | NoSuchMethodException | SecurityException
				| IllegalArgumentException | InvocationTargetException e) {
			e.printStackTrace();
			LanguageListVO vo = new LanguageListVO();
			vo.setResult(TranslateResultVO.FAILURE);
			vo.setInfo(e.getMessage());
			return vo;
		}
		if(service == null) {
			//如果没有用插件自定义，那么默认从appliclation.properties中取设置的
			service  = Service.getService();
		}
		
		String serverName = StringUtil.subString(service.getClass().getPackage().getName(), "cn.zvo.translate.service.", null);
		Language lang = new Language(serverName);
		
		return lang.getLanguageList();
	}
	
	/**
	 * 执行翻译操作
	 * @param from 将什么语言进行转换。<required> 传入如 chinese_simplified 具体可传入有：
	 * 			<ul>
	 * 				<li>chinese_simplified : 简体中文</li>
	 * 				<li>chinese_traditional : 繁體中文</li>
	 * 				<li>english : English</li>
	 * 				<li>更多参见：<a href="language.json.html" target="_black">language.json</a></li>
	 * 			</ul>
	 * @param to 转换为什么语言输出。<required> 传入如 english 具体可传入有：
	 * 			<ul>
	 * 				<li>chinese_simplified : 简体中文</li>
	 * 				<li>chinese_traditional : 繁體中文</li>
	 * 				<li>english : English</li>
	 * 				<li>更多参见：<a href="language.json.html" target="_black">language.json</a></li>
	 * 			</ul>
	 * @param text 转换的语言json数组，格式如 ["你好","探索星辰大海"] <required> <example=[&quot;你好&quot;,&quot;探索星辰大海&quot;]>
	 * @return 翻译结果
	 * @author 管雷鸣
	 */
	@ResponseBody
	@RequestMapping(value="translate.json", method = RequestMethod.POST)
	public TranslateResultVO translate(HttpServletRequest request,
			@RequestParam(value = "from", defaultValue = "chinese_simplified") String from,
			@RequestParam(value = "to", defaultValue = "english") String to,
			@RequestParam(value = "text", defaultValue = "") String text){
		TranslateResultVO vo = new TranslateResultVO();
//		vo.setFrom(from);
//		vo.setTo(to);
		//long start = DateUtil.timeForUnix13();
		
		//过滤换行符,如果有的话
		Pattern p = Pattern.compile("\r|\n");
		Matcher m = p.matcher(text);
		if(m.find()) {
			text = m.replaceAll("");
		}
		
		
		if(text == null || text.length() == 0) {
			vo.setBaseVO(BaseVO.FAILURE, "请传入 text 值");
			return vo;
		}
		if(to.length() < 1) {
			vo.setBaseVO(BaseVO.FAILURE, "请传入要翻译的语种");
			return vo;
		}
		//过滤掉回车换行，避免转数组时、以及hash化等出现异常
		text = text.replaceAll("\r|\n", " ");
		
		JSONArray textArray = null;
		try {
			textArray = JSONArray.fromObject(text);
		} catch (Exception e) {
			//e.printStackTrace();
			//Log.info("text : "+text);
			vo.setBaseVO(BaseVO.FAILURE, "序列化失败！text 字段传入的翻译文本格式异常！text字段传入格式请参考： http://api.zvo.cn/translate/service/20230807/translate.json.html  当前传入的为："+text);
			return vo;
		}
		
		
		//统计翻译字数
		int size = 0;
		for (int i = 0; i < textArray.size(); i++) {
			Object obj = textArray.get(i);
			if(obj == null) {
				continue;
			}
			if (!(obj instanceof String)) {
				//System.out.println("obj not string:" +obj);
				continue;
			}
			
			size = size + ((String)obj).length();
		}
		
		//Log.debug("tongji : "+(DateUtil.timeForUnix13()-start));
		
		//来源，是哪个网页在使用
//		String referer = request.getHeader("referer"); 
		//取这个来源网页的domain
		String domain = RequestUtil.getRefererDomain(request);
		
		/***** 翻译之前，插件拦截 *****/
		try {
			TranslateResultVO beforeVO = TranslateManage.before(request, from, to, textArray, size, domain);
			if(beforeVO != null) {
				if(beforeVO.getResult() - TranslateResultVO.FAILURE == 0) {
					return beforeVO;
				}else {
					vo = beforeVO;
				}
			}
		} catch (InstantiationException | IllegalAccessException | NoSuchMethodException | SecurityException
				| IllegalArgumentException | InvocationTargetException e) {
			e.printStackTrace();
			vo.setResult(TranslateResultVO.FAILURE);
			vo.setInfo(e.getMessage());
			return vo;
		}
		//Log.debug("beforeVO : "+(DateUtil.timeForUnix13()-start));
		
		//日志
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("domain", domain);
		params.put("time", DateUtil.currentDate("yyyy-MM-dd HH:mm:ss"));
		params.put("method", "translate.json");
		params.put("size", size);
		params.put("referer", request.getHeader("referer"));
		
		//先从缓存中取
		String hash = null;
		try {
			BaseVO md5VO = MD5Util.stringToMD5(from+"_"+to+"_"+text);
			if(md5VO.getResult() - BaseVO.FAILURE == 0) {
				Log.info("text hash 化异常: "+vo.getInfo());
				vo.setResult(TranslateResultVO.FAILURE);
				vo.setInfo("text hash 化异常:"+vo.getInfo());
				return vo;
			}
			
			hash = md5VO.getInfo(); 
		} catch (Exception e) {
			e.printStackTrace();
			Log.info("text hash 化异常: "+text);
			vo.setResult(TranslateResultVO.FAILURE);
			vo.setInfo("text hash 化异常:"+e.getMessage());
			return vo;
		}
		
//		vo = CacheUtil.get(hash, to);
		JSONArray cacheTextArray = CacheUtil.get(hash, to);
		cacheTextArray = null;
		if(cacheTextArray == null) {
			//缓存中没有，那么从api中取
			
			ServiceInterface service = null; 
			/***** 翻译时，插件拦截，获取使用什么翻译 *****/
			try {
				service = TranslateManage.getServiceInterface(request);
			} catch (InstantiationException | IllegalAccessException | NoSuchMethodException | SecurityException
					| IllegalArgumentException | InvocationTargetException e) {
				e.printStackTrace();
				vo.setResult(TranslateResultVO.FAILURE);
				vo.setInfo(e.getMessage());
				return vo;
			}
			//Log.debug("getServiceInterface : "+(DateUtil.timeForUnix13()-start));
			if(service == null) {
				//如果没有用插件自定义，那么默认从appliclation.properties中取设置的
				service = Service.getService();
			}
			//com.xnx3.Log.debug("service:"+service.getClass().getName());
			
//			String service_from = service.
			String serverName = StringUtil.subString(service.getClass().getPackage().getName(), "cn.zvo.translate.service.", null);
//			System.out.println("serverName:"+serverName);
			Language lang = new Language(serverName);
			
			//取翻译语言 - 原本的语言
			BaseVO fromVO = lang.currentToService(from);
			if(fromVO.getResult() - BaseVO.FAILURE == 0) {
				vo.setBaseVO(BaseVO.FAILURE, "from params error : "+fromVO.getInfo());
				return vo;
			}
			//取翻译语言 - 翻译的目标的语言
			BaseVO toVO = lang.currentToService(to);
			if(toVO.getResult() - BaseVO.FAILURE == 0) {
				vo.setBaseVO(BaseVO.FAILURE, "to params error : "+toVO.getInfo());
				return vo;
			}
			
			vo = service.api(fromVO.getInfo(), toVO.getInfo(), textArray);
			if(vo.getResult() - TranslateResultVO.SUCCESS == 0) {
				vo.setInfo("SUCCESS");
			}
			//Log.debug("service.api : "+(DateUtil.timeForUnix13()-start));
			params.put("source", "api");  //翻译来源-API翻译接口
			
			if(vo.getResult() - TranslateResultVO.FAILURE == 0) {
				//失败了，返回失败提示
				
				//记录失败
				params.put("service", service.getClass().getName());
				params.put("info", vo.getInfo());
				params.put("status", "ServiceFailure"); //翻译失败
				LogUtil.add(params); //记录日志
				return vo;
			}
			/***** 翻译成功 ****/
			
			//取出来后加入缓存
			CacheUtil.set(hash, to, vo.getText());
		}else {
			vo.setText(cacheTextArray);
			params.put("source", "cache"); //翻译来源-缓存
		}
		
		params.put("cache", hash+"_"+to+"_.txt");	
		params.put("to", to);
		LogUtil.add(params);
		

		/***** 翻译之后，插件拦截 *****/
		try {
			TranslateResultVO afterVO = TranslateManage.after(request, from, to, textArray, size, domain, cacheTextArray!=null, vo.getText());
			if(afterVO != null) {
				if(afterVO.getResult() - TranslateResultVO.FAILURE == 0) {
					return afterVO;
				}else {
					vo = afterVO;
				}
			}
		} catch (InstantiationException | IllegalAccessException | NoSuchMethodException | SecurityException
				| IllegalArgumentException | InvocationTargetException e) {
			e.printStackTrace();
			vo.setResult(TranslateResultVO.FAILURE);
			vo.setInfo(e.getMessage());
			return vo;
		}
		//Log.debug("afterVO : "+(DateUtil.timeForUnix13()-start));
		
		vo.setFrom(from);
		vo.setTo(to);
		return vo;
	}
	
	public static void main(String[] args) throws IOException {
		String text = "12346";
		String hash = com.xnx3.MD5Util.MD5(text);
				
    	System.out.println(hash);
        
	}
}
