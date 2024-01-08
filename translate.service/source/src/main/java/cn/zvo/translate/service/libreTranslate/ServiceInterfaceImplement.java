package cn.zvo.translate.service.libreTranslate;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import cn.zvo.http.Http;
import cn.zvo.http.Response;
import cn.zvo.translate.service.core.util.JSONUtil;
import cn.zvo.translate.tcdn.core.LanguageEnum;
import cn.zvo.translate.tcdn.core.service.Language;
import cn.zvo.translate.tcdn.core.service.ServiceInterface;
import cn.zvo.translate.tcdn.core.vo.TranslateResultVO;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 对接LibreTranslate翻译提供的翻译服务
 * @author 管雷鸣
 *
 */
public class ServiceInterfaceImplement implements ServiceInterface{
	static Http http; //http请求工具类，使用参考 https://github.com/xnx3/http.java
	static {
		http = new Http();
	}
	private String domain = "http://127.0.0.1:5353/"; //格式如 http://192.168.31.29:5353/  部署 LibreTranslate 的域名
	
	/**
	 * 初始化
	 * @param config 如果不传入 domain，默认是本地 http://127.0.0.1:5353/
	 */
	public ServiceInterfaceImplement(Map<String, String> config) {
		if(config == null) {
			return;
		}
		if(config.get("domain") == null) {
			return;
		}
		this.domain = config.get("domain");
	}


	public static void main(String[] args) {

		Map<String, String> config = new HashMap<String, String>();
		config.put("domain", "http://192.168.31.29:5353/");
		ServiceInterfaceImplement service = new ServiceInterfaceImplement(config);
		service.setLanguage();

		JSONArray array = new JSONArray();
		array.add("翻译");
		array.add("你好世界");

		TranslateResultVO vo = service.api("zh", "en", array);
		System.out.println(vo);
	}

	@Override
	public TranslateResultVO api(String from, String to, JSONArray array) {
		TranslateResultVO vo = new TranslateResultVO();
		vo.setText(new JSONArray());
		
		List<JSONArray> list = JSONUtil.split(array, 2000); //长度不能超过2000字符，所以针对2000进行截取
		for (int i = 0; i < list.size(); i++) {
			TranslateResultVO vf = requestApi(from, to, list.get(i));
			if(vf.getResult() - TranslateResultVO.FAILURE == 0) {
				return vf;
			}
//			System.out.println(i+", "+vf.toString());
			
			vo.getText().addAll(vf.getText());
		}
		
		vo.setFrom(from);
		vo.setTo(to);
		return vo;
	}

	@Override
	public void setLanguage() {
//		if(Language.map.get("niutrans") != null) {
//			return;
//		}
		
		Language lang = new Language("libreTranslate");
		/*
		 * 向语种列表中追加支持的语种，以下注意只需要改第二个参数为对接的翻译服务中，人家的api语种标识即可
		 */
		lang.append(LanguageEnum.CHINESE_SIMPLIFIED, "zh");	
		lang.append(LanguageEnum.CHINESE_TRADITIONAL, "zt");
		lang.append(LanguageEnum.ENGLISH, "en");
		lang.append(LanguageEnum.ALBANIAN, "sq");
		lang.append(LanguageEnum.ARABIC, "ar");
		lang.append(LanguageEnum.AZERBAIJANI, "az");
		lang.append(LanguageEnum.BENGALI, "bn");
		lang.append(LanguageEnum.BULGARIAN, "bg");
		lang.append(LanguageEnum.CATALAN, "ca");
		lang.append(LanguageEnum.CZECH, "cs");
		lang.append(LanguageEnum.DANISH, "da");
		lang.append(LanguageEnum.DUTCH, "nl");
		lang.append(LanguageEnum.ESPERANTO, "eo");
		lang.append(LanguageEnum.ESTONIAN, "et");
		lang.append(LanguageEnum.FINNISH, "fi");
		lang.append(LanguageEnum.FRENCH, "fr");
		lang.append(LanguageEnum.DEUTSCH, "de");
		lang.append(LanguageEnum.GREEK, "el");
		lang.append(LanguageEnum.HEBREW, "he");
		lang.append(LanguageEnum.HINDI, "hi");
		lang.append(LanguageEnum.HUNGARIAN, "hu");
		lang.append(LanguageEnum.INDONESIAN, "id");
		lang.append(LanguageEnum.IRISH, "ga");
		lang.append(LanguageEnum.ITALIAN, "it");
		lang.append(LanguageEnum.JAPANESE, "ja");
		lang.append(LanguageEnum.KOREAN, "ko");
		lang.append(LanguageEnum.LATVIAN, "lv");
		lang.append(LanguageEnum.LITHUANIAN, "lt");
		lang.append(LanguageEnum.MALAY, "ms");
		lang.append(LanguageEnum.NORWEGIAN, "nb");
		lang.append(LanguageEnum.PERSIAN, "fa");
		lang.append(LanguageEnum.POLISH, "pl");
		lang.append(LanguageEnum.PORTUGUESE, "pt");
		lang.append(LanguageEnum.ROMANIAN, "ro");
		lang.append(LanguageEnum.RUSSIAN, "ru");
		lang.append(LanguageEnum.SLOVAK, "sk");
		lang.append(LanguageEnum.SLOVENE, "sl");
		lang.append(LanguageEnum.SPANISH, "es");
		lang.append(LanguageEnum.SWEDISH, "sv");
		lang.append(LanguageEnum.TAGALOG, "tl");
		lang.append(LanguageEnum.THAI, "th");
		lang.append(LanguageEnum.TURKISH, "tr");
		lang.append(LanguageEnum.UKRAINIAN, "uk");
	}
	

	private TranslateResultVO requestApi(String from, String to, JSONArray array) {
		TranslateResultVO vo = new TranslateResultVO();
		
		//要翻译的原字符串
		StringBuffer payload = new StringBuffer();
		payload.append(array.get(0));
		if (array.size() > 1) {
			for (int i = 1; i < array.size(); i++) {
				payload.append("\n" + array.get(i));
			}
		}
		String sourceText = payload.toString();
		
		try {
			Map<String, String> params = new HashMap<String, String>();
			params.put("target", to);
			params.put("source", from);
			params.put("q", payload.toString());
			params.put("format", "text");
			params.put("api_key", "");
			
			Map<String, String> header = new HashMap<String, String>();
			header.put("accept", "application/json");
			header.put("Content-Type", "application/x-www-form-urlencoded");
			
			Response response = http.post(domain+"translate",params,header);
//			Response response = http.post("http://192.168.31.29:5353/translate",params,header);
			
			
			if (response.getCode() == 200) {
				String content = response.getContent();
				JSONObject fromObject = JSONObject.fromObject(content);
				if (fromObject.get("translatedText") != null) {
					String string = fromObject.getString("translatedText");
					String[] texts = string.split("\n");
					vo.setFrom(from);
					vo.setTo(to);
					vo.setText(JSONArray.fromObject(texts));
					vo.setBaseVO(TranslateResultVO.SUCCESS, "SUCCESS");
				}else {
					vo.setBaseVO(TranslateResultVO.FAILURE, "error : " + fromObject.getString("error"));
				}
			}else {
				vo.setBaseVO(TranslateResultVO.FAILURE, "http code:"+response.getCode()+", content:"+response.getContent());
			}

		} catch (IOException e) {
			e.printStackTrace();
			vo.setBaseVO(TranslateResultVO.FAILURE, e.getMessage());
		}
		
		return vo;
	}
}
