// API配置文件 - 集中管理所有外部API地址
// 接口来源说明：
// - 60秒读懂世界：来源于知乎日报等新闻聚合
// - 必应壁纸：Microsoft Bing官方壁纸API
// - 一言语录：Hitokoto官方API (https://hitokoto.cn/)
// - 翻译API：百度翻译API
// - 热搜数据：各平台官方API聚合
// - 其他功能：各种开源API整合

export const API_CONFIG = {
  // 基础URL - 使用官方API聚合服务
  BASE_URL: 'https://top.ilib.vip',
  
  // 60秒读懂世界 - 知乎日报API
  NEWS: 'https://top.ilib.vip/api/60s',
  
  // 必应壁纸 - Microsoft Bing官方API
  BING_WALLPAPER: 'https://top.ilib.vip/api/bing',
  
  // 一言语录 - Hitokoto官方API
  HITOKOTO: 'https://top.ilib.vip',
  
  // IP信息 - IP查询API
  IP_INFO: 'https://top.ilib.vip/api/getIpInfo',
  
  // 语言列表 - 百度翻译支持语言
  LANGUAGES: 'https://top.ilib.vip/api/fanyi/langs',
  
  // 翻译API - 百度翻译API
  TRANSLATE: 'https://top.ilib.vip/api/fanyi',
  
  // 运势查询 - 星座运势API
  LUCK: 'https://top.ilib.vip/api/horoscope',
  
  // 发病文学 - 随机文本生成
  SICK_TEXT: 'https://top.ilib.vip/api/text/love',
  
  // 随机歌曲 - 网易云音乐API
  RANDOM_MUSIC: 'https://top.ilib.vip/api/music/netease',
  
  // 历史上的今天 - 历史事件API
  HISTORY: 'https://top.ilib.vip/api/history',
  
  // 哔哩哔哩热搜 - B站官方API
  BILIBILI_HOT: 'https://top.ilib.vip/api/bilihot',
  
  // Epic免费游戏 - Epic Games官方API
  EPIC_GAMES: 'https://top.ilib.vip/api/epic',
  
  // 随机段子 - 笑话API
  RANDOM_JOKE: 'https://top.ilib.vip/api/text/joke',
  
  // 微博热搜 - 微博官方API
  WEIBO_HOT: 'https://top.ilib.vip/api/weibohot',
  
  // 知乎热门 - 知乎官方API
  ZHIHU_HOT: 'https://top.ilib.vip/api/zhihuhot',
  
  // 抖音热搜 - 抖音官方API
  DOUYIN_HOT: 'https://top.ilib.vip/api/douyinhot',
  
  // 头条热搜 - 今日头条官方API
  TOUTIAO_HOT: 'https://top.ilib.vip/api/toutiaohot',
  
  // 哈希计算 - 本地计算服务
  HASH: 'https://top.ilib.vip/api/hash',
  
  // 汇率转换 - 实时汇率API
  EXCHANGE_RATE: 'https://top.ilib.vip/api/exchange',
  
  // OG信息 - 网页元信息解析
  OG_INFO: 'https://top.ilib.vip/api/og'
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