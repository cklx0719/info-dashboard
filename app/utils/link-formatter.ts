/**
 * 链接格式化工具函数
 */

/**
 * 转换知乎API链接为用户友好的链接
 * 将 https://api.zhihu.com/questions/1949543504989623922 
 * 转换为 https://zhihu.com/question/1949543504989623922
 * @param url 原始链接
 * @returns 转换后的链接
 */
export function formatZhihuLink(url: string): string {
  if (!url) return url
  
  // 匹配知乎API链接格式
  const zhihuApiPattern = /^https?:\/\/api\.zhihu\.com\/questions\/(\d+)/
  const match = url.match(zhihuApiPattern)
  
  if (match) {
    const questionId = match[1]
    return `https://zhihu.com/question/${questionId}`
  }
  
  return url
}

/**
 * 批量格式化数据中的知乎链接
 * @param data 包含链接的数据数组
 * @param linkField 链接字段名，默认为 'link'
 * @returns 格式化后的数据
 */
export function formatZhihuLinksInData<T extends Record<string, any>>(
  data: T[], 
  linkField: string = 'link'
): T[] {
  return data.map(item => ({
    ...item,
    [linkField]: formatZhihuLink(item[linkField])
  }))
}

/**
 * 通用链接格式化函数
 * 支持多种平台的链接格式化
 * @param url 原始链接
 * @param platform 平台类型
 * @returns 格式化后的链接
 */
export function formatPlatformLink(url: string, platform: 'zhihu' | 'weibo' | 'bili' | 'douyin' = 'zhihu'): string {
  if (!url) return url
  
  switch (platform) {
    case 'zhihu':
      return formatZhihuLink(url)
    
    case 'weibo':
      // 微博链接格式化（如果需要的话）
      return url
    
    case 'bili':
      // B站链接格式化（如果需要的话）
      return url
    
    case 'douyin':
      // 抖音链接格式化（如果需要的话）
      return url
    
    default:
      return url
  }
}

/**
 * 检查链接是否为知乎API链接
 * @param url 链接
 * @returns 是否为知乎API链接
 */
export function isZhihuApiLink(url: string): boolean {
  if (!url) return false
  return /^https?:\/\/api\.zhihu\.com\/questions\/\d+/.test(url)
}

/**
 * 获取知乎问题ID
 * @param url 知乎链接（API或用户友好格式）
 * @returns 问题ID，如果无法提取则返回null
 */
export function getZhihuQuestionId(url: string): string | null {
  if (!url) return null
  
  // 匹配API格式：https://api.zhihu.com/questions/1949543504989623922
  const apiMatch = url.match(/^https?:\/\/api\.zhihu\.com\/questions\/(\d+)/)
  if (apiMatch) {
    return apiMatch[1]
  }
  
  // 匹配用户友好格式：https://zhihu.com/question/1949543504989623922
  const userMatch = url.match(/^https?:\/\/zhihu\.com\/question\/(\d+)/)
  if (userMatch) {
    return userMatch[1]
  }
  
  return null
}