package cn.zvo.translate.tcdn.admin.vo;

import com.xnx3.j2ee.system.responseBody.ResponseBodyManage;
import com.xnx3.j2ee.vo.BaseVO;

import cn.zvo.translate.tcdn.core.entity.TranslateSiteSet;

/**
 * 翻译站点的相关设置 详情
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@ResponseBodyManage(ignoreField = {}, nullSetDefaultValue = true)
public class TranslateSiteSetVO extends BaseVO {
	private TranslateSiteSet translateSiteSet;	// 翻译站点的相关设置
	
	public TranslateSiteSet getTranslateSiteSet() {
		return translateSiteSet;
	}
	public void setTranslateSiteSet(TranslateSiteSet translateSiteSet) {
		this.translateSiteSet = translateSiteSet;
	}
	
	@Override
	public String toString() {
		return "TranslateSiteSetVO [translateSiteSet=" + translateSiteSet + "]";
	}
	
}
