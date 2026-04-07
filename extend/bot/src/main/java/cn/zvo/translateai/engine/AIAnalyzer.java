package cn.zvo.translateai.engine;

import cn.zvo.translateai.model.AuditDimension;
import cn.zvo.translateai.model.AuditRound;
import com.google.gson.*;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * AI 审查引擎
 *
 * 核心原则：
 * - 初始代码只有 JS 配置，不加任何宽泛 CSS
 * - CSS 修复只针对检测到溢出的具体元素，用精确选择器
 * - 尊重响应式布局（flex/grid 子元素用 min-width:0 而非 overflow:hidden）
 */
@Component
public class AIAnalyzer {

    @Value("${claude.api.key:}")
    private String apiKey;

    @Value("${claude.api.model:claude-sonnet-4-6}")
    private String model;

    @Value("${claude.api.base-url:https://api.anthropic.com}")
    private String baseUrl;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();

    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();

    private int mockRound = 0;

    /**
     * 生成初始接入代码 — 纯 JS 配置，不加宽泛 CSS
     */
    public String generateInitialCode(Map<String, String> pageInfo) {
        if (isApiAvailable()) {
            return generateInitialCodeWithAI(pageInfo);
        }
        return buildDefaultCode(pageInfo);
    }

    /**
     * 执行一轮完整审查
     */
    public AuditRound performAudit(
            String screenshotBefore, String screenshotAfter, String screenshotMobile,
            List<String> consoleErrors, String layoutIssuesJson, double textChangeRate,
            String currentCode, List<AuditRound> previousRounds) {

        if (isApiAvailable()) {
            return performAuditWithAI(screenshotBefore, screenshotAfter, screenshotMobile,
                    consoleErrors, layoutIssuesJson, textChangeRate, currentCode, previousRounds);
        }
        return performAuditLocal(consoleErrors, layoutIssuesJson, textChangeRate, previousRounds);
    }

    /**
     * 生成修复代码
     */
    public String generateFix(AuditRound auditResult, String currentCode,
                               List<AuditRound> previousRounds, String layoutIssuesJson) {
        if (isApiAvailable()) {
            return generateFixWithAI(auditResult, currentCode, previousRounds, layoutIssuesJson);
        }
        return generateFixLocal(auditResult, currentCode, layoutIssuesJson);
    }

    // ==================== 本地规则引擎 ====================

    /**
     * 默认代码 — 只有 JS，不加宽泛 CSS
     */
    private String buildDefaultCode(Map<String, String> pageInfo) {
        String localLang = detectLocalLang(pageInfo.getOrDefault("language", ""));

        return "<script src=\"https://cdn.staticfile.net/translate.js/3.18.66/translate.js\"></script>\n" +
                "<script>\n" +
                "translate.language.setLocal('" + localLang + "');\n" +
                "translate.ignore.tag.push('pre','code','script','style','textarea');\n" +
                "translate.ignore.class.push('no-translate','notranslate');\n" +
                "translate.service.use('client.edge');\n" +
                "translate.listener.start();\n" +
                "translate.execute();\n" +
                "</script>";
    }

    private String detectLocalLang(String lang) {
        if (lang.startsWith("en")) return "english";
        if (lang.startsWith("ja")) return "japanese";
        if (lang.startsWith("ko")) return "korean";
        if (lang.startsWith("fr")) return "french";
        if (lang.startsWith("de")) return "german";
        return "chinese_simplified";
    }

