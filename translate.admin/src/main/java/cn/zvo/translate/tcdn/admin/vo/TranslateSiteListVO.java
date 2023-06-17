package cn.zvo.translate.tcdn.admin.vo;

import java.util.List;
import com.xnx3.j2ee.system.responseBody.ResponseBodyManage;
import com.xnx3.j2ee.util.Page;
import com.xnx3.j2ee.vo.BaseVO;
import cn.zvo.translate.tcdn.core.entity.TranslateSite;

/**
 * 翻译的站点 列表
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@ResponseBodyManage(ignoreField = {}, nullSetDefaultValue = true)
public class TranslateSiteListVO extends BaseVO {
	private List<TranslateSite> list;	// 翻译的站点
	private Page page;	// 分页
	
	public List<TranslateSite> getList() {
		return this.list;
	}
	public void setList(List<TranslateSite> list) {
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
		return "TranslateSiteListVO [list=" + list + ", page=" + page + "]";
	}
}
