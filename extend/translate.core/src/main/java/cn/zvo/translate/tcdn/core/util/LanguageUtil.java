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
	
	
	public static void main(String[] args) {
		System.out.println(getLanguageMap());
		
	}
	
}
