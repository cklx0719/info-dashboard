import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';
import { api, ApiFailover } from '../utils/api-failover';
import { getApiDomains } from '../config/api';

const ApiFailoverTest = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [domainStatus, setDomainStatus] = useState<Record<string, 'unknown' | 'success' | 'failed'>>({});
  const [domains, setDomains] = useState<string[]>([]);

  // 初始化时获取域名列表
  useEffect(() => {
    const loadDomains = async () => {
      try {
        const domainList = await getApiDomains();
        setDomains(domainList);
      } catch (error) {
        console.error('Failed to load domains:', error);
        toast.error('加载域名列表失败');
      }
    };
    loadDomains();
  }, []);

  // 测试单个API接口
  const testSingleApi = async (apiName: string, apiFunction: () => Promise<any>) => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const result = await apiFunction();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      const testResult = {
        apiName,
        success: result.success,
        usedDomain: result.usedDomain,
        duration,
        timestamp: new Date().toLocaleTimeString(),
        error: result.error || null
      };
      
      setTestResults(prev => [testResult, ...prev]);
      
      if (result.success) {
        toast.success(`${apiName} 测试成功 (${duration}ms)`);
        if (result.usedDomain) {
          setDomainStatus(prev => ({ ...prev, [result.usedDomain]: 'success' }));
        }
      } else {
        toast.error(`${apiName} 测试失败: ${result.error}`);
      }
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      const testResult = {
        apiName,
        success: false,
        usedDomain: null,
        duration,
        timestamp: new Date().toLocaleTimeString(),
        error: error instanceof Error ? error.message : '未知错误'
      };
      
      setTestResults(prev => [testResult, ...prev]);
      toast.error(`${apiName} 测试失败: ${testResult.error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 测试域名健康检查
  const testDomainHealth = async () => {
    setIsLoading(true);
    toast.info('开始测试域名健康状态...');
    
    const healthResults: Record<string, 'success' | 'failed'> = {};
    const domains = await getApiDomains();
    
    for (const domain of domains) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${domain}/v2/60s?encoding=json`, {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          healthResults[domain] = 'success';
          toast.success(`${domain} 健康检查通过`);
        } else {
          healthResults[domain] = 'failed';
          toast.error(`${domain} 健康检查失败: ${response.status}`);
        }
      } catch (error) {
        healthResults[domain] = 'failed';
        toast.error(`${domain} 健康检查失败: 连接超时`);
      }
    }
    
    setDomainStatus(healthResults);
    setIsLoading(false);
  };

  // 清空测试结果
  const clearResults = () => {
    setTestResults([]);
    setDomainStatus({});
    toast.success('测试结果已清空');
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API故障转移测试</CardTitle>
          <CardDescription>
            测试API故障转移机制的有效性，验证多域名切换功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 域名状态显示 */}
          <div>
            <h3 className="text-lg font-semibold mb-2">域名状态</h3>
            <div className="flex flex-wrap gap-2">
              {domains.map(domain => {
                const status = domainStatus[domain] || 'unknown';
                const variant = status === 'success' ? 'default' : 
                              status === 'failed' ? 'destructive' : 'secondary';
                return (
                  <Badge key={domain} variant={variant}>
                    {domain.replace('https://', '')} - {status}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* 测试按钮 */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => testSingleApi('60秒读懂世界', () => api.getSixtySeconds({ encoding: 'json' }))}
              disabled={isLoading}
            >
              测试60秒读懂世界
            </Button>
            <Button 
              onClick={() => testSingleApi('历史上的今天', () => api.getTodayInHistory({ encoding: 'json' }))}
              disabled={isLoading}
            >
              测试历史上的今天
            </Button>
            <Button 
              onClick={() => testSingleApi('知乎热榜', () => api.getZhihuHot({ encoding: 'json' }))}
              disabled={isLoading}
            >
              测试知乎热榜
            </Button>
            <Button 
              onClick={testDomainHealth}
              disabled={isLoading}
              variant="outline"
            >
              域名健康检查
            </Button>
            <Button 
              onClick={clearResults}
              disabled={isLoading}
              variant="destructive"
            >
              清空结果
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 测试结果 */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>测试结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={result.success ? 'default' : 'destructive'}>
                        {result.success ? '成功' : '失败'}
                      </Badge>
                      <span className="font-medium">{result.apiName}</span>
                      <span className="text-sm text-gray-500">{result.timestamp}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.duration}ms
                    </div>
                  </div>
                  {result.usedDomain && (
                    <div className="text-sm text-blue-600 mt-1">
                      使用域名: {result.usedDomain}
                    </div>
                  )}
                  {result.error && (
                    <div className="text-sm text-red-600 mt-1">
                      错误: {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiFailoverTest;