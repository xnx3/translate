package cn.zvo.translate.tcdn.core.util;

import java.util.HashMap;
import java.util.Map;
import cn.zvo.translate.tcdn.core.LanguageEnum;

public class LanguageUtil {
	/*
	 * key 语种id，格式如 chinese_simplified ,全是小写的
	 * value 枚举类
	 */
	static Map<String, LanguageEnum> languageMap;
	public static Map<String, LanguageEnum> getLanguageMap(){
		if(languageMap == null) {
			languageMap = new HashMap<String, LanguageEnum>();
			
			for (LanguageEnum value : LanguageEnum.values()) {
	            //System.out.println(value);
	            languageMap.put(value.id.toLowerCase(), value);
	        }
			
		}
		return languageMap;
	}
	
	/**
	 * 对 languageId 进行处理，比如德语的id再 2023.11.08 进行更改过
	 * @param languageId 传入如 english ，枚举类中定义的语种的id，这个可以是很早之前枚举中的，但是后面废弃了的，这里做转换兼容
	 * @return 返回枚举类中定义的语种的id
	 */
	public static String languageIdHandle(String languageId) {
		if(languageId == null) {
			return null;
		}
		
		//德语的id更改过一次
		if(languageId.equalsIgnoreCase("german")) {
			languageId = "deutsch";
		}
		if(languageId.indexOf("-") > 0) {
			languageId = languageId.replaceAll("-", "_");
		}
		
		return languageId;
	}
	
	public static void main(String[] args) {
		System.out.println(languageIdHandle("english"));
		System.out.println(languageIdHandle("scottish-gaelic"));
		System.out.println(languageIdHandle("scottish_gaelic"));
		System.out.println(languageIdHandle("scottish-ga-e-lic"));
	}
	
}