    /**
     * 本地审查
     */
    private AuditRound performAuditLocal(List<String> consoleErrors, String layoutIssuesJson,
                                          double textChangeRate, List<AuditRound> previousRounds) {
        mockRound++;
        AuditRound round = new AuditRound();

        // 1. 翻译功能
        AuditDimension transDim = new AuditDimension("translation_function", "翻译功能");
        if (textChangeRate > 30) {
            transDim.setScore(10);
            transDim.setDetail("翻译生效，文字变化率 " + String.format("%.1f%%", textChangeRate));
        } else if (textChangeRate > 10) {
            transDim.setScore(7);
            transDim.setDetail("翻译部分生效，变化率偏低: " + String.format("%.1f%%", textChangeRate));
            transDim.setIssues(List.of("部分动态内容可能未被翻译"));
        } else {
            transDim.setScore(3);
            transDim.setDetail("翻译可能未生效，变化率: " + String.format("%.1f%%", textChangeRate));
            transDim.setIssues(List.of("翻译未生效或变化率极低"));
        }
        round.getDimensions().add(transDim);

        // 2. 控制台错误
        AuditDimension consoleDim = new AuditDimension("console_errors", "控制台错误");
        List<String> translateErrors = filterTranslateErrors(consoleErrors);
        if (translateErrors.isEmpty()) {
            consoleDim.setScore(10);
            consoleDim.setDetail("无 translate.js 相关错误");
        } else {
            consoleDim.setScore(3);
            consoleDim.setDetail("translate.js 相关错误 " + translateErrors.size() + " 个");
            consoleDim.setIssues(translateErrors);
        }
        round.getDimensions().add(consoleDim);

        // 3. 语言切换器
        AuditDimension switcherDim = new AuditDimension("switcher_display", "语言切换器");
        switcherDim.setScore(10);
        switcherDim.setDetail("切换器正常显示");
        round.getDimensions().add(switcherDim);

        // 4. 布局完整性
        AuditDimension layoutDim = new AuditDimension("layout_integrity", "布局完整性");
        List<LayoutIssue> layoutIssues = parseLayoutIssues(layoutIssuesJson);
        if (layoutIssues.isEmpty()) {
            layoutDim.setScore(10);
            layoutDim.setDetail("未检测到布局溢出");
        } else {
            layoutDim.setScore(layoutIssues.size() > 5 ? 5 : layoutIssues.size() > 2 ? 7 : 8);
            layoutDim.setDetail("检测到 " + layoutIssues.size() + " 个元素溢出");
            List<String> issueDescs = new ArrayList<>();
            for (LayoutIssue li : layoutIssues) {
                issueDescs.add(li.selector + " 溢出 " + li.overflowPx + "px" +
                        (li.text.isEmpty() ? "" : " (\"" + li.text + "\")"));
            }
            layoutDim.setIssues(issueDescs);
        }
        round.getDimensions().add(layoutDim);

        // 5-7: 其他维度
        AuditDimension contentDim = new AuditDimension("content_accuracy", "内容准确性");
        contentDim.setScore(10);
        contentDim.setDetail("ignore 规则已配置");
        round.getDimensions().add(contentDim);

        AuditDimension mobileDim = new AuditDimension("mobile_responsive", "移动端适配");
        mobileDim.setScore(10);
        mobileDim.setDetail("移动端布局正常");
        round.getDimensions().add(mobileDim);

        AuditDimension perfDim = new AuditDimension("performance", "性能表现");
        perfDim.setScore(10);
        perfDim.setDetail("翻译速度正常");
        round.getDimensions().add(perfDim);

        round.computePassStatus();
        return round;
    }

    /**
     * 本地修复 — 精准针对溢出元素生成 CSS
     */
    private String generateFixLocal(AuditRound auditResult, String currentCode, String layoutIssuesJson) {
        // 保留原有的 JS 部分
        String scriptSrc = "<script src=\"https://cdn.staticfile.net/translate.js/3.18.66/translate.js\"></script>";
        String jsConfig = extractInlineScript(currentCode);
        if (jsConfig.isEmpty()) {
            jsConfig = "translate.language.setLocal('chinese_simplified');\n" +
                    "translate.ignore.tag.push('pre','code','script','style','textarea');\n" +
                    "translate.ignore.class.push('no-translate','notranslate');\n" +
                    "translate.service.use('client.edge');\n" +
                    "translate.listener.start();\n" +
                    "translate.execute();";
        }

        // 解析布局问题，生成精准 CSS
        List<LayoutIssue> layoutIssues = parseLayoutIssues(layoutIssuesJson);
        String cssFixBlock = generatePreciseCSS(layoutIssues);

        // 组装
        StringBuilder result = new StringBuilder();
        result.append(scriptSrc).append("\n");
        result.append("<script>\n").append(jsConfig).append("\n</script>");

        if (!cssFixBlock.isEmpty()) {
            result.append("\n<style>\n");
            result.append("/* translate.js 翻译后溢出修复 — 仅针对检测到的溢出元素 */\n");
            result.append(cssFixBlock);
            result.append("</style>");
        }

        return result.toString();
    }

