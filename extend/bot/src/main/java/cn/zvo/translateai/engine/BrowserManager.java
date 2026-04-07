package cn.zvo.translateai.engine;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.LoadState;
import com.microsoft.playwright.options.ViewportSize;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PreDestroy;
import java.nio.file.Paths;
import java.util.*;

/**
 * Playwright 浏览器管理器
 */
@Component
public class BrowserManager {

    @Value("${playwright.headless:false}")
    private boolean headless;

    @Value("${playwright.timeout:60000}")
    private int timeout;

    private Playwright playwright;
    private Browser browser;
    private BrowserContext context;
    private Page page;

    private final List<String> consoleErrors = Collections.synchronizedList(new ArrayList<>());
    private final List<String> consoleWarnings = Collections.synchronizedList(new ArrayList<>());
    private final List<String> consoleInfos = Collections.synchronizedList(new ArrayList<>());

    /**
     * 启动浏览器并打开指定URL
     */
    public void launch(String url) {
        close();
        playwright = Playwright.create();
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                .setHeadless(headless)
                .setArgs(Arrays.asList("--start-maximized")));

        context = browser.newContext(new Browser.NewContextOptions()
                .setViewportSize(null)
                .setLocale("zh-CN"));

        page = context.newPage();
        page.setDefaultTimeout(timeout);

        setupConsoleListener();

