package cn.zvo.translateai.engine;

import cn.zvo.translateai.model.AnalysisTask;
import cn.zvo.translateai.model.AuditDimension;
import cn.zvo.translateai.model.AuditRound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Consumer;

/**
 * 审查循环引擎 - 核心调度器
 * 负责：注入 → 审查 → 修复 → 再审查 的完整闭环
 */
@Component
public class AuditLoopEngine {

    @Autowired
    private BrowserManager browserManager;

    @Autowired
    private AIAnalyzer aiAnalyzer;

    @Value("${audit.max-rounds:10}")
    private int maxRounds;

    /**
     * 执行完整的分析审查流程
     *
     * @param task             分析任务
     * @param progressCallback 进度回调（实时推送给前端）
     */
    public void execute(AnalysisTask task, Consumer<ProgressEvent> progressCallback) {
        try {
            // Phase 1: 采集页面信息
            sendProgress(progressCallback, "analyzing", "正在采集页面信息...");
            task.setStatus(AnalysisTask.Status.ANALYZING);

            Map<String, String> pageInfo = browserManager.getPageInfo();
            task.setPageTitle(pageInfo.get("title"));
            task.setDetectedFramework(pageInfo.get("framework"));
            task.setDetectedLanguage(pageInfo.get("language"));

            sendProgress(progressCallback, "analyzing",
                    "页面信息: " + pageInfo.get("title") + " | 框架: " + pageInfo.get("framework"));

            // 记录注入前的控制台错误和页面文本
            List<String> errorsBefore = browserManager.snapshotConsoleErrors();
            String textBefore = browserManager.getPageText();

            // 翻译前截图
            sendProgress(progressCallback, "analyzing", "正在截取翻译前截图...");
            byte[] screenshotBefore = browserManager.screenshotViewport();
            String screenshotBeforeBase64 = Base64.getEncoder().encodeToString(screenshotBefore);
            task.setScreenshotBefore(screenshotBeforeBase64);

            // Phase 2: 生成初始代码
            sendProgress(progressCallback, "injecting", "AI 正在生成初始接入代码...");
            task.setStatus(AnalysisTask.Status.INJECTING);
            String currentCode = aiAnalyzer.generateInitialCode(pageInfo);

            // 开始审查循环
            int round = 0;
            boolean passed = false;
            double lastOverallScore = -1;
            int noImprovementCount = 0;
            int consecutiveErrors = 0;
            // 记录上一次成功的代码，异常回退时使用
            String lastSuccessfulCode = currentCode;

            while (round < maxRounds && !passed) {
                round++;
                sendProgress(progressCallback, "auditing",
                        "===== 第 " + round + " 轮审查 =====");

                try {
                    // 每轮都重新加载页面，确保干净状态
                    if (round > 1) {
                        sendProgress(progressCallback, "auditing", "正在重新加载页面（干净状态）...");
                        browserManager.reloadPage();

                        // 重新采集基准数据
                        errorsBefore = browserManager.snapshotConsoleErrors();
                        textBefore = browserManager.getPageText();

                        // 重新截取翻译前截图
                        screenshotBefore = browserManager.screenshotViewport();
                        screenshotBeforeBase64 = Base64.getEncoder().encodeToString(screenshotBefore);
                        task.setScreenshotBefore(screenshotBeforeBase64);
                    }

                    // 注入代码（第1轮注入初始代码，后续轮注入上一轮修复后的代码）
                    sendProgress(progressCallback, "injecting", "正在注入接入代码...");
                    task.setStatus(AnalysisTask.Status.INJECTING);
                    browserManager.injectTranslateJs(currentCode);

                    // 切换语言触发翻译
                    sendProgress(progressCallback, "auditing", "正在切换到 English 进行测试...");
                    browserManager.switchLanguage("english");

                    // 采集审查数据
                    sendProgress(progressCallback, "auditing", "正在采集审查数据...");
                    task.setStatus(AnalysisTask.Status.AUDITING);

                    // 翻译后截图
                    byte[] screenshotAfter = browserManager.screenshotViewport();
                    String screenshotAfterBase64 = Base64.getEncoder().encodeToString(screenshotAfter);
                    task.setScreenshotAfter(screenshotAfterBase64);

                    // 移动端截图
                    byte[] screenshotMobile = browserManager.screenshotMobile();
                    String screenshotMobileBase64 = Base64.getEncoder().encodeToString(screenshotMobile);
                    task.setScreenshotMobile(screenshotMobileBase64);

                    // 控制台错误（只要注入后新增的）
                    List<String> translateErrors = browserManager.getTranslateRelatedErrors(errorsBefore);

                    // 布局检测
                    String layoutIssues = browserManager.runLayoutCheck();

                    // 文字变化率
                    double textChangeRate = browserManager.getTextChangeRate(textBefore);

                    sendProgress(progressCallback, "auditing",
                            "文字变化率: " + String.format("%.1f%%", textChangeRate) +
                                    " | 新增控制台错误: " + translateErrors.size() +
                                    " | 布局问题: " + layoutIssues);

                    // AI 审查
                    sendProgress(progressCallback, "auditing", "AI 正在审查...");
                    AuditRound auditRound = aiAnalyzer.performAudit(
                            screenshotBeforeBase64,
                            screenshotAfterBase64,
                            screenshotMobileBase64,
                            translateErrors,
                            layoutIssues,
                            textChangeRate,
                            currentCode,
                            task.getRounds()
                    );

                    auditRound.setRound(round);
                    auditRound.setConsoleErrors(translateErrors);
                    auditRound.setFixCodeApplied(currentCode);
                    auditRound.setScreenshotBeforePath("round_" + round + "_before");
                    auditRound.setScreenshotAfterPath("round_" + round + "_after");
                    auditRound.setScreenshotMobilePath("round_" + round + "_mobile");

                    task.getRounds().add(auditRound);

                    // 本轮成功，记录成功的代码，重置连续错误计数
                    lastSuccessfulCode = currentCode;
                    consecutiveErrors = 0;

                    // 输出本轮审查结果
                    sendProgress(progressCallback, "auditing", formatRoundResult(auditRound));

                    // 检查是否全部通过（所有维度都是10分）
                    if (auditRound.isPassed()) {
                        passed = true;
                        sendProgress(progressCallback, "completed",
                                "第 " + round + " 轮: 全部 10 分！完美通过！");
                        break;
                    }

                    // 收敛保护: 如果连续3轮分数没有提升，停止
                    if (auditRound.getOverallScore() <= lastOverallScore) {
                        noImprovementCount++;
                    } else {
                        noImprovementCount = 0;
                    }
                    lastOverallScore = auditRound.getOverallScore();

                    if (noImprovementCount >= 3) {
                        sendProgress(progressCallback, "completed",
                                "连续 3 轮无进步，停止自动修复。剩余问题建议人工处理。");
                        break;
                    }

                    // 还有问题，让AI生成修复方案
                    if (round < maxRounds) {
                        sendProgress(progressCallback, "fixing",
                                "第 " + round + " 轮发现 " + countFailedDimensions(auditRound) + " 个问题，AI 正在生成修复方案...");
                        task.setStatus(AnalysisTask.Status.FIXING);

                        // AI生成修复后的代码（传入布局检测数据用于生成CSS修复）
                        currentCode = aiAnalyzer.generateFix(auditRound, currentCode, task.getRounds(), layoutIssues);

                        sendProgress(progressCallback, "fixing", "修复方案已生成，准备第 " + (round + 1) + " 轮验证...");
                    }

                } catch (Exception roundError) {
                    consecutiveErrors++;
                    sendProgress(progressCallback, "auditing",
                            "第 " + round + " 轮遇到异常: " + roundError.getMessage() + "，跳过本轮...");

                    // 回退到上一次成功的代码
                    currentCode = lastSuccessfulCode;
                    sendProgress(progressCallback, "auditing",
                            "已回退到上一次成功的代码，准备继续下一轮...");

                    // 连续3次异常则终止，避免无限循环
                    if (consecutiveErrors >= 3) {
                        sendProgress(progressCallback, "completed",
                                "连续 " + consecutiveErrors + " 轮异常，停止审查。请检查页面是否可正常访问。");
                        break;
                    }

                    // 页面可能处于异常状态，尝试检测并恢复
                    try {
                        if (!browserManager.isPageAlive()) {
                            sendProgress(progressCallback, "auditing", "检测到页面已失效，停止审查。");
                            break;
                        }
                    } catch (Exception checkError) {
                        sendProgress(progressCallback, "auditing", "无法检测页面状态，停止审查。");
                        break;
                    }
                }
            }

            // 设置最终结果
            task.setFinalCode(currentCode);
            task.setInsertPosition("将以下代码插入到页面 </body> 标签之前");
            task.setStatus(AnalysisTask.Status.COMPLETED);

            // 生成注意事项
            generateNotes(task);

            sendProgress(progressCallback, "completed", buildFinalSummary(task));

        } catch (Exception e) {
            task.setStatus(AnalysisTask.Status.FAILED);
            task.setStatusMessage("分析失败: " + e.getMessage());
            sendProgress(progressCallback, "error", "分析失败: " + e.getMessage());
        }
    }