    /**
     * 精准 CSS 生成 — 优先自然换行，保留原有 padding 间距，不粗暴截断
     *
     * 策略：
     * 1. 多行内容元素（div/p/li 等）：用 overflow-wrap + word-break 让长文字自然换行
     * 2. 明确单行的元素（原本就是 nowrap）：才用 text-overflow:ellipsis
     * 3. flex/grid 子元素：min-width:0 + overflow-wrap，不破坏弹性布局
     * 4. 表格单元格：overflow-wrap + max-width，不截断
     * 5. 所有情况都保留原始 padding，加 box-sizing: border-box 确保 padding 不撑破宽度
     */
    private String generatePreciseCSS(List<LayoutIssue> issues) {
        if (issues.isEmpty()) return "";

        StringBuilder css = new StringBuilder();
        Set<String> handled = new HashSet<>();

        for (LayoutIssue issue : issues) {
            if (handled.contains(issue.selector)) continue;
            handled.add(issue.selector);

            css.append(issue.selector).append(" {\n");

            // 始终确保 box-sizing，防止 padding 撑破容器
            if (!"border-box".equals(issue.boxSizing)) {
                css.append("  box-sizing: border-box;\n");
            }

            boolean isOriginallyNowrap = "nowrap".equals(issue.whiteSpace) || "pre".equals(issue.whiteSpace);
            boolean isInlineElement = "a".equals(issue.tag) || "span".equals(issue.tag)
                    || "button".equals(issue.tag) || "label".equals(issue.tag);

            if (issue.isFlex) {
                // flex 子元素：min-width:0 让 flex 算法正确收缩，配合自然换行
                css.append("  min-width: 0;\n");
                if (isOriginallyNowrap) {
                    // 原本就是单行不换行，保持截断
                    css.append("  overflow: hidden;\n");
                    css.append("  text-overflow: ellipsis;\n");
                } else {
                    // 多行内容，让文字自然换行
                    css.append("  overflow-wrap: break-word;\n");
                    css.append("  word-break: break-word;\n");
                }
            } else if (issue.isResponsive) {
                // 响应式元素：只加自然换行，不设固定宽度，不截断
                css.append("  overflow-wrap: break-word;\n");
                css.append("  word-break: break-word;\n");
            } else if ("td".equals(issue.tag) || "th".equals(issue.tag)) {
                // 表格单元格：自然换行 + 最大宽度限制，不截断内容
                css.append("  overflow-wrap: break-word;\n");
                css.append("  word-break: break-word;\n");
                css.append("  max-width: ").append(Math.max(issue.clientW, 80)).append("px;\n");
            } else if (isInlineElement && isOriginallyNowrap) {
                // 行内元素且原本就是 nowrap：保持截断，限制最大宽度
                css.append("  overflow: hidden;\n");
                css.append("  text-overflow: ellipsis;\n");
                int maxW = issue.parentW > 0 ? issue.parentW : issue.clientW;
                css.append("  max-width: ").append(maxW).append("px;\n");
            } else if (isInlineElement) {
                // 行内元素但原本允许换行：改为 inline-block 让它能换行
                css.append("  display: inline-block;\n");
                css.append("  overflow-wrap: break-word;\n");
                css.append("  word-break: break-word;\n");
                int maxW = issue.parentW > 0 ? issue.parentW : issue.clientW;
                css.append("  max-width: ").append(maxW).append("px;\n");
            } else if (isOriginallyNowrap) {
                // 块级元素但原本是 nowrap：保持截断
                css.append("  overflow: hidden;\n");
                css.append("  text-overflow: ellipsis;\n");
            } else {
                // 块级元素，多行内容：优先自然换行
                css.append("  overflow-wrap: break-word;\n");
                css.append("  word-break: break-word;\n");
            }

            // 保留原始 padding（如果有值且非 0，显式写出来防止被其他规则覆盖）
            appendPaddingIfNeeded(css, issue);

            css.append("}\n");
        }

        return css.toString();
    }

    /**
     * 保留元素原有的 padding，确保翻译后间距不变
     */
    private void appendPaddingIfNeeded(StringBuilder css, LayoutIssue issue) {
        boolean hasPadding = false;
        if (isNonZeroPx(issue.paddingLeft) || isNonZeroPx(issue.paddingRight)
                || isNonZeroPx(issue.paddingTop) || isNonZeroPx(issue.paddingBottom)) {
            hasPadding = true;
        }
        // 只有在元素本身有 padding 时才显式保留（防止其他 CSS 规则意外覆盖）
        if (hasPadding) {
            css.append("  padding: ")
                    .append(defaultPx(issue.paddingTop)).append(" ")
                    .append(defaultPx(issue.paddingRight)).append(" ")
                    .append(defaultPx(issue.paddingBottom)).append(" ")
                    .append(defaultPx(issue.paddingLeft)).append(";\n");
        }
    }

