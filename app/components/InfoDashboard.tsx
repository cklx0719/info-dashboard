import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import ThemeSelector from './ThemeSelector';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  RefreshCw, 
  Loader2, 
  Calendar, 
  ImageIcon, 
  TrendingUp, 
  Clock, 
  Gamepad2, 
  Smile, 
  MapPin, 
  Quote, 
  Music, 
  Hash, 
  DollarSign, 
  Link,
  Languages,
  Star,
  ExternalLink,
  ArrowLeftRight,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { API_CONFIG, getApiUrl } from '../config/api';

const InfoDashboard = () => {
  // 状态管理
  const [newsData, setNewsData] = useState<any>(null);
  const [bingWallpaper, setBingWallpaper] = useState<any>(null);
  const [hitokoto, setHitokoto] = useState<any>(null);
  const [ipInfo, setIpInfo] = useState<any>(null);
  const [languages, setLanguages] = useState<any[]>([]);

  const [luckData, setLuckData] = useState<any>(null);
  const [sickText, setSickText] = useState<any>(null);
  const [songData, setSongData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [bilibiliHotData, setBilibiliHotData] = useState<any[]>([]);
  const [epicGamesData, setEpicGamesData] = useState<any[]>([]);
  const [randomJoke, setRandomJoke] = useState<any>(null);
  const [weiboHotData, setWeiboHotData] = useState<any[]>([]);
  const [zhihuHotData, setZhihuHotData] = useState<any[]>([]);
  const [douyinHotData, setDouyinHotData] = useState<any[]>([]);
  const [toutiaoHotData, setToutiaoHotData] = useState<any[]>([]);

  // 翻译相关状态
  const [translateText, setTranslateText] = useState('');
  const [translateFrom, setTranslateFrom] = useState('auto');
  const [translateTo, setTranslateTo] = useState('en');
  const [translateResult, setTranslateResult] = useState<any>(null);

  // 哈希计算状态
  const [hashText, setHashText] = useState('');
  const [hashResult, setHashResult] = useState<any>(null);

  // 汇率换算状态
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('CNY');
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [exchangeRateData, setExchangeRateData] = useState<any>(null);

  // OG信息状态
  const [ogUrl, setOgUrl] = useState('');
  const [ogInfoData, setOgInfoData] = useState<any>(null);

  // 加载状态
  const [loading, setLoading] = useState({
    news: false,
    bing: false,
    hitokoto: false,
    ip: false,
    languages: false,

    luck: false,
    sickText: false,
    song: false,
    history: false,
    bilibiliHot: false,
    epicGames: false,
    randomJoke: false,
    weiboHot: false,
    zhihuHot: false,
    douyinHot: false,
    toutiaoHot: false,
    translate: false,
    hash: false,
    exchangeRate: false,
    ogInfo: false
  });

  // API调用函数
  const fetchNews = async () => {
    setLoading(prev => ({ ...prev, news: true }));
    try {
      const response = await fetch(API_CONFIG.NEWS);
      const result = await response.json();
      if (result.code === 200) {
        setNewsData(result.data);
        toast.success('60秒读懂世界已更新');
      }
    } catch (error) {
      toast.error('获取新闻失败');
    } finally {
      setLoading(prev => ({ ...prev, news: false }));
    }
  };

  const fetchBingWallpaper = async () => {
    setLoading(prev => ({ ...prev, bing: true }));
    try {
      const response = await fetch(API_CONFIG.BING_WALLPAPER);
      const result = await response.json();
      if (result.code === 200) {
        setBingWallpaper(result.data);
        toast.success('必应壁纸已更新');
      }
    } catch (error) {
      toast.error('获取必应壁纸失败');
    } finally {
      setLoading(prev => ({ ...prev, bing: false }));
    }
  };

  const fetchHitokoto = async () => {
    setLoading(prev => ({ ...prev, hitokoto: true }));
    try {
      const response = await fetch(API_CONFIG.HITOKOTO);
      const result = await response.json();
      if (result.code === 200) {
        // 修复数据字段映射：API返回的是 {hitokoto: "内容"}，需要转换为 {text: "内容"}
        const transformedData = {
          text: result.data.hitokoto,
          author: result.data.author,
          source: result.data.source
        };
        setHitokoto(transformedData);
        toast.success('一言语录已更新');
      }
    } catch (error) {
      toast.error('获取一言语录失败');
    } finally {
      setLoading(prev => ({ ...prev, hitokoto: false }));
    }
  };

  const fetchIP = async () => {
    setLoading(prev => ({ ...prev, ip: true }));
    try {
      const response = await fetch(API_CONFIG.IP_INFO);
      const result = await response.json();
      if (result.code === 200) {
        // 只保留IP地址信息
        setIpInfo({
          ip: result.data.ip
        });
        toast.success('IP信息已更新');
      }
    } catch (error) {
      toast.error('获取IP信息失败');
    } finally {
      setLoading(prev => ({ ...prev, ip: false }));
    }
  };

  const fetchLanguages = async () => {
    setLoading(prev => ({ ...prev, languages: true }));
    try {
      const response = await fetch(API_CONFIG.LANGUAGES);
      const result = await response.json();
      if (result.code === 200 && result.data) {
        // 修复数据字段映射：API返回的是 {code: "语言代码", label: "语言名称"}，需要转换为 {code: "语言代码", name: "语言名称"}
        const transformedLanguages = result.data.map((lang: any) => ({
          code: lang.code,
          name: lang.label
        }));
        setLanguages(transformedLanguages);
        toast.success('语言列表已加载');
      }
    } catch (error) {
      console.error('获取语言列表失败:', error);
      toast.error('获取语言列表失败');
    } finally {
      setLoading(prev => ({ ...prev, languages: false }));
    }
  };

  const fetchTranslate = async () => {
    if (!translateText.trim()) return;
    
    setLoading(prev => ({ ...prev, translate: true }));
    try {
      const response = await fetch(getApiUrl('TRANSLATE', { from: translateFrom, to: translateTo, text: translateText }));
      const result = await response.json();
      if (result.code === 200) {
        // 修复数据字段映射：API返回的是 {source: {text: "原文"}, target: {text: "译文"}}，需要转换为前端期望的格式
        setTranslateResult({
          text: result.data.target.text,
          source: result.data.source.text,
          sourceType: result.data.source.type_desc,
          targetType: result.data.target.type_desc
        });
        toast.success('翻译完成');
      }
    } catch (error) {
      toast.error('翻译失败');
    } finally {
      setLoading(prev => ({ ...prev, translate: false }));
    }
  };

  // 语言互换功能
  const swapLanguages = () => {
    if (translateFrom === 'auto') {
      toast.error('自动检测语言无法互换');
      return;
    }
    const temp = translateFrom;
    setTranslateFrom(translateTo);
    setTranslateTo(temp);
    toast.success('语言已互换');
  };

  // 复制译文功能
  const copyTranslation = async () => {
    if (!translateResult?.text) return;
    
    try {
      await navigator.clipboard.writeText(translateResult.text);
      toast.success('译文已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败');
    }
  };

  // 智能目标语言切换
  const handleSourceLanguageChange = (value: string) => {
    setTranslateFrom(value);
    if (value === 'auto') {
      setTranslateTo('en');
    } else {
      setTranslateTo('zh-CHS');
    }
  };



  const fetchLuck = async () => {
    setLoading(prev => ({ ...prev, luck: true }));
    try {
      const response = await fetch(API_CONFIG.LUCK);
      const result = await response.json();
      if (result.code === 200) {
        setLuckData(result.data);
        toast.success('运势查询已更新');
      }
    } catch (error) {
      toast.error('获取运势信息失败');
    } finally {
      setLoading(prev => ({ ...prev, luck: false }));
    }
  };

  const fetchSickText = async () => {
    setLoading(prev => ({ ...prev, sickText: true }));
    try {
      const response = await fetch(API_CONFIG.SICK_TEXT);
      const result = await response.json();
      if (result.code === 200) {
        // 修复数据字段映射：API返回的是 {saying: "内容"}，需要转换为前端期望的 {fabing: "内容"}
        const transformedData = {
          fabing: result.data.saying
        };
        setSickText(transformedData);
        toast.success('发病文学已更新');
      }
    } catch (error) {
      toast.error('获取发病文学失败');
    } finally {
      setLoading(prev => ({ ...prev, sickText: false }));
    }
  };

  const fetchSong = async () => {
    setLoading(prev => ({ ...prev, song: true }));
    try {
      const response = await fetch(API_CONFIG.RANDOM_MUSIC);
      const result = await response.json();
      if (result.code === 200) {
        setSongData(result.data);
        toast.success('随机歌曲已更新');
      }
    } catch (error) {
      toast.error('获取随机歌曲失败');
    } finally {
      setLoading(prev => ({ ...prev, song: false }));
    }
  };

  const fetchHistory = async () => {
    setLoading(prev => ({ ...prev, history: true }));
    try {
      const response = await fetch(API_CONFIG.HISTORY);
      const result = await response.json();
      if (result.code === 200) {
        // 修复数据字段映射：API返回的是 {items: [...]}，需要提取items数组
        setHistoryData(result.data.items || []);
        toast.success('历史上的今天已更新');
      }
    } catch (error) {
      toast.error('获取历史上的今天失败');
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

  const fetchBilibiliHot = async () => {
    setLoading(prev => ({ ...prev, bilibiliHot: true }));
    try {
      const response = await fetch(API_CONFIG.BILIBILI_HOT);
      const result = await response.json();
      if (result.code === 200) {
        setBilibiliHotData(result.data);
        toast.success('哔哩哔哩热搜已更新');
      }
    } catch (error) {
      toast.error('获取哔哩哔哩热搜失败');
    } finally {
      setLoading(prev => ({ ...prev, bilibiliHot: false }));
    }
  };

  const fetchEpicGames = async () => {
    setLoading(prev => ({ ...prev, epicGames: true }));
    try {
      const response = await fetch(API_CONFIG.EPIC_GAMES);
      const result = await response.json();
      if (result.code === 200) {
        setEpicGamesData(result.data);
        toast.success('Epic免费游戏已更新');
      }
    } catch (error) {
      toast.error('获取Epic免费游戏失败');
    } finally {
      setLoading(prev => ({ ...prev, epicGames: false }));
    }
  };

  const fetchRandomJoke = async () => {
    setLoading(prev => ({ ...prev, randomJoke: true }));
    try {
      const response = await fetch(API_CONFIG.RANDOM_JOKE);
      const result = await response.json();
      if (result.code === 200) {
        setRandomJoke(result.data);
        toast.success('随机段子已更新');
      }
    } catch (error) {
      toast.error('获取随机段子失败');
    } finally {
      setLoading(prev => ({ ...prev, randomJoke: false }));
    }
  };

  const fetchHash = async () => {
    if (!hashText.trim()) return;
    
    setLoading(prev => ({ ...prev, hash: true }));
    try {
      const response = await fetch(getApiUrl(API_CONFIG.HASH, { content: hashText }));
      const result = await response.json();
      if (result.code === 200) {
        // 修复数据字段映射：过滤掉source字段，只保留哈希算法结果
        const { source, ...hashResults } = result.data;
        setHashResult(hashResults);
        toast.success('哈希计算完成');
      }
    } catch (error) {
      toast.error('哈希计算失败');
    } finally {
      setLoading(prev => ({ ...prev, hash: false }));
    }
  };

  const fetchExchangeRate = async () => {
    if (!fromCurrency || !toCurrency || !exchangeAmount) return;
    
    setLoading(prev => ({ ...prev, exchangeRate: true }));
    try {
      const response = await fetch(getApiUrl(API_CONFIG.EXCHANGE_RATE, { from: fromCurrency, to: toCurrency, amount: exchangeAmount }));
      const result = await response.json();
      if (result.code === 200) {
        // 修复数据字段映射：API返回 {base_code, updated, rates}，需要转换为前端期望的格式
        const rate = result.data.rates[toCurrency];
        setExchangeRateData({
          result: (parseFloat(exchangeAmount) * rate).toFixed(2),
          rate: rate,
          updated: result.data.updated
        });
        toast.success('汇率转换完成');
      }
    } catch (error) {
      toast.error('汇率转换失败');
    } finally {
      setLoading(prev => ({ ...prev, exchangeRate: false }));
    }
  };

  const fetchOgInfo = async () => {
    if (!ogUrl.trim()) return;
    
    setLoading(prev => ({ ...prev, ogInfo: true }));
    try {
      const response = await fetch(getApiUrl(API_CONFIG.OG_INFO, { url: ogUrl }));
      const result = await response.json();
      if (result.code === 200) {
        setOgInfoData(result.data);
        toast.success('OG信息获取完成');
      }
    } catch (error) {
      toast.error('获取OG信息失败');
    } finally {
      setLoading(prev => ({ ...prev, ogInfo: false }));
    }
  };

  // 获取微博热搜榜
  const fetchWeiboHot = async () => {
    setLoading(prev => ({ ...prev, weiboHot: true }));
    try {
      const response = await fetch(API_CONFIG.WEIBO_HOT);
      const result = await response.json();
      if (result.code === 200) {
        setWeiboHotData(result.data);
        toast.success('微博热搜榜已更新');
      }
    } catch (error) {
      toast.error('获取微博热搜榜失败');
    } finally {
      setLoading(prev => ({ ...prev, weiboHot: false }));
    }
  };

  // 获取知乎热门话题
  const fetchZhihuHot = async () => {
    setLoading(prev => ({ ...prev, zhihuHot: true }));
    try {
      const response = await fetch(API_CONFIG.ZHIHU_HOT);
      const result = await response.json();
      if (result.code === 200) {
        setZhihuHotData(result.data);
        toast.success('知乎热门话题已更新');
      }
    } catch (error) {
      toast.error('获取知乎热门话题失败');
    } finally {
      setLoading(prev => ({ ...prev, zhihuHot: false }));
    }
  };

  // 获取抖音热搜榜
  const fetchDouyinHot = async () => {
    setLoading(prev => ({ ...prev, douyinHot: true }));
    try {
      const response = await fetch(API_CONFIG.DOUYIN_HOT);
      const result = await response.json();
      if (result.code === 200) {
        setDouyinHotData(result.data);
        toast.success('抖音热搜榜已更新');
      }
    } catch (error) {
      toast.error('获取抖音热搜榜失败');
    } finally {
      setLoading(prev => ({ ...prev, douyinHot: false }));
    }
  };

  // 获取头条热搜榜
  const fetchToutiaoHot = async () => {
    setLoading(prev => ({ ...prev, toutiaoHot: true }));
    try {
      const response = await fetch(API_CONFIG.TOUTIAO_HOT);
      const result = await response.json();
      if (result.code === 200) {
        setToutiaoHotData(result.data);
        toast.success('头条热搜榜已更新');
      }
    } catch (error) {
      toast.error('获取头条热搜榜失败');
    } finally {
      setLoading(prev => ({ ...prev, toutiaoHot: false }));
    }
  };

  // 页面加载时自动获取数据
  useEffect(() => {
    fetchNews();
    fetchBingWallpaper();
    fetchHitokoto();
    fetchIP();
    fetchLanguages();
    fetchLuck();
    fetchSickText();
    fetchSong();
    fetchHistory();
    fetchBilibiliHot();
    fetchEpicGames();
    fetchRandomJoke();
    fetchWeiboHot();
    fetchZhihuHot();
    fetchDouyinHot();
    fetchToutiaoHot();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 主题选择器 */}
        <div className="flex justify-end mb-4">
          <ThemeSelector />
        </div>
        
        {/* 页面标题 */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">信息汇聚中心</h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">实时获取各类有趣信息，让您快速了解世界</p>
        </div>

        {/* 主要内容区域 */}
        <div className="space-y-4 sm:space-y-6">
          {/* 第一行：60秒读懂世界 + 必应壁纸 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* 60秒读懂世界 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <CardTitle>60秒读懂世界</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchNews}
                  disabled={loading.news}
                >
                  {loading.news ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {newsData ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{newsData.date}</span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">今日要闻</h4>
                      <div className="max-h-64 overflow-y-auto space-y-1">
                        {newsData.news.slice(0, 15).map((item: string, index: number) => (
                          <div key={index} className="text-sm text-gray-600 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span className="font-medium text-blue-600 dark:text-blue-400">{index + 1}.</span> {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {newsData.link && (
                      <div className="mt-3">
                        <a 
                          href={newsData.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          查看原文
                        </a>
                      </div>
                    )}
                    
                    {newsData.tip && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border-l-4 border-blue-400 dark:border-blue-500">
                        <p className="text-sm text-blue-800 dark:text-blue-300 italic">💡 {newsData.tip}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 必应壁纸 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5 text-purple-500" />
                  <CardTitle>必应壁纸</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchBingWallpaper}
                  disabled={loading.bing}
                >
                  {loading.bing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {bingWallpaper ? (
                  <div className="space-y-3">
                    <img 
                      src={bingWallpaper.cover} 
                      alt={bingWallpaper.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-sm dark:text-white">{bingWallpaper.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{bingWallpaper.copyright}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">{bingWallpaper.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 第二行：微博热搜榜 - 全宽度 */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  <CardTitle>微博热搜榜</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchWeiboHot}
                  disabled={loading.weiboHot}
                >
                  {loading.weiboHot ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {weiboHotData && weiboHotData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {weiboHotData.map((item: any, index: number) => (
                      <div key={index} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                          {/* 微博热搜API暂不提供有效热度值，暂时隐藏热度显示 */}
                          <Badge variant="outline" className="text-xs text-red-600 dark:text-red-400">
                            热搜
                          </Badge>
                        </div>
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline block mb-2 text-sm leading-relaxed">
                            {item.title}
                          </a>
                        ) : (
                          <h4 className="font-medium text-sm dark:text-gray-200 mb-2 leading-relaxed">{item.title}</h4>
                        )}
                        {item.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 第三行：知乎热门话题 - 全宽度 */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <CardTitle>知乎热门话题</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchZhihuHot}
                  disabled={loading.zhihuHot}
                >
                  {loading.zhihuHot ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {zhihuHotData && zhihuHotData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {zhihuHotData.map((item: any, index: number) => (
                      <div key={index} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                          {item.hot_value_desc && (
                            <Badge variant="outline" className="text-xs text-blue-600 dark:text-blue-400">
                              {item.hot_value_desc}
                            </Badge>
                          )}
                        </div>
                        
                        {item.cover && (
                          <img 
                            src={item.cover} 
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                        
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline block mb-2 text-sm leading-relaxed">
                            {item.title}
                          </a>
                        ) : (
                          <h4 className="font-semibold text-sm dark:text-gray-200 mb-2 leading-relaxed">{item.title}</h4>
                        )}
                        
                        {item.detail && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">{item.detail}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                          {item.answer_cnt && (
                            <span className="flex items-center gap-1">
                              <span>💬</span> {item.answer_cnt} 回答
                            </span>
                          )}
                          {item.follower_cnt && (
                            <span className="flex items-center gap-1">
                              <span>👥</span> {item.follower_cnt} 关注
                            </span>
                          )}
                          {item.comment_cnt && (
                            <span className="flex items-center gap-1">
                              <span>💭</span> {item.comment_cnt} 评论
                            </span>
                          )}
                        </div>
                        
                        {item.created && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            创建时间：{item.created}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 第四行：抖音热搜榜 - 全宽度 */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <CardTitle>抖音热搜榜</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchDouyinHot}
                  disabled={loading.douyinHot}
                >
                  {loading.douyinHot ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {douyinHotData && douyinHotData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {douyinHotData.map((item: any, index: number) => (
                      <div key={index} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                          {item.hot_value && (
                            <Badge variant="outline" className="text-xs text-purple-600 dark:text-purple-400">
                              {item.hot_value.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                        
                        {item.cover && (
                          <img 
                            src={item.cover} 
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                        
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline block mb-2 text-sm leading-relaxed">
                            {item.title}
                          </a>
                        ) : (
                          <h4 className="font-semibold text-sm dark:text-gray-200 mb-2 leading-relaxed">{item.title}</h4>
                        )}
                        
                        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                          {item.event_time && (
                            <div className="flex items-center gap-1">
                              <span>📅</span> 事件时间：{item.event_time}
                            </div>
                          )}
                          {item.active_time && (
                            <div className="flex items-center gap-1">
                              <span>🔥</span> 激活时间：{item.active_time}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 第五行：头条热搜榜 - 全宽度 */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <CardTitle>头条热搜榜</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchToutiaoHot}
                  disabled={loading.toutiaoHot}
                >
                  {loading.toutiaoHot ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {toutiaoHotData && toutiaoHotData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {toutiaoHotData.map((item: any, index: number) => (
                      <div key={index} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                          {item.hot_value && (
                            <Badge variant="outline" className="text-xs text-orange-600 dark:text-orange-400">
                              {item.hot_value.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                        
                        {item.cover && (
                          <img 
                            src={item.cover} 
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                        
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline block mb-2 text-sm leading-relaxed">
                            {item.title}
                          </a>
                        ) : (
                          <h4 className="font-semibold text-sm dark:text-gray-200 mb-2 leading-relaxed">{item.title}</h4>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 第三行：历史上的今天、哔哩哔哩热搜、Epic免费游戏 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* 历史上的今天 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <CardTitle>历史上的今天</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchHistory}
                  disabled={loading.history}
                >
                  {loading.history ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {historyData && historyData.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {historyData.map((item: any, index: number) => (
                      <div key={index} className="border dark:border-gray-700 rounded-lg p-3 hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow">
                        <Badge variant="outline" className="text-xs mb-2">
                          {item.year}年
                        </Badge>
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-medium text-sm line-clamp-2 text-blue-600 dark:text-blue-400 hover:underline">
                            {item.title}
                          </a>
                        ) : (
                          <h4 className="font-medium text-sm line-clamp-2 dark:text-gray-200">{item.title}</h4>
                        )}
                        {item.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 哔哩哔哩热搜 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-pink-500" />
                  <CardTitle>哔哩哔哩热搜</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchBilibiliHot}
                  disabled={loading.bilibiliHot}
                >
                  {loading.bilibiliHot ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {bilibiliHotData && bilibiliHotData.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {bilibiliHotData.map((item: any, index: number) => (
                      <div key={index} className="border dark:border-gray-700 rounded-lg p-3 hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary" className="text-xs mb-2">
                            #{index + 1}
                          </Badge>
                          {item.hot && (
                            <Badge variant="outline" className="text-xs text-pink-600 dark:text-pink-400">
                              {item.hot}
                            </Badge>
                          )}
                        </div>
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline line-clamp-2 text-sm">
                            {item.title}
                          </a>
                        ) : (
                          <h4 className="font-medium line-clamp-2 text-sm dark:text-gray-200">{item.title}</h4>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Epic免费游戏 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gamepad2 className="h-5 w-5 text-indigo-500" />
                  <CardTitle>Epic免费游戏</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchEpicGames}
                  disabled={loading.epicGames}
                >
                  {loading.epicGames ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {epicGamesData && epicGamesData.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {epicGamesData.map((item: any, index: number) => (
                      <div key={index} className="border dark:border-gray-700 rounded-lg p-3 hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-24 object-cover rounded mb-2"
                          />
                        )}
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-medium text-sm line-clamp-2 text-blue-600 dark:text-blue-400 hover:underline">
                            {item.title}
                          </a>
                        ) : (
                          <h4 className="font-medium text-sm line-clamp-2 dark:text-gray-200">{item.title}</h4>
                        )}
                        {item.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                        )}
                        {item.price && (
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">
                              原价: {item.price}
                            </Badge>
                            <Badge variant="secondary" className="text-xs text-green-600 dark:text-green-400">
                              免费
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 第四行：小模块区域 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 一言语录 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Quote className="h-5 w-5 text-yellow-500" />
                  <CardTitle>一言语录</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchHitokoto}
                  disabled={loading.hitokoto}
                >
                  {loading.hitokoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {hitokoto ? (
                  <div className="space-y-2">
                    <blockquote className="text-sm italic text-gray-700 dark:text-gray-300 border-l-4 border-yellow-400 pl-3">
                      "{hitokoto.text}"
                    </blockquote>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-right">—— {hitokoto.author || '佚名'}</p>
                    {hitokoto.source && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">出自：{hitokoto.source}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* IP信息 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <CardTitle>IP信息</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchIP}
                  disabled={loading.ip}
                >
                  {loading.ip ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {ipInfo ? (
                  <div className="space-y-2">
                    <div className="text-sm dark:text-gray-200">
                      <span className="font-medium">IP地址：</span>
                      <span className="font-mono">{ipInfo.ip}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 随机段子 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smile className="h-5 w-5 text-orange-500" />
                  <CardTitle>随机段子</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchRandomJoke}
                  disabled={loading.randomJoke}
                >
                  {loading.randomJoke ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {randomJoke ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{randomJoke.duanzi}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>



            {/* 运势查询 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <CardTitle>运势查询</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchLuck}
                  disabled={loading.luck}
                >
                  {loading.luck ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {luckData ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-1">{luckData.luck_rank}</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{luckData.luck_desc}</p>
                    </div>
                    {luckData.luck_tip && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
                        <p className="text-xs text-yellow-800 dark:text-yellow-300">
                          <span className="font-medium">小贴士：</span>{luckData.luck_tip}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 第五行：在线翻译 */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Languages className="h-5 w-5 text-blue-500" />
                  <CardTitle>在线翻译</CardTitle>
                </div>
                <CardDescription>支持多种语言互译</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block dark:text-gray-300">源语言</label>
                    <select 
                      value={translateFrom} 
                      onChange={(e) => handleSourceLanguageChange(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    >
                      <option value="auto">自动检测</option>
                      {languages.map((lang: any) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={swapLanguages}
                      disabled={translateFrom === 'auto'}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      title={translateFrom === 'auto' ? '自动检测语言无法互换' : '互换源语言和目标语言'}
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block dark:text-gray-300">目标语言</label>
                    <select 
                      value={translateTo} 
                      onChange={(e) => setTranslateTo(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    >
                      {languages.map((lang: any) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={fetchTranslate}
                      disabled={loading.translate || !translateText.trim()}
                      className="w-full"
                    >
                      {loading.translate ? <Loader2 className="h-4 w-4 animate-spin" /> : '翻译'}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block dark:text-gray-300">原文</label>
                    <textarea 
                      placeholder="输入要翻译的文本"
                      value={translateText}
                      onChange={(e) => setTranslateText(e.target.value)}
                      className="w-full h-32 p-3 border rounded-lg resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium dark:text-gray-300">译文</label>
                      {translateResult?.text && (
                        <Button 
                          onClick={copyTranslation}
                          variant="outline"
                          size="sm"
                          className="h-6 px-2"
                          title="复制译文"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="w-full h-32 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 overflow-y-auto">
                      {translateResult ? (
                        <p className="text-sm dark:text-gray-300">{translateResult.text}</p>
                      ) : (
                        <p className="text-sm text-gray-400">翻译结果将显示在这里</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 第六行：发病文学和随机歌曲 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* 发病文学 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Quote className="h-5 w-5 text-pink-500" />
                  <CardTitle>发病文学</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchSickText}
                  disabled={loading.sickText}
                >
                  {loading.sickText ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {sickText ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{sickText.fabing}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 随机歌曲 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Music className="h-5 w-5 text-green-500" />
                  <CardTitle>随机歌曲</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchSong}
                  disabled={loading.song}
                >
                  {loading.song ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  刷新
                </Button>
              </CardHeader>
              <CardContent>
                {songData ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm dark:text-white">{songData.song?.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{songData.song?.singer}</p>
                    </div>
                    {songData.audio?.url && (
                      <audio controls className="w-full">
                        <source src={songData.audio.url} type="audio/mpeg" />
                        您的浏览器不支持音频播放。
                      </audio>
                    )}
                    {songData.user?.avatar_url && (
                      <img 
                        src={songData.user.avatar_url} 
                        alt="用户头像"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 第七行：工具模块区域 - 哈希计算、汇率换算 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* 哈希计算 */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Hash className="h-5 w-5 text-purple-500" />
                  <CardTitle>哈希计算</CardTitle>
                </div>
                <CardDescription>计算文本的各种哈希值</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="输入要计算哈希的文本"
                    value={hashText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHashText(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={fetchHash}
                    disabled={loading.hash || !hashText.trim()}
                    size="sm"
                  >
                    {loading.hash ? <Loader2 className="h-4 w-4 animate-spin" /> : '计算'}
                  </Button>
                </div>
                
                {hashResult && (
                  <div className="space-y-2">
                    {Object.entries(hashResult).map(([algorithm, hash]) => (
                      <div key={algorithm} className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm uppercase dark:text-gray-300">{algorithm}:</span>
                          <Badge variant="outline" className="text-xs">
                            {String(hash).length} 字符
                          </Badge>
                        </div>
                        <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all mt-1">{String(hash)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 汇率换算 */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <CardTitle>汇率换算</CardTitle>
                </div>
                <CardDescription>实时货币汇率转换</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium dark:text-gray-300">从</label>
                    <Input 
                      placeholder="货币代码"
                      value={fromCurrency}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFromCurrency(e.target.value.toUpperCase())}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium dark:text-gray-300">到</label>
                    <Input 
                      placeholder="货币代码"
                      value={toCurrency}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToCurrency(e.target.value.toUpperCase())}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Input 
                    type="number"
                    placeholder="金额"
                    value={exchangeAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExchangeAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={fetchExchangeRate}
                    disabled={loading.exchangeRate || !fromCurrency || !toCurrency || !exchangeAmount}
                    size="sm"
                  >
                    {loading.exchangeRate ? <Loader2 className="h-4 w-4 animate-spin" /> : '转换'}
                  </Button>
                </div>
                
                {exchangeRateData && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-800 dark:text-green-300">
                         {exchangeAmount} {fromCurrency} = {exchangeRateData.result} {toCurrency}
                       </p>
                       <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                         汇率: 1 {fromCurrency} = {exchangeRateData.rate} {toCurrency}
                       </p>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                         更新时间: {exchangeRateData?.updated}
                       </p>
                     </div>
                   </div>
                 )}
               </CardContent>
             </Card>
           </div>

           {/* 第八行：链接OG信息 */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
             <Card>
               <CardHeader>
                 <div className="flex items-center space-x-2">
                   <Link className="h-5 w-5 text-blue-500" />
                   <CardTitle>链接OG信息</CardTitle>
                 </div>
                 <CardDescription>获取网页的Open Graph信息</CardDescription>
               </CardHeader>
               <CardContent className="space-y-3">
                 <div className="flex space-x-2">
                   <Input 
                     placeholder="输入网页URL"
                     value={ogUrl}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOgUrl(e.target.value)}
                     className="flex-1"
                   />
                   <Button 
                     onClick={fetchOgInfo}
                     disabled={loading.ogInfo || !ogUrl.trim()}
                     size="sm"
                   >
                     {loading.ogInfo ? <Loader2 className="h-4 w-4 animate-spin" /> : '获取'}
                   </Button>
                 </div>
                 
                 {ogInfoData && (
                   <div className="border dark:border-gray-600 rounded-lg p-3">
                     {ogInfoData.image && (
                       <img 
                         src={ogInfoData.image} 
                         alt="网页预览图"
                         className="w-full h-32 object-cover rounded mb-3"
                       />
                     )}
                     <div>
                       <h4 className="font-semibold dark:text-white">{ogInfoData.title || '无标题'}</h4>
                       <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ogInfoData.description || '无描述'}</p>
                       {ogInfoData.url && (
                         <a 
                           href={ogInfoData.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-xs text-blue-500 dark:text-blue-400 hover:underline mt-2 block"
                         >
                           {ogInfoData.url}
                         </a>
                       )}
                     </div>
                   </div>
                 )}
               </CardContent>
             </Card>
           </div>
         </div>
       </div>
     </div>
   );
 };

 export default InfoDashboard;