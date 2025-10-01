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

# 生产阶段 - 使用nginx提供静态文件服务，同时运行Node.js代理服务器
FROM nginx:alpine

# 安装必要的工具和Node.js
RUN apk add --no-cache tzdata nodejs npm supervisor

# 设置时区
ENV TZ=Asia/Shanghai

# 创建nginx配置目录
RUN mkdir -p /etc/nginx/conf.d

# 创建nginx配置
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html index.htm;
    
    # 代理服务器API
    location /api/movie/ {
        proxy_pass http://localhost:3001/api/movie/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization";
        
        if (\$request_method = OPTIONS) {
            return 204;
        }
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

# 复制配置文件到静态目录（可被挂载覆盖）
COPY --from=builder /app/public/config.json /usr/share/nginx/html/config.json

# 创建配置文件目录并设置权限
RUN mkdir -p /app/config && \
    chown -R nginx:nginx /app/config && \
    chown -R nginx:nginx /usr/share/nginx/html

# 复制配置文件到可挂载目录（用于docker-compose挂载）
COPY --from=builder /app/public/config.json /app/config/config.json

# 复制代理服务器文件
COPY --from=builder /app/proxy-server.js /app/proxy-server.js
COPY --from=builder /app/proxy-package.json /app/package.json
COPY --from=builder /app/api /app/api

# 安装代理服务器依赖
WORKDIR /app
RUN npm install --production

# 创建supervisor配置目录和日志目录
RUN mkdir -p /etc/supervisor/conf.d /var/log/supervisor
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:nginx]
command=nginx -g "daemon off;"
autostart=true
autorestart=true
stderr_logfile=/var/log/nginx/error.log
stdout_logfile=/var/log/nginx/access.log

[program:proxy-server]
command=node /app/proxy-server.js
directory=/app
autostart=true
autorestart=true
stderr_logfile=/var/log/proxy-server.log
stdout_logfile=/var/log/proxy-server.log
environment=NODE_ENV=production,PORT=3001
EOF

# 复制启动脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 暴露端口（只暴露80，3001通过nginx内部反代）
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# 使用supervisor启动多个服务
ENTRYPOINT ["/docker-entrypoint.sh"]