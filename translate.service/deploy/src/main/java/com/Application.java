package com;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import com.xnx3.j2ee.util.ConsoleUtil;
import com.xnx3.j2ee.util.SystemUtil;

/**
 * 运行入口
 * @author 管雷鸣
 *
 */
@EnableTransactionManagement // 启注解事务管理，等同于xml配置方式的 <tx:annotation-driven />
@SpringBootApplication
@ServletComponentScan
public class Application {
	
	// 运行时的参数
	private static String[] args;
	// spring容器的配合容器组件
	public static ConfigurableApplicationContext context;
	
	public static void main(String[] args) {
		ConsoleUtil.debug = true;
		ConsoleUtil.info = true;
		ConsoleUtil.error = true;
		startFinish();
		
		SpringApplication app = new SpringApplication(Application.class);
		context = app.run(args);
		Application.args = args;
	}
	
	/**
	 * 进行Spring相关的信息进行重新加载
	 * @author 李鑫
	 */
	public static void restart(){
		ExecutorService threadPool = new ThreadPoolExecutor (1,1,0, TimeUnit.SECONDS,new ArrayBlockingQueue<> ( 1 ),new ThreadPoolExecutor.DiscardOldestPolicy ());
		threadPool.execute (()->{
			Application.context.close ();
			Application.context = SpringApplication.run (Application.class, args);
		} );
		threadPool.shutdown ();
	}
	
	/**
	 * 当项目运行起来之后，要进行的东西
	 */
	public static void startFinish(){
		new Thread(new Runnable() {
			public void run() {
				System.out.println(" start thread monitor for application run finish");
				while(SystemUtil.get("USER_REG_ROLE") == null){
					//循环，一直到数据库加载完毕
					try {
						Thread.sleep(500);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				
				//数据库加载完毕了，等待3秒，出现运行成功，已经运行起来的提醒
				try {
					Thread.sleep(3000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				String str = "\n"
						+ "***************************\n"
						+ "WM 已开启完毕！您可打开浏览器，访问 localhost:8080 进行使用，管理后台默认账号密码都是 admin \n"
						+ "***************************\n"
						+ "  官网： www.leimingyun.com\n"
						+ "  作者微信：  xnx3com    \n"
						+ "***************************\n";
				System.out.println(str);
				
			}
		}).start();
	}
}
