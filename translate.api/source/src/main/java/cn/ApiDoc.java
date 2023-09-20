package cn;


import com.xnx3.doc.JavaDoc;

public class ApiDoc {
	public static void main(String[] args) {
		JavaDoc doc = new JavaDoc("cn.zvo.translate.tcdn.api.controller");
		
		doc.name = "translate.api";
//		doc.domain = "http://service.translate.zvo.cn";
		doc.domain = "http://123.123.123.123";
		doc.version = "2023.09.08";
		doc.welcome = "此需要进行部署了TCDN服务后才能使用，并没有提供线上公共开放的接口，部署方式参见：http://translate.zvo.cn/41159.html";
		
		doc.generateHtmlDoc();
	}
}
