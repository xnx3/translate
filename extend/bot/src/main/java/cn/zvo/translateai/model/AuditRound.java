package cn.zvo.translateai.model;

import java.util.ArrayList;
import java.util.List;

/**
 * 单轮审查结果
 */
public class AuditRound {
    private int round;
    private List<AuditDimension> dimensions = new ArrayList<>();
    private double overallScore;
    private boolean passed;
    private String screenshotBeforePath;
    private String screenshotAfterPath;
    private String screenshotMobilePath;
    private List<String> consoleErrors = new ArrayList<>();
    private List<String> consoleWarnings = new ArrayList<>();
    private String fixCodeApplied;

    public int getRound() { return round; }
    public void setRound(int round) { this.round = round; }

    public List<AuditDimension> getDimensions() { return dimensions; }
    public void setDimensions(List<AuditDimension> dimensions) { this.dimensions = dimensions; }

    public double getOverallScore() { return overallScore; }
    public void setOverallScore(double overallScore) { this.overallScore = overallScore; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public String getScreenshotBeforePath() { return screenshotBeforePath; }
    public void setScreenshotBeforePath(String p) { this.screenshotBeforePath = p; }

    public String getScreenshotAfterPath() { return screenshotAfterPath; }
    public void setScreenshotAfterPath(String p) { this.screenshotAfterPath = p; }

    public String getScreenshotMobilePath() { return screenshotMobilePath; }
    public void setScreenshotMobilePath(String p) { this.screenshotMobilePath = p; }

    public List<String> getConsoleErrors() { return consoleErrors; }
    public void setConsoleErrors(List<String> e) { this.consoleErrors = e; }

    public List<String> getConsoleWarnings() { return consoleWarnings; }
    public void setConsoleWarnings(List<String> w) { this.consoleWarnings = w; }

    public String getFixCodeApplied() { return fixCodeApplied; }
    public void setFixCodeApplied(String c) { this.fixCodeApplied = c; }

    /**
     * 检查所有维度是否都是满分10分
     */
    public void computePassStatus() {
        if (dimensions.isEmpty()) {
            this.passed = false;
            this.overallScore = 0;
            return;
        }
        double sum = 0;
        boolean allPerfect = true;
        for (AuditDimension d : dimensions) {
            sum += d.getScore();
            if (d.getScore() < 10) {
                allPerfect = false;
            }
        }
        this.overallScore = sum / dimensions.size();
        this.passed = allPerfect;
    }
}
