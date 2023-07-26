package cn.zvo.translate.service.google;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.xnx3.DateUtil;

import cn.zvo.http.Http;
import cn.zvo.http.Response;
import cn.zvo.translate.service.core.util.StringUtil;
import cn.zvo.translate.tcdn.core.service.Language;
import cn.zvo.translate.tcdn.core.service.ServiceInterface;
import cn.zvo.translate.tcdn.core.vo.TranslateResultVO;
import net.sf.json.JSONArray;

/**
 * 谷歌翻译接口的对接
 * @author 管雷鸣
 *
 */
public class ServiceInterfaceImplement implements ServiceInterface{
	static Http http;
	static {
		http = new Http();
		http.setEncode(Http.UTF8);	
	}
	
	public static void main(String[] args) {
		ServiceInterfaceImplement service = new ServiceInterfaceImplement();
		service.setLanguage();
		
		JSONArray array = new JSONArray();
		array.add("你好");
		array.add("世界");
		
		TranslateResultVO vo = service.api("zh-CN", "en", array);
		System.out.println(vo);
	}
	
	@Override
	public TranslateResultVO api(String from, String to, JSONArray array) {
		TranslateResultVO vo = new TranslateResultVO();
//		from = Language.currentToService(from).getInfo();
//		to = Language.currentToService(to).getInfo();
		
		String domain = "translate.googleapis.com";
//		domain = "api.translate.zvo.cn";	//本地调试用
		String url = "https://"+domain+"/translate_a/t?anno=3&client=te_lib&format=html&v=1.0&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&logld=vTE_"+DateUtil.currentDate("yyyyMMdd")+"&sl="+from+"&tl="+to+"&sp=nmt&tc=1&ctt=1&sr=1&tk=&mode=1";
		//System.out.println(url);
//		JSONArray array = JSONArray.fromObject(text);
		StringBuffer payload = new StringBuffer();
		for (int i = 0; i < array.size(); i++) {
			if(i > 0) {
				payload.append("&");
			}
//			if(from.equalsIgnoreCase(LanguageEnum.CHINESE_SIMPLIFIED.id) || from.equalsIgnoreCase(LanguageEnum.CHINESE_TRADITIONAL.id)) {
//				//简体中文、繁体中文时要用url编码
				payload.append("q="+StringUtil.stringToUrl(array.getString(i)));
//			}else {
//				payload.append("q="+array.getString(i));
//			}
		}
		//System.out.println(payload);
		Response res = null;
		try {
			res = trans(url, payload.toString(), null, null, null);
			if(res.getCode() == 200) {
				//成功
				
				vo.setResult(TranslateResultVO.SUCCESS);
				vo.setInfo("SUCCESS");
				vo.setText(JSONArray.fromObject(res.getContent()));
				
				//对结果中不合适的地方进行替换
				vo = responseReplace(vo);
			}else {
				vo.setResult(TranslateResultVO.SUCCESS);
				vo.setInfo("translate service response error , http code : "+res.getCode());
				vo.setText(array);
			}
		} catch (IOException e) {
			e.printStackTrace();
			vo.setResult(TranslateResultVO.SUCCESS);
			vo.setInfo("translate service response error");
			vo.setText(array);
		}
		
		return vo;
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
	 * 对翻译的结果进行优化替换，将不合适的替换掉
	 * @param vo
	 * @return
	 */
	public static TranslateResultVO responseReplace(TranslateResultVO vo) {
		if(vo.getResult() - TranslateResultVO.SUCCESS == 0 && vo.getText() != null) {
			
    		boolean update = false; //是否改动了，如果true改动了，需要后面向res中更新
    		JSONArray array = vo.getText();
    		
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
    		
    		//遍历 &quot; 的问题
    		for (int i = 0; i < array.size(); i++) {
				if(array.getString(i).indexOf("&quot;") > -1) {
					//存在，过滤，将其替换
					String text = array.getString(i);
					text = text.replaceAll("&quot;", "\"");
					array.set(i, text);
					
					update = true;
				}
			}
    		
    		if(update) {
    			//重新赋予
    			vo.setText(array);
    		}
    		
    	}
		
		return vo;
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

	@Override
	public void setLanguage() {
		Language.append("english", "en", "English");
		Language.append("chinese_simplified", "zh-CN", "简体中文");
		Language.append("chinese_traditional", "zh-TW", "繁體中文");
		Language.append("korean", "ko", "한어");
		Language.append("japanese", "ja", "日本語");	//日语
		Language.append("russian", "ru", "Русский язык");
		Language.append("arabic", "ar", "بالعربية");	//阿拉伯语
		Language.append("german", "de", "Deutsch");	//德语
		Language.append("french", "fr", "Français");	//法语
		Language.append("portuguese", "pt", "Português");	//葡萄牙语
		Language.append("thai", "th", "ภาษาไทย");	//泰语
		Language.append("turkish", "tr", "Türkçe");	//土耳其语
		Language.append("vietnamese", "vi", "Tiếng Việt");	//越南语
	
		Language.append("afrikaans", "af", "Suid-Afrikaanse Dutch taal");	//南非荷兰语
		Language.append("twi", "ak", "tur");	//契维语
		Language.append("amharic", "am", "አማርኛ");	//阿姆哈拉语
		Language.append("assamese", "as", "অসমীয়া");	//阿萨姆语
		Language.append("aymara", "ay", "Aymara");	//艾马拉语
		Language.append("azerbaijani", "az", "Azərbaycan");	//阿塞拜疆语
		Language.append("belarusian", "be", "беларускі");	//白俄罗斯语
		Language.append("bulgarian", "bg", "български");	//保加利亚语
		Language.append("bhojpuri", "bho", "भोजपुरी");	//博杰普尔语
		Language.append("bambara", "bm", "Bamanankan");	//班巴拉语
		Language.append("bengali", "bn", "বাংলা");	//孟加拉语
		Language.append("bosnian", "bs", "bosanski");	//波斯尼亚语
		Language.append("catalan", "ca", "català");	//加泰罗尼亚语
		Language.append("cebuano", "ceb", "Cebuano");	//宿务语
		Language.append("kurdish_sorani", "ckb", "کوردی-سۆرانی");	//库尔德语（索拉尼）
		Language.append("corsican", "co", "Corsu");	//科西嘉语
		Language.append("czech", "cs", "čeština");	//捷克语
		Language.append("welsh", "cy", "Cymraeg");	//威尔士语
		Language.append("danish", "da", "dansk");	//丹麦语
		Language.append("dogrid", "doi", "डोग्रिड ने दी");	//多格来语
		Language.append("dhivehi", "dv", "ދިވެހި");	//迪维希语
		Language.append("ewe", "ee", "Eʋegbe");	//埃维语
		Language.append("greek", "el", "Ελληνικά");	//希腊语
		Language.append("spanish", "es", "español");	//西班牙语
		Language.append("estonian", "et", "eesti keel");	//爱沙尼亚语
		Language.append("basque", "eu", "euskara");	//巴斯克语
		Language.append("persian", "fa", "فارسی");	//波斯语
		Language.append("finnish", "fi", "Suomalainen");	//芬兰语
		Language.append("frisian", "fy", "Frysk");	//弗里西语
		Language.append("irish", "ga", "Gaeilge");	//爱尔兰语
		Language.append("scottish-gaelic", "gd", "Gàidhlig na h-Alba");	//苏格兰盖尔语
		Language.append("galician", "gl", "galego");	//加利西亚语
		Language.append("guarani", "gn", "guarani");	//瓜拉尼语
		Language.append("gongen", "gom", "गोंगेन हें नांव");	//贡根语
		Language.append("gujarati", "gu", "ગુજરાતી");	//古吉拉特语
		Language.append("hausa", "ha", "Hausa");	//豪萨语
		Language.append("hawaiian", "haw", "ʻŌlelo Hawaiʻi");	//夏威夷语
		Language.append("hindi", "hi", "हिंदी");	//印地语
		Language.append("hmong", "hmn", "Hmoob");	//苗语
		Language.append("croatian", "hr", "Hrvatski");	//克罗地亚语
		Language.append("haitian_creole", "ht", "Kreyòl ayisyen");	//海地克里奥尔语
		Language.append("hungarian", "hu", "Magyar");	//匈牙利语
		Language.append("armenian", "hy", "հայերեն");	//亚美尼亚语
		Language.append("dutch", "nl", "Nederlands");	//荷兰语
		Language.append("italian", "it", "Italiano");	//意大利语
		
		/*
		Language.append("", "id", "");	//印尼语
		Language.append("", "ig", "");	//伊博语
		Language.append("", "ilo", "");	//伊洛卡诺语
		Language.append("", "is", "");	//冰岛语
		
		Language.append("", "iw", "");	//希伯来语
		Language.append("", "jw", "");	//印尼爪哇语
		Language.append("", "ka", "");	//格鲁吉亚语
		Language.append("", "kk", "");	//哈萨克语
		Language.append("", "km", "");	//高棉语
		Language.append("", "kn", "");	//卡纳达语
		Language.append("", "kri", "");	//克里奥尔语
		Language.append("", "ku", "");	//库尔德语（库尔曼吉语）
		Language.append("", "ky", "");	//吉尔吉斯语
		Language.append("", "la", "");	//拉丁语
		Language.append("", "lb", "");	//卢森堡语
		Language.append("", "lg", "");	//卢干达语
		Language.append("", "ln", "");	//林格拉语
		Language.append("", "lo", "");	//老挝语
		Language.append("", "lt", "");	//立陶宛语
		Language.append("", "lus", "");	//米佐语
		Language.append("", "lv", "");	//拉脱维亚语
		Language.append("", "mai", "");	//迈蒂利语
		Language.append("", "mg", "");	//马尔加什语
		Language.append("", "mi", "");	//毛利语
		Language.append("", "mk", "");	//马其顿语
		Language.append("", "ml", "");	//马拉雅拉姆语
		Language.append("", "mn", "");	//蒙古语
		Language.append("", "mni-Mtei", "");	//梅泰语（曼尼普尔语）
		Language.append("", "mr", "");	//马拉地语
		Language.append("", "ms", "");	//马来语
		Language.append("", "mt", "");	//马耳他语
		Language.append("", "my", "");	//缅甸语
		Language.append("", "ne", "");	//尼泊尔语
		
		Language.append("", "no", "");	//挪威语
		Language.append("", "nso", "");	//塞佩蒂语
		Language.append("", "ny", "");	//齐切瓦语
		Language.append("", "om", "");	//奥罗莫语
		Language.append("", "or", "");	//奥利亚语
		Language.append("", "pa", "");	//旁遮普语
		Language.append("", "pl", "");	//波兰语
		Language.append("", "ps", "");	//普什图语
		Language.append("", "pt", "");	//葡萄牙语
		Language.append("", "qu", "");	//克丘亚语
		Language.append("", "ro", "");	//罗马尼亚语
		Language.append("", "rw", "");	//卢旺达语
		Language.append("", "sa", "");	//梵语
		Language.append("", "sd", "");	//信德语
		Language.append("", "si", "");	//僧伽罗语
		Language.append("", "sk", "");	//斯洛伐克语
		Language.append("", "sl", "");	//斯洛文尼亚语
		Language.append("", "sm", "");	//萨摩亚语
		Language.append("", "sn", "");	//修纳语
		Language.append("", "so", "");	//索马里语
		Language.append("", "sq", "");	//阿尔巴尼亚语
		Language.append("", "sr", "");	//塞尔维亚语
		Language.append("", "st", "");	//塞索托语
		Language.append("", "su", "");	//印尼巽他语
		Language.append("", "sv", "");	//瑞典语
		Language.append("", "sw", "");	//斯瓦希里语
		Language.append("", "ta", "");	//泰米尔语
		Language.append("", "te", "");	//泰卢固语
		Language.append("", "tg", "");	//塔吉克语
		Language.append("", "ti", "");	//蒂格尼亚语
		Language.append("", "tk", "");	//土库曼语
		Language.append("", "tl", "");	//菲律宾语
		Language.append("", "ts", "");	//宗加语
		Language.append("", "tt", "");	//鞑靼语
		Language.append("", "ug", "");	//维吾尔语
		Language.append("", "uk", "");	//乌克兰语
		Language.append("", "ur", "");	//乌尔都语
		Language.append("", "uz", "");	//乌兹别克语
		Language.append("", "xh", "");	//南非科萨语
		Language.append("", "yi", "");	//意第绪语
		Language.append("", "yo", "");	//约鲁巴语
		Language.append("", "zu", "");	//南非祖鲁语
		*/
	}
	
}
