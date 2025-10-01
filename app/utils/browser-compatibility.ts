// 浏览器兼容性检测和处理工具

/**
 * 检测当前浏览器类型
 */
export function detectBrowser() {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Edg/')) {
    return 'edge';
  } else if (userAgent.includes('Chrome/')) {
    return 'chrome';
  } else if (userAgent.includes('Firefox/')) {
    return 'firefox';
  } else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
    return 'safari';
  }
  
  return 'unknown';
}

/**
 * 检测是否为Edge浏览器
 */
export function isEdgeBrowser(): boolean {
  return detectBrowser() === 'edge';
}

/**
 * Edge浏览器DOM操作兼容性处理
 */
export function setupEdgeCompatibility() {
  if (!isEdgeBrowser()) {
    return;
  }

  console.log('检测到Edge浏览器，启用兼容性处理...');

  // 1. 添加DOM操作错误监听
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message.includes('insertBefore')) {
      console.warn('Edge浏览器DOM操作错误，尝试恢复:', event.error.message);
      event.preventDefault();
      
      // 延迟重新渲染
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });

  // 2. 添加未捕获的Promise错误监听
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('insertBefore')) {
      console.warn('Edge浏览器Promise错误，尝试恢复:', event.reason.message);
      event.preventDefault();
    }
  });

  // 3. 优化DOM操作时序
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function<T extends Node>(newNode: T, referenceNode: Node | null): T {
    try {
      // 验证节点关系
      if (referenceNode && referenceNode.parentNode !== this) {
        console.warn('Edge兼容性: 修复insertBefore节点关系错误');
        return this.appendChild(newNode) as T;
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    } catch (error) {
      console.warn('Edge兼容性: insertBefore操作失败，使用appendChild替代', error);
      return this.appendChild(newNode) as T;
    }
  };

  // 4. 添加React Router特定的兼容性处理
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName: string, options?: ElementCreationOptions): HTMLElement {
    const element = originalCreateElement.call(this, tagName, options);
    
    // 为新创建的元素添加Edge兼容性标记
    if (element && typeof element.setAttribute === 'function') {
      element.setAttribute('data-edge-compat', 'true');
    }
    
    return element;
  };
}

/**
 * 检测并处理React Router相关的兼容性问题
 */
export function handleReactRouterCompatibility() {
  if (!isEdgeBrowser()) {
    return;
  }

  // 等待DOM加载完成后再处理
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleReactRouterCompatibility);
    return;
  }

  console.log('设置React Router Edge兼容性处理...');

  // 监听路由变化
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      console.log('Edge兼容性: 检测到路由变化');
      
      // 给React Router时间完成DOM更新
      setTimeout(() => {
        // 检查是否有孤立的DOM节点
        const orphanedNodes = document.querySelectorAll('[data-edge-compat="true"]');
        orphanedNodes.forEach(node => {
          if (!node.parentNode || !document.contains(node)) {
            console.warn('Edge兼容性: 清理孤立节点', node);
            node.remove();
          }
        });
      }, 100);
    }
  }).observe(document, { subtree: true, childList: true });
}

/**
 * 初始化所有浏览器兼容性处理
 */
export function initBrowserCompatibility() {
  setupEdgeCompatibility();
  handleReactRouterCompatibility();
  
  // 添加浏览器信息到控制台
  console.log(`浏览器检测: ${detectBrowser()}`);
  if (isEdgeBrowser()) {
    console.log('Edge浏览器兼容性处理已启用');
  }
}