        page.navigate(url);
        page.waitForLoadState(LoadState.NETWORKIDLE);
    }

    /**
     * 重新加载当前页面（导航到同一URL，等待加载完成）
     */
    public void reloadPage() {
        String currentUrl = page.url();
        clearConsoleRecords();
        page.navigate(currentUrl);
        page.waitForLoadState(LoadState.NETWORKIDLE);
    }

    private void setupConsoleListener() {
        consoleErrors.clear();
        consoleWarnings.clear();
        consoleInfos.clear();

        page.onConsoleMessage(msg -> {
            String text = msg.text();
            String entry = "[" + msg.type() + "] " + text;

            switch (msg.type()) {
                case "error":
                    consoleErrors.add(entry);
                    break;
                case "warning":
                    consoleWarnings.add(entry);
                    break;
                default:
                    consoleInfos.add(entry);
                    break;
            }
        });

        page.onPageError(error -> {
            consoleErrors.add("[PageError] " + error);
        });
    }

    /**
     * 获取页面基本信息
     */
    public Map<String, String> getPageInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("title", page.title());
        info.put("url", page.url());

        String framework = (String) page.evaluate(
            "function() {" +
            "  try { if (window.__VUE__) return 'Vue 2'; } catch(e) {}" +
            "  try { if (document.querySelector('[data-v-]')) return 'Vue 3'; } catch(e) {}" +
            "  try { if (document.querySelector('[data-reactroot]')) return 'React'; } catch(e) {}" +
            "  try { if (window.__NEXT_DATA__) return 'Next.js'; } catch(e) {}" +
            "  try { if (window.__NUXT__) return 'Nuxt.js'; } catch(e) {}" +
            "  try { if (window.angular) return 'Angular'; } catch(e) {}" +
            "  try { if (window.jQuery) return 'jQuery'; } catch(e) {}" +
            "  return 'Unknown';" +
            "}"
        );
        info.put("framework", framework != null ? framework : "Unknown");

        String lang = (String) page.evaluate(
            "function() { return document.documentElement.lang || 'unknown'; }"
        );
        info.put("language", lang != null ? lang : "unknown");

        boolean hasTranslate = (Boolean) page.evaluate(
            "function() { return typeof window.translate !== 'undefined'; }"
        );
        info.put("hasTranslateJs", String.valueOf(hasTranslate));

        return info;
    }

    public List<String> snapshotConsoleErrors() {
        return new ArrayList<>(consoleErrors);
    }

    public void clearConsoleRecords() {
        consoleErrors.clear();
        consoleWarnings.clear();
        consoleInfos.clear();
    }

    /**
     * 注入 translate.js - 检测是否已加载，避免重复注入
     */
    public void injectTranslateJs(String configCode) {
        // 先清除之前注入的配置代码和样式（但不清除 translate.js 本身）
        page.evaluate(
            "function() {" +
            "  var els = document.querySelectorAll('script[data-translate-ai-config], style[data-translate-ai]');" +
            "  for (var i = 0; i < els.length; i++) els[i].remove();" +
            "}"
        );

        // 检测 translate.js 是否已经加载
        boolean alreadyLoaded = (Boolean) page.evaluate(
            "function() { return typeof(translate) === 'object' && typeof(translate.version) === 'string'; }"
        );

        List<String> scriptSrcs = new ArrayList<>();
        List<String> scriptInlines = new ArrayList<>();
        List<String> styles = new ArrayList<>();

        parseHtmlFragments(configCode, scriptSrcs, scriptInlines, styles);

        // 注入 style
        for (String css : styles) {
            page.evaluate(
                "function(cssText) {" +
                "  var s = document.createElement('style');" +
                "  s.setAttribute('data-translate-ai', 'true');" +
                "  s.textContent = cssText;" +
                "  document.head.appendChild(s);" +
                "}",
                css
            );
        }

        // 只有 translate.js 未加载时才注入外部 script
        if (!alreadyLoaded) {
            for (String src : scriptSrcs) {
                page.evaluate(
                    "function(url) {" +
                    "  return new Promise(function(resolve) {" +
                    "    var s = document.createElement('script');" +
                    "    s.setAttribute('data-translate-ai', 'true');" +
                    "    s.src = url;" +
                    "    s.onload = resolve;" +
                    "    s.onerror = resolve;" +
                    "    document.body.appendChild(s);" +
                    "  });" +
                    "}",
                    src
                );
                page.waitForTimeout(2000);
            }
        }

        // 注入内联配置 script（每次都需要重新执行配置）
        for (String code : scriptInlines) {
            page.evaluate(
                "function(jsCode) {" +
                "  var s = document.createElement('script');" +
                "  s.setAttribute('data-translate-ai-config', 'true');" +
                "  s.textContent = jsCode;" +
                "  document.body.appendChild(s);" +
                "}",
                code
            );
        }

        page.waitForTimeout(3000);
    }

    /**
     * 用 Java 解析 HTML 片段，提取 script 和 style
     */
    private void parseHtmlFragments(String html, List<String> scriptSrcs,
                                     List<String> scriptInlines, List<String> styles) {
        if (html == null || html.isEmpty()) return;

        String remaining = html;

        while (true) {
            // 查找 <script 或 <style
            int scriptStart = remaining.toLowerCase().indexOf("<script");
            int styleStart = remaining.toLowerCase().indexOf("<style");

            if (scriptStart == -1 && styleStart == -1) break;

            if (styleStart != -1 && (scriptStart == -1 || styleStart < scriptStart)) {
                // 处理 <style>
                int contentStart = remaining.indexOf(">", styleStart) + 1;
                int contentEnd = remaining.toLowerCase().indexOf("</style>", contentStart);
                if (contentEnd == -1) break;
                String cssContent = remaining.substring(contentStart, contentEnd).trim();
                if (!cssContent.isEmpty()) {
                    styles.add(cssContent);
                }
                remaining = remaining.substring(contentEnd + 8);
            } else {
                // 处理 <script>
                String tagPart = remaining.substring(scriptStart);
                int tagEnd = tagPart.indexOf(">");
                if (tagEnd == -1) break;
                String openTag = tagPart.substring(0, tagEnd + 1);

                // 检查是否有 src 属性
                int srcIdx = openTag.toLowerCase().indexOf("src=");
                if (srcIdx != -1) {
                    // 外部脚本
                    char quote = openTag.charAt(srcIdx + 4);
                    if (quote == '"' || quote == '\'') {
                        int srcEnd = openTag.indexOf(quote, srcIdx + 5);
                        if (srcEnd != -1) {
                            String src = openTag.substring(srcIdx + 5, srcEnd);
                            scriptSrcs.add(src);
                        }
                    }
                }

                // 查找 </script>
                int closeScript = remaining.toLowerCase().indexOf("</script>", scriptStart + tagEnd);
                if (closeScript == -1) break;

                // 如果没有 src，提取内联代码
                if (srcIdx == -1) {
                    String inlineCode = remaining.substring(scriptStart + tagEnd + 1, closeScript).trim();
                    if (!inlineCode.isEmpty()) {
                        scriptInlines.add(inlineCode);
                    }
                }

                remaining = remaining.substring(closeScript + 9);
            }
        }

        // 如果什么都没解析出来，把整个内容当作内联 JS
        if (scriptSrcs.isEmpty() && scriptInlines.isEmpty() && styles.isEmpty()) {
            String trimmed = html.trim();
            if (!trimmed.isEmpty()) {
                scriptInlines.add(trimmed);
            }
        }
    }

    /**
     * 切换翻译语言
     */
    public void switchLanguage(String language) {
        page.evaluate(
            "function(lang) { if(window.translate) translate.changeLanguage(lang); }",
            language
        );
        page.waitForTimeout(3000);
    }

    /**
     * 截图 - 当前视口
     */
    public byte[] screenshotViewport() {
        return page.screenshot();
    }

    /**
     * 截图 - 模拟移动端
     */
    public byte[] screenshotMobile() {
        ViewportSize original = page.viewportSize();
        page.setViewportSize(375, 812);
        page.waitForTimeout(1000);
        byte[] shot = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        if (original != null) {
            page.setViewportSize(original.width, original.height);
        } else {
            page.setViewportSize(1920, 1080);
        }
        page.waitForTimeout(500);
        return shot;
    }

    /**
     * 布局检测 - 生成精确的 CSS 选择器，避免宽泛匹配
     */
    public String runLayoutCheck() {
        Object result = page.evaluate(
            "function() {" +
            // 生成精确唯一的 CSS 选择器
            "  function getUniqueSelector(el) {" +
            "    if (el.id) return '#' + CSS.escape(el.id);" +
            "    var path = [];" +
            "    var current = el;" +
            "    while (current && current !== document.body && current !== document.documentElement) {" +
            "      var tag = current.tagName.toLowerCase();" +
            "      if (current.id) { path.unshift('#' + CSS.escape(current.id)); break; }" +
            "      var parent = current.parentElement;" +
            "      if (!parent) break;" +
            "      var siblings = parent.children;" +
            "      var sameTag = [];" +
            "      for (var i = 0; i < siblings.length; i++) {" +
            "        if (siblings[i].tagName === current.tagName) sameTag.push(siblings[i]);" +
            "      }" +
            "      if (sameTag.length === 1) { path.unshift(tag); }" +
            "      else {" +
            "        var idx = 0;" +
            "        for (var i = 0; i < sameTag.length; i++) { if (sameTag[i] === current) { idx = i + 1; break; } }" +
            "        path.unshift(tag + ':nth-of-type(' + idx + ')');" +
            "      }" +
            "      current = parent;" +
            "    }" +
            "    return (path[0] && path[0].charAt(0) === '#') ? path.join(' > ') : 'body > ' + path.join(' > ');" +
            "  }" +
            // 检测是否是 flex/grid 子元素（响应式布局的标志）
            "  function isFlexOrGridChild(el) {" +
            "    var p = el.parentElement;" +
            "    if (!p) return false;" +
            "    var ps = window.getComputedStyle(p);" +
            "    return ps.display === 'flex' || ps.display === 'inline-flex' || ps.display === 'grid' || ps.display === 'inline-grid';" +
            "  }" +
            // 检测是否有响应式相关类名
            "  function hasResponsiveClass(el) {" +
            "    if (!el.className || typeof el.className !== 'string') return false;" +
            "    var cls = el.className.toLowerCase();" +
            "    return cls.match(/col-|row|grid|flex|container|responsive|adaptive|d-/) !== null;" +
            "  }" +
            "  var issues = [];" +
            "  var all = document.querySelectorAll('body *');" +
            "  for (var i = 0; i < Math.min(all.length, 3000); i++) {" +
            "    var el = all[i];" +
            "    try {" +
            "      var style = window.getComputedStyle(el);" +
            "      if (style.display === 'none' || style.visibility === 'hidden') continue;" +
            "      if (el.offsetWidth === 0 && el.offsetHeight === 0) continue;" +
            "      var overflowH = el.scrollWidth > el.clientWidth + 2;" +
            "      if (!overflowH) continue;" +
            "      if (style.overflow === 'scroll' || style.overflow === 'auto') continue;" +
            "      if (style.overflowX === 'scroll' || style.overflowX === 'auto') continue;" +
            // 跳过 body/html
            "      if (el.tagName === 'BODY' || el.tagName === 'HTML') continue;" +
            // 跳过宽度很大的容器（往往是正常的滚动容器）
            "      if (el.clientWidth > 800 && el.scrollWidth - el.clientWidth < 20) continue;" +
            "      var selector = getUniqueSelector(el);" +
            "      var isFlex = isFlexOrGridChild(el);" +
            "      var isResp = hasResponsiveClass(el);" +
            "      var parentW = el.parentElement ? el.parentElement.clientWidth : 0;" +
            "      var overflowPx = el.scrollWidth - el.clientWidth;" +
            "      issues.push({" +
            "        selector: selector," +
            "        overflowPx: overflowPx," +
            "        clientW: el.clientWidth," +
            "        parentW: parentW," +
            "        isFlex: isFlex," +
            "        isResponsive: isResp," +
            "        display: style.display," +
            "        whiteSpace: style.whiteSpace," +
            "        paddingLeft: style.paddingLeft," +
            "        paddingRight: style.paddingRight," +
            "        paddingTop: style.paddingTop," +
            "        paddingBottom: style.paddingBottom," +
            "        boxSizing: style.boxSizing," +
            "        tag: el.tagName.toLowerCase()," +
            "        text: (el.textContent || '').substring(0, 50).trim()" +
            "      });" +
            "    } catch(e) {}" +
            "  }" +
            "  return JSON.stringify(issues.slice(0, 20));" +
            "}"
        );
        return result != null ? result.toString() : "[]";
    }

    /**
     * 获取文字变化率
     */
    public double getTextChangeRate(String textBefore) {
        String textAfter = getPageText();
        if (textBefore == null || textBefore.isEmpty()) return 0;
        if (textAfter == null || textAfter.isEmpty()) return 0;

        int changed = 0;
        int total = Math.max(textBefore.length(), textAfter.length());
        int minLen = Math.min(textBefore.length(), textAfter.length());
        for (int i = 0; i < minLen; i++) {
            if (textBefore.charAt(i) != textAfter.charAt(i)) changed++;
        }
        changed += Math.abs(textBefore.length() - textAfter.length());
        return (double) changed / total * 100;
    }

    public String getPageText() {
        Object result = page.evaluate("function() { return document.body.innerText; }");
        return result != null ? result.toString() : "";
    }

    public List<String> getConsoleErrors() {
        return new ArrayList<>(consoleErrors);
    }

    public List<String> getConsoleWarnings() {
        return new ArrayList<>(consoleWarnings);
    }

    public List<String> getTranslateRelatedErrors(List<String> errorsBefore) {
        List<String> result = new ArrayList<>();
        Set<String> beforeSet = new HashSet<>(errorsBefore);
        for (String error : consoleErrors) {
            if (beforeSet.contains(error)) continue;
            result.add(error);
        }
        return result;
    }

    public boolean isPageAlive() {
        try {
            if (page == null || page.isClosed()) return false;
            page.evaluate("function() { return true; }");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Page getPage() {
        return page;
    }

    @PreDestroy
    public void close() {
        try { if (context != null) context.close(); } catch (Exception ignored) {}
        try { if (browser != null) browser.close(); } catch (Exception ignored) {}
        try { if (playwright != null) playwright.close(); } catch (Exception ignored) {}
        playwright = null;
        browser = null;
        context = null;
        page = null;
    }
}
