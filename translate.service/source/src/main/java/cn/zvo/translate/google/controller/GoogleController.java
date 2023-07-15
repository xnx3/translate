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
		String payload = getRequestData(request);
		if(payload == null || payload.length() == 0) {
			return "翻译的内容为空";
		}
		
		//日志
		String referer = request.getHeader("referer"); 
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("referer", referer);
		LogUtil.add(params);
		
		//先从缓存中取
		String text = payload;
		String hash = MD5Util.MD5(text);
		String from = request.getParameter("sl");
		String to = request.getParameter("tl");
		TranslateResultVO vo = CacheUtil.get(hash, to);
//		Response res = CacheUtil.get(hash, to);
		if(vo == null) {
			vo = new TranslateResultVO();
			//缓存中没有，那么从api中取
			
			String url = "https://translate.googleapis.com/translate_a/t?"+request.getQueryString();
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Content-Type", "application/x-www-form-urlencoded");
			headers.put("User-Agent", request.getHeader("user-agent"));
			headers.put("Accept-Language", request.getHeader("accept-language"));
			headers.put("Connection", "keep-alive");
			headers.put("Content-Length", request.getHeader("content-length"));
			headers.put("Accept", "*/*");
			Response res = Util.trans(url, payload, request.getHeader("user-agent"), request.getHeader("accept-language"), request.getHeader("content-length"));
			if(res.getCode() > 199 && res.getCode() < 600) {
			}else {
				res = new Response();
				res.code = 0;
				res.content = "code:"+res.getCode()+", content:"+res.getContent();
			}
			
			//组合vo
			vo.setResult(res.code > 0? TranslateResultVO.SUCCESS:TranslateResultVO.FAILURE);
			vo.setInfo(res.getContent());
			vo.setFrom(from);
			vo.setTo(to);
			vo.setText(JSONArray.fromObject(res.getContent()));
			
			//加入缓存
			CacheUtil.set(hash, to, vo);
		}
		
		return vo.getText().toString();
	}
	
	
	//l接口返回的语言列表
	public static final String languages = "({\"sl\":{\"auto\":\"检测语言\",\"sq\":\"阿尔巴尼亚语\",\"ar\":\"阿拉伯语\",\"am\":\"阿姆哈拉语\",\"as\":\"阿萨姆语\",\"az\":\"阿塞拜疆语\",\"ee\":\"埃维语\",\"ay\":\"艾马拉语\",\"ga\":\"爱尔兰语\",\"et\":\"爱沙尼亚语\",\"or\":\"奥利亚语\",\"om\":\"奥罗莫语\",\"eu\":\"巴斯克语\",\"be\":\"白俄罗斯语\",\"bm\":\"班巴拉语\",\"bg\":\"保加利亚语\",\"is\":\"冰岛语\",\"pl\":\"波兰语\",\"bs\":\"波斯尼亚语\",\"fa\":\"波斯语\",\"bho\":\"博杰普尔语\",\"af\":\"布尔语(南非荷兰语)\",\"tt\":\"鞑靼语\",\"da\":\"丹麦语\",\"de\":\"德语\",\"dv\":\"迪维希语\",\"ti\":\"蒂格尼亚语\",\"doi\":\"多格来语\",\"ru\":\"俄语\",\"fr\":\"法语\",\"sa\":\"梵语\",\"tl\":\"菲律宾语\",\"fi\":\"芬兰语\",\"fy\":\"弗里西语\",\"km\":\"高棉语\",\"ka\":\"格鲁吉亚语\",\"gom\":\"贡根语\",\"gu\":\"古吉拉特语\",\"gn\":\"瓜拉尼语\",\"kk\":\"哈萨克语\",\"ht\":\"海地克里奥尔语\",\"ko\":\"韩语\",\"ha\":\"豪萨语\",\"nl\":\"荷兰语\",\"ky\":\"吉尔吉斯语\",\"gl\":\"加利西亚语\",\"ca\":\"加泰罗尼亚语\",\"cs\":\"捷克语\",\"kn\":\"卡纳达语\",\"co\":\"科西嘉语\",\"kri\":\"克里奥尔语\",\"hr\":\"克罗地亚语\",\"qu\":\"克丘亚语\",\"ku\":\"库尔德语（库尔曼吉语）\",\"ckb\":\"库尔德语（索拉尼）\",\"la\":\"拉丁语\",\"lv\":\"拉脱维亚语\",\"lo\":\"老挝语\",\"lt\":\"立陶宛语\",\"ln\":\"林格拉语\",\"lg\":\"卢干达语\",\"lb\":\"卢森堡语\",\"rw\":\"卢旺达语\",\"ro\":\"罗马尼亚语\",\"mg\":\"马尔加什语\",\"mt\":\"马耳他语\",\"mr\":\"马拉地语\",\"ml\":\"马拉雅拉姆语\",\"ms\":\"马来语\",\"mk\":\"马其顿语\",\"mai\":\"迈蒂利语\",\"mi\":\"毛利语\",\"mni-Mtei\":\"梅泰语（曼尼普尔语）\",\"mn\":\"蒙古语\",\"bn\":\"孟加拉语\",\"lus\":\"米佐语\",\"my\":\"缅甸语\",\"hmn\":\"苗语\",\"xh\":\"南非科萨语\",\"zu\":\"南非祖鲁语\",\"ne\":\"尼泊尔语\",\"no\":\"挪威语\",\"pa\":\"旁遮普语\",\"pt\":\"葡萄牙语\",\"ps\":\"普什图语\",\"ny\":\"齐切瓦语\",\"ak\":\"契维语\",\"ja\":\"日语\",\"sv\":\"瑞典语\",\"sm\":\"萨摩亚语\",\"sr\":\"塞尔维亚语\",\"nso\":\"塞佩蒂语\",\"st\":\"塞索托语\",\"si\":\"僧伽罗语\",\"eo\":\"世界语\",\"sk\":\"斯洛伐克语\",\"sl\":\"斯洛文尼亚语\",\"sw\":\"斯瓦希里语\",\"gd\":\"苏格兰盖尔语\",\"ceb\":\"宿务语\",\"so\":\"索马里语\",\"tg\":\"塔吉克语\",\"te\":\"泰卢固语\",\"ta\":\"泰米尔语\",\"th\":\"泰语\",\"tr\":\"土耳其语\",\"tk\":\"土库曼语\",\"cy\":\"威尔士语\",\"ug\":\"维吾尔语\",\"ur\":\"乌尔都语\",\"uk\":\"乌克兰语\",\"uz\":\"乌兹别克语\",\"es\":\"西班牙语\",\"iw\":\"希伯来语\",\"el\":\"希腊语\",\"haw\":\"夏威夷语\",\"sd\":\"信德语\",\"hu\":\"匈牙利语\",\"sn\":\"修纳语\",\"hy\":\"亚美尼亚语\",\"ig\":\"伊博语\",\"ilo\":\"伊洛卡诺语\",\"it\":\"意大利语\",\"yi\":\"意第绪语\",\"hi\":\"印地语\",\"su\":\"印尼巽他语\",\"id\":\"印尼语\",\"jw\":\"印尼爪哇语\",\"en\":\"英语\",\"yo\":\"约鲁巴语\",\"vi\":\"越南语\",\"zh-CN\":\"中文\",\"ts\":\"宗加语\"},\"tl\":{\"sq\":\"阿尔巴尼亚语\",\"ar\":\"阿拉伯语\",\"am\":\"阿姆哈拉语\",\"as\":\"阿萨姆语\",\"az\":\"阿塞拜疆语\",\"ee\":\"埃维语\",\"ay\":\"艾马拉语\",\"ga\":\"爱尔兰语\",\"et\":\"爱沙尼亚语\",\"or\":\"奥利亚语\",\"om\":\"奥罗莫语\",\"eu\":\"巴斯克语\",\"be\":\"白俄罗斯语\",\"bm\":\"班巴拉语\",\"bg\":\"保加利亚语\",\"is\":\"冰岛语\",\"pl\":\"波兰语\",\"bs\":\"波斯尼亚语\",\"fa\":\"波斯语\",\"bho\":\"博杰普尔语\",\"af\":\"布尔语(南非荷兰语)\",\"tt\":\"鞑靼语\",\"da\":\"丹麦语\",\"de\":\"德语\",\"dv\":\"迪维希语\",\"ti\":\"蒂格尼亚语\",\"doi\":\"多格来语\",\"ru\":\"俄语\",\"fr\":\"法语\",\"sa\":\"梵语\",\"tl\":\"菲律宾语\",\"fi\":\"芬兰语\",\"fy\":\"弗里西语\",\"km\":\"高棉语\",\"ka\":\"格鲁吉亚语\",\"gom\":\"贡根语\",\"gu\":\"古吉拉特语\",\"gn\":\"瓜拉尼语\",\"kk\":\"哈萨克语\",\"ht\":\"海地克里奥尔语\",\"ko\":\"韩语\",\"ha\":\"豪萨语\",\"nl\":\"荷兰语\",\"ky\":\"吉尔吉斯语\",\"gl\":\"加利西亚语\",\"ca\":\"加泰罗尼亚语\",\"cs\":\"捷克语\",\"kn\":\"卡纳达语\",\"co\":\"科西嘉语\",\"kri\":\"克里奥尔语\",\"hr\":\"克罗地亚语\",\"qu\":\"克丘亚语\",\"ku\":\"库尔德语（库尔曼吉语）\",\"ckb\":\"库尔德语（索拉尼）\",\"la\":\"拉丁语\",\"lv\":\"拉脱维亚语\",\"lo\":\"老挝语\",\"lt\":\"立陶宛语\",\"ln\":\"林格拉语\",\"lg\":\"卢干达语\",\"lb\":\"卢森堡语\",\"rw\":\"卢旺达语\",\"ro\":\"罗马尼亚语\",\"mg\":\"马尔加什语\",\"mt\":\"马耳他语\",\"mr\":\"马拉地语\",\"ml\":\"马拉雅拉姆语\",\"ms\":\"马来语\",\"mk\":\"马其顿语\",\"mai\":\"迈蒂利语\",\"mi\":\"毛利语\",\"mni-Mtei\":\"梅泰语（曼尼普尔语）\",\"mn\":\"蒙古语\",\"bn\":\"孟加拉语\",\"lus\":\"米佐语\",\"my\":\"缅甸语\",\"hmn\":\"苗语\",\"xh\":\"南非科萨语\",\"zu\":\"南非祖鲁语\",\"ne\":\"尼泊尔语\",\"no\":\"挪威语\",\"pa\":\"旁遮普语\",\"pt\":\"葡萄牙语\",\"ps\":\"普什图语\",\"ny\":\"齐切瓦语\",\"ak\":\"契维语\",\"ja\":\"日语\",\"sv\":\"瑞典语\",\"sm\":\"萨摩亚语\",\"sr\":\"塞尔维亚语\",\"nso\":\"塞佩蒂语\",\"st\":\"塞索托语\",\"si\":\"僧伽罗语\",\"eo\":\"世界语\",\"sk\":\"斯洛伐克语\",\"sl\":\"斯洛文尼亚语\",\"sw\":\"斯瓦希里语\",\"gd\":\"苏格兰盖尔语\",\"ceb\":\"宿务语\",\"so\":\"索马里语\",\"tg\":\"塔吉克语\",\"te\":\"泰卢固语\",\"ta\":\"泰米尔语\",\"th\":\"泰语\",\"tr\":\"土耳其语\",\"tk\":\"土库曼语\",\"cy\":\"威尔士语\",\"ug\":\"维吾尔语\",\"ur\":\"乌尔都语\",\"uk\":\"乌克兰语\",\"uz\":\"乌兹别克语\",\"es\":\"西班牙语\",\"iw\":\"希伯来语\",\"el\":\"希腊语\",\"haw\":\"夏威夷语\",\"sd\":\"信德语\",\"hu\":\"匈牙利语\",\"sn\":\"修纳语\",\"hy\":\"亚美尼亚语\",\"ig\":\"伊博语\",\"ilo\":\"伊洛卡诺语\",\"it\":\"意大利语\",\"yi\":\"意第绪语\",\"hi\":\"印地语\",\"su\":\"印尼巽他语\",\"id\":\"印尼语\",\"jw\":\"印尼爪哇语\",\"en\":\"英语\",\"yo\":\"约鲁巴语\",\"vi\":\"越南语\",\"zh-TW\":\"中文（繁体）\",\"zh-CN\":\"中文（简体）\",\"ts\":\"宗加语\"},\"al\":{}})";
	/**
	 * google翻译-打开页面初始化时拉取语言列表的接口
	 * @throws IOException 
	 */
	@ResponseBody
	@RequestMapping("/l")
	public String l(HttpServletRequest request, HttpServletResponse response) throws IOException{
		return request.getParameter("cb")+languages;
	}
	
	public String getRequestData(HttpServletRequest httpServletRequest){
		  HttpServletRequestWrapper httpServletRequestWrapper = new HttpServletRequestWrapper(httpServletRequest);
		  StringBuilder sb = new StringBuilder();
		  BufferedReader reader = null;
		  InputStreamReader inputStreamReader=null;
		  ServletInputStream servletInputStream =null;
		  try {
		   servletInputStream = httpServletRequestWrapper.getInputStream();
		   inputStreamReader=new InputStreamReader (servletInputStream, Charset.forName("UTF-8"));
		   reader = new BufferedReader(inputStreamReader);
		   String line = "";
		   while ((line = reader.readLine()) != null) {
		    sb.append(line);
		   }
		  } catch (IOException e) {
		   return "";
		  }finally {
		   try {
		    if(servletInputStream!=null){
		     servletInputStream.close();
		    }
		    if(inputStreamReader!=null){
		     inputStreamReader.close();
		    }
		    if(reader!=null){
		     reader.close();
		    }
		   } catch (IOException e) {    
		   }
		  }
		  return sb.toString ();
		 }
}
