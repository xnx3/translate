package cn.zvo.translate.service.edge;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import com.xnx3.CacheUtil;
import com.xnx3.Lang;

import cn.zvo.http.Http;
import cn.zvo.http.Response;
import cn.zvo.translate.tcdn.core.LanguageEnum;
import cn.zvo.translate.tcdn.core.service.Language;
import cn.zvo.translate.tcdn.core.service.ServiceInterface;
import cn.zvo.translate.tcdn.core.vo.TranslateResultVO;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 对接 microsoft edge 翻译提供的翻译服务
 * @author 管雷鸣
 *
 */
public class ServiceInterfaceImplement implements ServiceInterface{
	static Http http; //http请求工具类，使用参考 https://github.com/xnx3/http.java
	static {
		http = new Http();
	}
	private int authCacheTime = 30000; //auth授权码缓存的时间，多长时间刷新一次，默认 30000 为30秒
	
	/**
	 * 初始化
	 * @param config 如果不传入 authCacheTime，默认是30000
	 */
	public ServiceInterfaceImplement(Map<String, String> config) {
		if(config == null) {
			return;
		}
		if(config.get("domain") == null) {
			return;
		}
		String time = config.get("authCacheTime");
		this.authCacheTime = Lang.stringToInt(time, 30000);
	}


	public static void main(String[] args) {

		Map<String, String> config = new HashMap<String, String>();
		config.put("domain", "http://192.168.31.29:5353/");
		ServiceInterfaceImplement service = new ServiceInterfaceImplement(config);
		service.setLanguage();

		JSONArray array = new JSONArray();
		array.add("hello");
		array.add("File Not Found");

		TranslateResultVO vo = service.api("zh", "en", array);
		System.out.println(vo);
	}

	@Override
	public TranslateResultVO api(String from, String to, JSONArray array) {
		TranslateResultVO vo = new TranslateResultVO();
		vo.setText(new JSONArray());
		
		//要翻译的原字符串
		StringBuffer payload = new StringBuffer();
		if (array.size() > 0) {
			for (int i = 0; i < array.size(); i++) {
				if(i > 0) {
					payload.append(",");
				}
				payload.append("{\"Text\":\""+array.get(i)+"\"}");
			}
		}
		String sourceText = "["+payload.toString()+"]";
//		String sourceText = "[{\"Text\":\"Corsu\"},{\"Text\":\"guarani\"},{\"Text\":\"Kinyarwanda\"}]";
		
		try {
			Map<String, String> params = new HashMap<String, String>();
//			params.put("target", to);
//			params.put("source", from);
//			params.put("q", payload.toString());
//			params.put("format", "text");
//			params.put("api_key", "");
			
			Map<String, String> header = new HashMap<String, String>();
			header.put("Accept", "*/*");
			header.put("Content-Type", "application/json");
			header.put("Authorization", "Bearer "+gainAuth());
			
//			Response response = http.post("https://api-edge.cognitive.microsofttranslator.com/translate?from=en&to=zh-CHS&api-version=3.0&includeSentenceLength=true",params,header);
//			Response response = http.post("http://192.168.31.29:5353/translate",params,header);
			Response response = http.post("https://api-edge.cognitive.microsofttranslator.com/translate?from=en&to=zh-CHS&api-version=3.0&includeSentenceLength=true", sourceText, header);
			
			if (response.getCode() == 200) {
				String content = response.getContent();
				System.out.println(content);
				
				JSONArray resultArray = new JSONArray(); //翻译结果的存储
				JSONArray jsonArray = JSONArray.fromObject(content);
				for (int i = 0; i < jsonArray.size(); i++) {
					JSONObject transObj = jsonArray.getJSONObject(i);
					if(transObj.get("translations") == null) {
						resultArray.add("翻译异常，translate array is null");
						continue;
					}
					
					JSONArray itemArray = transObj.getJSONArray("translations");
					if(itemArray.size() < 1) {
						resultArray.add("翻译异常，itemArray size is 0");
						continue;
					}
					
					JSONObject item = itemArray.getJSONObject(0);
					Object obj = item.get("text");
					if(obj == null) {
						resultArray.add("翻译异常，item is null");
						continue;
					}
					
					resultArray.add((String)obj);
				}
				
				vo.setFrom(from);
				vo.setTo(to);
				vo.setText(resultArray);
				vo.setBaseVO(TranslateResultVO.SUCCESS, "SUCCESS");
			}else {
				vo.setBaseVO(TranslateResultVO.FAILURE, "http code:"+response.getCode()+", content:"+response.getContent());
			}

		} catch (IOException e) {
			e.printStackTrace();
			vo.setBaseVO(TranslateResultVO.FAILURE, e.getMessage());
		}
		
		vo.setFrom(from);
		vo.setTo(to);
		return vo;
	}

