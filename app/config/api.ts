// API配置文件 - 集中管理所有外部API地址
// 接口来源说明：
// - 本项目使用的API接口来源于 https://github.com/vikiboss/60s 项目
// - 感谢原作者 Viki 提供的高质量、开源、可靠的API服务
// - 60秒读懂世界：来源于知乎日报等新闻聚合
// - 必应壁纸：Microsoft Bing官方壁纸API
// - 一言语录：Hitokoto官方API (https://hitokoto.cn/)
// - 翻译API：百度翻译API
// - 热搜数据：各平台官方API聚合
// - 其他功能：各种开源API整合

// 配置类型定义
interface ApiConfig {
  API_DOMAINS: {
    primary: string;
    fallback: string[];
    description: {
      primary: string;
      fallback: string[];
    };
  };
  FAILOVER_CONFIG: {
    timeout: number;
    retryDelay: number;
    maxRetries: number;
    enableFailover: boolean;
    description: {
      timeout: string;
      retryDelay: string;
      maxRetries: string;
      enableFailover: string;
    };
  };
  API_ENDPOINTS: Record<string, string>;
  API_OPTIONS: {
    method: string;
    headers: Record<string, string>;
  };
}

// 配置加载函数
let cachedConfig: ApiConfig | null = null;

export const loadConfig = async (): Promise<ApiConfig> => {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    let configData: ApiConfig;
    
    if (typeof window !== 'undefined') {
      // 浏览器环境
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch config.json: ${response.status}`);
      }
      configData = await response.json();
    } else {
      // Node.js环境
      const fs = await import('fs');
      const path = await import('path');
      const configPath = path.resolve(process.cwd(), 'config.json');
      const configText = fs.readFileSync(configPath, 'utf-8');
      configData = JSON.parse(configText);
    }
    
    cachedConfig = configData;
    return configData;
  } catch (error) {
    console.error('Failed to load config.json:', error);
    throw new Error('Configuration file is required but could not be loaded');
  }
};

// 同步获取配置（必须先调用loadConfig）
export const getConfig = (): ApiConfig => {
  if (!cachedConfig) {
    throw new Error('Configuration not loaded. Please call loadConfig() first.');
  }
  return cachedConfig;
};

// 配置初始化状态
let configInitialized = false;
let configPromise: Promise<ApiConfig> | null = null;

// 初始化配置
export const initConfig = async (): Promise<ApiConfig> => {
  if (!configPromise) {
    configPromise = loadConfig();
  }
  const config = await configPromise;
  configInitialized = true;
  return config;
};

// 获取配置（确保已初始化）
const getInitializedConfig = async (): Promise<ApiConfig> => {
  if (!configInitialized) {
    return await initConfig();
  }
  return getConfig();
};

// 导出配置获取函数
export const getApiDomains = async (): Promise<string[]> => {
  const config = await getInitializedConfig();
  return [config.API_DOMAINS.primary, ...config.API_DOMAINS.fallback];
};

export const getApiEndpoints = async (): Promise<Record<string, string>> => {
  const config = await getInitializedConfig();
  return config.API_ENDPOINTS;
};

export const getFailoverConfig = async () => {
  const config = await getInitializedConfig();
  return config.FAILOVER_CONFIG;
};

export const getApiOptions = async () => {
  const config = await getInitializedConfig();
  return config.API_OPTIONS;
};

// 兼容性：保持原有的v2_CONFIG结构（异步版本）
export const getV2Config = async () => {
  const config = await getInitializedConfig();
  const domains = [config.API_DOMAINS.primary, ...config.API_DOMAINS.fallback];
  const endpoints = config.API_ENDPOINTS;
  const baseUrl = domains[0];
  
  return {
    // 基础URL - 使用官方API聚合服务
    BASE_URL: baseUrl,
    
    // 60秒读懂世界 - 知乎日报API
    NEWS: baseUrl + endpoints.NEWS,
    
    // 必应壁纸 - Microsoft Bing官方API
    BING_WALLPAPER: baseUrl + endpoints.BING_WALLPAPER,
    
    // 一言语录 - Hitokoto官方API
    HITOKOTO: baseUrl + endpoints.HITOKOTO,
    
    // IP信息 - IP查询API
    IP_INFO: baseUrl + endpoints.IP_INFO,
    
    // 语言列表 - 百度翻译支持语言
    LANGUAGES: baseUrl + endpoints.LANGUAGES,
    
    // 翻译API - 百度翻译API
    TRANSLATE: baseUrl + endpoints.TRANSLATE,
    
    // 运势查询 - 星座运势API
    LUCK: baseUrl + endpoints.LUCK,
    
    // 发病文学 - 随机文本生成
    SICK_TEXT: baseUrl + endpoints.SICK_TEXT,
    
    // 随机歌曲 - 网易云音乐API
    RANDOM_MUSIC: baseUrl + endpoints.RANDOM_MUSIC,
    
    // 历史上的今天 - 历史事件API
    HISTORY: baseUrl + endpoints.HISTORY,
    
    // 哔哩哔哩热搜 - B站官方API
    BILIBILI_HOT: baseUrl + endpoints.BILIBILI_HOT,
    
    // Epic免费游戏 - Epic Games官方API
    EPIC_GAMES: baseUrl + endpoints.EPIC_GAMES,
    
    // 随机段子 - 笑话API
    RANDOM_JOKE: baseUrl + endpoints.RANDOM_JOKE,
    
    // 微博热搜 - 微博官方API
    WEIBO_HOT: baseUrl + endpoints.WEIBO_HOT,
    
    // 知乎热门 - 知乎官方API
    ZHIHU_HOT: baseUrl + endpoints.ZHIHU_HOT,
    
    // 抖音热搜 - 抖音官方API
    DOUYIN_HOT: baseUrl + endpoints.DOUYIN_HOT,
    
    // 头条热搜 - 今日头条官方API
    TOUTIAO_HOT: baseUrl + endpoints.TOUTIAO_HOT,
    
    // 哈希计算 - 本地计算服务
    HASH: baseUrl + endpoints.HASH,
    
    // 汇率转换 - 实时汇率API
    EXCHANGE_RATE: baseUrl + endpoints.EXCHANGE_RATE,
    
    // OG信息 - 网页元信息解析
    OG_INFO: baseUrl + endpoints.OG_INFO
  };
};

// 获取完整的API URL（异步版本）
export const getApiUrl = async (endpoint: string, params?: Record<string, string>) => {
  const v2Config = await getV2Config();
  let url = v2Config[endpoint as keyof typeof v2Config];
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};

// 故障转移API请求函数（异步版本）
export const getApiUrlWithFailover = async (endpointKey: string, params?: Record<string, string>) => {
  const endpoints = await getApiEndpoints();
  const domains = await getApiDomains();
  const path = endpoints[endpointKey];
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  
  return domains.map(domain => `${domain}${path}${queryString}`);
};

// 动态配置更新函数
export const updateDomains = async () => {
  try {
    // 重置配置状态，强制重新加载
    configInitialized = false;
    configPromise = null;
    cachedConfig = null;
    
    await initConfig();
    console.log('Configuration updated successfully');
  } catch (error) {
    console.error('Failed to update configuration:', error);
  }
};

// 获取当前主域名（异步版本）
export const getPrimaryDomain = async (): Promise<string> => {
  const domains = await getApiDomains();
  return domains[0];
};

// 获取所有备用域名（异步版本）
export const getFallbackDomains = async (): Promise<string[]> => {
  const domains = await getApiDomains();
  return domains.slice(1);
};

// 检查故障转移是否启用（异步版本）
export const isFailoverEnabled = async (): Promise<boolean> => {
  const failoverConfig = await getFailoverConfig();
  return failoverConfig.enableFailover;
};