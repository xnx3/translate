package cn.zvo.translate.service.google;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import com.xnx3.StringUtil;
import cn.zvo.http.Http;
import cn.zvo.http.Response;
import net.sf.json.JSONArray;

/**
 * 用到的相关工具类
 * @author 管雷鸣
 *
 */
public class Util {
	public static Http http;
	static {
		http = new Http();
	}
	
	public static Response trans(String url, String payload, String userAgent, String acceptLanguage, String contentLength) throws IOException {
		if(userAgent == null || userAgent.length() == 0) {
			userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36";
		}
		
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "application/x-www-form-urlencoded");
		headers.put("User-Agent", userAgent);
		if(acceptLanguage != null && acceptLanguage.length() > 0) {
			headers.put("Accept-Language", acceptLanguage);
		}else {
			headers.put("Accept-Language", "zh-CN,zh;q=0.9");
		}
		headers.put("Connection", "keep-alive");
		if(contentLength != null && contentLength.length() > 0) {
			headers.put("Content-Length", contentLength);
		}else {
			headers.put("Content-Length", payload.length()+"");
		}
		headers.put("Accept", "*/*");
		
    	Response res = http.post(url, payload, headers);
		return res;
	}
	
	/**
	 * <p>从翻译结果中取b标签的内容</p>
	 * 谷歌翻译后，如果句子有点长，会被拆分为这样 
	 * <textarea><i>没有？</i> <b>No?</b><i>点此立即注册一个域名</i><b>Click here to register a domain name now</b></textarea>
	 * 此时需要将i全删除掉，将b标签隐藏掉，只返回b标签内的翻译好的结果
	 * @param text 包含i、b标签的翻译结果
	 * @return 只取b标签中的结果返回
	 */
	public static String resultFindBTagText(String text) {
		if(text == null || text.length() == 0) {
			return "";
		}
		
		while(text.indexOf("<i>") > -1 && text.indexOf("</i>") > -1) {
			text = StringUtil.subStringReplace(text, "<i>", "</i>", "");
		}
		
		text = text.replaceAll("<b>", "");
		text = text.replaceAll("</b>", "");
		return text;
	}
	
	
	/**
	 * 对翻译的结果进行优化替换，将不合适的替换掉
	 * @param res
	 * @return
	 */
	public static Response responseReplace(Response res) {
		if(res.getCode() == 200) {
    		boolean update = false; //是否改动了，如果true改动了，需要后面向res中更新
    		JSONArray array = JSONArray.fromObject(res.getContent());
    		
    		//遍历 i标签的问题
    		for (int i = 0; i < array.size(); i++) {
				if(array.getString(i).indexOf("<i>") > -1) {
					//存在i标签，过滤
					array.set(i, resultFindBTagText(array.getString(i)));
					update = true;
				}
			}
    		
    		//遍历 &#39; 的问题
    		for (int i = 0; i < array.size(); i++) {
				if(array.getString(i).indexOf("&#39;") > -1) {
					//存在，过滤，将其替换
					String text = array.getString(i);
					text = text.replaceAll("&#39;", "'");
					array.set(i, text);
					
					update = true;
				}
			}
    		
    		//遍历 &amp; 的问题
    		for (int i = 0; i < array.size(); i++) {
				if(array.getString(i).indexOf("&amp;") > -1) {
					//存在，过滤，将其替换
					String text = array.getString(i);
					text = text.replaceAll("&amp;", "&");
					array.set(i, text);
					
					update = true;
				}
			}
    		
    		if(update) {
    			//重新序列化赋予response
    			res.content = array.toString();
    		}
    		
    	}
		
		return res;
	}
	
	public static void main(String[] args) throws IOException {
		String url = "https://api.translate.zvo.cn/translate_a/t?anno=3&client=te&format=html&v=1.0&key&logld=vTE_20200210_00&sl=zh-CN&tl=en&sp=nmt&tc=1&sr=1&tk=&mode=1";
		String payload = "q=%E4%BD%A0%E5%A5%BD&q=%E5%93%88%E5%96%BD";
		System.out.println(trans(url, payload, null, null, null).getContent());
		
	}
}
