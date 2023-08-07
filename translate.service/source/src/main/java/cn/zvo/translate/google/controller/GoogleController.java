package cn.zvo.translate.google.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.xnx3.Log;
import com.xnx3.MD5Util;
import cn.zvo.http.Http;
import cn.zvo.http.Response;
import cn.zvo.log.framework.springboot.LogUtil;
import cn.zvo.translate.service.core.util.CacheUtil;
import cn.zvo.translate.service.google.Util;
import cn.zvo.translate.tcdn.core.vo.TranslateResultVO;
import net.sf.json.JSONArray;

/**
 * 
 * 对外开放的翻译接口.
 * translate v1 版本使用，v2版本已废弃
 * @author 管雷鸣
 * @deprecated
 *
 */
@Controller
@RequestMapping("/translate_a/")
public class GoogleController{
	public static Http http;
	static {
		http = new Http();
	}

	/**
	 * google翻译-执行翻译接口
	 * @throws IOException 
	 */
	@ResponseBody
	@RequestMapping("/t")
	public String t(HttpServletRequest request, HttpServletResponse response) throws IOException{
		return "提示：https://github.com/xnx3/translate 在 v2.5 版本之后，由于谷歌翻译调整，免费翻译通道不再支持，所以v1版本的翻译接口不再被支持。另外再2022年就已发布v2版本，在各方面都要优于v1！请切换到v2版本进行使用。当前已自动切换到v2版本。如果您使用中发现什么异常，请针对v2版本进行适配。详情请参考我们文档 http://translate.zvo.cn";
	}
	
}
