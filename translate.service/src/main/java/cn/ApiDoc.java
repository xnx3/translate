package cn;

import com.xnx3.doc.JavaDoc;

/**
 * 自动扫描指定的包下所有controller的json接口，根据其标准的JAVADOC注释，生成接口文档。  
 * 使用参考 https://gitee.com/leimingyun/dashboard/wikis/leimingyun/wm/preview?sort_id=4518712&doc_id=1101390
 * @author 管雷鸣
 */
public class ApiDoc {
	public static void main(String[] args) {
		JavaDoc doc = new com.xnx3.doc.JavaDoc("cn.zvo.translate.api.controller");
//		doc.templatePath = "/Users/apple/Downloads/javadoc/";		//本地模板所在磁盘的路径
		doc.name = "translate.js 接口文档";				//文档的名字
		doc.domain = "https://api.translate.zvo.cn";				//文档中默认的接口请求域名
		doc.version = "2.20230104";						//当前做的软件系统的版本号
		doc.welcome = "适用于 treaslate.js v2.x 版本，配合 treaslate.js 一起使用，达到无需改动原本网页，两行js即可让网页具备多国语言翻译的能力。<br/>"
				+ "translage.js 开源仓库及使用说明参考： <a href=\"https://gitee.com/mail_osc/translate\" target=\"_black\">https://gitee.com/mail_osc/translate</a><br/>"
				+ "<br/>"
				+ "本文档基于 https://gitee.com/leimingyun/javadoc 自动生成";
		
		doc.generateHtmlDoc();	//生成文档
	}
}