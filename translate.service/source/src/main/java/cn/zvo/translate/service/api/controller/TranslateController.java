package cn.zvo.translate.service.api.controller;

import java.io.IOException;
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
import com.xnx3.MD5Util;
import cn.zvo.log.framework.springboot.LogUtil;
import cn.zvo.translate.service.core.util.CacheUtil;
import cn.zvo.translate.tcdn.core.service.Language;
import cn.zvo.translate.tcdn.core.service.Service;
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
		return Language.getLanguageList();
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
		vo.setFrom(from);
		vo.setTo(to);
		
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
		
		JSONArray textArray = JSONArray.fromObject(text);
		
		//统计翻译字数
		int size = 0;
		for (int i = 0; i < textArray.size(); i++) {
			Object obj = textArray.get(i);
			if(obj != null) {
				size = size + ((String)obj).length();
			}
		}
		
		
		//日志
		String referer = request.getHeader("referer"); 
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("referer", referer);
		params.put("time", DateUtil.currentDate("yyyy-MM-dd HH:mm:ss"));
		params.put("method", "translate.json");
		params.put("size", size);
		
		//先从缓存中取
		String hash = MD5Util.MD5(from+"_"+to+"_"+text);
		vo = CacheUtil.get(hash, to);
		if(vo == null) {
			//缓存中没有，那么从api中取
			vo = Service.getService().api(Language.currentToService(from).getInfo(), Language.currentToService(to).getInfo(), textArray);
			vo.setFrom(from);
			vo.setTo(to);
			if(vo.getResult() - TranslateResultVO.SUCCESS == 0) {
				vo.setInfo("SUCCESS");
			}
			
			params.put("source", "api");  //翻译来源-API翻译接口
			
			//取出来后加入缓存
			CacheUtil.set(hash, to, vo);
		}else {
			params.put("source", "cache"); //翻译来源-缓存
		}
		
		LogUtil.add(params);
		return vo;
	}
	
	public static void main(String[] args) throws IOException {
		String text = "12346";
		String hash = com.xnx3.MD5Util.MD5(text);
				
    	System.out.println(hash);
        
	}
}