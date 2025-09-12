// v2配置文件 - 集中管理所有外部v2地址
// 接口来源说明：
// - 本项目使用的API接口来源于 https://github.com/vikiboss/60s 项目
// - 感谢原作者 Viki 提供的高质量、开源、可靠的API服务
// - 60秒读懂世界：来源于知乎日报等新闻聚合
// - 必应壁纸：Microsoft Bing官方壁纸v2
// - 一言语录：Hitokoto官方v2 (https://hitokoto.cn/)
// - 翻译v2：百度翻译v2
// - 热搜数据：各平台官方v2聚合
// - 其他功能：各种开源v2整合

// API域名配置 - 支持故障转移
export const API_DOMAINS = [
  'https://top.ilib.vip',           // 当前默认域名
  'https://60s.viki.moe',           // 主域名 (Deno Deploy)
  'https://60s.b23.run',            // 备用域名 1 (Deno Deploy)
  'https://60s-cf.viki.moe',        // 备用域名 2 (CF Workers)
  'https://60s.114128.xyz',         // 备用域名 3 (Deno Deploy)
  'https://60s-cf.114128.xyz'       // 备用域名 4 (CF Workers)
]

// API接口路径配置
export const API_ENDPOINTS = {
  SIXTY_SECONDS: '/v2/60s',
  BING: '/v2/bing',
  HISTORY: '/v2/today_in_history',
  BILI: '/v2/bili',
  WEIBO: '/v2/weibo',
  ZHIHU: '/v2/zhihu',
  DOUYIN: '/v2/douyin',
  TOUTIAO: '/v2/toutiao',
  EPIC: '/v2/epic',
  WEATHER: '/v2/weather',
  BAIKE: '/v2/baike',
  FANYI: '/v2/fanyi',
  QRCODE: '/v2/qrcode',
  IP: '/v2/ip',
  LUNAR: '/v2/lunar',
  HASH: '/v2/hash',
  PASSWORD: '/v2/password',
  COLOR: '/v2/color',
  KFC: '/v2/kfc',
  HITOKOTO: '/v2/hitokoto',
  DUANZI: '/v2/duanzi',
  ANSWER: '/v2/answer',
  LUCK: '/v2/luck',
  CHEMICAL: '/v2/chemical',
  CHANGYA: '/v2/changya',
  FABING: '/v2/fabing',
  DAD_JOKE: '/v2/dad-joke',
  AWESOME_JS: '/v2/awesome-js',
  HEALTH: '/v2/health',
  EXCHANGE_RATE: '/v2/exchange_rate',
  AI_NEWS: '/v2/ai-news',
  HACKER_NEWS: '/v2/hacker-news',
  MAOYAN: '/v2/maoyan',
  NCM_RANK: '/v2/ncm-rank',
  REDNOTE: '/v2/rednote',
  BAIDU_REALTIME: '/v2/baidu/realtime',
  BAIDU_TELEPLAY: '/v2/baidu/teleplay',
  BAIDU_TIEBA: '/v2/baidu/tieba',
  DONGCHEDI: '/v2/dongchedi',
  WEATHER_FORECAST: '/v2/weather/forecast',
  FANYI_LANGS: '/v2/fanyi/langs',
  PASSWORD_CHECK: '/v2/password/check',
  COLOR_PALETTE: '/v2/color/palette',
  OG: '/v2/og'
}

// 兼容性：保持原有的v2_CONFIG结构
export const v2_CONFIG = {
  // 基础URL - 使用官方v2聚合服务
  BASE_URL: API_DOMAINS[0],
  
  // 60秒读懂世界 - 知乎日报v2
  NEWS: API_DOMAINS[0] + API_ENDPOINTS.SIXTY_SECONDS,
  
  // 必应壁纸 - Microsoft Bing官方v2
  BING_WALLPAPER: API_DOMAINS[0] + API_ENDPOINTS.BING,
  
  // 一言语录 - Hitokoto官方v2
  HITOKOTO: API_DOMAINS[0] + API_ENDPOINTS.HITOKOTO,
  
  // IP信息 - IP查询v2
  IP_INFO: API_DOMAINS[0] + API_ENDPOINTS.IP,
  
  // 语言列表 - 百度翻译支持语言
  LANGUAGES: API_DOMAINS[0] + API_ENDPOINTS.FANYI_LANGS,
  
  // 翻译v2 - 百度翻译v2
  TRANSLATE: API_DOMAINS[0] + API_ENDPOINTS.FANYI,
  
  // 运势查询 - 星座运势v2
  LUCK: API_DOMAINS[0] + API_ENDPOINTS.LUCK,
  
  // 发病文学 - 随机文本生成
  SICK_TEXT: API_DOMAINS[0] + API_ENDPOINTS.FABING,
  
  // 随机歌曲 - 网易云音乐v2
  RANDOM_MUSIC: API_DOMAINS[0] + API_ENDPOINTS.CHANGYA,
  
  // 历史上的今天 - 历史事件v2
  HISTORY: API_DOMAINS[0] + API_ENDPOINTS.HISTORY,
  
  // 哔哩哔哩热搜 - B站官方v2
  BILIBILI_HOT: API_DOMAINS[0] + API_ENDPOINTS.BILI,
  
  // Epic免费游戏 - Epic Games官方v2
  EPIC_GAMES: API_DOMAINS[0] + API_ENDPOINTS.EPIC,
  
  // 随机段子 - 笑话v2
  RANDOM_JOKE: API_DOMAINS[0] + API_ENDPOINTS.DUANZI,
  
  // 微博热搜 - 微博官方v2
  WEIBO_HOT: API_DOMAINS[0] + API_ENDPOINTS.WEIBO,
  
  // 知乎热门 - 知乎官方v2
  ZHIHU_HOT: API_DOMAINS[0] + API_ENDPOINTS.ZHIHU,
  
  // 抖音热搜 - 抖音官方v2
  DOUYIN_HOT: API_DOMAINS[0] + API_ENDPOINTS.DOUYIN,
  
  // 头条热搜 - 今日头条官方v2
  TOUTIAO_HOT: API_DOMAINS[0] + API_ENDPOINTS.TOUTIAO,
  
  // 哈希计算 - 本地计算服务
  HASH: API_DOMAINS[0] + API_ENDPOINTS.HASH,
  
  // 汇率转换 - 实时汇率v2
  EXCHANGE_RATE: API_DOMAINS[0] + API_ENDPOINTS.EXCHANGE_RATE,
  
  // OG信息 - 网页元信息解析
  OG_INFO: API_DOMAINS[0] + API_ENDPOINTS.OG
};

// API故障转移配置
export const FAILOVER_CONFIG = {
  timeout: 5000,        // 请求超时时间(ms)
  retryDelay: 1000,     // 重试延迟(ms)
  maxRetries: 3,        // 每个域名最大重试次数
  enableFailover: true  // 是否启用故障转移
}

// API请求的通用配置
export const API_OPTIONS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

// 获取完整的API URL
export const getApiUrl = (endpoint: keyof typeof v2_CONFIG, params?: Record<string, string>) => {
  let url = v2_CONFIG[endpoint];
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};

// 故障转移API请求函数
export const getApiUrlWithFailover = (endpointPath: keyof typeof API_ENDPOINTS, params?: Record<string, string>) => {
  const path = API_ENDPOINTS[endpointPath];
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  
  return API_DOMAINS.map(domain => `${domain}${path}${queryString}`);
};