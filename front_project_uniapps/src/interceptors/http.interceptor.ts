import { useUserStore } from '@/store'

import { http } from './http.index'

declare module 'luch-request' {
  interface HttpRequestConfig<T = HttpTask> {
    remember?: boolean
    tryagain?: boolean
  }
}

// 通用请求头设定
const ajaxHeader = 'x-ajax'
const sessionIdHeader = 'x-token'
const rememberMeHeader = 'x-remember'

const requestInterceptors = () => {
  /**
   * 请求拦截
   * @param {Object} http
   */
  http.interceptors.request.use(
    (config) => {
      // 可使用async await 做异步操作
      const { getToken, getRemember } = useUserStore()
      // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
      config.data = config.data || {}

      // 默认指定返回 JSON 数据
      if (!config.header[ajaxHeader]) {
        config.header[ajaxHeader] = 'json'
      }

      // 设定传递 Token 认证参数 ThinkGem
      if (!config.header[sessionIdHeader] && getToken()) {
        config.header[sessionIdHeader] = getToken()
      }

      // 为节省流量，记住我数据不是每次都发送的，当会话失效后，尝试重试登录 ThinkGem
      if (!config.header[rememberMeHeader] && getRemember() && config.remember) {
        config.header[rememberMeHeader] = getRemember()
        config.remember = false
      }

      return config
    },
    (
      config, // 可使用async await 做异步操作
    ) => Promise.reject(config),
  )
}

const responseInterceptors = () => {
  /**
   * 响应拦截
   * @param {Object} http
   */
  http.interceptors.response.use(
    async (response) => {
      let data = response.data

      if (!data) {
        uni.showToast({
          title: '连接服务器失败',
          icon: 'none',
          duration: 2000,
        })
        return false
      }
      // 自定义参数
      const custom = response.config?.custom
      if (response.statusCode !== 200) {
        // 服务端返回的状态码不等于200，则reject()
        // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
        if (custom?.toast !== false) {
          uni.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000,
          })
        }
        // 如果需要catch返回，则进行reject
        if (custom?.catch) {
          return Promise.reject(data)
        } else {
          // 否则返回一个pending中的promise
          return new Promise(() => {})
        }
      }

      const { setUserInfo, clearUserInfo, setRemember, setToken } = useUserStore()

      if (typeof data === 'object') {
        if (data.sessionid) {
          setToken(data.sessionid)
          if (data.user) {
            setUserInfo(data.user)
          }
        }

        if (data.result === 'false') {
          uni.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000,
          })
          return new Promise(() => {})
        }

        if (data.result === 'login') {
          clearUserInfo()
          const config = response.config
          if (config.tryagain === undefined || config.tryagain) {
            config.tryagain = false
            config.remember = true
            try {
              const res = await http.request(config)
              data = res
            } catch (error) {
              console.error('重复请求错误:', error)
            }

            if (data.result === 'login') {
              if (!config.data?.loginCheck) {
                uni.showToast({
                  title: data.message,
                  icon: 'none',
                  duration: 2000,
                })
              }
              config.tryagain = true
            }
          }
        }
      }

      if (response.header && response.header[rememberMeHeader]) {
        const remember = response.header[rememberMeHeader]
        if (remember && remember !== 'deleteMe') {
          setRemember(remember)
        } else {
          setRemember('')
        }
      }

      return data || {}
    },
    (response) => {
      /*  对响应错误做点什么 （statusCode !== 200） */
      return Promise.reject(response)
    },
  )
}

export { requestInterceptors, responseInterceptors }
