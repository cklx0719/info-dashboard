# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
    RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段 - 使用nginx提供静态文件服务
FROM nginx:alpine

# 安装必要的工具
RUN apk add --no-cache tzdata

# 设置时区
ENV TZ=Asia/Shanghai

# 创建nginx配置目录
RUN mkdir -p /etc/nginx/conf.d

# 复制自定义nginx配置
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA路由支持
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# 从构建阶段复制静态文件
COPY --from=builder /app/build/client /usr/share/nginx/html

# 创建配置文件目录并设置权限
RUN mkdir -p /app/config && \
    chown -R nginx:nginx /app/config && \
    chown -R nginx:nginx /usr/share/nginx/html

# 复制API配置文件到可挂载目录
COPY --from=builder /app/app/config/api.ts /app/config/api.ts

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]