    private int countFailedDimensions(AuditRound round) {
        int count = 0;
        for (AuditDimension d : round.getDimensions()) {
            if (d.getScore() < 10) count++;
        }
        return count;
    }

    private String formatRoundResult(AuditRound round) {
        StringBuilder sb = new StringBuilder();
        sb.append("第 ").append(round.getRound()).append(" 轮审查结果 (overall: ")
                .append(String.format("%.1f", round.getOverallScore())).append("):\n");

        for (AuditDimension dim : round.getDimensions()) {
            String icon = dim.getScore() >= 10 ? "[PASS]" : "[FAIL]";
            sb.append("  ").append(icon).append(" ").append(dim.getName())
                    .append(": ").append(dim.getScore()).append("/10");
            if (dim.getScore() < 10 && !dim.getDetail().isEmpty()) {
                sb.append(" - ").append(dim.getDetail());
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    private void generateNotes(AnalysisTask task) {
        List<String> notes = new ArrayList<>();
        AuditRound lastRound = task.getLatestRound();
        if (lastRound != null) {
            for (AuditDimension dim : lastRound.getDimensions()) {
                if (dim.getScore() < 10) {
                    notes.add("[需人工检查] " + dim.getName() + ": " + dim.getDetail());
                }
            }
        }
        if (task.getRounds().size() > 1) {
            notes.add("共经过 " + task.getRounds().size() + " 轮审查修复");
        }
        task.setNotes(notes);
    }

    private String buildFinalSummary(AnalysisTask task) {
        StringBuilder sb = new StringBuilder();
        sb.append("========== 分析完成 ==========\n");
        sb.append("网站: ").append(task.getPageTitle()).append("\n");
        sb.append("框架: ").append(task.getDetectedFramework()).append("\n");
        sb.append("总轮次: ").append(task.getRounds().size()).append("\n");

        AuditRound lastRound = task.getLatestRound();
        if (lastRound != null) {
            sb.append("最终评分: ").append(String.format("%.1f", lastRound.getOverallScore())).append("/10\n");
            if (lastRound.isPassed()) {
                sb.append("状态: 全部完美通过!\n");
            } else {
                sb.append("状态: 部分项目需要人工检查\n");
            }
        }
        return sb.toString();
    }

    private void sendProgress(Consumer<ProgressEvent> callback, String phase, String message) {
        if (callback != null) {
            callback.accept(new ProgressEvent(phase, message));
        }
    }

    /**
     * 进度事件
     */
    public static class ProgressEvent {
        private final String phase;
        private final String message;
        private final long timestamp;

        public ProgressEvent(String phase, String message) {
            this.phase = phase;
            this.message = message;
            this.timestamp = System.currentTimeMillis();
        }

        public String getPhase() { return phase; }
        public String getMessage() { return message; }
        public long getTimestamp() { return timestamp; }
    }
}
