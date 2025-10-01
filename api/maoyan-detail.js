// Vercel API函数 - 猫眼电影详情代理
// 解决CORS问题，支持生产环境部署

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许GET请求
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { movieId } = req.query;

  // 验证movieId参数
  if (!movieId) {
    res.status(400).json({ 
      error: 'Missing movieId parameter',
      message: '缺少movieId参数' 
    });
    return;
  }

  try {
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

    // 设置缓存头（缓存1小时）
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    
    // 返回成功响应
    res.status(200).json({
      success: true,
      data: data,
      timestamp: Date.now(),
      movieId: movieId
    });

  } catch (error) {
    console.error('猫眼API请求失败:', error);
    
    // 返回错误响应
    res.status(500).json({
      success: false,
      error: error.message,
      message: '获取电影详情失败，请稍后重试',
      movieId: movieId,
      timestamp: Date.now()
    });
  }
}