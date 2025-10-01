import { getApiDomains, getApiEndpoints, getFailoverConfig } from '../config/api'

// API请求错误类型
export interface ApiError {
  domain: string
  error: Error
  timestamp: number
}

// API请求结果类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  usedDomain?: string
  failedDomains?: ApiError[]
}

// 故障转移API请求类
export class ApiFailover {
  private static failedDomains = new Set<string>()
  private static lastFailureCheck = 0
  private static readonly FAILURE_RESET_INTERVAL = 5 * 60 * 1000 // 5分钟重置失败记录

  /**
   * 执行带故障转移的API请求
   * @param endpoint API端点
   * @param params 请求参数
   * @param options 请求选项
   */
  static async request<T = any>(
    endpoint: string,
    params?: Record<string, string>,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const failoverConfig = await getFailoverConfig();
    const apiDomains = await getApiDomains();
    
    if (!failoverConfig.enableFailover) {
      // 如果未启用故障转移，使用第一个域名
      return this.singleRequest<T>(apiDomains[0], endpoint, params, options)
    }

    // 重置过期的失败记录
    this.resetExpiredFailures()

    const failedDomains: ApiError[] = []
    const availableDomains = apiDomains.filter(domain => !this.failedDomains.has(domain))
    
    // 如果所有域名都失败了，重置失败记录并重试
    if (availableDomains.length === 0) {
      this.failedDomains.clear()
      availableDomains.push(...apiDomains)
    }

    // 依次尝试可用的域名
    for (const domain of availableDomains) {
      try {
        const result = await this.singleRequest<T>(domain, endpoint, params, options)
        if (result.success) {
          // 请求成功，从失败列表中移除该域名
          this.failedDomains.delete(domain)
          return {
            ...result,
            usedDomain: domain,
            failedDomains: failedDomains.length > 0 ? failedDomains : undefined
          }
        }
      } catch (error) {
        const apiError: ApiError = {
          domain,
          error: error as Error,
          timestamp: Date.now()
        }
        failedDomains.push(apiError)
        
        // 将失败的域名加入黑名单
        this.failedDomains.add(domain)
        
        console.warn(`API请求失败 [${domain}]:`, error)
        
        // 如果不是最后一个域名，等待一段时间再尝试下一个
        if (domain !== availableDomains[availableDomains.length - 1]) {
          await this.delay(failoverConfig.retryDelay)
        }
      }
    }

    // 所有域名都失败了
    return {
      success: false,
      error: '所有API域名都无法访问，请稍后重试',
      failedDomains
    }
  }

