package cn.zvo.translate.service.core;

import org.springframework.stereotype.Component;

import com.xnx3.version.VersionUtil;
import com.xnx3.version.VersionVO;

/**
 * 版本检测相关
 * @author 管雷鸣
 *
 */
@Component(value = "translateServiceVersion")
public class Version {
	
	//版本检测提醒
	public static final String VERSION = "2.2"; //当前版本
	static {
		VersionVO v = VersionUtil.cloudContrast("http://version.zvo.cn/translateService.html", VERSION);
		if(v.isFindNewVersion()) {
			System.out.println("find new version : "+v.getNewVersion()+", see : "+v.getPreviewUrl());
		}else {
			System.out.println("Currently is the latest version");
		}
	}
}
