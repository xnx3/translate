package cn.zvo.translate.tcdn.api.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.xnx3.BaseVO;
import com.xnx3.UrlUtil;
import com.xnx3.j2ee.util.ConsoleUtil;

import cn.zvo.translate.tcdn.api.util.ChromeUtil;
import cn.zvo.translate.tcdn.api.util.TranslateUtil;

/**
 * html翻译能力
 * @author 管雷鸣
 */
@Controller
@RequestMapping("/")
public class ApiController{
	
//	static String currentExecuteUrl = ""; //当前正在执行的url
	
	/**
	 * 对指定网页url进行翻译
	 * @param url 翻译的目标url <example=https://www.leimingyun.com/index.html> <required>
	 * @param dynamic 对翻译后的结果页面是否加入js动态翻译代码？这个会追加到你html源码的末尾，可对页面中的ajax请求数据进行翻译。
	 * 			<p>取值：
	 * 				<ul>
	 * 					<li>true:加入</li>
	 * 					<li>false:不加入</li>
	 * 				</ul>
	 * 			</p>
	 * @param language 目标语言 <example=english> <required>
	 * @param executeJs 在执行页面翻译的操作时，额外执行的js。这个只是在翻译的过程中进行执行，影响的是输出的翻译结果
	 * @author 管雷鸣
	 */
	@RequestMapping(value="api", method = RequestMethod.POST)
	@ResponseBody
	public String translateApi(
			@RequestParam(value = "url", defaultValue = "") String url,
			@RequestParam(value = "dynamic", defaultValue = "false") String dynamic,
			@RequestParam(value = "language", defaultValue = "english") String language,
			@RequestParam(value = "executeJs", defaultValue = "") String executeJs,
			HttpServletRequest request, HttpServletResponse response
			) throws InterruptedException{
		response.setHeader("Access-Control-Allow-Origin", "*");
		
		if(url.length() < 3) {
			response.setStatus(200);
			return "请传入url";
		}
		
		ConsoleUtil.debug("url："+url);
		String sourceDomain = UrlUtil.getDomain(url);
		ConsoleUtil.debug("sourceDomain："+sourceDomain);
		BaseVO vo = TranslateUtil.trans(sourceDomain, null, url, dynamic, language,executeJs, request);
		if(vo.getResult() - BaseVO.FAILURE == 0) {
			response.setStatus(500);
			return vo.getInfo();
		}else {
			response.setStatus(200);
			String html = vo.getInfo();
			return html;
		}
		
	}
	
}
