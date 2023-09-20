package cn.zvo.translate.tcdn.generate;

import cn.zvo.log.framework.springboot.LogUtil;

/**
 * 日志
 * @author 管雷鸣
 *
 */
public class Log {
	
	public static cn.zvo.log.Log log;
	
	static {
		log = LogUtil.log.clone();
		log.setCacheMaxNumber(0); //时时提交
		log.setTable("task");
		
	}
	
}
