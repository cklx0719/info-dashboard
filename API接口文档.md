# API 接口文档

本项目使用多个第三方API服务，所有API地址都在 `app/config/api.ts` 文件中集中管理。

## 📡 接口来源说明

本项目使用的API接口来源于以下服务提供商：

- **60s API** ([github.com/vikiboss/60s](https://github.com/vikiboss/60s)): 提供新闻、壁纸、翻译、热搜等聚合API服务
- **Hitokoto** ([hitokoto.cn](https://hitokoto.cn)): 提供一言语录API服务
- **各平台官方API**: 微博、知乎、抖音、今日头条等热搜数据来源于各平台官方接口

## 🙏 特别感谢

本项目使用的API服务来源于 [@vikiboss](https://github.com/vikiboss) 开发的 [60s API](https://github.com/vikiboss/60s) 项目。

感谢 @vikiboss 提供的高质量、开源、可靠、全球 CDN 加速的开放 API 集合，为开发者提供了便利的数据接口服务。

## ⚖️ 版权声明

- 本项目仅用于学习和技术交流目的
- 所有API数据版权归原平台所有
- 请遵守各API服务商的使用条款和限制
- 商业使用前请确认相关API的授权许可

## 🙏 致谢

感谢以下API服务提供商的开源贡献：
- [60s API](https://github.com/vikiboss/60s) - 高质量、开源、可靠的API聚合服务
- [Hitokoto](https://hitokoto.cn) - 一言语录服务
- 各大平台的开放API接口

## API 配置管理

### 配置文件位置

`app/config/api.ts` - 集中管理所有外部API地址

### 配置文件结构

```typescript
export const API_CONFIG = {
  // 基础URL - 使用60s API服务
  BASE_URL: 'https://60s-cf.viki.moe',
  
  // 60秒读懂世界 - 知乎日报API
  NEWS: 'https://60s-cf.viki.moe/v2/60s',
  
  // 必应壁纸 - Microsoft Bing官方API
  BING_WALLPAPER: 'https://60s-cf.viki.moe/v2/bing',
  
  // 一言语录 - Hitokoto官方API
  HITOKOTO: 'https://60s-cf.viki.moe/v2/hitokoto',
  
  // 翻译API - 百度翻译API
  TRANSLATE: 'https://60s-cf.viki.moe/v2/fanyi',
  LANGUAGES: 'https://60s-cf.viki.moe/v2/fanyi/langs',
  
  // 热搜数据 - 各平台官方API聚合
  BILIBILI_HOT: 'https://60s-cf.viki.moe/v2/bili',
  WEIBO_HOT: 'https://60s-cf.viki.moe/v2/weibo',
  ZHIHU_HOT: 'https://60s-cf.viki.moe/v2/zhihu',
  DOUYIN_HOT: 'https://60s-cf.viki.moe/v2/douyin',
  TOUTIAO_HOT: 'https://60s-cf.viki.moe/v2/toutiao',
  
  // 其他功能API
  RANDOM_JOKE: 'https://60s-cf.viki.moe/v2/duanzi',
  SICK_TEXT: 'https://60s-cf.viki.moe/v2/fabing',
  LUCK: 'https://60s-cf.viki.moe/v2/luck',
  EXCHANGE_RATE: 'https://60s-cf.viki.moe/v2/exchange_rate',
  HASH: 'https://60s-cf.viki.moe/v2/hash',
  RANDOM_MUSIC: 'https://60s-cf.viki.moe/v2/changya'
};

export const API_OPTIONS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

export const getApiUrl = (endpoint: string, params?: Record<string, string>) => {
  const url = new URL(endpoint);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
};
```

### 如何修改API地址

1. 打开 `app/config/api.ts` 文件
2. 修改对应的API地址
3. 保存文件，应用会自动使用新的API地址

### 使用示例

```typescript
import { API_CONFIG, getApiUrl } from '../config/api';

// 获取新闻数据
const response = await fetch(API_CONFIG.NEWS);

// 带参数的API调用
const translateUrl = getApiUrl(API_CONFIG.TRANSLATE, {
  text: '你好',
  from: 'zh-CHS',
  to: 'en'
});
const translateResponse = await fetch(translateUrl);
```

## 当前使用的API服务

本项目集成了以下功能模块的API接口：

- **新闻资讯**: 60秒读懂世界
- **图片服务**: 每日壁纸
- **翻译服务**: 多语言在线翻译
- **热搜榜单**: 哔哩哔哩、微博、知乎、抖音
- **娱乐内容**: 一言语录、随机段子、发病文学、随机歌曲
- **实用工具**: 运势查询、汇率换算、哈希计算

## 1. 日更资讯类接口

### 1.1 60秒读懂世界

**接口地址：** `/v2/60s`

**请求方法：** GET

**参数：**
- `encoding` (可选): 返回格式
  - 不传或空：JSON格式
  - `text`：纯文本格式
  - `image`：图片格式

**返回示例（JSON格式）：**
```json
{
  "code": 200,
  "message": "获取成功。数据来自官方/权威源头，以确保稳定与实时。开源地址 https://github.com/vikiboss/60s，反馈群 595941841",
  "data": {
    "date": "2025-08-18",
    "news": ["新闻1", "新闻2", ...],
    "image": "图片URL",
    "tip": "每日一句",
    "cover": "封面图URL",
    "audio": {
      "music": "",
      "news": ""
    },
    "link": "原文链接",
    "created": "2025/08/18 01:13:24",
    "day_of_week": "星期一",
    "lunar_date": "乙巳年闰六月廿五"
  }
}
```

### 1.2 汇率换算

**接口地址：** `/v2/exchange_rate`

**请求方法：** GET

**参数：**
- `from` (可选): 源货币代码，如 USD
- `to` (可选): 目标货币代码，如 CNY
- `amount` (可选): 金额，默认1

**返回示例：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "base_code": "CNY",
    "updated": "2025/08/18 08:02:32",
    "rates": [
      {"currency": "CNY", "rate": 1},
      {"currency": "USD", "rate": 0.139}
    ]
  }
}
```

### 1.3 必应壁纸

**接口地址：** `/v2/bing`

**请求方法：** GET

**参数：** 无

**返回：** 必应每日壁纸信息

### 1.4 历史上的今天

**接口地址：** `/v2/today_in_history`

**请求方法：** GET

**参数：** 无

**返回：** 历史上今天发生的事件

## 2. 热搜榜单类接口

### 2.1 哔哩哔哩热搜

**接口地址：** `/v2/bili`

**请求方法：** GET

**参数：** 无

### 2.2 抖音热搜

**接口地址：** `/v2/douyin`

**请求方法：** GET

**参数：** 无

### 2.3 知乎热榜

**接口地址：** `/v2/zhihu`

**请求方法：** GET

**参数：** 无

### 2.4 微博热搜

**接口地址：** `/v2/weibo`

**请求方法：** GET

**参数：** 无

### 2.5 头条热搜

**接口地址：** `/v2/toutiao`

**请求方法：** GET

**参数：** 无

## 3. 实用功能类接口

### 3.1 翻译支持语言列表

**接口地址：** `/v2/fanyi/langs`

**请求方法：** GET

**参数：** 无

**返回：** 支持的语言列表及代码

### 3.2 在线翻译

**接口地址：** `/v2/fanyi`

**请求方法：** GET

**参数：**
- `text` (必需): 要翻译的文本
- `from` (可选): 源语言类型，默认 auto（自动检测）
- `to` (可选): 目标语言类型，默认 auto（源语言为中文则目标为英文，否则目标为中文）

**返回示例：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "source": {
      "text": "こんにちは",
      "type": "ja",
      "type_desc": "日语",
      "pronounce": "Konnitiha"
    },
    "target": {
      "text": "你好",
      "type": "zh-CHS",
      "type_desc": "中文",
      "pronounce": "nĭhăo"
    }
  }
}
```

### 3.3 百科查询

**接口地址：** `/v2/baike`

**请求方法：** GET

**参数：**
- `word` (必需): 词条名称，如 "西游记"

**返回：** 百科词条信息

### 3.4 Epic免费游戏

**接口地址：** `/v2/epic`

**请求方法：** GET

**参数：** 无

**返回：** Epic商店当前免费游戏信息

### 3.5 IP地址查询

**接口地址：** `/v2/ip`

**请求方法：** GET

**参数：** 无

**返回：** 当前IP地址及地理位置信息

### 3.6 哈希计算

**接口地址：** `/v2/hash`

**请求方法：** GET

**参数：**
- `content` (必需): 要计算哈希的内容
- `type` (可选): 哈希类型，如 md5、sha1、sha256等

**返回：** 计算后的哈希值

### 3.7 链接OG信息

**接口地址：** `/v2/og`

**请求方法：** GET

**参数：**
- `url` (必需): 要获取OG信息的链接

**返回：** 网页的Open Graph信息

## 4. 娱乐消遣类接口

### 4.1 随机段子

**接口地址：** `/v2/duanzi`

**请求方法：** GET

**参数：** 无

**返回：** 随机笑话段子

### 4.2 一言语录

**接口地址：** `/v2/hitokoto`

**请求方法：** GET

**参数：** 无

**返回：** 随机一言语录

### 4.3 答案之书

**接口地址：** `/v2/answer`

**请求方法：** GET

**参数：**
- `question` (可选): 要询问的问题

**返回：** 随机答案

### 4.4 运势查询

**接口地址：** `/v2/luck`

**请求方法：** GET

**参数：** 无

**返回：** 今日运势信息

### 4.5 唱歌音频

**接口地址：** `/v2/changya`

**请求方法：** GET

**参数：** 无

**返回：** 随机唱歌音频信息

### 4.6 随机化合物

**接口地址：** `/v2/chemical`

**请求方法：** GET

**参数：** 无

**返回：** 随机化学化合物信息

### 4.7 随机发病文学

**接口地址：** `/v2/fabing`

**请求方法：** GET

**参数：** 无

**返回：** 随机发病文学语句

## 接口通用返回格式

所有接口都遵循统一的返回格式：

```json
{
  "code": 200,
  "message": "获取成功。数据来自官方/权威源头，以确保稳定与实时。开源地址 https://github.com/vikiboss/60s，反馈群 595941841",
  "data": {
    // 具体数据内容
  }
}
```

## 错误处理

- `code`: 200表示成功，其他值表示错误
- `message`: 错误或成功的描述信息
- 网络错误或服务不可用时会返回相应的HTTP状态码

## 部署注意事项

### 跨域问题

由于本项目是纯前端SPA应用，直接调用第三方API可能遇到跨域问题。建议：

1. **开发环境**: 使用代理服务器（已在vite.config.ts中配置）
2. **生产环境**: 
   - 使用支持CORS的API服务
   - 或者部署自己的API代理服务
   - 或者使用Vercel等平台的API Routes功能

### API服务稳定性

1. 建议在请求间添加适当的延迟，避免频繁请求
2. 部分接口可能有缓存，数据更新频率不同
3. 建议添加错误处理和重试机制
4. 可以考虑添加备用API地址

### 性能优化建议

1. 对API响应数据进行缓存
2. 使用防抖/节流控制请求频率
3. 添加加载状态和错误提示
4. 考虑使用Service Worker缓存静态资源

## 更新日志

- 2025-01-18: 项目架构从SSR改为SPA，创建API配置文件统一管理
- 2025-01-18: 优化翻译模块交互逻辑，添加语言互换和复制功能
- 2025-01-18: 完善深色模式适配，添加主题切换功能