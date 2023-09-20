package cn.zvo;

import com.xnx3.doc.JavaDoc;

public class ApiDoc {
	public static void main(String[] args) {
		JavaDoc doc = new JavaDoc("cn.zvo.translate.test");
		
		doc.name = "translate service";
//		doc.domain = "http://service.translate.zvo.cn";
		doc.domain = "http://192.168.31.243";
		doc.version = "2023.09.14";
		
		doc.javaSourceFolderList.add("G:\\git\\FileUpload\\core\\");
		doc.javaSourceFolderList.add("G:\\git\\FileUpload\\config_json\\");
		
		doc.generateHtmlDoc();
	}
}
