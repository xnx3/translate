package cn.zvo.translate.service.niutrans;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.zvo.http.Https;
import cn.zvo.http.Response;
import cn.zvo.translate.service.core.LanguageEnum;
import cn.zvo.translate.service.core.util.JSONUtil;
import cn.zvo.translate.service.core.util.Language;
import cn.zvo.translate.tcdn.core.service.ServiceInterface;
import cn.zvo.translate.tcdn.core.vo.TranslateResultVO;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
/**
 * 对接小牛翻译提供的翻译服务
 * @author 管雷鸣
 *
 */
public class ServiceInterfaceImplement implements ServiceInterface{
	static Https https; //http请求工具类，使用参考 https://github.com/xnx3/http.java
	static {
		https = new Https();
	}
	// 文本翻译请求地址
	private static final String TRANS_API_URL = "https://api.niutrans.com/NiuTransServer/translation";
	
	
	// apikey  
	private String apikey;
	
	public ServiceInterfaceImplement(Map<String, String> config) {
		this.apikey = config.get("apikey");
	}
	

	public static void main(String[] args) {

		Map<String, String> config = new HashMap<String, String>();
		config.put("apikey", "1234");

		ServiceInterfaceImplement service = new ServiceInterfaceImplement(config);
		service.setLanguage();

		JSONArray array = new JSONArray();
		array.add("你好");
		array.add("世界");

		TranslateResultVO vo = service.api("zh", "en", array);
		System.out.println("vo === "+vo);
		
		
	}

	@Override
	public TranslateResultVO api(String from, String to, JSONArray array) {
		TranslateResultVO vo = new TranslateResultVO();
		vo.setText(new JSONArray());
		
		List<JSONArray> list = JSONUtil.split(array, 5000); //长度不能超过5000字符，所以针对5000进行截取
		for (int i = 0; i < list.size(); i++) {
			TranslateResultVO vf = requestApi(from, to, list.get(i));
			if(vf.getResult() - TranslateResultVO.FAILURE == 0) {
				return vf;
			}
//			System.out.println(i+", "+vf.toString());
			
			vo.getText().addAll(vf.getText());
		}
		
		return vo;
	}

	@Override
	public void setLanguage() {

		/*
		 * 向语种列表中追加支持的语种，以下注意只需要改第二个参数为对接的翻译服务中，人家的api语种标识即可
		 */
//		Language.append("chinese_simplified", "zh", "简体中文");
		Language.append(LanguageEnum.CHINESE_SIMPLIFIED, "zh");
		//Language.append("chinese_traditional", "cht", "繁體中文");
		Language.append(LanguageEnum.CHINESE_TRADITIONAL, "cht");
//		Language.append("english", "en", "English");
		Language.append(LanguageEnum.ENGLISH, "en");
//		Language.append("korean", "ko", "한어");
		Language.append(LanguageEnum.KOREAN, "ko");
//		Language.append("arabic", "ar", "بالعربية");	//阿拉伯语
//		Language.append("german", "de", "Deutsch");	//德语
//		Language.append("french", "fr", "Français");	//法语
//		Language.append("portuguese", "pt", "Português");	//葡萄牙语
//		Language.append("japanese", "ja", "日本語");	//日语
//		Language.append("thai", "th", "ภาษาไทย");	//泰语
//		Language.append("turkish", "tr", "Türkçe");	//土耳其语
//		Language.append("spanish", "es", "Español");	//西班牙语
//		Language.append("vietnamese", "vi", "Tiếng Việt");	//越南语
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
			String encode = URLEncoder.encode(sourceText,"utf-8");
			
			Map<String, String> params = new HashMap<String, String>();
			params.put("from", from);
			params.put("to", to);
			params.put("apikey", apikey);
			params.put("src_text", encode);
			params.put("source", "translate-js");
			
			Map<String, String> heardlers = new HashMap<String, String>();
			heardlers.put("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
			
			Response response = https.post(TRANS_API_URL,params,heardlers);
			
			
			if (response.getCode() == 200) {
				String content = response.getContent();
				JSONObject fromObject = JSONObject.fromObject(content);
				if (fromObject.get("tgt_text") != null) {
					String string = fromObject.getString("tgt_text");
					String[] texts = string.split("\n");

					vo.setText(JSONArray.fromObject(texts));
					vo.setFrom(from);
					vo.setTo(to);
					vo.setBaseVO(TranslateResultVO.SUCCESS, "SUCCESS");
				}else {
					vo.setBaseVO(TranslateResultVO.FAILURE, "http response code : " + fromObject.getString("error_code")+", content: "+ fromObject.getString("error_msg"));
				}
			}

		} catch (IOException e) {
			e.printStackTrace();
			vo.setBaseVO(TranslateResultVO.FAILURE, e.getMessage());
		}
		
		return vo;
	}
}
