# 猫眼电影详情代理服务器部署指南

## 概述

这个代理服务器用于解决猫眼电影详情API的CORS问题，使前端能够正常获取电影详情数据。

## 🐳 Docker部署（推荐）

**v0.4.2版本开始，Docker镜像已内置nginx反向代理，无需单独部署代理服务器！**

### 特性
- ✅ 内置nginx反向代理，自动处理CORS问题
- ✅ 使用supervisor管理nginx和Node.js代理服务器
- ✅ 统一80端口对外提供服务
- ✅ 自动路由 `/api/movie/` 到内部代理服务器

### 部署方式

#### 使用Docker Compose
```bash
docker-compose up -d
```

#### 使用Docker命令
```bash
docker run -d \
  --name info-dashboard \
  -p 3000:80 \
  --restart unless-stopped \
  cklx0719/info-dashboard:v0.4.2
```

### 宝塔面板反向代理配置

如果你使用宝塔面板，可以这样配置nginx反向代理：

```nginx
# 主应用反向代理
location / {
    proxy_pass http://127.0.0.1:3090;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# 电影API反向代理（可选，如果需要单独处理）
location /api/movie/ {
    proxy_pass http://127.0.0.1:3090/api/movie/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS 处理
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

> **注意**: 如果你的Docker容器映射到3090端口，上述配置中的端口号需要相应调整。

## 本地开发

### 安装依赖
```bash
npm install express cors node-fetch@2.6.7
```

### 启动服务器
```bash
node proxy-server.js
```

服务器将在 `http://localhost:3001` 启动。

### API端点
- 健康检查: `GET /`
- 电影详情: `GET /api/movie/:movieId`

### 示例请求
```bash
curl "http://localhost:3001/api/movie/1294273"
```

## 云平台部署

### 方案一：Vercel部署

1. 安装Vercel CLI
```bash
npm i -g vercel
```

2. 登录Vercel
```bash
vercel login
```

3. 部署项目
```bash
vercel --prod
```

4. 配置环境变量
- `NODE_ENV`: `production`

### 方案二：Railway部署

1. 访问 [Railway.app](https://railway.app)
2. 连接GitHub仓库
3. 选择项目目录
4. Railway会自动检测并部署Node.js应用

### 方案三：Render部署

1. 访问 [Render.com](https://render.com)
2. 创建新的Web Service
3. 连接GitHub仓库
4. 配置构建命令: `npm install`
5. 配置启动命令: `node proxy-server.js`

## 前端配置

部署完成后，需要修改前端代码中的代理服务器地址：

```typescript
// app/utils/maoyan-proxy.ts
const proxyBaseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-deployed-proxy-server.vercel.app' // 替换为实际部署地址
  : 'http://localhost:3001';
```

## 环境变量

- `PORT`: 服务器端口（默认3001）
- `NODE_ENV`: 环境类型（development/production）

## 安全考虑

1. 代理服务器已配置CORS，允许所有来源访问
2. 设置了请求超时（10秒）
3. 添加了错误处理和日志记录
4. 设置了缓存头（1小时）

## 监控和维护

- 检查服务器日志以监控API调用
- 定期检查猫眼API是否有变化
- 监控服务器响应时间和可用性

## 故障排除

### 常见问题

1. **CORS错误**: 确保代理服务器正在运行且配置正确
2. **超时错误**: 检查网络连接和猫眼API状态
3. **404错误**: 确认API端点路径正确

### 调试步骤

1. 检查代理服务器是否正在运行
2. 测试代理API端点是否响应
3. 检查前端请求URL是否正确
4. 查看浏览器网络面板和控制台错误

## 更新日志

- v0.4.2: 🎉 **重大更新** - Docker镜像内置nginx反向代理，无需单独部署代理服务器
  - 新增supervisor管理多个服务
  - 新增nginx反向代理配置
  - 统一80端口对外提供服务
  - 自动处理CORS问题
  - 简化部署流程
- v1.0.0: 初始版本，支持猫眼电影详情API代理