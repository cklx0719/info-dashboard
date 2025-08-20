# 信息聚合仪表板 (Info Dashboard)

一个现代化的单页面应用（SPA），集成多种实用信息查询功能，包括新闻、翻译、热搜、壁纸等。

[![Docker Hub](https://img.shields.io/docker/v/cklx0719/info-dashboard?label=Docker%20Hub)](https://hub.docker.com/r/cklx0719/info-dashboard)
[![GitHub](https://img.shields.io/github/license/cklx0719/info-dashboard)](https://github.com/cklx0719/info-dashboard)
[![Version](https://img.shields.io/badge/version-0.2.0-blue)](https://github.com/cklx0719/info-dashboard)

## 功能特性

- 📰 60秒读懂世界 - 每日新闻摘要
- 🌅 每日壁纸 - 精美壁纸展示
- 🔥 热搜榜单 - 实时热门话题
- 🌐 在线翻译 - 多语言翻译服务
- 📝 一言语录 - 随机名言警句
- 🎭 随机段子 - 轻松娱乐内容
- 🔮 运势查询 - 每日运势预测
- 💱 汇率换算 - 实时汇率查询
- 🔐 哈希计算 - 文本哈希工具
- 🌙 深色模式 - 护眼主题切换
- ⚡️ 热模块替换 (HMR)
- 📦 资源打包和优化
- 🔒 TypeScript 支持
- 🎨 TailwindCSS 样式

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

### API 配置

所有外部 API 地址都在 `app/config/api.ts` 文件中集中管理：

```typescript
export const API_CONFIG = {
  NEWS: 'https://api.vvhan.com/api/60s',
  BING_WALLPAPER: 'https://api.vvhan.com/api/bing',
  TRANSLATE: 'https://api.vvhan.com/api/fanyi',
  HITOKOTO: 'https://v1.hitokoto.cn',
  // ... 其他 API 配置
};
```

如需修改 API 地址，只需编辑此配置文件即可。

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
   wget https://raw.githubusercontent.com/cklx0719/info-dashboard/main/docker-compose.yml
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
  -v $(pwd)/app/config/api.ts:/app/config/api.ts:ro \
  --restart unless-stopped \
  cklx0719/info-dashboard:latest
```

#### Docker 配置说明

- **端口映射**: 容器内部使用80端口，可映射到主机任意端口
- **配置文件映射**: 可挂载 `api.ts` 配置文件自定义API地址
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

## 项目结构

```
app/
├── components/     # 可复用组件
├── config/        # 配置文件
│   └── api.ts     # API 地址配置
├── pages/         # 页面组件
└── utils/         # 工具函数
```

## 📡 接口来源

本项目使用的API接口来源于以下服务提供商，感谢他们的开源贡献：

- **韩小韩API**: [api.vvhan.com](https://api.vvhan.com) - 提供新闻、壁纸、翻译、热搜等聚合API服务
- **Hitokoto**: [hitokoto.cn](https://hitokoto.cn) - 提供一言语录API服务
- **各平台官方API**: 微博、知乎、抖音、今日头条等热搜数据来源于各平台官方接口

## 🙏 致谢

感谢以下开源项目和服务提供商：

- [韩小韩API](https://api.vvhan.com) - 免费API聚合服务
- [Hitokoto](https://hitokoto.cn) - 一言语录服务
- [React](https://reactjs.org) - 前端框架
- [Vite](https://vitejs.dev) - 构建工具
- [TailwindCSS](https://tailwindcss.com) - CSS框架
- [Lucide](https://lucide.dev) - 图标库

## 📄 许可证

本项目基于 MIT 许可证开源，详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

使用 ❤️ 和 React Router 构建 | [GitHub](https://github.com/cklx0719/info-dashboard) | [Docker Hub](https://hub.docker.com/r/cklx0719/info-dashboard)
