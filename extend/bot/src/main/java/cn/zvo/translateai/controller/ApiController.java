package cn.zvo.translateai.controller;

import cn.zvo.translateai.model.AnalysisTask;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST API - 用于页面初始化和获取报告
 */
@RestController
@RequestMapping("/api")
public class ApiController {

    private final Gson gson = new Gson();

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "ok",
                "service", "TranslateAI",
                "version", "1.0.0"
        );
    }
}