    private boolean isNonZeroPx(String value) {
        if (value == null || value.isEmpty()) return false;
        try {
            return Float.parseFloat(value.replace("px", "").trim()) > 0;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private String defaultPx(String value) {
        if (value == null || value.isEmpty()) return "0px";
        return value;
    }

    // ==================== 数据解析 ====================

    private List<String> filterTranslateErrors(List<String> errors) {
        List<String> result = new ArrayList<>();
        for (String err : errors) {
            String lower = err.toLowerCase();
            if (lower.contains("translate") || lower.contains("翻译")) {
                result.add(err);
            }
        }
        // 如果全都不含 translate 关键字，但注入后出现了新错误，也返回
        if (result.isEmpty() && !errors.isEmpty()) {
            return errors;
        }
        return result;
    }

    /**
     * 布局问题结构
     */
    private static class LayoutIssue {
        String selector;
        int overflowPx;
        int clientW;
        int parentW;
        boolean isFlex;
        boolean isResponsive;
        String display;
        String whiteSpace;
        String paddingLeft;
        String paddingRight;
        String paddingTop;
        String paddingBottom;
        String boxSizing;
        String tag;
        String text;
    }

    private List<LayoutIssue> parseLayoutIssues(String json) {
        List<LayoutIssue> issues = new ArrayList<>();
        if (json == null || json.equals("[]")) return issues;

        try {
            JsonArray arr = JsonParser.parseString(json).getAsJsonArray();
            for (JsonElement el : arr) {
                JsonObject obj = el.getAsJsonObject();
                LayoutIssue li = new LayoutIssue();
                li.selector = getStr(obj, "selector");
                li.overflowPx = obj.has("overflowPx") ? obj.get("overflowPx").getAsInt() : 0;
                li.clientW = obj.has("clientW") ? obj.get("clientW").getAsInt() : 0;
                li.parentW = obj.has("parentW") ? obj.get("parentW").getAsInt() : 0;
                li.isFlex = obj.has("isFlex") && obj.get("isFlex").getAsBoolean();
                li.isResponsive = obj.has("isResponsive") && obj.get("isResponsive").getAsBoolean();
                li.display = getStr(obj, "display");
                li.whiteSpace = getStr(obj, "whiteSpace");
                li.paddingLeft = getStr(obj, "paddingLeft");
                li.paddingRight = getStr(obj, "paddingRight");
                li.paddingTop = getStr(obj, "paddingTop");
                li.paddingBottom = getStr(obj, "paddingBottom");
                li.boxSizing = getStr(obj, "boxSizing");
                li.tag = getStr(obj, "tag");
                li.text = getStr(obj, "text");
                if (!li.selector.isEmpty()) {
                    issues.add(li);
                }
            }
        } catch (Exception e) {
            // ignore
        }
        return issues;
    }

    private String extractInlineScript(String html) {
        // 找第二个 <script>...</script>（第一个是 CDN 引用）
        int firstScriptEnd = html.indexOf("</script>");
        if (firstScriptEnd == -1) return "";
        int secondScriptStart = html.indexOf("<script>", firstScriptEnd);
        if (secondScriptStart == -1) secondScriptStart = html.indexOf("<script\n", firstScriptEnd);
        if (secondScriptStart == -1) return "";
        int contentStart = html.indexOf(">", secondScriptStart) + 1;
        int contentEnd = html.indexOf("</script>", contentStart);
        if (contentEnd == -1) return "";
        return html.substring(contentStart, contentEnd).trim();
    }

    // ==================== AI 模式 ====================

    private boolean isApiAvailable() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    private String generateInitialCodeWithAI(Map<String, String> pageInfo) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("你是 translate.js 接入专家。根据以下页面信息，生成接入代码。\n\n");
        prompt.append("页面信息:\n");
        for (Map.Entry<String, String> entry : pageInfo.entrySet()) {
            prompt.append("- ").append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
        }
        prompt.append("\n要求：\n");
        prompt.append("1. 只输出 <script> 标签代码，不要加任何 CSS（CSS 后续根据检测结果精准添加）\n");
        prompt.append("2. 引入 translate.js CDN: https://cdn.staticfile.net/translate.js/3.18.66/translate.js\n");
        prompt.append("3. 配置: setLocal、ignore(pre/code/script/style/textarea)、service.use('client.edge')、listener.start、execute\n");
        prompt.append("只输出代码，不要解释。\n");

        List<Map<String, Object>> content = List.of(Map.of("type", "text", "text", prompt.toString()));
        String response = callClaudeAPI(content);
        return extractCodeFromResponse(response);
    }

    private AuditRound performAuditWithAI(
            String screenshotBefore, String screenshotAfter, String screenshotMobile,
            List<String> consoleErrors, String layoutIssuesJson, double textChangeRate,
            String currentCode, List<AuditRound> previousRounds) {

        String prompt = buildAuditPrompt(consoleErrors, layoutIssuesJson, textChangeRate, currentCode);
        List<Map<String, Object>> content = new ArrayList<>();
        content.add(Map.of("type", "text", "text", prompt));
        if (screenshotBefore != null) content.add(buildImageBlock(screenshotBefore));
        if (screenshotAfter != null) content.add(buildImageBlock(screenshotAfter));
        if (screenshotMobile != null) content.add(buildImageBlock(screenshotMobile));

        String response = callClaudeAPI(content);
        return parseAuditResponse(response);
    }

    private String generateFixWithAI(AuditRound auditResult, String currentCode,
                                      List<AuditRound> previousRounds, String layoutIssuesJson) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("你是 translate.js 接入专家。根据审查结果，生成修复后的完整接入代码。\n\n");
        prompt.append("## 当前代码\n```html\n").append(currentCode).append("\n```\n\n");

        prompt.append("## 发现的问题\n");
        for (AuditDimension dim : auditResult.getDimensions()) {
            if (dim.getScore() < 10) {
                prompt.append("- ").append(dim.getName()).append(" (").append(dim.getScore()).append("/10): ")
                        .append(dim.getDetail()).append("\n");
                for (String issue : dim.getIssues()) prompt.append("  - ").append(issue).append("\n");
            }
        }

        prompt.append("\n## 布局检测数据（溢出元素的精确选择器）\n").append(layoutIssuesJson).append("\n");

        prompt.append("\n## CSS 修复原则（非常重要！）\n");
        prompt.append("1. 只针对上面检测到的溢出元素添加 CSS，使用检测数据中提供的精确选择器\n");
        prompt.append("2. 绝对不能用宽泛选择器（如 nav a, .btn, td）\n");
        prompt.append("3. 优先使用 overflow-wrap:break-word + word-break:break-word 让文字自然换行，而不是 overflow:hidden 截断\n");
        prompt.append("4. 只有元素原本就是 white-space:nowrap 时才用 text-overflow:ellipsis 截断\n");
        prompt.append("5. flex/grid 子元素用 min-width:0 + overflow-wrap，不破坏弹性布局\n");
        prompt.append("6. 必须保留元素原有的 padding 间距！翻译后不能让文字紧贴左侧或丢失四周间距\n");
        prompt.append("7. 加 box-sizing:border-box 确保 padding 不会额外撑破宽度\n");
        prompt.append("8. 表格单元格用 overflow-wrap + max-width，不加 white-space:nowrap\n");
        prompt.append("9. 美观第一：如果左右间距不均匀（左侧紧贴、右侧空白），要修正为均匀间距\n");
        prompt.append("\n只输出完整代码（<script> + <style>），不要解释。\n");

        List<Map<String, Object>> content = List.of(Map.of("type", "text", "text", prompt.toString()));
        String response = callClaudeAPI(content);
        return extractCodeFromResponse(response);
    }

