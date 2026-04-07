@echo off
chcp 65001 >nul
echo.
echo  ==========================================
echo   TranslateAI - translate.js 智能接入工具
echo  ==========================================
echo.

REM 查找 JDK 17
set "JAVA_CMD="
if exist "C:\Program Files\Java17\jdk-17.0.2\bin\java.exe" (
    set "JAVA_CMD=C:\Program Files\Java17\jdk-17.0.2\bin\java.exe"
    set "JAVA_HOME=C:\Program Files\Java17\jdk-17.0.2"
)

if "%JAVA_CMD%"=="" (
    REM 尝试默认 java
    where java >nul 2>&1
    if %errorlevel%==0 (
        set "JAVA_CMD=java"
    ) else (
        echo [错误] 未找到 Java 17+，请先安装 JDK 17
        echo 下载地址: https://adoptium.net/
        pause
        exit /b 1
    )
)

echo  使用 Java: %JAVA_CMD%
echo.

REM 检查是否需要安装 Playwright 浏览器
if not exist "%USERPROFILE%\.cache\ms-playwright" (
    echo  首次运行，需要安装 Playwright 浏览器...
    echo  这可能需要几分钟，请耐心等待...
    echo.
    "%JAVA_CMD%" -cp "target\translate-ai-1.0.0.jar" com.microsoft.playwright.CLI install chromium
    echo.
)

REM 设置 Claude API Key（如果有环境变量则使用）
if "%CLAUDE_API_KEY%"=="" (
    echo  [提示] 未设置 CLAUDE_API_KEY 环境变量
    echo  将使用模拟模式运行（功能受限）
    echo  设置方法: set CLAUDE_API_KEY=your-api-key
    echo.
)

echo  正在启动 TranslateAI...
echo  启动后请访问: http://localhost:8080
echo.

"%JAVA_CMD%" -jar target\translate-ai-1.0.0.jar

pause
