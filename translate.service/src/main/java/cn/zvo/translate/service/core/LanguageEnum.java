package cn.zvo.translate.service.core;

/**
 * 网站管理后台的左侧菜单项的id唯一标示
 * @author 管雷鸣
 *
 */
public enum LanguageEnum {
	ENGLISH("english", "English"),
	CHINESE_SIMPLIFIED("chinese_simplified", "简体中文"),
	CHINESE_TRADITIONAL("chinese_traditional", "繁體中文"),
	KOREAN("korean", "한어"); //韩语
//	JAPANESE("japanese", "しろうと"), //日语
//	RUSSIAN("russian","Русский язык");	//俄语
//	
	
	public final String id;		//语言名，如 english、chinese_simplified、chinese_traditional
	public final String name;		//文字说明，如 english、简体中文、繁体中文
	
	private LanguageEnum(String id, String name) { 
		this.name = name;
		this.id = id;
	}
	
	public static void main(String[] args) {

		LanguageEnum[] languages = LanguageEnum.values();
        for (int i = 0; i < languages.length; i++) {
        	System.out.println(languages[i].id +" - "+languages[i].name);
        }
		
	}
}
