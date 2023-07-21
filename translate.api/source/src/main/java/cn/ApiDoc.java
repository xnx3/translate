package cn;


import com.xnx3.doc.JavaDoc;

public class ApiDoc {
	public static void main(String[] args) {
		JavaDoc doc = new JavaDoc("cn.zvo.translate.tcdn.api.controller");
		
		doc.name = "translate.api";
//		doc.domain = "http://service.translate.zvo.cn";
		doc.domain = "http://123.123.123.123";
		doc.version = "2023.07.21";
		
		doc.generateHtmlDoc();
	}
}