	@Override
	public void setLanguage() {
		Language lang = new Language("edge");
		/*
		 * 向语种列表中追加支持的语种，以下注意只需要改第二个参数为对接的翻译服务中，人家的api语种标识即可
   		 * ʻŌleloHawaiʻi
		 * भोजपुरी
		 * беларускі
		 * tur
		 * অসমীয়া
		 * galego
		 * डोग्रिड ने दी
		 * Hmoob
		 * ދިވެހި
		 * کوردیسۆرانی
		 * euskara	
		 */
		lang.append(LanguageEnum.CHINESE_SIMPLIFIED, "zh-CHS");	 //简体中文
		lang.append(LanguageEnum.CHINESE_TRADITIONAL, "zh-CHT"); //繁体中文
		lang.append(LanguageEnum.ENGLISH, "en"); //英文
		lang.append(LanguageEnum.ALBANIAN, "sq"); //阿尔巴尼亚语
		lang.append(LanguageEnum.ARABIC, "ar"); //阿拉伯语
		lang.append(LanguageEnum.AMHARIC, "am"); //阿姆哈拉语
		lang.append(LanguageEnum.AZERBAIJANI, "az"); //阿塞拜疆语
		lang.append(LanguageEnum.IRISH, "ga"); //爱尔兰语
		lang.append(LanguageEnum.ESTONIAN, "et"); //爱沙尼亚语
		lang.append(LanguageEnum.ORIYA, "or"); //奥里亚语
		lang.append(LanguageEnum.BULGARIAN, "bg"); //保加利亚语
		lang.append(LanguageEnum.ICELANDIC, "is"); //冰岛语
		lang.append(LanguageEnum.POLISH, "pl"); //波兰语
		lang.append(LanguageEnum.BOSNIAN, "bs-Latn"); //波斯尼亚语（拉丁文）
		lang.append(LanguageEnum.PERSIAN, "fa"); //波斯语
		lang.append(LanguageEnum.DANISH, "da"); //丹麦语
		lang.append(LanguageEnum.DEUTSCH, "de"); //德语
		lang.append(LanguageEnum.RUSSIAN, "ru"); //俄语
		lang.append(LanguageEnum.FRENCH, "fr"); //法语
		lang.append(LanguageEnum.FILIPINO, "fil"); //菲律宾语
		lang.append(LanguageEnum.FINNISH, "fi"); //芬兰语
		lang.append(LanguageEnum.KHMER, "km"); //高棉语
		lang.append(LanguageEnum.GUJARATI, "gu"); //古吉拉特语
		lang.append(LanguageEnum.HAITIAN_CREOLE, "ht"); //海地克里奥尔语
		lang.append(LanguageEnum.KOREAN, "ko"); //韩语
		lang.append(LanguageEnum.DUTCH, "nl"); //荷兰语
		lang.append(LanguageEnum.CATALAN, "ca"); //加泰罗尼亚语
		lang.append(LanguageEnum.CZECH, "cs"); //捷克语
		lang.append(LanguageEnum.KANNADA, "kn"); //卡纳达语
		lang.append(LanguageEnum.CROATIAN, "hr"); //克罗地亚语
		lang.append(LanguageEnum.KURDISH, "ku"); //库尔德语
		lang.append(LanguageEnum.LATVIAN, "lv"); //拉脱维亚语
		lang.append(LanguageEnum.LAO, "lo"); //老挝语
		lang.append(LanguageEnum.LITHUANIAN, "lt"); //立陶宛语
		lang.append(LanguageEnum.ROMANIAN, "ro"); //罗马尼亚语
		lang.append(LanguageEnum.MALTESE, "mt"); //马耳他语
		lang.append(LanguageEnum.MARATHI, "mr"); //马拉地语
		lang.append(LanguageEnum.MALAGASY, "mg"); //马拉加斯语
		lang.append(LanguageEnum.MALAYALAM, "ml"); //马拉雅拉姆语
		lang.append(LanguageEnum.MALAY, "ms"); //马来语
		lang.append(LanguageEnum.MAORI, "mi"); //毛利语
		lang.append(LanguageEnum.BENGALI, "bn"); //孟加拉语
		lang.append(LanguageEnum.BURMESE, "my"); //缅甸语
		lang.append(LanguageEnum.AFRIKAANS, "af"); //南非荷兰语
		lang.append(LanguageEnum.NEPALI, "ne"); //尼泊尔语
		lang.append(LanguageEnum.NORWEGIAN, "no"); //挪威语
		lang.append(LanguageEnum.PUNJABI, "pa"); //旁遮普语
		lang.append(LanguageEnum.PORTUGUESE, "pt"); //葡萄牙语
		lang.append(LanguageEnum.PASHTO, "ps"); //普什图语
		lang.append(LanguageEnum.JAPANESE, "ja"); //日语
		lang.append(LanguageEnum.SWEDISH, "sv"); //瑞典语
		lang.append(LanguageEnum.SAMOAN, "sm"); //萨摩亚语
		lang.append(LanguageEnum.SERBIA, "sr-Latn"); //塞尔维亚语
		lang.append(LanguageEnum.SLOVAK, "sk"); //斯洛伐克语
		lang.append(LanguageEnum.SLOVENE, "sl"); //斯洛文尼亚语
		lang.append(LanguageEnum.SWAHILI, "sw"); //斯瓦希里语
		lang.append(LanguageEnum.TELUGU, "te"); //泰卢固语
		lang.append(LanguageEnum.TAMIL, "ta"); //泰米尔语
		lang.append(LanguageEnum.THAI, "th"); //泰语
		lang.append(LanguageEnum.TONGAN, "to"); //汤加语
		lang.append(LanguageEnum.TURKISH, "tr"); //土耳其语
		lang.append(LanguageEnum.WELSH, "cy"); //威尔士语
		lang.append(LanguageEnum.URDU, "ur"); //乌尔都语
		lang.append(LanguageEnum.UKRAINIAN, "uk"); //乌克兰语
		lang.append(LanguageEnum.SPANISH, "es"); //西班牙语
		lang.append(LanguageEnum.HEBREW, "he"); //希伯来语
		lang.append(LanguageEnum.GREEK, "el"); //希腊语
		lang.append(LanguageEnum.HUNGARIAN, "hu"); //匈牙利语
		lang.append(LanguageEnum.ARMENIAN, "hy"); //亚美尼亚语
		lang.append(LanguageEnum.ITALIAN, "it"); //意大利语
		lang.append(LanguageEnum.INUKTITUT, "iu"); //因纽特语
		lang.append(LanguageEnum.HINDI, "hi"); //印地语
		lang.append(LanguageEnum.INDONESIAN, "id"); //印度尼西亚语
		lang.append(LanguageEnum.VIETNAMESE, "vi"); //越南语
	}
	
	public String gainAuth() {
		String key = "edge:auth";
		Object authObj = CacheUtil.get(key);
		
		if(authObj == null) {
			try {
				Response res = http.get("https://edge.microsoft.com/translate/auth");
				if(res.code != 200) {
					return "";
				}
				
				CacheUtil.set(key, res.getContent(), 30000); // 有效期半分钟
				return res.getContent();
			} catch (IOException e) {
				e.printStackTrace();
				return e.getMessage();
			}
		}else {
			return (String)authObj;
		}
		
		
//		DelayCycleExecuteUtil delay = new DelayCycleExecuteUtil(new DelayCycleExecute() {
//			@Override
//			public void success() {
//				
//			}
//			
//			@Override
//			public void failure() {
//				
//			}
//			
//			@Override
//			public boolean executeProcedures(int i) {
//				try {
//					Response res = http.get("https://edge.microsoft.com/translate/auth");
//					if(res.code != 200) {
//						return false;
//					}
//					
//					auth = res.getContent();
//					return true;
//				} catch (IOException e) {
//					e.printStackTrace();
//				}
//				
//				return false;
//			}
//		});
//		delay.setSleepArray(new int[]{0,1000,3000,5000});
//		delay.start();
	}

}
