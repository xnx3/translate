package cn.zvo.translate.tcdn.admin.generateCache;

import java.util.List;

import org.springframework.stereotype.Component;
import com.xnx3.j2ee.generateCache.BaseGenerate;

import cn.zvo.translate.tcdn.admin.util.DomainLanguageUtil;
import cn.zvo.translate.tcdn.core.service.Language;
import cn.zvo.translate.tcdn.core.vo.LanguageListVO;
import cn.zvo.translate.tcdn.core.vo.bean.LanguageBean;

/**
 * 站点相关
 * @author 管雷鸣
 */
@Component
public class Site extends BaseGenerate {
	public Site() {
		language();
	}
	
	public void language(){
		createCacheObject("language");
		
//		LanguageListVO vo = Language.getLanguageList();
//		for (int i = 0; i < vo.getList().size(); i++) {
//			LanguageBean bean = vo.getList().get(i);
//			cacheAdd(bean.getId(), bean.getName());
//		}
		
		List<LanguageBean> list = DomainLanguageUtil.generateDomain();
		for (int i = 0; i < list.size(); i++) {
			LanguageBean bean = list.get(i);
			cacheAdd(bean.getId(), bean.getName());
		}
		generateCacheFile();
	}
}
