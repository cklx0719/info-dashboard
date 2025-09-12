# 信息聚合仪表板 (Info Dashboard)

一个现代化的单页面应用（SPA），集成多种实用信息查询功能，包括新闻、翻译、热搜、壁纸等。

[![GitHub Release](https://img.shields.io/github/v/release/cklx0719/info-dashboard)](https://github.com/cklx0719/info-dashboard/releases)
[![Docker Hub](https://img.shields.io/docker/v/cklx0719/info-dashboard?label=Docker%20Hub)](https://hub.docker.com/r/cklx0719/info-dashboard)
[![GitHub License](https://img.shields.io/github/license/cklx0719/info-dashboard)](https://github.com/cklx0719/info-dashboard/blob/master/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/cklx0719/info-dashboard)](https://github.com/cklx0719/info-dashboard)
[![GitHub Forks](https://img.shields.io/github/forks/cklx0719/info-dashboard)](https://github.com/cklx0719/info-dashboard)

## 🔗 项目链接

- **GitHub 仓库**: [https://github.com/cklx0719/info-dashboard](https://github.com/cklx0719/info-dashboard)
- **Docker Hub**: [https://hub.docker.com/r/cklx0719/info-dashboard](https://hub.docker.com/r/cklx0719/info-dashboard)
- **最新发布**: [v0.3.0](https://github.com/cklx0719/info-dashboard/releases/tag/v0.3.0)

## 功能特性

### 📊 信息聚合功能
- 📰 60秒读懂世界 - 每日新闻摘要
- 🌅 每日壁纸 - 精美壁纸展示
- 🔥 热搜榜单 - 实时热门话题（微博、知乎、抖音、今日头条、哔哩哔哩）
- 📅 历史上的今天 - 历史事件回顾
- 🎮 Epic免费游戏 - 每周免费游戏推荐
- 🎵 随机音乐 - 网易云音乐推荐

### 🛠️ 实用工具
- 🌐 在线翻译 - 多语言翻译服务
- 💱 汇率换算 - 实时汇率查询
- 🔐 哈希计算 - 文本哈希工具
- 🌍 IP信息查询 - 获取IP地址详细信息
- 🔗 网页信息提取 - OG标签信息获取

### 🎭 娱乐内容
- 📝 一言语录 - 随机名言警句
- 🎭 随机段子 - 轻松娱乐内容
- 😷 发病文学 - 随机文本生成
- 🔮 运势查询 - 每日运势预测

### 🚀 技术特性
- 🔄 **智能故障转移** - 多域名自动切换，确保服务稳定性
- ⚡️ **实时错误处理** - 友好的错误提示和自动重试机制
- 🌙 **深色模式** - 护眼主题切换
- 📱 **响应式设计** - 完美适配各种设备
- ⚡️ **热模块替换 (HMR)** - 开发时快速更新
- 📦 **资源打包和优化** - 高性能构建
- 🔒 **TypeScript 支持** - 类型安全
- 🎨 **TailwindCSS 样式** - 现代化UI设计

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### 开发模式

启动开发服务器：

```bash
npm run dev
```

应用将在 `http://localhost:5173` 运行。

### 🔧 API 配置与故障转移

本项目采用**智能故障转移机制**，确保服务的高可用性：

#### 多域名支持
```typescript
// app/config/api.ts
export const API_DOMAINS = [
  'https://top.ilib.vip',           // 当前默认域名
  'https://60s.viki.moe',           // 主域名 (Deno Deploy)
  'https://60s.b23.run',            // 备用域名 1
  'https://60s-cf.viki.moe',        // 备用域名 2 (CF Workers)
  'https://60s.114128.xyz',         // 备用域名 3
  'https://60s-cf.114128.xyz'       // 备用域名 4
]
```

#### 故障转移特性
- 🔄 **自动域名切换**: 当主域名不可用时，自动切换到备用域名
- ⏱️ **智能重试**: 每个域名支持最多3次重试，总超时时间5秒
- 📊 **失败记录**: 自动记录失败的域名，5分钟后重新尝试
- 🚨 **用户提示**: 切换到备用域名时会显示友好提示
- 🔍 **健康检查**: 支持手动检查所有域名的健康状态

#### 配置说明
```typescript
export const FAILOVER_CONFIG = {
  timeout: 5000,        // 请求超时时间(ms)
  retryDelay: 1000,     // 重试延迟(ms)
  maxRetries: 3,        // 每个域名最大重试次数
  enableFailover: true  // 是否启用故障转移
}
```

## 生产构建

创建生产版本：

```bash
npm run build
```

构建完成后，静态文件将生成在 `build/client/` 目录中。

## 部署

### 🐳 Docker 部署（推荐）

#### 使用 Docker Compose（推荐）

1. **下载配置文件**：
   ```bash
   wget https://raw.githubusercontent.com/cklx0719/info-dashboard/master/docker-compose.yml
   ```

2. **启动服务**：
   ```bash
   docker-compose up -d
   ```

3. **访问应用**：
   打开浏览器访问 `http://localhost:3000`

#### 使用 Docker 命令

```bash
# 拉取镜像
docker pull cklx0719/info-dashboard:latest

# 运行容器
docker run -d \
  --name info-dashboard \
  -p 3000:80 \
  -v ./config.json:/usr/share/nginx/html/config.json:ro \
  --restart unless-stopped \
  cklx0719/info-dashboard:latest
```

#### Docker 配置说明

- **端口映射**: 容器内部使用80端口，可映射到主机任意端口
- **配置文件映射**: 可挂载 `config.json` 配置文件自定义API地址
- **日志目录**: 可挂载 `/var/log/nginx` 查看访问日志
- **多架构支持**: 支持 `amd64` 和 `arm64` 架构

### 📦 静态文件部署

本项目是单页面应用（SPA），可以部署到任何静态文件托管服务：

1. **构建项目**：
   ```bash
   npm run build
   ```

2. **部署文件**：
   将 `build/client/` 目录下的所有文件上传到服务器：
   ```
   build/client/
   ├── assets/     # JS 和 CSS 文件
   ├── favicon.ico
   └── index.html  # 入口文件
   ```

3. **服务器配置**：
   配置服务器将所有路由请求重定向到 `index.html`

### 🛠️ 宝塔面板部署

1. 创建静态网站
2. 上传 `build/client/` 目录下的所有文件到网站根目录
3. 在 Nginx 配置中添加伪静态规则：
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

### ☁️ 其他平台

- **Vercel**: 直接连接 Git 仓库自动部署
- **Netlify**: 拖拽 `build/client/` 文件夹部署
- **GitHub Pages**: 上传静态文件到 gh-pages 分支
- **阿里云 OSS**: 开启静态网站托管功能

## 技术栈

- **前端框架**: React 18 + TypeScript
- **路由**: React Router v7 (SPA 模式)
- **构建工具**: Vite
- **样式**: TailwindCSS
- **状态管理**: React Hooks
- **图标**: Lucide React

## 📁 项目结构

```
app/
├── components/           # React 组件
│   ├── InfoDashboard.tsx # 主仪表板组件
│   ├── ThemeSelector.tsx # 主题切换组件
│   └── ui/              # UI 基础组件
├── config/              # 配置文件
│   ├── api.ts           # API 域名和端点配置
│   └── runtime-config.ts # 运行时配置管理
├── contexts/            # React Context
│   └── ThemeContext.tsx # 主题上下文
├── routes/              # 路由页面
│   └── home.tsx         # 首页组件
├── utils/               # 工具函数
│   ├── api-failover.ts  # API 故障转移逻辑
│   └── link-formatter.ts # 链接格式化工具
├── test/                # 测试文件
└── welcome/             # 欢迎页面资源
```

## 📡 接口来源

本项目使用的API接口来源于以下服务提供商，感谢他们的开源贡献：

- **60s API**: [github.com/vikiboss/60s](https://github.com/vikiboss/60s) - 提供新闻、壁纸、翻译、热搜等聚合API服务
- **Hitokoto**: [hitokoto.cn](https://hitokoto.cn) - 提供一言语录API服务
- **各平台官方API**: 微博、知乎、抖音、今日头条等热搜数据来源于各平台官方接口

> API服务由 [60s API](https://github.com/vikiboss/60s) 提供，感谢 [@vikiboss](https://github.com/vikiboss) 的开源贡献！

## 🙏 特别感谢

本项目使用的API服务来源于 [@vikiboss](https://github.com/vikiboss) 开发的 [60s API](https://github.com/vikiboss/60s) 项目。

感谢 @vikiboss 提供的高质量、开源、可靠、全球 CDN 加速的开放 API 集合，为开发者提供了便利的数据接口服务。

## 🙏 致谢

感谢以下开源项目和服务提供商：

- **[60s API](https://github.com/vikiboss/60s)** - 由 [@vikiboss](https://github.com/vikiboss) 开发的高质量、开源、可靠的API聚合服务
- [Hitokoto](https://hitokoto.cn) - 一言语录服务
- [React](https://reactjs.org) - 前端框架
- [Vite](https://vitejs.dev) - 构建工具
- [TailwindCSS](https://tailwindcss.com) - CSS框架
- [Lucide](https://lucide.dev) - 图标库

特别感谢 [@vikiboss](https://github.com/vikiboss) 提供的优秀开源项目 [60s API](https://github.com/vikiboss/60s)，为开发者提供了稳定可靠的API服务，让本项目能够顺利运行。

## 📄 许可证

本项目基于 MIT 许可证开源，详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

使用 ❤️ 和 React Router 构建 | [GitHub](https://github.com/cklx0719/info-dashboard) | [Docker Hub](https://hub.docker.com/r/cklx0719/info-dashboard)
