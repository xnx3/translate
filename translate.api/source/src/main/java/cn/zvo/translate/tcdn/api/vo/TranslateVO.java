package cn.zvo.translate.tcdn.api.vo;

import com.xnx3.BaseVO;

public class TranslateVO extends BaseVO implements java.io.Serializable{
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
