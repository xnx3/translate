# Translate AI BOT

> translate.js 智能接入工具 — 自动分析、注入、审查、修复

## 简介 

它是一个自动化工具，帮助开发者快速将 [translate.js](https://github.com/xnx3/translate) 接入到任意网站中。通过 AI 驱动的多轮审查机制，自动完成代码注入、翻译效果测试、问题检测与修复，大幅降低人工接入成本。

## 功能特性

- 🌐 **自动化浏览器**：基于 Playwright 启动真实浏览器
- 🤖 **AI 智能分析**：集成 Claude API，自动生成接入代码并智能修复问题
- 🔄 **多轮审查闭环**：注入 → 审查 → 修复 → 再审查，最多 10 轮迭代
- 📊 **多维度检测**：
  - 文字翻译覆盖率
  - 页面布局完整性
  - 控制台错误检测
  - 移动端适配检查
- 📸 **可视化报告**：截图对比（翻译前/翻译后/移动端），清晰展示效果
- ⚡ **实时进度**：WebSocket 推送分析进度，前端实时展示

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 3.2.5 | 后端框架 |
| Java | 17+ | 运行环境 |
| Playwright | 1.44.0 | 浏览器自动化 |
| Claude API | - | AI 分析 |
| WebSocket | - | 实时通信 |

## 快速开始

### 环境要求

- JDK 17 或更高版本
- Maven 3.6+
- Claude API Key（可选，不设置将使用模拟模式）

### 安装与运行

**Windows:**

```bash
# 1. 编译打包
build.bat

# 2. 启动应用
start.bat
```

**Linux/macOS:**

```bash
# 1. 编译打包
mvn package -DskipTests

# 2. 启动应用
./start.sh
```

### 配置 Claude API Key

**Windows:**
```bash
set CLAUDE_API_KEY=your-api-key
start.bat
```

**Linux/macOS:**
```bash
export CLAUDE_API_KEY=your-api-key
./start.sh
```

或在 `src/main/resources/application.properties` 中配置：

```properties
claude.api.key=your-api-key
```

## 使用方法

1. 启动应用后，浏览器访问 `http://localhost:8080`
2. 输入目标网站 URL，点击「启动浏览器」
3. 如需登录，在弹出的浏览器窗口中完成登录
4. 导航到需要接入翻译的页面，点击「页面已就绪，开始分析」
5. 等待 AI 自动分析完成，查看报告
6. 复制生成的接入代码，插入到目标页面 `</body>` 标签之前

## 项目结构

```
translateAI/
├── src/main/
│   ├── java/cn/zvo/translateai/
│   │   ├── TranslateAIApplication.java    # 启动类
│   │   ├── config/
│   │   │   └── WebSocketConfig.java       # WebSocket 配置
│   │   ├── controller/
│   │   │   ├── ApiController.java         # REST API
│   │   │   └── AnalysisWebSocketHandler.java  # WebSocket 处理
│   │   ├── engine/
│   │   │   ├── AuditLoopEngine.java       # 审查循环引擎（核心）
│   │   │   ├── AIAnalyzer.java            # AI 分析器
│   │   │   └── BrowserManager.java        # 浏览器管理
│   └── model/
│       ├── AnalysisTask.java              # 分析任务模型
│       ├── AuditDimension.java            # 审查维度
│       └── AuditRound.java                # 审查轮次
│   └── resources/
│       ├── application.properties         # 配置文件
│       └── static/                        # 前端页面
├── pom.xml                                # Maven 配置
├── build.bat                              # Windows 编译脚本
├── start.bat                              # Windows 启动脚本
└── start.sh                               # Linux/macOS 启动脚本
```

## 审查维度

AI 会从以下维度对翻译效果进行评分（满分 10 分）：

| 维度 | 说明 |
|------|------|
| 文字翻译覆盖 | 检测页面文字是否被正确翻译 |
| 布局完整性 | 检测翻译后是否有布局错乱 |
| 控制台错误 | 检测是否产生 JS 错误 |
| 移动端适配 | 检测移动端显示效果 |
| 交互功能 | 检测按钮、链接等是否正常 |
| 性能影响 | 检测翻译是否影响页面性能 |

## 配置说明

`application.properties` 主要配置项：

```properties
# 服务端口
server.port=8080

# Claude API 配置
claude.api.key=${CLAUDE_API_KEY:}
claude.api.model=claude-sonnet-4-6
claude.api.base-url=https://api.anthropic.com

# Playwright 配置
playwright.headless=false        # 是否无头模式
playwright.timeout=60000         # 超时时间（毫秒）

# 审查配置
audit.max-rounds=10              # 最大审查轮次
audit.pass-score=10              # 通过分数
```

## 注意事项

1. **首次运行**会自动下载 Playwright 浏览器（约 300MB），需要等待几分钟
2. **API Key**：必须配置 Claude API Key 才能使用 AI 分析功能
3. **浏览器窗口**：分析过程中会弹出浏览器窗口，请勿手动操作
4. **网络环境**：需要能够正常访问 Claude API

## License

MIT License
