package cn.zvo.translate.tcdn.core.vo;

import com.xnx3.BaseVO;

import cn.zvo.translate.tcdn.core.util.TranslateApiRequestUtil;

/**
 * 调取 translate.api 接口进行请求的返回，服务于 {@link TranslateApiRequestUtil}
 * @author 管雷鸣
 *
 */
public class TranslateApiRequestVO extends BaseVO implements java.io.Serializable{
	private String localLanguage;	//取网页翻译前的本地语种，格式如 english

	public String getLocalLanguage() {
		return localLanguage;
	}

	public void setLocalLanguage(String localLanguage) {
		this.localLanguage = localLanguage;
	}

	@Override
	public String toString() {
		return "TranslateVO [localLanguage=" + localLanguage + ", getResult()=" + getResult() + ", getInfo()="
				+ getInfo() + "]";
	}
	
}