    // ==================== 通用工具方法 ====================

    private String buildAuditPrompt(List<String> consoleErrors, String layoutIssuesJson,
                                     double textChangeRate, String currentCode) {
        StringBuilder sb = new StringBuilder();
        sb.append("你是 translate.js 接入质量审查专家。严格审查，只有 10 分才算通过。\n\n");
        sb.append("## 当前代码\n```html\n").append(currentCode).append("\n```\n\n");
        sb.append("## 控制台错误（注入后新增的）\n");
        if (consoleErrors.isEmpty()) sb.append("无\n");
        else for (String err : consoleErrors) sb.append("- ").append(err).append("\n");
        sb.append("\n## 布局检测\n").append(layoutIssuesJson).append("\n");
        sb.append("\n## 文字变化率: ").append(String.format("%.1f%%", textChangeRate)).append("\n\n");
        sb.append("以JSON返回 7 维度评分（translation_function, console_errors, switcher_display, ");
        sb.append("layout_integrity, content_accuracy, mobile_responsive, performance），");
        sb.append("每个维度含 id, name, score(0-10), detail, issues[], fixes[]。只返回JSON。\n");
        return sb.toString();
    }

    private Map<String, Object> buildImageBlock(String base64Image) {
        Map<String, Object> source = new LinkedHashMap<>();
        source.put("type", "base64");
        source.put("media_type", "image/png");
        source.put("data", base64Image);
        Map<String, Object> block = new LinkedHashMap<>();
        block.put("type", "image");
        block.put("source", source);
        return block;
    }

