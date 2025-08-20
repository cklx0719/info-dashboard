import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { toast } from 'sonner';
import { Loader2, Globe, Image, MessageSquare, Book, MapPin, Sparkles, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface ApiResult {
  loading: boolean;
  data: any;
  error: string | null;
  imageUrl?: string;
}

const API_BASE_URL = 'https://top.ilib.vip';

// 根据测试结果，只保留可用的API接口
const apis = [
  {
    id: '60s-json',
    name: '60秒读懂世界 (JSON)',
    description: '获取每日60秒读懂世界新闻，JSON格式',
    category: '日更资讯',
    endpoint: 'https://top.ilib.vip/v2/60s?format=json',
    method: 'GET',
    hasInput: false,
    responseType: 'json',
    icon: Globe,
    color: 'bg-blue-500'
  },
  {
    id: '60s-text',
    name: '60秒读懂世界 (文本)',
    description: '获取每日60秒读懂世界新闻，纯文本格式',
    category: '日更资讯',
    endpoint: 'https://top.ilib.vip/v2/60s?format=text',
    method: 'GET',
    hasInput: false,
    responseType: 'text',
    icon: MessageSquare,
    color: 'bg-green-500'
  },
  {
    id: '60s-image',
    name: '60秒读懂世界 (图片)',
    description: '获取每日60秒读懂世界新闻图片',
    category: '日更资讯',
    endpoint: 'https://top.ilib.vip/v2/60s?format=image',
    method: 'GET',
    hasInput: false,
    responseType: 'image',
    icon: Image,
    color: 'bg-purple-500'
  },
  {
    id: 'ip',
    name: 'IP地址查询',
    description: '查询指定IP地址的地理位置信息',
    category: '实用功能',
    endpoint: 'https://top.ilib.vip/v2/ip',
    method: 'GET',
    hasInput: true,
    inputPlaceholder: '请输入IP地址（可选，留空查询当前IP）',
    responseType: 'json',
    icon: MapPin,
    color: 'bg-red-500'
  },

  {
    id: 'answer',
    name: '答案之书',
    description: '获取随机的人生答案',
    category: '娱乐消遣',
    endpoint: 'https://top.ilib.vip/v2/answer',
    method: 'GET',
    hasInput: false,
    responseType: 'json',
    icon: HelpCircle,
    color: 'bg-indigo-500'
  },
  {    id: 'hash',    name: '哈希计算',    description: '计算文本的各种哈希值',    category: '实用功能',    endpoint: 'https://top.ilib.vip/v2/hash',    method: 'GET',    hasInput: true,    inputPlaceholder: '请输入要计算哈希的文本',    responseType: 'json',    icon: Book,    color: 'bg-yellow-500'  },  {    id: 'fanyi-langs',    name: '翻译语言列表',    description: '获取支持的翻译语言列表',    category: '实用功能',    endpoint: 'https://top.ilib.vip/v2/fanyi/langs',    method: 'GET',    hasInput: false,    responseType: 'json',    icon: Globe,    color: 'bg-cyan-500'  },  {    id: 'fanyi',    name: '在线翻译',    description: '翻译文本到指定语言',    category: '实用功能',    endpoint: 'https://top.ilib.vip/v2/fanyi',    method: 'GET',    hasInput: true,    inputPlaceholder: '请输入要翻译的文本',    responseType: 'json',    icon: MessageSquare,    color: 'bg-teal-500'  },  {    id: 'wiki',    name: '百科查询',    description: '查询百科词条信息',    category: '实用功能',    endpoint: 'https://top.ilib.vip/v2/baike',    method: 'GET',    hasInput: true,    inputPlaceholder: '请输入要查询的词条名称',    responseType: 'json',    icon: Book,    color: 'bg-orange-500'  }
];

const categories = ['全部', '日更资讯', '实用功能', '娱乐消遣'];

export function ApiDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [apiResults, setApiResults] = useState<Record<string, ApiResult>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  // 清除所有结果
  const clearAllResults = () => {
    setApiResults({});
    setInputValues({});
    toast.info('已清除所有测试结果', {
      description: '可以重新开始测试接口',
      duration: 2000,
    });
  };

  const filteredApis = selectedCategory === '全部' 
    ? apis 
    : apis.filter(api => api.category === selectedCategory);

  const callApi = async (api: typeof apis[0]) => {
    const resultKey = api.id;
    
    setApiResults(prev => ({
      ...prev,
      [resultKey]: { loading: true, data: null, error: null }
    }));

    try {
      let url = api.endpoint;
      
      // 处理需要输入参数的接口
       if (api.hasInput && inputValues[api.id]) {
         if (api.id === 'ip') {
           url += `?ip=${encodeURIComponent(inputValues[api.id])}`;
         } else if (api.id === 'hash') {
           url += `?content=${encodeURIComponent(inputValues[api.id])}`;
         } else if (api.id === 'fanyi') {
           url += `?text=${encodeURIComponent(inputValues[api.id])}&from=auto&to=auto`;
         } else if (api.id === 'wiki') {
           url += `?word=${encodeURIComponent(inputValues[api.id])}`;
         }
       }
      
      const response = await fetch(url);
      
      if (api.responseType === 'image') {
        // 对于图片接口，检查是否返回图片URL
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const jsonData = await response.json();
          setApiResults(prev => ({
            ...prev,
            [resultKey]: { 
              loading: false, 
              data: jsonData, 
              error: null 
            }
          }));
        } else {
          // 直接是图片
          setApiResults(prev => ({
            ...prev,
            [resultKey]: { 
              loading: false, 
              data: { imageUrl: url, contentType }, 
              error: null 
            }
          }));
        }
      } else {
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
        
        setApiResults(prev => ({
          ...prev,
          [resultKey]: { 
            loading: false, 
            data: { content: data, contentType, status: response.status }, 
            error: null 
          }
        }));
      }

      // 成功提示
      toast.success(`${api.name} 调用成功！`, {
        description: '数据已成功获取并显示在下方',
        duration: 3000,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '请求失败';
      setApiResults(prev => ({
        ...prev,
        [resultKey]: { 
          loading: false, 
          data: null, 
          error: errorMessage
        }
      }));

      // 错误提示
      toast.error(`${api.name} 调用失败`, {
        description: errorMessage,
        duration: 5000,
      });
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* 头部 */}
        <div className="text-center mb-6 md:mb-8 px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            60s API 接口展示平台
          </h1>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            现代化的API接口测试和展示平台，支持多种数据格式和实时交互
          </p>
        </div>

        {/* 统计信息和操作按钮 */}
        <div className="flex flex-col items-center gap-4 mb-6 px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-blue-600">{apis.length}</div>
                <div className="text-xs text-gray-600">总接口数</div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-green-600">{filteredApis.length}</div>
                <div className="text-xs text-gray-600">当前显示</div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-purple-600">{Object.keys(apiResults).length}</div>
                <div className="text-xs text-gray-600">已测试</div>
              </div>
            </div>
          </div>
          
          {/* 操作按钮 */}
          {Object.keys(apiResults).length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllResults}
              className="text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
            >
              <AlertCircle className="mr-1 h-3 w-3" />
              清除所有结果
            </Button>
          )}
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8 px-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-200 hover:scale-105 text-xs md:text-sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* API接口卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredApis.map((api) => {
            const IconComponent = api.icon;
            return (
                <Card key={api.id} className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${api.color} text-white flex-shrink-0`}>
                      <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base md:text-lg truncate">{api.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {api.category}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {api.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {/* 输入框 */}
                  {api.hasInput && (
                    <div className="mb-3">
                      <Input
                        placeholder={api.inputPlaceholder}
                        value={inputValues[api.id] || ''}
                        onChange={(e) => setInputValues(prev => ({
                          ...prev,
                          [api.id]: e.target.value
                        }))}
                        className="w-full text-sm"
                      />
                    </div>
                  )}
                  
                  {/* 调用按钮 */}
                  <Button 
                    onClick={() => callApi(api)}
                    disabled={apiResults[api.id]?.loading}
                    className="w-full mb-3 text-sm"
                    size="sm"
                  >
                    {apiResults[api.id]?.loading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        调用中...
                      </>
                    ) : (
                      `调用接口`
                    )}
                  </Button>
                  
                  {/* 结果显示 */}
                  {apiResults[api.id] && (
                    <div className="border-t pt-3">
                      <h4 className="font-semibold mb-2 text-gray-700 text-sm">响应结果:</h4>
                      
                      {apiResults[api.id].error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                          <p className="text-red-600 text-xs break-words">
                            错误: {apiResults[api.id].error}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* JSON 数据显示 */}
                          {apiResults[api.id].data && typeof apiResults[api.id].data === 'object' && (
                            <div className="bg-gray-50 border rounded-lg p-2">
                              <h5 className="font-medium text-gray-700 mb-1 text-xs">JSON 数据:</h5>
                              <div className="max-h-32 overflow-y-auto">
                                <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap break-words">
                                  {JSON.stringify(apiResults[api.id].data, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                          
                          {/* 文本数据显示 */}
                          {apiResults[api.id].data && typeof apiResults[api.id].data === 'string' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                              <h5 className="font-medium text-blue-700 mb-1 text-xs">文本内容:</h5>
                              <div className="max-h-32 overflow-y-auto">
                                <p className="text-xs text-blue-600 whitespace-pre-wrap break-words">
                                  {apiResults[api.id].data}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* 图片显示 */}
                          {apiResults[api.id].imageUrl && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                              <h5 className="font-medium text-green-700 mb-1 text-xs">图片内容:</h5>
                              <div className="flex justify-center">
                                <img 
                                  src={apiResults[api.id].imageUrl} 
                                  alt="API返回的图片" 
                                  className="max-w-full max-h-48 h-auto rounded border object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (nextElement) {
                                      nextElement.style.display = 'block';
                                    }
                                  }}
                                />
                                <p className="text-red-500 text-xs mt-2" style={{display: 'none'}}>
                                  图片加载失败
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-12 text-gray-500">
          <p>API 基础地址: {API_BASE_URL}</p>
          <p className="mt-2">共 {apis.length} 个可用接口</p>
        </div>
      </div>
    </div>
  );
}