#!/bin/sh

# Docker容器启动脚本 - 支持环境变量配置

set -e

# 配置文件路径
CONFIG_FILE="/usr/share/nginx/html/config.json"
TEMP_CONFIG="/tmp/config.json"

# 默认配置
DEFAULT_BASE_URL="https://api.vvhan.com"
DEFAULT_WEIBO_ENDPOINT="/api/hotlist/wbHot"
DEFAULT_ZHIHU_ENDPOINT="/api/hotlist/zhihuHot"
DEFAULT_DOUYIN_ENDPOINT="/api/hotlist/douyinHot"
DEFAULT_TOUTIAO_ENDPOINT="/api/hotlist/toutiaoHot"

# 从环境变量获取配置，如果未设置则使用默认值
BASE_URL="${API_BASE_URL:-$DEFAULT_BASE_URL}"
WEIBO_ENDPOINT="${API_WEIBO_ENDPOINT:-$DEFAULT_WEIBO_ENDPOINT}"
ZHIHU_ENDPOINT="${API_ZHIHU_ENDPOINT:-$DEFAULT_ZHIHU_ENDPOINT}"
DOUYIN_ENDPOINT="${API_DOUYIN_ENDPOINT:-$DEFAULT_DOUYIN_ENDPOINT}"
TOUTIAO_ENDPOINT="${API_TOUTIAO_ENDPOINT:-$DEFAULT_TOUTIAO_ENDPOINT}"

echo "=== Info Dashboard Docker Container Starting ==="
echo "Base URL: $BASE_URL"
echo "Weibo Endpoint: $WEIBO_ENDPOINT"
echo "Zhihu Endpoint: $ZHIHU_ENDPOINT"
echo "Douyin Endpoint: $DOUYIN_ENDPOINT"
echo "Toutiao Endpoint: $TOUTIAO_ENDPOINT"
echo "================================================"

# 生成配置文件
cat > "$TEMP_CONFIG" << EOF
{
  "BASE_URL": "$BASE_URL",
  "description": "API配置文件 - Docker运行时配置",
  "version": "0.2.0",
  "endpoints": {
    "weibo": "$WEIBO_ENDPOINT",
    "zhihu": "$ZHIHU_ENDPOINT",
    "douyin": "$DOUYIN_ENDPOINT",
    "toutiao": "$TOUTIAO_ENDPOINT"
  }
}
EOF

# 检查配置文件是否为挂载的只读文件
if [ -f "$CONFIG_FILE" ] && [ ! -w "$CONFIG_FILE" ]; then
    echo "Configuration file is mounted as read-only, using mounted configuration."
    echo "Current mounted config content:"
    cat "$CONFIG_FILE" || echo "Failed to read mounted config file"
else
    # 如果配置文件不存在或者环境变量有变化，则更新配置文件
    if [ ! -f "$CONFIG_FILE" ] || ! cmp -s "$TEMP_CONFIG" "$CONFIG_FILE" 2>/dev/null; then
        echo "Updating configuration file..."
        cp "$TEMP_CONFIG" "$CONFIG_FILE" 2>/dev/null || echo "Warning: Could not update config file, using existing one"
        echo "Configuration updated successfully."
    else
        echo "Configuration file is up to date."
    fi
fi

# 清理临时文件
rm -f "$TEMP_CONFIG"

# 确保nginx用户有权限访问配置文件
if [ -w "$CONFIG_FILE" ]; then
    chown nginx:nginx "$CONFIG_FILE" 2>/dev/null || echo "Warning: Could not change ownership"
    chmod 644 "$CONFIG_FILE" 2>/dev/null || echo "Warning: Could not change permissions"
fi

echo "Final configuration content:"
cat "$CONFIG_FILE" 2>/dev/null || echo "Could not read final config file"

echo "Starting nginx..."

# 测试nginx配置
nginx -t || {
    echo "Nginx configuration test failed!"
    exit 1
}

# 启动nginx
exec nginx -g "daemon off;"