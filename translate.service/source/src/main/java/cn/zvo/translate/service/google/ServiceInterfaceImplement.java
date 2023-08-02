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
		
		Language.append("indonesian", "id", "IndonesiaName");	//印尼语
		Language.append("igbo", "ig", "igbo");	//伊博语
		Language.append("icelandic", "is", "ÍslandName");	//冰岛语
		Language.append("hebrew", "iw", "היברית");	//希伯来语
		Language.append("georgian", "ka", "ჯორჯიანიName");	//格鲁吉亚语
		Language.append("khmer", "km", "ខ្មែរKCharselect unicode block name");	//高棉语
		Language.append("kannada", "kn", "ಕನ್ನಡ್Name");	//卡纳达语
		Language.append("creole", "kri", "a n:n");	//克里奥尔语
		Language.append("kyrgyz", "ky", "Кыргыз тили");	//吉尔吉斯语
		Language.append("latin", "la", "Latina");	//拉丁语
		Language.append("luxembourgish", "lb", "LëtzebuergeschName");	//卢森堡语
		Language.append("luganda", "lg", "luganda");	//卢干达语
		Language.append("lao", "lo", "ກະຣຸນາ");	//老挝语
		Language.append("lithuanian", "lt", "Lietuva");	//立陶宛语
		Language.append("latvian", "lv", "latviešu");	//拉脱维亚语
		Language.append("maithili", "mai", "मरातिलीName");	//迈蒂利语
		Language.append("maori", "mi", "Maori");	//毛利语
		Language.append("macedonian", "mk", "Македонски");	//马其顿语
		Language.append("malayalam", "ml", "മലമാലം");	//马拉雅拉姆语
		Language.append("marathi", "mr", "मराठीName");	//马拉地语
		Language.append("malay", "ms", "Malay");	//马来语
		Language.append("maltese", "mt", "Malti");	//马耳他语
		Language.append("burmese", "my", "ဗာရမ်");	//缅甸语
		Language.append("nepali", "ne", "नेपालीName");	//尼泊尔语
		Language.append("norwegian", "no", "Norge");	//挪威语
		Language.append("nyanja", "ny", "potakuyan");	//齐切瓦语
		Language.append("oromo", "om", "adeta");	//奥罗莫语
		Language.append("punjabi", "pa", "ਪੰਜਾਬੀName");	//旁遮普语
		Language.append("polish", "pl", "Polski");	//波兰语
		Language.append("pashto", "ps", "پښتوName");	//普什图语
		Language.append("portuguese", "pt", "Português");	//葡萄牙语
		Language.append("quechua", "qu", "Quechua");	//克丘亚语
		Language.append("romanian", "ro", "Română");	//罗马尼亚语
		Language.append("kinyarwanda", "rw", "Kinyarwanda");	//卢旺达语
		Language.append("sanskrit", "sa", "Sanskrit");	//梵语
		Language.append("sindhi", "sd", "سنڌي");	//信德语
		Language.append("singapore", "si", "සිංගාපුර්");	//僧伽罗语
		Language.append("slovak", "sk", "Slovenská");	//斯洛伐克语
		Language.append("slovene", "sl", "slovenščina");	//斯洛文尼亚语
		Language.append("samoan", "sm", "lifiava");	//萨摩亚语
		Language.append("shona", "sn", "Shona");	//修纳语
		Language.append("somali", "so", "Soomaali");	//索马里语
		Language.append("albanian", "sq", "albanian");	//阿尔巴尼亚语
		Language.append("swedish", "sv", "Svenska");	//瑞典语
		Language.append("swahili", "sw", "Kiswahili");	//斯瓦希里语
		Language.append("tamil", "ta", "தாமில்");	//泰米尔语
		Language.append("telugu", "te", "తెలుగుQFontDatabase");	//泰卢固语
		Language.append("tajik", "tg", "ТаjikӣName");	//塔吉克语
		Language.append("turkmen", "tk", "Türkmençe");	//土库曼语
		Language.append("filipino", "tl", "Pilipino");	//菲律宾语
		Language.append("tatar", "tt", "Татар");	//鞑靼语
		Language.append("ukrainian", "uk", "УкраїнськаName");	//乌克兰语
		Language.append("urdu", "ur", "اوردو");	//乌尔都语
		Language.append("yiddish", "yi", "ייַדיש");	//意第绪语
		Language.append("yoruba", "yo", "Yoruba");	//约鲁巴语
		Language.append("kurdish", "ku", "Kurdî");	//库尔德语（库尔曼吉语）

		
		/*  不确定的几种进行注释
		 
		Language.append("Serbian", "sr", "Srpski@ item Spelling dictionary");	//TODO 塞尔维亚语   ---有（拉丁文）/（西里尔文） 此处用的第一种
		Language.append("Ilocano", "ilo", "Ilocano");	//TODO 伊洛卡诺语---百度搜不出该语种/谷歌只有 伊洛卡诺文
		Language.append("Oriya", "or", "OriyaName");	//TODO 奥利亚语---百度没有奥利亚语--》有奥里亚语
		Language.append("Xhosa language, South Africa", "xh", "Name");	//TODO 南非科萨语  ---百度有科萨语没有南非科萨语
		Language.append("South African Zulu", "zu", "isi-Ningizimu Afrika IsiZulu");	//TODO 南非祖鲁语  ---百度有祖鲁语没有南非祖鲁语
		Language.append("Uzbek", "uz", "");	//TODO 乌兹别克语--百度搜不出该语种
		Language.append("Javanese", "jw", "");	//TODO 印尼爪哇语---百度搜不出该语种/谷歌也没
		Language.append("Kazakh", "kk", "");	//TODO 哈萨克语---百度搜不出该语种
        	Language.append("Lingala", "ln", "");	//TODO 林格拉语---百度搜不出该语种/谷歌也无
        	Language.append("Malagasy", "mg", "");	//TODO 马尔加什语---百度搜不出该语种
		Language.append("Mongolian", "mn", "");	//TODO 蒙古语---百度搜不出该语种
		Language.append("Meitei", "mni-Mtei", "");	//TODO 梅泰语（曼尼普尔语）---百度搜不出该语种
		Language.append("Sepeti", "nso", "");	//TODO 塞佩蒂语---百度搜不出该语种
		Language.append("sesotho", "st", "");	//TODO 塞索托语---百度搜不出该语种
		Language.append("Sundanese", "su", "");	//TODO 印尼巽他语--百度搜不出该语种
		Language.append("Tigri", "ti", "");	//TODO 蒂格尼亚语--百度搜不出该语种
		Language.append("Uyghur", "ug", "");	//TODO 维吾尔语--百度搜不出该语种
		Language.append("Zongjia", "ts", "");	//TODO 宗加语-百度搜不出该语种
		Language.append("Mizo", "lus", "");	//TODO 米佐语---百度搜不出该语种
		
		*/
	}

}
