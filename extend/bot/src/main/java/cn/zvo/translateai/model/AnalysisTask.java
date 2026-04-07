package cn.zvo.translateai.model;

import java.util.ArrayList;
import java.util.List;

/**
 * 完整的分析任务，包含所有轮次的审查结果
 */
public class AnalysisTask {

    public enum Status {
        WAITING_BROWSER,   // 等待用户在浏览器中操作
        PAGE_READY,        // 用户确认页面就绪
        ANALYZING,         // 正在分析
        INJECTING,         // 正在注入代码
        AUDITING,          // 正在审查
        FIXING,            // 正在修复
        COMPLETED,         // 完成
        FAILED             // 失败
    }

    private String id;
    private String url;
    private Status status = Status.WAITING_BROWSER;
    private String statusMessage = "";

    // 页面信息
    private String detectedFramework;
    private String detectedLanguage;
    private String pageTitle;

    // 审查轮次记录
    private List<AuditRound> rounds = new ArrayList<>();

    // 最终输出
    private String finalCode;
    private String insertPosition;
    private List<String> notes = new ArrayList<>();

    // 截图 (Base64)
    private String screenshotBefore;
    private String screenshotAfter;
    private String screenshotMobile;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getStatusMessage() { return statusMessage; }
    public void setStatusMessage(String m) { this.statusMessage = m; }

    public String getDetectedFramework() { return detectedFramework; }
    public void setDetectedFramework(String f) { this.detectedFramework = f; }

    public String getDetectedLanguage() { return detectedLanguage; }
    public void setDetectedLanguage(String l) { this.detectedLanguage = l; }

    public String getPageTitle() { return pageTitle; }
    public void setPageTitle(String t) { this.pageTitle = t; }

    public List<AuditRound> getRounds() { return rounds; }
    public void setRounds(List<AuditRound> r) { this.rounds = r; }

    public String getFinalCode() { return finalCode; }
    public void setFinalCode(String c) { this.finalCode = c; }

    public String getInsertPosition() { return insertPosition; }
    public void setInsertPosition(String p) { this.insertPosition = p; }

    public List<String> getNotes() { return notes; }
    public void setNotes(List<String> n) { this.notes = n; }

    public String getScreenshotBefore() { return screenshotBefore; }
    public void setScreenshotBefore(String s) { this.screenshotBefore = s; }

    public String getScreenshotAfter() { return screenshotAfter; }
    public void setScreenshotAfter(String s) { this.screenshotAfter = s; }

    public String getScreenshotMobile() { return screenshotMobile; }
    public void setScreenshotMobile(String s) { this.screenshotMobile = s; }

    public int getCurrentRound() { return rounds.size(); }

    public boolean isCompleted() { return status == Status.COMPLETED; }

    public AuditRound getLatestRound() {
        if (rounds.isEmpty()) return null;
        return rounds.get(rounds.size() - 1);
    }
}
