@echo off
chcp 65001 >nul

REM 查找 JDK 17
set "JAVA_HOME=C:\Program Files\Java17\jdk-17.0.2"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "MVN_CMD=C:\Users\Administrator\.trae-cn\tools\maven\latest\bin\mvn.cmd"

echo  编译打包 TranslateAI...
call "%MVN_CMD%" package -DskipTests
echo.

if %errorlevel%==0 (
    echo  打包成功！运行 start.bat 启动应用
) else (
    echo  打包失败，请检查错误信息
)
pause
