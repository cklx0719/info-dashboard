// 运行时配置管理 - 支持Docker容器动态配置
interface ApiConfig {
  BASE_URL: string;
  NEWS: string;
  BING_WALLPAPER: string;
  HITOKOTO: string;
  IP_INFO: string;
  LANGUAGES: string;
  TRANSLATE: string;
  LUCK: string;
  SICK_TEXT: string;
  RANDOM_MUSIC: string;
  HISTORY: string;
  BILIBILI_HOT: string;
  EPIC_GAMES: string;
  RANDOM_JOKE: string;
  WEIBO_HOT: string;
  ZHIHU_HOT: string;
  DOUYIN_HOT: string;
  TOUTIAO_HOT: string;
  HASH: string;
  EXCHANGE_RATE: string;
  OG_INFO: string;
}

interface ConfigFile {
  API_CONFIG: ApiConfig;
  API_OPTIONS: {
    method: string;
    headers: {
      "Content-Type": string;
    };
  };
}

class RuntimeConfig {
  private config: ApiConfig | null = null;
  private loading: Promise<ApiConfig> | null = null;

  async getConfig(): Promise<ApiConfig> {
    if (this.config) {
      return this.config;
    }

    if (this.loading) {
      return this.loading;
    }

    this.loading = this.loadConfig();
    this.config = await this.loading;
    this.loading = null;
    return this.config;
  }

  private async loadConfig(): Promise<ApiConfig> {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`);
      }
      const configFile: ConfigFile = await response.json();
      console.log('Runtime config loaded:', configFile);
      return configFile.API_CONFIG;
    } catch (error) {
      console.warn('Failed to load runtime config, using fallback:', error);
      // 回退到默认配置
      return {
        BASE_URL: 'https://top.ilib.vip',
        NEWS: 'https://top.ilib.vip/v2/60s',
        BING_WALLPAPER: 'https://top.ilib.vip/v2/bing',
        HITOKOTO: 'https://top.ilib.vip',
        IP_INFO: 'https://top.ilib.vip/v2/getIpInfo',
        LANGUAGES: 'https://top.ilib.vip/v2/fanyi/langs',
        TRANSLATE: 'https://top.ilib.vip/v2/fanyi',
        LUCK: 'https://top.ilib.vip/v2/horoscope',
        SICK_TEXT: 'https://top.ilib.vip/v2/text/love',
        RANDOM_MUSIC: 'https://top.ilib.vip/v2/music/netease',
        HISTORY: 'https://top.ilib.vip/v2/history',
        BILIBILI_HOT: 'https://top.ilib.vip/v2/bilihot',
        EPIC_GAMES: 'https://top.ilib.vip/v2/epic',
        RANDOM_JOKE: 'https://top.ilib.vip/v2/text/joke',
        WEIBO_HOT: 'https://top.ilib.vip/v2/weibohot',
        ZHIHU_HOT: 'https://top.ilib.vip/v2/zhihuhot',
        DOUYIN_HOT: 'https://top.ilib.vip/v2/douyinhot',
        TOUTIAO_HOT: 'https://top.ilib.vip/v2/toutiaohot',
        HASH: 'https://top.ilib.vip/v2/hash',
        EXCHANGE_RATE: 'https://top.ilib.vip/v2/exchange',
        OG_INFO: 'https://top.ilib.vip/v2/og'
      };
    }
  }

  // 获取完整的API URL
  async getApiUrl(endpoint: string, params?: Record<string, string>): Promise<string> {
    const config = await this.getConfig();
    let url = config[endpoint as keyof ApiConfig] || config.BASE_URL;

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    return url;
  }


}

// 导出单例实例
export const runtimeConfig = new RuntimeConfig();

// 兼容性函数，保持与原有API_CONFIG的兼容
export const getApiUrl = async (endpoint: string, params?: Record<string, string>) => {
  return runtimeConfig.getApiUrl(endpoint, params);
};

// API请求的通用配置
export const API_OPTIONS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};