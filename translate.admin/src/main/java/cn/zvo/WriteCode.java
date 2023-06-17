package cn.zvo;

import com.xnx3.writecode.template.wm.Code;

/**
 * 自动写代码，根据数据表写出实体类、controller、vo、jsp页面等
 * 详细使用可参考 https://gitee.com/mail_osc/writecode/tree/master/template-wm
 * 【注意，只支持Mysql数据库，暂不支持Sqlite】
 * @author 管雷鸣
 */
public class WriteCode {
	public static void main(String[] args) {
		Code code = new Code();
		code.setPackageName("com.xnx3.translate.mirrorimage");	//设置生成的entity、controller、vo等java类放到哪个包下
		code.setProjectUrlPath("/translate/mirrorimage/"); //设置url请求的路径
		code.write();	//执行
	}
}
