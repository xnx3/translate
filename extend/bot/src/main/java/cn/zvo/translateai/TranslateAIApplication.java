package cn.zvo.translateai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TranslateAIApplication {

    public static void main(String[] args) {
        SpringApplication.run(TranslateAIApplication.class, args);
        System.out.println("\n===========================================");
        System.out.println("  TranslateAI 已启动");
        System.out.println("  打开浏览器访问: http://localhost:8080");
        System.out.println("===========================================\n");
    }
}
