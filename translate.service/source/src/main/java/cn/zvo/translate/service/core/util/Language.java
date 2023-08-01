package cn.zvo.translate.service.core.util;


import cn.zvo.translate.service.core.LanguageEnum;

/**
 * 当前翻译支持的语种
 * @author 管雷鸣
 *
 */
public class Language extends cn.zvo.translate.tcdn.core.service.Language {
	
	/**
	 * 追加支持的语种
	 * @param languageEnum 语种的枚举
	 * @param serviceId 对应翻译平台的语种标识，比如谷歌翻译、小牛翻译 这个枚举语种在具体翻译平台中的标识，比如中文是 zh ，英文是 en
	 */
	public static void append(LanguageEnum languageEnum, String serviceId) {
		append(languageEnum.id, serviceId, languageEnum.name);
	}

}
