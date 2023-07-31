package cn.zvo.translate.service.core;

/**
 * 网站管理后台的左侧菜单项的id唯一标示
 * @author 管雷鸣
 *
 */
public enum LanguageEnum {
	ENGLISH("english", "English", "英语"),
	CHINESE_SIMPLIFIED("chinese_simplified", "简体中文", "简体中文"),
	CHINESE_TRADITIONAL("chinese_traditional", "繁體中文", "繁体中文"),
	KOREAN("korean", "한어", "韩语"),
	JAPANESE("japanese", "しろうと", "日语"),
	RUSSIAN("russian","Русский язык", "俄语"),
	ARABIC("arabic", "بالعربية", "阿拉伯语");
	
	
	/*
	 
	 	待补充
	 	内容参考
	 	https://gitee.com/mail_osc/translate/blob/master/translate.service/source/src/main/java/cn/zvo/translate/service/google/ServiceInterfaceImplement.java
	 	语种(语种Key)
	  
	 */
	
	
	
	
	
	
	
	
	public final String id;		//语言名，如 english、chinese_simplified、chinese_traditional
	public final String name;		//文字说明，对应语种的文字说明，如 english、简体中文、繁体中文、한어
	public final String chinese_name;	//中文的说明，以中文方式的语种说明
	
	private LanguageEnum(String id, String name, String chinese_name) { 
		this.name = name;
		this.id = id;
		this.chinese_name = chinese_name;
	}
	
	public static void main(String[] args) {

		LanguageEnum[] languages = LanguageEnum.values();
        for (int i = 0; i < languages.length; i++) {
        	System.out.println(languages[i].id +" - "+languages[i].name);
        }
		
	}
}
