import { API_DOMAINS, API_ENDPOINTS, FAILOVER_CONFIG } from '../config/api'

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
    endpoint: keyof typeof API_ENDPOINTS,
    params?: Record<string, string>,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    if (!FAILOVER_CONFIG.enableFailover) {
      // 如果未启用故障转移，使用第一个域名
      return this.singleRequest<T>(API_DOMAINS[0], endpoint, params, options)
    }

    // 重置过期的失败记录
    this.resetExpiredFailures()

    const failedDomains: ApiError[] = []
    const availableDomains = API_DOMAINS.filter(domain => !this.failedDomains.has(domain))
    
    // 如果所有域名都失败了，重置失败记录并重试
    if (availableDomains.length === 0) {
      this.failedDomains.clear()
      availableDomains.push(...API_DOMAINS)
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
          await this.delay(FAILOVER_CONFIG.retryDelay)
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
    endpoint: keyof typeof API_ENDPOINTS,
    params?: Record<string, string>,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const path = API_ENDPOINTS[endpoint]
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    const url = `${domain}${path}${queryString}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FAILOVER_CONFIG.timeout)

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
  static getAvailableDomains(): string[] {
    this.resetExpiredFailures()
    return API_DOMAINS.filter(domain => !this.failedDomains.has(domain))
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
      const result = await this.singleRequest(domain, 'SIXTY_SECONDS', { encoding: 'json' })
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
    
    await Promise.all(
      API_DOMAINS.map(async (domain) => {
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
    apiRequest('SIXTY_SECONDS', params),
  
  // 历史上的今天
  getTodayInHistory: (params?: Record<string, string>) => 
    apiRequest('HISTORY', params),
  
  // 知乎热榜
  getZhihuHot: (params?: Record<string, string>) => 
    apiRequest('ZHIHU', params),
  
  // IP查询
  getIpInfo: (ip?: string) => 
    apiRequest('IP', ip ? { ip } : undefined),
  
  // 必应壁纸
  getBingWallpaper: (params?: Record<string, string>) => 
    apiRequest('BING', params),
  
  // 一言
  getHitokoto: (params?: Record<string, string>) => 
    apiRequest('HITOKOTO', params),
  
  // 获取翻译支持的语言列表
  getLanguages: (params?: Record<string, string>) => 
    apiRequest('FANYI_LANGS', params),
  
  // 翻译文本
  getTranslate: (params?: Record<string, string>) => 
    apiRequest('FANYI', params),
  
  // 今日运势
  getLuck: (params?: Record<string, string>) => 
    apiRequest('LUCK', params),
  
  // 发病文案
  getSickText: (params?: Record<string, string>) => 
    apiRequest('FABING', params),
  
  // 随机音乐
  getRandomMusic: (params?: Record<string, string>) => 
    apiRequest('CHANGYA', params),
  

  
  // Epic免费游戏（新增方法）
  getEpicGames: (params?: Record<string, string>) => 
    apiRequest('EPIC', params),
  
  // 随机段子（新增方法）
  getRandomJoke: (params?: Record<string, string>) => 
    apiRequest('DUANZI', params),
  
  // 哈希计算（新增方法）
  getHash: (params?: Record<string, string>) => 
    apiRequest('HASH', params),
  
  // 汇率查询（新增方法）
  getExchangeRate: (params?: Record<string, string>) => 
    apiRequest('EXCHANGE_RATE', params),
  
  // OG信息获取（新增方法）
  getOgInfo: (params?: Record<string, string>) => 
    apiRequest('OG', params),
  
  // 微博热搜
  getWeiboHot: (params?: Record<string, string>) => 
    apiRequest('WEIBO', params),
   
  // 抖音热搜
  getDouyinHot: (params?: Record<string, string>) => 
    apiRequest('DOUYIN', params),
   
  // 头条热搜
  getToutiaoHot: (params?: Record<string, string>) => 
    apiRequest('TOUTIAO', params),
  
  // 哔哩哔哩热搜
  getBilibiliHot: (params?: Record<string, string>) => 
    apiRequest('BILI', params),
  

}