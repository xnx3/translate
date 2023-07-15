package cn.zvo.translate.service.huawei;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import cn.zvo.http.Http;
import cn.zvo.http.Response;
import cn.zvo.translate.service.core.util.JSONUtil;
import cn.zvo.translate.tcdn.core.service.Language;
import cn.zvo.translate.tcdn.core.service.ServiceInterface;
import cn.zvo.translate.tcdn.core.vo.TranslateResultVO;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
/**
 * 对接华为云翻译提供的翻译服务
 * @author 管雷鸣
 *
 */
public class ServiceInterfaceImplement implements ServiceInterface{
	static Http http; //http请求工具类，使用参考 https://github.com/xnx3/http.java
	static {
		http = new Http();
	}
	// 获取token请求地址
	private static final String TOKEN_API_URL = "https://iam.myhuaweicloud.com/v3/auth/tokens?nocatalog=true";
	// 文本翻译请求地址
	private static final String TRANS_API_URL = "https://nlp-ext.cn-north-4.myhuaweicloud.com/v1/07cca648b08025d52f8fc00a2dc61e61/machine-translation/text-translation";
	
	//通过 https://console.huaweicloud.com/nlp/#/nlp/call-guide/call-api 获取
	//用户名
	private String username;
	//账户名
	private String domainname;
	// 用户密码
	private String password;
	//需与NLP服务终端节点中的区域保持一致 比如这里填写 cn-north-4
	private String projectname;

	public ServiceInterfaceImplement(Map<String, String> config) {
		this.username = config.get("username");
		this.domainname = config.get("domainname");
		this.password = config.get("password");
		this.projectname = config.get("projectname");
	}


	public static void main(String[] args) {

		Map<String, String> config = new HashMap<String, String>();
		config.put("username", "hw5xxxxxx");
		config.put("domainname", "hw5xxxxxx");
		config.put("password", "xxxxxxxx");
		config.put("projectname", "cn-north-4");

		ServiceInterfaceImplement service = new ServiceInterfaceImplement(config);
		service.setLanguage();

		JSONArray array = new JSONArray();
		array.add("你好");
		array.add("世界");

		TranslateResultVO vo = service.api("zh", "en", array);
		System.out.println(vo);
	}

	@Override
	public TranslateResultVO api(String from, String to, JSONArray array) {
		TranslateResultVO vo = new TranslateResultVO();
		vo.setText(new JSONArray());
		from = "auto";
		
		List<JSONArray> list = JSONUtil.split(array, 2000); //长度不能超过2000字符，所以针对2000进行截取
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
		Language.append("chinese_simplified", "zh", "简体中文");
		Language.append("chinese_traditional", "zh-tw", "繁體中文");
		Language.append("english", "en", "English");
		Language.append("korean", "ko", "한어");
		Language.append("arabic", "ar", "بالعربية");	//阿拉伯语
		Language.append("german", "de", "Deutsch");	//德语
		Language.append("french", "fr", "Français");	//法语
		Language.append("portuguese", "pt", "Português");	//葡萄牙语
		Language.append("japanese", "ja", "日本語");	//日语
		Language.append("thai", "th", "ภาษาไทย");	//泰语
		Language.append("turkish", "tr", "Türkçe");	//土耳其语
		Language.append("spanish", "es", "Español");	//西班牙语
		Language.append("vietnamese", "vi", "Tiếng Việt");	//越南语
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
		//System.out.println(sourceText);
		//System.out.println(sourceText.length());

		//header
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "application/json;charset=utf8");

		JSONObject authObject = new JSONObject();
		JSONObject identityObject = new JSONObject();
		JSONArray pwdArray = new JSONArray();
		pwdArray.add("password");
		identityObject.put("methods", pwdArray);
		JSONObject passwordObject = new JSONObject();
		JSONObject userJsonObject = new JSONObject();
		// IAM用户所属帐号名
		JSONObject nameObject = new JSONObject();
		nameObject.put("name", this.username);

