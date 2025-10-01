// 猫眼电影详情代理函数
// 通过本地代理访问猫眼API，解决CORS问题

interface MovieDetail {
  id: number;
  nm: string; // 电影名称
  img: string; // 海报图片
  url: string; // 详情页URL
  sc: number; // 评分
  dur: number; // 时长
  cat: string; // 类型
  star: string; // 主演
  rt: string; // 上映时间
  wish: number; // 想看人数
  watched: number; // 看过人数
  pubDesc: string; // 上映描述
  scm: string; // 评分描述
}

interface MaoyanDetailResponse {
  success: boolean;
  data?: MovieDetail;
  error?: string;
}

/**
 * 通过Express代理服务器获取猫眼电影详情
 * @param movieId 电影ID
 * @returns 电影详情数据
 */
export async function fetchMovieDetailProxy(movieId: string | number): Promise<MaoyanDetailResponse> {
  try {
    // 使用Express代理服务器
    // 在生产环境中，这个URL应该指向部署的代理服务器
    const proxyBaseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-proxy-server.vercel.app' // 替换为实际的代理服务器地址
      : 'http://localhost:3001';
    
    const apiUrl = `${proxyBaseUrl}/api/movie/${movieId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // 10秒超时
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Express代理服务器返回的格式：{ success: boolean, data?: any, error?: string }
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.detailMovie || result.data.data || result.data // 适配猫眼API的嵌套结构
      };
    } else {
      return {
        success: false,
        error: result.error || result.message || '获取电影详情失败'
      };
    }
  } catch (error) {
    console.error('获取电影详情失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '网络请求失败'
    };
  }
}

/**
 * 主要的电影详情获取函数
 * 直接使用本地代理服务器获取电影详情
 */
export async function getMovieDetail(movieId: string | number): Promise<MaoyanDetailResponse> {
  // 直接使用本地代理服务器
  return await fetchMovieDetailProxy(movieId);
}