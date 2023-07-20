package cn;


import com.xnx3.doc.JavaDoc;

public class ApiDoc {
	public static void main(String[] args) {
		JavaDoc doc = new JavaDoc("cn.zvo.translate.tcdn.api.controller");
		
		doc.name = "translate service";
//		doc.domain = "http://service.translate.zvo.cn";
		doc.domain = "http://192.168.31.243";
		doc.version = "2023.06.10";
		
		doc.generateHtmlDoc();
	}
}
