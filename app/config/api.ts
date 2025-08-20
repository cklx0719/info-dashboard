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

export const v2_CONFIG = {
  // 基础URL - 使用官方v2聚合服务
  BASE_URL: 'https://60s-cf.viki.moe',
  
  // 60秒读懂世界 - 知乎日报v2
  NEWS: 'https://60s-cf.viki.moe/v2/60s',
  
  // 必应壁纸 - Microsoft Bing官方v2
  BING_WALLPAPER: 'https://60s-cf.viki.moe/v2/bing',
  
  // 一言语录 - Hitokoto官方v2
  HITOKOTO: 'https://60s-cf.viki.moe/v2/hitokoto',
  
  // IP信息 - IP查询v2
  IP_INFO: 'https://60s-cf.viki.moe/v2/ip',
  
  // 语言列表 - 百度翻译支持语言
  LANGUAGES: 'https://60s-cf.viki.moe/v2/fanyi/langs',
  
  // 翻译v2 - 百度翻译v2
  TRANSLATE: 'https://60s-cf.viki.moe/v2/fanyi',
  
  // 运势查询 - 星座运势v2
  LUCK: 'https://60s-cf.viki.moe/v2/luck',
  
  // 发病文学 - 随机文本生成
  SICK_TEXT: 'https://60s-cf.viki.moe/v2/fabing',
  
  // 随机歌曲 - 网易云音乐v2
  RANDOM_MUSIC: 'https://60s-cf.viki.moe/v2/changya',
  
  // 历史上的今天 - 历史事件v2
  HISTORY: 'https://60s-cf.viki.moe/v2/today_in_history',
  
  // 哔哩哔哩热搜 - B站官方v2
  BILIBILI_HOT: 'https://60s-cf.viki.moe/v2/bili',
  
  // Epic免费游戏 - Epic Games官方v2
  EPIC_GAMES: 'https://60s-cf.viki.moe/v2/epic',
  
  // 随机段子 - 笑话v2
  RANDOM_JOKE: 'https://60s-cf.viki.moe/v2/duanzi',
  
  // 微博热搜 - 微博官方v2
  WEIBO_HOT: 'https://60s-cf.viki.moe/v2/weibo',
  
  // 知乎热门 - 知乎官方v2
  ZHIHU_HOT: 'https://60s-cf.viki.moe/v2/zhihu',
  
  // 抖音热搜 - 抖音官方v2
  DOUYIN_HOT: 'https://60s-cf.viki.moe/v2/douyin',
  
  // 头条热搜 - 今日头条官方v2
  TOUTIAO_HOT: 'https://60s-cf.viki.moe/v2/toutiao',
  
  // 哈希计算 - 本地计算服务
  HASH: 'https://60s-cf.viki.moe/v2/hash',
  
  // 汇率转换 - 实时汇率v2
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