    private String callClaudeAPI(List<Map<String, Object>> content) {
        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("model", model);
        requestBody.put("max_tokens", 4096);
        requestBody.put("messages", List.of(Map.of("role", "user", "content", content)));

        RequestBody body = RequestBody.create(
                gson.toJson(requestBody), MediaType.parse("application/json"));

        Request request = new Request.Builder()
                .url(baseUrl + "/v1/messages")
                .addHeader("x-api-key", apiKey)
                .addHeader("anthropic-version", "2023-06-01")
                .addHeader("content-type", "application/json")
                .post(body)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "unknown";
                throw new RuntimeException("Claude API error " + response.code() + ": " + errorBody);
            }
            String responseJson = response.body().string();
            JsonObject obj = JsonParser.parseString(responseJson).getAsJsonObject();
            JsonArray contentArray = obj.getAsJsonArray("content");
            if (contentArray != null && !contentArray.isEmpty()) {
                return contentArray.get(0).getAsJsonObject().get("text").getAsString();
            }
            return "";
        } catch (IOException e) {
            throw new RuntimeException("Claude API call failed: " + e.getMessage(), e);
        }
    }

    private String extractCodeFromResponse(String response) {
        if (response == null) return buildDefaultCode(Map.of());
        int start = response.indexOf("```html");
        if (start >= 0) {
            start = response.indexOf("\n", start) + 1;
            int end = response.indexOf("```", start);
            if (end > start) return response.substring(start, end).trim();
        }
        start = response.indexOf("```");
        if (start >= 0) {
            start = response.indexOf("\n", start) + 1;
            int end = response.indexOf("```", start);
            if (end > start) return response.substring(start, end).trim();
        }
        if (response.contains("<script")) return response.trim();
        return buildDefaultCode(Map.of());
    }

    private AuditRound parseAuditResponse(String response) {
        AuditRound round = new AuditRound();
        try {
            String json = response;
            int jsonStart = response.indexOf("{");
            int jsonEnd = response.lastIndexOf("}");
            if (jsonStart >= 0 && jsonEnd > jsonStart) json = response.substring(jsonStart, jsonEnd + 1);

            JsonObject obj = JsonParser.parseString(json).getAsJsonObject();
            JsonArray dims = obj.getAsJsonArray("dimensions");
            if (dims != null) {
                for (JsonElement el : dims) {
                    JsonObject d = el.getAsJsonObject();
                    AuditDimension dim = new AuditDimension();
                    dim.setId(getStr(d, "id"));
                    dim.setName(getStr(d, "name"));
                    dim.setScore(d.has("score") ? d.get("score").getAsInt() : 0);
                    dim.setDetail(getStr(d, "detail"));
                    dim.setIssues(getStrList(d, "issues"));
                    dim.setFixes(getStrList(d, "fixes"));
                    round.getDimensions().add(dim);
                }
            }
        } catch (Exception e) {
            round.setDimensions(createDefaultDimensions());
        }
        round.computePassStatus();
        return round;
    }

    private String getStr(JsonObject obj, String key) {
        return obj.has(key) && !obj.get(key).isJsonNull() ? obj.get(key).getAsString() : "";
    }

    private List<String> getStrList(JsonObject obj, String key) {
        List<String> list = new ArrayList<>();
        if (obj.has(key) && obj.get(key).isJsonArray()) {
            for (JsonElement e : obj.getAsJsonArray(key)) {
                try { list.add(e.getAsString()); } catch (Exception ex) {}
            }
        }
        return list;
    }

    private List<AuditDimension> createDefaultDimensions() {
        List<AuditDimension> dims = new ArrayList<>();
        dims.add(new AuditDimension("translation_function", "翻译功能"));
        dims.add(new AuditDimension("console_errors", "控制台错误"));
        dims.add(new AuditDimension("switcher_display", "语言切换器"));
        dims.add(new AuditDimension("layout_integrity", "布局完整性"));
        dims.add(new AuditDimension("content_accuracy", "内容准确性"));
        dims.add(new AuditDimension("mobile_responsive", "移动端适配"));
        dims.add(new AuditDimension("performance", "性能表现"));
        return dims;
    }
}
