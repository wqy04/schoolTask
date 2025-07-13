// 引入环境变量配置
import { getEnvBaseUrl } from '@/utils'
// 引入拦截器配置
import { requestInterceptors, responseInterceptors } from './http.interceptor'
import Request from 'luch-request' // 下载的插件
// 定义HTTP实例
export const http = new Request()

//  初始化请求配置
const initRequest = () => {
  http.setConfig((defaultConfig) => {
    defaultConfig.baseURL = getEnvBaseUrl() /* 根域名 */
    defaultConfig.header = {
      'content-type': 'application/x-www-form-urlencoded',
      'x-requested-with': 'XMLHttpRequest',
    }
    return defaultConfig
  })
  // 调用拦截器，传入vm参数
  requestInterceptors()
  responseInterceptors()
}

export { initRequest }
