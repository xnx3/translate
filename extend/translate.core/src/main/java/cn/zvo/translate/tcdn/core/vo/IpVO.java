package cn.zvo.translate.tcdn.core.vo;

import com.xnx3.BaseVO;

/**
 * IP查询，根据用户ip获取这个用户属于哪个国家，然后判断出这个国家使用哪个语种
 * @author 管雷鸣
 *
 */
public class IpVO extends BaseVO{
	private String country;	//国家，如中国、美国
	private String language;	//语种，如 english 、chinese_simplified
	
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	@Override
	public String toString() {
		return "IpVO [country=" + country + ", language=" + language + "]";
	}
}