  /**
   * 单个域名的API请求
   */
  private static async singleRequest<T>(
    domain: string,
    endpoint: string,
    params?: Record<string, string>,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const apiEndpoints = await getApiEndpoints();
    const failoverConfig = await getFailoverConfig();
    
    const path = apiEndpoints[endpoint]
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    const url = `${domain}${path}${queryString}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), failoverConfig.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TopAPI/1.0',
          ...options?.headers
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: true,
        data
      }
    } catch (error) {
      clearTimeout(timeoutId)
      
      // 改进AbortError的处理
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`请求超时: ${domain}`)
      }
      
      throw error
    }
  }

  /**
   * 延迟函数
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 重置过期的失败记录
   */
  private static resetExpiredFailures(): void {
    const now = Date.now()
    if (now - this.lastFailureCheck > this.FAILURE_RESET_INTERVAL) {
      this.failedDomains.clear()
      this.lastFailureCheck = now
    }
  }

  /**
   * 获取当前可用的域名列表
   */
  static async getAvailableDomains(): Promise<string[]> {
    this.resetExpiredFailures()
    const apiDomains = await getApiDomains();
    return apiDomains.filter(domain => !this.failedDomains.has(domain))
  }

  /**
   * 获取失败的域名列表
   */
  static getFailedDomains(): string[] {
    return Array.from(this.failedDomains)
  }

  /**
   * 手动重置所有失败记录
   */
  static resetFailures(): void {
    this.failedDomains.clear()
    this.lastFailureCheck = Date.now()
  }

  /**
   * 检查域名健康状态
   */
  static async checkDomainHealth(domain: string): Promise<boolean> {
    try {
      const result = await this.singleRequest(domain, 'NEWS', { encoding: 'json' })
      return result.success
    } catch {
      return false
    }
  }

  /**
   * 检查所有域名的健康状态
   */
  static async checkAllDomainsHealth(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}
    const apiDomains = await getApiDomains();
    
    await Promise.all(
      apiDomains.map(async (domain) => {
        results[domain] = await this.checkDomainHealth(domain)
      })
    )
    
    return results
  }
}

// 便捷的API请求函数
export const apiRequest = ApiFailover.request.bind(ApiFailover)

// 导出常用的API请求方法
export const api = {
  // 60秒读懂世界
  getSixtySeconds: (params?: Record<string, string>) => 
    apiRequest('NEWS', params),
  
  // 历史上的今天
  getTodayInHistory: (params?: Record<string, string>) => 
    apiRequest('HISTORY', params),
  
  // 知乎热榜
  getZhihuHot: (params?: Record<string, string>) => 
    apiRequest('ZHIHU_HOT', params),
  
  // IP信息
  getIpInfo: (ip?: string) => 
    apiRequest('IP_INFO', ip ? { ip } : undefined),
  
  // 必应壁纸
  getBingWallpaper: (params?: Record<string, string>) => 
    apiRequest('BING_WALLPAPER', params),
  
  // 一言语录
  getHitokoto: (params?: Record<string, string>) => 
    apiRequest('HITOKOTO', params),
  
  // 翻译语言列表
  getLanguages: (params?: Record<string, string>) => 
    apiRequest('LANGUAGES', params),
  
  // 翻译
  getTranslate: (params?: Record<string, string>) => 
    apiRequest('TRANSLATE', params),
  
  // 运势
  getLuck: (params?: Record<string, string>) => 
    apiRequest('LUCK', params),
  
  // 发病文案
  getSickText: (params?: Record<string, string>) => 
    apiRequest('SICK_TEXT', params),
  
  // 随机音乐
  getRandomMusic: (params?: Record<string, string>) => 
    apiRequest('RANDOM_MUSIC', params),
  
  // Epic免费游戏
  getEpicGames: (params?: Record<string, string>) => 
    apiRequest('EPIC_GAMES', params),
  
  // 随机段子
  getRandomJoke: (params?: Record<string, string>) => 
    apiRequest('RANDOM_JOKE', params),
  
  // 哈希
  getHash: (params?: Record<string, string>) => 
    apiRequest('HASH', params),
  
  // 汇率
  getExchangeRate: (params?: Record<string, string>) => 
    apiRequest('EXCHANGE_RATE', params),
  
  // OG信息
  getOgInfo: (params?: Record<string, string>) => 
    apiRequest('OG_INFO', params),
  
  // 微博热搜
  getWeiboHot: (params?: Record<string, string>) => 
    apiRequest('WEIBO_HOT', params),
   
  // 抖音热搜
  getDouyinHot: (params?: Record<string, string>) => 
    apiRequest('DOUYIN_HOT', params),
   
  // 头条热搜
  getToutiaoHot: (params?: Record<string, string>) => 
    apiRequest('TOUTIAO_HOT', params),
  
  // 哔哩哔哩热搜
  getBilibiliHot: (params?: Record<string, string>) => 
    apiRequest('BILIBILI_HOT', params),

  // 小红书热点
  getRednote: (params?: Record<string, string>) => 
    apiRequest('REDNOTE', params),
  
  // 百度实时热搜
  getBaiduRealtime: (params?: Record<string, string>) => 
    apiRequest('BAIDU_REALTIME', params),
  
  // 百度电视剧
  getBaiduTeleplay: (params?: Record<string, string>) => 
    apiRequest('BAIDU_TELEPLAY', params),
  
  // 百度贴吧话题榜
  getBaiduTieba: (params?: Record<string, string>) => 
    apiRequest('BAIDU_TIEBA', params),
  
  // 猫眼相关
  getMaoyan: (params?: Record<string, string>) => 
    apiRequest('MAOYAN', params),
  
  // 猫眼电视收视排行
  getMaoyanTv: (params?: Record<string, string>) => 
    apiRequest('MAOYAN_TV', params),
  
  // 猫眼网剧实时热度
  getMaoyanWeb: (params?: Record<string, string>) => 
    apiRequest('MAOYAN_WEB', params),

}