package cn.zvo.translate.tcdn.admin.vo;

import java.util.List;
import com.xnx3.j2ee.system.responseBody.ResponseBodyManage;
import com.xnx3.j2ee.util.Page;
import com.xnx3.j2ee.vo.BaseVO;

import cn.zvo.translate.tcdn.core.entity.TranslateSiteSet;

/**
 * 翻译站点的相关设置 列表
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@ResponseBodyManage(ignoreField = {}, nullSetDefaultValue = true)
public class TranslateSiteSetListVO extends BaseVO {
	private List<TranslateSiteSet> list;	// 翻译站点的相关设置
	private Page page;	// 分页
	
	public List<TranslateSiteSet> getList() {
		return this.list;
	}
	public void setList(List<TranslateSiteSet> list) {
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
		return "TranslateSiteSetListVO [list=" + list + ", page=" + page + "]";
	}
}
