// 简单的Express代理服务器
// 用于解决猫眼电影详情API的CORS问题
// 可以部署到Vercel、Railway等免费云平台

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

// 启用CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析JSON
app.use(express.json());

// 健康检查端点
app.get('/', (req, res) => {
  res.json({
    message: '猫眼电影详情代理服务器运行中',
    version: '1.0.0',
    endpoints: {
      movieDetail: '/api/movie/:movieId',
      health: '/'
    }
  });
});

// 猫眼电影详情代理端点
app.get('/api/movie/:movieId', async (req, res) => {
  const { movieId } = req.params;

  // 验证movieId
  if (!movieId || !/^\d+$/.test(movieId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid movieId parameter',
      message: '无效的电影ID参数'
    });
  }

  try {
    console.log(`正在获取电影详情: ${movieId}`);

    // 请求猫眼电影详情API
    const maoyanUrl = `https://m.maoyan.com/ajax/detailmovie?movieId=${movieId}`;
    
    const response = await fetch(maoyanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://m.maoyan.com/',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      timeout: 10000, // 10秒超时
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 检查响应数据
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response data');
    }

    console.log(`成功获取电影详情: ${movieId}`);

    // 设置缓存头（缓存1小时）
    res.set({
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Content-Type': 'application/json'
    });
    
    // 返回成功响应
    res.json({
      success: true,
      data: data,
      timestamp: Date.now(),
      movieId: movieId
    });

  } catch (error) {
    console.error(`获取电影详情失败 (${movieId}):`, error.message);
    
    // 返回错误响应
    res.status(500).json({
      success: false,
      error: error.message,
      message: '获取电影详情失败，请稍后重试',
      movieId: movieId,
      timestamp: Date.now()
    });
  }
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: '服务器内部错误'
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: '接口不存在'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 猫眼电影详情代理服务器启动成功`);
  console.log(`📡 服务器地址: http://localhost:${PORT}`);
  console.log(`🎬 电影详情API: http://localhost:${PORT}/api/movie/{movieId}`);
  console.log(`💡 示例: http://localhost:${PORT}/api/movie/1294273`);
});

export default app;