@echo off
setlocal
chcp 65001 >nul

rem ============================================================================
rem translate.js 自动化测试入口：分别检查同目录的 translate.js 和 translate.min.js。
rem 以下说明也供 AI 阅读，用于在新电脑上准备测试环境。
rem
rem 一、先安装的环境
rem   Windows 10 或 Windows 11。
rem   Node.js 最低版本 20，建议安装当前 LTS，需包含 npm 并加入 PATH。
rem   AI 先执行 node --version 和 npm.cmd --version 检查环境。
rem   若未安装或版本过旧，可执行：
rem     winget install --id OpenJS.NodeJS.LTS --exact --source winget
rem   没有 winget 时，从 https://nodejs.org/ 下载 Windows LTS 安装包。
rem   安装完成后重新打开终端或编辑器，使 PATH 更新，再运行本文件。
rem   本文件会检查环境并提示错误，不会自行安装或升级系统 Node.js。
rem
rem 二、运行时自动准备的内容
rem   dev/e2e/start.js 会按 dev/e2e/package-lock.json 自动安装缺失的测试依赖。
rem   优先使用配套 Chromium；也会尝试本机已有的可运行 Playwright 缓存。
rem   没有可用浏览器时，自动下载 Chromium Headless Shell，不需要手工装 Chrome。
rem   首次准备需要能访问 npm registry 和 Playwright 浏览器下载服务。
rem   本地 127.0.0.1 的 8123 和 8124 端口需要空闲，测试会自动启停模拟服务。
rem   后续依赖和浏览器都可用时，直接双击，不再重复安装。
rem
rem 三、使用方法与结果
rem   必须保留完整项目目录，不能只复制本 bat 文件到其他位置。
rem   默认对本文件旁边的 translate.js 和 translate.min.js 分别运行完整测试。
rem   iframe 场景在 dev/e2e/iframe.spec.js，默认一并执行；无需另开测试入口。
rem   只看 iframe 的严格检查可执行 test.bat --no-pause --strict --grep iframe。
rem   与启动时的工作目录无关，两份文件始终直接从当前项目读取。
rem   测试不会自动压缩生成 translate.min.js；修改源码后请按发布流程更新压缩文件。
rem   AI 或脚本可执行 test.bat --no-pause，结束后不等待按键，并保留退出码。
rem   修复已知问题时可执行 test.bat --no-pause --strict。
rem   退出码 0 表示未发现新的故障；非 0 表示测试失败或环境准备失败。
rem   两份文件各自统计正常通过、已知失败、跳过、意外失败，再显示总计。
rem   任一文件出现新增故障，最终退出码都非 0；一份失败仍会继续测试另一份。
rem   已知失败不代表已修复，严格模式也会分别测试两份文件。
rem   JSON 报告在 dev/e2e/report/results.json，截图和跟踪在 dev/e2e/test-results。
rem   只覆盖已有测试场景，不能证明全部功能和所有浏览器都无问题。
rem ============================================================================

title translate.js automated tests

echo.
echo ===== translate.js 自动化测试 =====
echo.

where node.exe >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Node.js，请先安装 Node.js 20 或更新版本，然后重新双击本文件。
    echo [安装方法] winget install --id OpenJS.NodeJS.LTS --exact --source winget
    echo [说明] 详细环境要求写在本文件开头的注释中，也可以让 AI 阅读并完成环境准备。
    set "test_exit=1"
    goto finish
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 npm，请安装包含 npm 的 Node.js LTS，并确认 node 和 npm 都已加入 PATH。
    echo [说明] 安装后重新打开终端或编辑器，再运行本文件。
    set "test_exit=1"
    goto finish
)

pushd "%~dp0..\dev\e2e"
if errorlevel 1 (
    echo [错误] 未找到 dev\e2e 测试目录，请先将项目更新到包含测试工具的版本。
    set "test_exit=1"
    goto finish
)

node start.js %*
set "test_exit=%errorlevel%"
popd

:finish
echo.
if "%test_exit%"=="0" (
    echo [完成] 两份发布文件均未发现新的测试故障。已知问题和跳过项目请查看各自统计。
) else (
    echo [失败] 测试未通过或环境准备失败，请查看上面的错误信息。
)
echo.
if /i not "%~1"=="--no-pause" pause
exit /b %test_exit%
