import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

const initState = { username: '', portarit: '' }

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>({ ...initState })
    const theme = ref<'light' | 'dark'>('light')

    const cacheData = ref<any>({}) // 本次缓存临时数据

    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val
    }

    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }

    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    const isLogined = computed(() => !!userInfo.value.access_token)

    const getToken = () => {
      return userInfo.value.access_token || ''
    }

    const getRemember = () => {
      return userInfo.value.remember || ''
    }

    const setRemember = (value) => {
      userInfo.value.remember = value
    }

    const setToken = (token) => {
      userInfo.value.access_token = token
    }

    return {
      userInfo,
      theme,
      toggleTheme,
      setUserInfo,
      clearUserInfo,
      isLogined,
      getToken,
      getRemember,
      setRemember,
      setToken,
      cacheData,
    }
  },

  {
    persist: true,
  },
)

// 导出一个获取 store 的函数，方便在组件外部使用
export function piniaUseStore() {
  return useUserStore()
}

// 添加使用 storeToRefs 的辅助函数，保持响应性
export function piniaUseStoreRefs() {
  const store = useUserStore()
  const storeRefs = storeToRefs(store)
  return {
    ...storeRefs,
  }
}
