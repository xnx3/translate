package cn.zvo;

import com.xnx3.doc.JavaDoc;

public class ApiDoc {
	public static void main(String[] args) {
		JavaDoc doc = new JavaDoc("com.xnx3.translate.service.controller");
		
		doc.name = "translate service";
//		doc.domain = "http://service.translate.zvo.cn";
		doc.domain = "http://192.168.31.243";
		doc.version = "2023.04.01";
		
		doc.generateHtmlDoc();
	}
}
