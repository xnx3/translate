# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**i18n-jsautotranslate** - 一个开源的网页自动翻译解决方案，仅需两行 JS 代码即可实现网页的多语言国际化。

- **NPM 包名**: i18n-jsautotranslate
- **当前版本**: 3.18.98
- **许可证**: MIT
- **作者**: 管雷鸣
- **仓库**: https://github.com/xnx3/translate

## 核心架构

### 主要目录结构

```
translate.js/          # 核心翻译引擎（12433行代码）
  ├── translate.js     # 主入口文件
  ├── translate.min.js # 压缩版本
  ├── debug.js         # 调试工具
  └── demo*.html       # 演示文件

extend/                # 框架扩展和集成
  ├── ArcoDesign/      # ArcoDesign Vue3 集成
  ├── naiveUI/         # NaiveUI 集成
  ├── vant/            # Vant 移动端 UI 集成
  ├── vue/             # Vue3 集成
  ├── react/           # React 集成
  ├── uniapp/          # UniApp 跨平台集成
  ├── chrome_plugin/   # Chrome 浏览器插件
  ├── wordpress/       # WordPress 插件
  ├── translate.core/  # Java 核心库（Maven 项目）
  ├── translate.service-admin/  # 翻译服务管理后台
  └── translate100/    # 轻量级翻译模型

deploy/                # 部署脚本
dev/                   # 开发工具
doc/                   # 文档
```

### 核心翻译引擎 (translate.js)

核心文件位于 `translate.js/translate.js`，包含以下主要模块：

- **translate.execute()** - 执行翻译的主方法
- **translate.listener** - 页面动态内容监控和自动翻译
- **translate.service** - 翻译服务管理（支持多个翻译通道）
- **translate.language** - 语言管理和切换
- **translate.selectLanguageTag** - 语言选择 UI 组件
- **translate.nomenclature** - 自定义翻译术语库
- **translate.ignore** - 忽略规则（id、class、tag、文本）
- **translate.config** - 配置导入导出
- **translate.whole** - 整体翻译能力配置
- **translate.element** - 元素属性翻译

**关键特性**：
- 三层缓存机制（浏览器缓存、预加载、文本预处理）
- 多线程加速翻译
- 自动语言识别
- 支持 100+ 语言
- SEO 友好（不改动源代码）

## 开发命令

### 版本管理

```bash
# 更新版本号（自动更新 translate.js 中的版本号）
npm run version

# 发布版本（自动 git push 和 push tags）
npm run postversion
```

**版本号格式**: `major.minor.patch.YYYYMMDD`

版本管理流程：
1. `dev/update-version.js` 从 `package.json` 读取版本
2. 自动写入 `translate.js/translate.js` 中的 version 字段
3. 自动执行 `git add translate.js/translate.js`
4. postversion 钩子自动执行 `git push && git push --tags`

### 各扩展项目的开发命令

**Vant Vue3 Demo** (`extend/vant/vue3/demo/`):
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本（包含 TypeScript 类型检查）
npm run preview      # 预览构建结果
```

**React Demo** (`extend/react/`):
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run lint         # 运行 ESLint 检查
npm run preview      # 预览构建结果
```

**Vue3 Demo** (`extend/vue/vue3/demo/`):
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
```

## 核心配置系统

translate.js 使用 `translate.config` 对象管理所有配置参数：

- **translate.config.get()** - 导出当前配置
- **translate.config.set(config)** - 导入配置

配置类定义在 `translate.config.data` 类中，包括：
- `documents` - 只翻译指定的元素
- `language` - 语言相关配置（本地语种、默认目标语种、URL 参数控制等）
- `images` - 图片翻译队列
- `nomenclature` - 自定义术语
- `listener` - 动态内容监听
- `ignore` - 忽略规则
- `service` - 翻译服务选择
- `whole` - 整体翻译配置

## 重要开发注意事项

### 修改核心 translate.js

1. **避免重复加载**: translate.js 有防重复加载机制，如果检测到重复加载会抛出错误
2. **版本号自动管理**: 版本号由 npm 脚本自动更新，位于 `// AUTO_VERSION_START` 和 `// AUTO_VERSION_END` 之间，不要手动修改
3. **配置参数**: 所有配置参数定义在 `translate.config.data` 类中，修改配置时需要同步更新这个类

### 扩展开发

**创建新的 UI 框架集成**:
1. 在 `extend/` 下创建新目录
2. 提供 `LanguageSelect` 组件（语言选择下拉框）
3. 提供 `translate.ts` 或 `translate.js` 配置文件
4. 创建 Demo 应用展示集成效果

**Vue3 集成模式**:
- 使用 `i18n-jsautotranslate` npm 包
- 在 `main.ts` 中引入并配置 translate
- 提供 `LanguageSelect.vue` 组件
- 支持 TypeScript

**React 集成模式**:
- 使用 Vite + React 19
- 在入口文件中引入 translate.js
- 创建语言切换组件

### NPM 包发布

发布到 npm 的文件（在 `package.json` 的 `files` 字段中定义）：
- `index.js`
- `ArcoDesign/Vue3/LanguageSelect.vue`
- `vue/vue3/LanguageSelect.vue`
- `vue/vue3/translateVue3TS.ts`
- `vue/vue3/translate.ts`
- `naiveUI/LanguageSelect.vue`

### 部署脚本

位于 `deploy/` 目录：
- `service.sh` - 服务部署
- `service_upgrade.sh` - 服务升级
- `install_translate.service.sh` - 服务安装
- `tcdn_install.sh` - CDN 安装
- `libreTranslate.sh` - LibreTranslate 集成

## 技术栈

**前端**:
- 原生 JavaScript（核心引擎）
- Vue 3 + TypeScript
- React 19
- Vite（构建工具）
- 多 UI 框架支持（ArcoDesign、NaiveUI、Vant、ElementUI、Layui）

**后端**:
- Java 1.8+（translate.core）
- Maven 构建

**跨平台**:
- Web 应用
- Chrome 浏览器插件
- UniApp（iOS/Android，不支持微信小程序）
- WordPress 插件

## 常见开发场景

### 添加新的翻译服务

修改 `translate.js/translate.js` 中的 `translate.service` 对象，添加新的服务实现。

### 修改语言选择组件

各框架的语言选择组件位于：
- ArcoDesign: `extend/ArcoDesign/Vue3/LanguageSelect.vue`
- NaiveUI: `extend/naiveUI/LanguageSelect.vue`
- Vue3: `extend/vue/vue3/LanguageSelect.vue`
- Vant: 在各 demo 项目中自定义

### 调试翻译问题

使用 `translate.js/debug.js` 调试工具：
- 提供可视化调试界面
- 自动检测翻译配置
- 显示翻译进度和错误信息

### 测试 iframe 注入

translate.js 支持自动注入 iframe 页面：
- 监听 iframe 的 src 属性变化
- 自动注入翻译脚本和配置
- 使用 `translate.config.get()` 和 `translate.config.set()` 传递配置

## 项目特点

1. **极简接入** - 仅需两行 JS 代码
2. **无需配置** - 自动识别语言，无需语言文件
3. **高性能** - 三层缓存、多线程加速、毫秒级翻译
4. **SEO 友好** - 不改动源代码，爬虫不受影响
5. **灵活扩展** - 丰富的配置选项和自定义能力
6. **私有部署** - 支持完全私有化部署
