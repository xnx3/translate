package cn.zvo.translate.tcdn.admin.vo;

import java.util.List;
import com.xnx3.j2ee.system.responseBody.ResponseBodyManage;
import com.xnx3.j2ee.util.Page;
import com.xnx3.j2ee.vo.BaseVO;

import cn.zvo.translate.tcdn.core.entity.TranslateSiteDomain;

/**
 * 翻译站点绑定域名相关 列表
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@ResponseBodyManage(ignoreField = {}, nullSetDefaultValue = true)
public class TranslateSiteDomainListVO extends BaseVO {
	private List<TranslateSiteDomain> list;	// 翻译站点绑定域名相关
	private Page page;	// 分页
	
	public List<TranslateSiteDomain> getList() {
		return this.list;
	}
	public void setList(List<TranslateSiteDomain> list) {
		this.list = list;
	}
	public Page getPage() {
		return page;
	}
	public void setPage(Page page) {
		this.page = page;
	}
	
	@Override
	public String toString() {
		return "TranslateSiteDomainListVO [list=" + list + ", page=" + page + "]";
	}
}
