# 猫眼电影详情代理服务器部署指南

## 概述

这个代理服务器用于解决猫眼电影详情API的CORS问题，使前端能够正常获取电影详情数据。

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

- v1.0.0: 初始版本，支持猫眼电影详情API代理