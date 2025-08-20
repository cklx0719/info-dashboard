// API配置文件 - 集中管理所有外部API地址
// 接口来源说明：
// - 本项目使用的API接口来源于 https://github.com/vikiboss/60s
// - 感谢 @vikiboss 提供的高质量、开源、可靠的API服务
// - 60秒读懂世界：来源于知乎日报等新闻聚合
// - 必应壁纸：Microsoft Bing官方壁纸API
// - 一言语录：Hitokoto官方API (https://hitokoto.cn/)
// - 翻译API：百度翻译API
// - 热搜数据：各平台官方API聚合
// - 其他功能：各种开源API整合

export const API_CONFIG = {
  // 基础URL - 使用60s API服务
  BASE_URL: 'https://60s-cf.viki.moe',
  
  // 60秒读懂世界 - 知乎日报API
  NEWS: 'https://60s-cf.viki.moe/v2/60s',
  
  // 必应壁纸 - Microsoft Bing官方API
  BING_WALLPAPER: 'https://60s-cf.viki.moe/v2/bing',
  
  // 一言语录 - Hitokoto官方API
  HITOKOTO: 'https://60s-cf.viki.moe/v2/hitokoto',
  
  // IP信息 - IP查询API
  IP_INFO: 'https://60s-cf.viki.moe/v2/ip',
  
  // 语言列表 - 百度翻译支持语言
  LANGUAGES: 'https://60s-cf.viki.moe/v2/fanyi/langs',
  
  // 翻译API - 百度翻译API
  TRANSLATE: 'https://60s-cf.viki.moe/v2/fanyi',
  
  // 运势查询 - 星座运势API
  LUCK: 'https://60s-cf.viki.moe/v2/luck',
  
  // 发病文学 - 随机文本生成
  SICK_TEXT: 'https://60s-cf.viki.moe/v2/fabing',
  
  // 随机歌曲 - 网易云音乐API
  RANDOM_MUSIC: 'https://60s-cf.viki.moe/v2/changya',
  
  // 历史上的今天 - 历史事件API
  HISTORY: 'https://60s-cf.viki.moe/v2/today_in_history',
  
  // 哔哩哔哩热搜 - B站官方API
  BILIBILI_HOT: 'https://60s-cf.viki.moe/v2/bili',
  
  // Epic免费游戏 - Epic Games官方API
  EPIC_GAMES: 'https://60s-cf.viki.moe/v2/epic',
  
  // 随机段子 - 笑话API
  RANDOM_JOKE: 'https://60s-cf.viki.moe/v2/duanzi',
  
  // 微博热搜 - 微博官方API
  WEIBO_HOT: 'https://60s-cf.viki.moe/v2/weibo',
  
  // 知乎热门 - 知乎官方API
  ZHIHU_HOT: 'https://60s-cf.viki.moe/v2/zhihu',
  
  // 抖音热搜 - 抖音官方API
  DOUYIN_HOT: 'https://60s-cf.viki.moe/v2/douyin',
  
  // 头条热搜 - 今日头条官方API
  TOUTIAO_HOT: 'https://60s-cf.viki.moe/v2/toutiao',
  
  // 哈希计算 - 本地计算服务
  HASH: 'https://60s-cf.viki.moe/v2/hash',
  
  // 汇率转换 - 实时汇率API
  EXCHANGE_RATE: 'https://60s-cf.viki.moe/v2/exchange_rate',
  
  // OG信息 - 网页元信息解析
  OG_INFO: 'https://60s-cf.viki.moe/v2/og'
};

// API请求的通用配置
export const API_OPTIONS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

// 获取完整的API URL
export const getApiUrl = (endpoint: keyof typeof API_CONFIG, params?: Record<string, string>) => {
  let url = API_CONFIG[endpoint];
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};