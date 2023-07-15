package cn;

/**
 * 自动将当前项目部署到服务器。而不再需要手动登录FTP上传、ssh连接等。
 * 参考文档：https://gitee.com/leimingyun/dashboard/wikis/leimingyun/wm/preview?sort_id=4804224&doc_id=1101390
 * @author 管雷鸣
 */
public class AutoPublish extends com.xnx3.autoPublish.AutoPublish{
	
	public static void main(String[] args) {
		
		/***** 服务器账号密码 *****/
		SERVER_HOST = "156.236.74.70";  //服务器ip
		SERVER_USERNAME = "root";		 //服务器ssh登录账号
		SERVER_PASSWORD = "123456";//服务器ssh登录密码
		
		//本地打包往服务器上发布，也就是往服务器上上传时，是否忽略 WEB-INF/lib/ 这个文件夹，这个文件夹下全是第三方jar，正常开发基本不会动，但文件又不较大，如果自动部署上传到服务器不包含这个的话，部署会非常快。建议如果没有jar文件改动，就设置为true
		//不设置默认是false		
//		PUBLISH_IGNORE_LIB_JAR = true;	
		
		//服务器上要备份的文件。这里是指/mnt/tomcat8/webapps/ROOT 下的文件。 上传项目前，会先备份这里配置的文件，项目更新上去后，再把这些备份的文件还原回去
		//不设置默认不会备份任何文件，传上去的项目是什么样就是什么样
		SERVER_BAK_FILE.add("/WEB-INF/classes/application.properties");
		
		run();
	}
}
