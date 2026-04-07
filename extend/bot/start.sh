#!/bin/bash
echo ""
echo "  =========================================="
echo "   TranslateAI - translate.js 智能接入工具"
echo "  =========================================="
echo ""

# 查找 Java 17+
JAVA_CMD="java"
if [ -x "/usr/lib/jvm/java-17/bin/java" ]; then
    JAVA_CMD="/usr/lib/jvm/java-17/bin/java"
    export JAVA_HOME="/usr/lib/jvm/java-17"
fi

echo "  使用 Java: $JAVA_CMD"
$JAVA_CMD -version 2>&1 | head -1
echo ""

# 检查是否需要安装 Playwright 浏览器
if [ ! -d "$HOME/.cache/ms-playwright" ]; then
    echo "  首次运行，需要安装 Playwright 浏览器..."
    $JAVA_CMD -cp "target/translate-ai-1.0.0.jar" com.microsoft.playwright.CLI install chromium
    echo ""
fi

# Claude API Key 提示
if [ -z "$CLAUDE_API_KEY" ]; then
    echo "  [提示] 未设置 CLAUDE_API_KEY 环境变量"
    echo "  将使用模拟模式运行（功能受限）"
    echo "  设置方法: export CLAUDE_API_KEY=your-api-key"
    echo ""
fi

echo "  正在启动 TranslateAI..."
echo "  启动后请访问: http://localhost:8080"
echo ""

$JAVA_CMD -jar target/translate-ai-1.0.0.jar
