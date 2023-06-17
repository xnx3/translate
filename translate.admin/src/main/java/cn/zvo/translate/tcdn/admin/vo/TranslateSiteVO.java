package cn.zvo.translate.tcdn.admin.vo;

import com.xnx3.j2ee.system.responseBody.ResponseBodyManage;
import com.xnx3.j2ee.vo.BaseVO;

import cn.zvo.translate.tcdn.core.entity.TranslateSite;

/**
 * 翻译的站点 详情
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@ResponseBodyManage(ignoreField = {}, nullSetDefaultValue = true)
public class TranslateSiteVO extends BaseVO {
	private TranslateSite translateSite;	// 翻译的站点
	
	public TranslateSite getTranslateSite() {
		return translateSite;
	}
	public void setTranslateSite(TranslateSite translateSite) {
		this.translateSite = translateSite;
	}
	
	@Override
	public String toString() {
		return "TranslateSiteVO [translateSite=" + translateSite + "]";
	}
	
}
