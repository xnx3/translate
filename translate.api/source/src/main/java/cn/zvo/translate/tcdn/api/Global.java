package cn.zvo.translate.tcdn.api;

import com.xnx3.SystemUtil;

public class Global {
	//项目所在路径，如 F:\jingzhunyingxiao
	public static String projectPath;
	static {
		projectPath = SystemUtil.getCurrentDir();
		//isIDE = Global.class.getResource("/").getPath().indexOf("/target/classes/") > -1;
	}
}
