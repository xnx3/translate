package cn.zvo.translate.tcdn.admin.vo;

import com.xnx3.j2ee.system.responseBody.ResponseBodyManage;
import com.xnx3.j2ee.vo.BaseVO;

import cn.zvo.translate.tcdn.core.entity.TranslateSiteDomain;

/**
 * 翻译站点绑定域名相关 详情
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@ResponseBodyManage(ignoreField = {}, nullSetDefaultValue = true)
public class TranslateSiteDomainVO extends BaseVO {
	private TranslateSiteDomain translateSiteDomain;	// 翻译站点绑定域名相关
	
	public TranslateSiteDomain getTranslateSiteDomain() {
		return translateSiteDomain;
	}
	public void setTranslateSiteDomain(TranslateSiteDomain translateSiteDomain) {
		this.translateSiteDomain = translateSiteDomain;
	}
	
	@Override
	public String toString() {
		return "TranslateSiteDomainVO [translateSiteDomain=" + translateSiteDomain + "]";
	}
	
}
