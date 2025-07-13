// TODO: 别忘加更改环境变量的 VITE_UPLOAD_BASEURL 地址。
import { getEnvBaseUploadUrl } from '@/utils'

/**
 * useUpload 是一个定制化的请求钩子，用于处理上传图片。
 * @param formData 额外传递给后台的数据，如{name: '菲鸽'}。
 * @returns 返回一个对象{loading, error, data, run}，包含请求的加载状态、错误信息、响应数据和手动触发请求的函数。
 */
// TODO: 别忘加更改环境变量的 VITE_UPLOAD_BASEURL 地址。

const VITE_UPLOAD_BASEURL = `${getEnvBaseUploadUrl()}`

/**
 * useUpload 是一个定制化的请求钩子，用于处理上传图片。
 * @param formData 额外传递给后台的数据，如{name: '菲鸽'}。
 * @returns 返回一个对象{loading, error, data, run}，包含请求的加载状态、错误信息、响应数据和手动触发请求的函数。
 */
export default function useUpload<T = string>(num: number = 1, type: string = 'image') {
  const loading = ref(false)
  const error = ref(false)
  const data = ref<T>()
  const upload = (callback: (data: T) => void = () => {}) => {
    // #ifdef MP-WEIXIN
    // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替。
    // 微信小程序在2023年10月17日之后，使用本API需要配置隐私协议

    uni.chooseMedia({
      count: num,
      mediaType: ['image', 'video'],
      success: (res) => {
        loading.value = true
        const tempFilePath = res.tempFiles[0].tempFilePath
        const file = {}
        uploadFile<T>({ tempFilePath, file, data, error, loading, type, callback })
      },
      fail: (err) => {
        console.error('uni.chooseMedia err->', err)
        error.value = true
      },
    })
    // #endif
    // #ifndef MP-WEIXIN
    if (type === 'image') {
      // 图片
      uni.chooseImage({
        count: num,
        success: (res) => {
          loading.value = true
          const tempFilePath = res.tempFilePaths[0]
          const file = res.tempFiles[0]
          uploadFile<T>({ tempFilePath, file, data, error, loading, type, callback })
        },
        fail: (err) => {
          console.error('uni.chooseImage err->', err)
          error.value = true
        },
      })
    } else if (type === 'voice') {
      // 上传音频的方法
      uni.chooseFile({
        count: 1,
        extension: ['mp3'],
        success: async (res) => {
          loading.value = true
          const tempFilePath = res.tempFilePaths[0]
          const file = res.tempFiles[0]
          uploadFile<T>({ tempFilePath, file, data, error, loading, type, callback })
        },
        fail: (err) => {
          console.error('uni.chooseVoice err->', err)
          error.value = true
        },
      })
    } else {
      // 因为要上传视频，所以这里需要使用 uni.chooseVideo 方法。
      // uni.chooseVideo 方法用于从本地相册选择视频或使用相机拍摄视频。
      // 视频
      uni.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        extension: ['mp4', 'mov'],
        success: (res) => {
          loading.value = true
          const tempFilePath = res.tempFilePath
          const file = {}
          uploadFile<T>({ tempFilePath, file, data, error, loading, type, callback })
        },
        fail: (err) => {
          console.error('uni.chooseVideo err->', err)
          error.value = true
        },
      })
    }
    // #endif
  }
  // 增加一个文件直接上传方法
  const uploadDirect = async (tempFilePath, type, callback: (data: T) => void = () => {}) => {
    loading.value = true
    const file = {}
    uploadFile<T>({ tempFilePath, file, data, error, loading, type, callback })
  }
  return { loading, error, data, upload, uploadDirect }
}

function uploadFile<T>({ tempFilePath, file, data, error, loading, type, callback }) {
  uni.uploadFile({
    url: VITE_UPLOAD_BASEURL + '/html/frontUploadFile?type=' + type,
    filePath: tempFilePath,
    name: 'uploadFile',
    success: (uploadFileRes) => {
      data.value = uploadFileRes.data as T
      callback(data.value, file)
    },
    fail: (err) => {
      console.error('uni.uploadFile err->', err)
      error.value = true
    },
    complete: () => {
      loading.value = false
    },
  })
}
