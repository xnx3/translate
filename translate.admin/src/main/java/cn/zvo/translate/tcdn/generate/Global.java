package cn.zvo.translate.tcdn.generate;

import java.util.ArrayList;
import java.util.List;

import cn.zvo.translate.tcdn.generate.bean.SiteBean;

/**
 * 全局控制
 * @author 管雷鸣
 *
 */
public class Global {
	
	/**
	 * 任务列表
	 */
	public static List<SiteBean> taskList;
	static {
		taskList = new ArrayList<SiteBean>();
	}
	
	
}
