package cn.zvo.translate.tcdn.user.vo;

import com.xnx3.BaseVO;
import cn.zvo.translate.tcdn.core.entity.TranslateSiteDomain;

/**
 * 站点相关
 * @author 管雷鸣
 *
 */
public class SiteVO extends BaseVO {
	private String domain;  //当前访问的域名
	private TranslateSiteDomain translateSiteDomain; //当前访问的域名对应的设置
	private boolean bySession; //通过域名获取到的数据是否来源于session缓存. true是，false则从map判断的
	
	
	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public TranslateSiteDomain getTranslateSiteDomain() {
		return translateSiteDomain;
	}

	public void setTranslateSiteDomain(TranslateSiteDomain translateSiteDomain) {
		this.translateSiteDomain = translateSiteDomain;
	}

	public boolean isBySession() {
		return bySession;
	}

	public void setBySession(boolean bySession) {
		this.bySession = bySession;
	}

	@Override
	public String toString() {
		return "SiteVO [domain=" + domain + ", translateSiteDomain=" + translateSiteDomain + ", bySession=" + bySession
				+ ", getResult()=" + getResult() + ", getInfo()=" + getInfo() + "]";
	}

}
