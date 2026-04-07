package cn.zvo.translateai.controller;

import cn.zvo.translateai.engine.AuditLoopEngine;
import cn.zvo.translateai.engine.BrowserManager;
import cn.zvo.translateai.model.AnalysisTask;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AnalysisWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private BrowserManager browserManager;

    @Autowired
    private AuditLoopEngine auditLoopEngine;

    private final Gson gson = new Gson();
    private final Map<String, AnalysisTask> tasks = new ConcurrentHashMap<>();
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.put(session.getId(), session);
        sendMessage(session, "connected", "已连接到 TranslateAI 服务");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            JsonObject msg = JsonParser.parseString(message.getPayload()).getAsJsonObject();
            String action = msg.get("action").getAsString();

            switch (action) {
                case "launch":
                    handleLaunch(session, msg);
                    break;
                case "pageReady":
                    handlePageReady(session);
                    break;
                default:
                    sendMessage(session, "error", "未知操作: " + action);
            }
        } catch (Exception e) {
            sendMessage(session, "error", "处理消息出错: " + e.getMessage());
        }
    }

    /**
     * 处理启动浏览器请求
     */
    private void handleLaunch(WebSocketSession session, JsonObject msg) {
        String url = msg.get("url").getAsString();
        if (url == null || url.trim().isEmpty()) {
            sendMessage(session, "error", "请输入有效的URL");
            return;
        }

        // 确保URL有协议前缀
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }

        AnalysisTask task = new AnalysisTask();
        task.setId(UUID.randomUUID().toString().substring(0, 8));
        task.setUrl(url);
        task.setStatus(AnalysisTask.Status.WAITING_BROWSER);
        tasks.put(session.getId(), task);

        sendMessage(session, "launching", "正在启动浏览器...");

        try {
            String finalUrl = url;
            new Thread(() -> {
                try {
                    browserManager.launch(finalUrl);
                    sendMessage(session, "browserReady",
                            "浏览器已打开。请在浏览器中完成登录（如需要），并导航到要接入翻译的页面，然后点击「页面已就绪，开始分析」按钮。");
                } catch (Exception e) {
                    sendMessage(session, "error", "启动浏览器失败: " + e.getMessage());
                }
            }).start();

        } catch (Exception e) {
            sendMessage(session, "error", "启动失败: " + e.getMessage());
        }
    }

    /**
     * 处理"页面已就绪"请求 - 开始自动分析审查循环
     */
    private void handlePageReady(WebSocketSession session) {
        AnalysisTask task = tasks.get(session.getId());
        if (task == null) {
            sendMessage(session, "error", "请先启动浏览器");
            return;
        }

        if (!browserManager.isPageAlive()) {
            sendMessage(session, "error", "浏览器已关闭，请重新启动");
            return;
        }

        task.setStatus(AnalysisTask.Status.PAGE_READY);
        sendMessage(session, "analysisStarted", "开始自动分析...");

        // 在后台线程执行分析（耗时操作）
        new Thread(() -> {
            auditLoopEngine.execute(task, progressEvent -> {
                // 实时推送进度
                JsonObject data = new JsonObject();
                data.addProperty("phase", progressEvent.getPhase());
                data.addProperty("message", progressEvent.getMessage());
                data.addProperty("timestamp", progressEvent.getTimestamp());
                sendJsonMessage(session, "progress", data);
            });

            // 发送最终结果
            sendJsonMessage(session, "result", JsonParser.parseString(gson.toJson(task)).getAsJsonObject());
        }).start();
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session.getId());
        tasks.remove(session.getId());
    }

    private void sendMessage(WebSocketSession session, String type, String message) {
        try {
            if (session.isOpen()) {
                JsonObject obj = new JsonObject();
                obj.addProperty("type", type);
                obj.addProperty("message", message);
                obj.addProperty("timestamp", System.currentTimeMillis());
                session.sendMessage(new TextMessage(obj.toString()));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void sendJsonMessage(WebSocketSession session, String type, JsonObject data) {
        try {
            if (session.isOpen()) {
                JsonObject obj = new JsonObject();
                obj.addProperty("type", type);
                obj.add("data", data);
                obj.addProperty("timestamp", System.currentTimeMillis());
                session.sendMessage(new TextMessage(obj.toString()));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