		userJsonObject.put("domain", nameObject);
		userJsonObject.put("name", this.domainname);
		userJsonObject.put("password", this.password);
		passwordObject.put("user", userJsonObject);
		identityObject.put("password", passwordObject);
		authObject.put("identity", identityObject);

		JSONObject scopeObject = new JSONObject();
		JSONObject pnameObject = new JSONObject();
		pnameObject.put("name", this.projectname);
		scopeObject.put("project", pnameObject);
		authObject.put("scope", scopeObject);

		JSONObject bodyObject = new JSONObject();
		bodyObject.put("auth", authObject);
		String sqlString = bodyObject.toString();

		try {
			// 获取token
			Response response = http.post(TOKEN_API_URL,sqlString , headers);
			if(response.getCode() == 201) {
				Map<String, List<String>> headerFields = response.getHeaderFields();
				String token = headerFields.get("X-Subject-Token").get(0);
				if (token == null) {
					vo.setBaseVO(TranslateResultVO.FAILURE, "获取token失败");
				}
				
				
				//TODO 方法① 文本翻译
				URL url = new URL(TRANS_API_URL);
				HttpURLConnection connection = (HttpURLConnection) url.openConnection();
				connection.setRequestMethod("POST");
				connection.setDoInput(true);
				connection.setDoOutput(true);
				connection.addRequestProperty("Content-Type", "application/json");
				connection.addRequestProperty("X-Auth-Token", token);

				//输入参数
				JSONObject resBody = new JSONObject();
				resBody.put("text", sourceText);
				resBody.put("from", from);
				resBody.put("to", to);
				String body = resBody.toString();

				OutputStreamWriter osw = new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
				osw.append(body);
				osw.flush();
				InputStream is = connection.getInputStream();
				BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
				
				while (br.ready()) {
					JSONObject fromObject = JSONObject.fromObject(br.readLine());
					String string = fromObject.getString("translated_text");
					//System.out.println(string);
					// 中文逗号转成英文的
//							String text = string.replace("，", ",").replace(" ", "");
					String[] texts = string.split("\n");

					vo.setText(JSONArray.fromObject(texts));
					vo.setFrom(from);
					vo.setTo(to);
					vo.setBaseVO(TranslateResultVO.SUCCESS, "SUCCESS");
				}
				if (is != null ) {
					is.close();
				}
				
				
				
				
				
				
//						//TODO 方法② 文本翻译
//						JSONObject resBody = new JSONObject();
//						resBody.put("text", sourceText);
//						resBody.put("from", from);
//						resBody.put("to", to);
//						String body = resBody.toString();
//						
//						System.err.println("string   "+body);
//						
//						// 添加token
//						headers.put("X-Auth-Token", token);
//						headers.put("Content-Type", "application/json");
//						
//						
//						Response fanyiResponse = http.post(TRANS_API_URL, body , headers);
//						JSONObject result = JSONObject.fromObject(fanyiResponse.getContent());
//
//						System.err.println("result   "+result);
//						
//						if (fanyiResponse.getCode() == 200) {
//							if(result == null) {
//								//接口响应出现了错误码
//								vo.setBaseVO(TranslateResultVO.FAILURE, response.getContent());
//							}else {
//								//成功
////								Object resultArray = result.getJSONArray("translated_text");
////								vo.setText((JSONArray)resultArray);
//								vo.setFrom(from);
//								vo.setTo(to);
//								vo.setBaseVO(TranslateResultVO.SUCCESS, "SUCCESS");
//							}
//						}else {
//							//http没有正常响应
//							vo.setBaseVO(TranslateResultVO.FAILURE, "http response code : " + fanyiResponse.getCode()+", content: "+ fanyiResponse.getContent());
//						}
				
				
				
				
				
				
				
			}else {
				// 获取token-http没有正常响应
				vo.setBaseVO(TranslateResultVO.FAILURE, "http response code : " + response.getCode()+", content: "+ response.getContent());
			}
		} catch (IOException e) {
			e.printStackTrace();
			vo.setBaseVO(TranslateResultVO.FAILURE, e.getMessage());
		}
		
		return vo;
	}
}
