<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '个人中心',
    enablePullDownRefresh: true,
    backgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="flex bg-white h-[167px]">
    <img class="w-[67px] h-[67px] ml-[23px] mt-[44px]" :src="url" />
    <view class="mt-[44px] ml-[18px]">
      <p class="text-[24px] text-black">{{ name }}</p>
      <p class="text-[14px] text-black mt-[18px]">工号ID：{{ userID }}</p>
    </view>
  </view>

  <view class="pb-[155px]">
    <view class="flex items-center bg-white h-[60px] mt-[15px]">
      <img
        class="w-[24px] h-[24px] ml-[36px]"
        src="http://swwq59hya.hn-bkt.clouddn.com/img/personal/%E4%BF%AE%E6%94%B9%E5%AF%86%E7%A0%81.png?e=1748420474&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:o8zNVk9ihDJNaGcuuMMIC4Xmlno="
      />
      <p class="text-[16px] ml-[17px] text-black">修改密码</p>
      <view
        class="absolute right-[20px] text-gray-500 text-[22px]"
        @click="navigateTo('/pages/personal/password')"
      >
        >
      </view>
    </view>

    <view class="flex items-center bg-white h-[60px] mt-[15px]">
      <img
        class="w-[24px] h-[24px] ml-[36px]"
        src="http://swwq59hya.hn-bkt.clouddn.com/img/personal/%E4%B8%8A%E4%BC%A0%E5%A4%B4%E5%83%8F.png?e=1748420447&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:EUmcYKOk4TB4l-Bwy4tWASIPcf8="
      />
      <p class="text-[16px] ml-[17px] text-black">上传头像</p>
      <view class="absolute right-[20px] text-gray-500 text-[22px]" @click="uploadFile()">></view>
    </view>

    <view class="flex items-center bg-white h-[60px] mt-[15px]">
      <img
        class="w-[24px] h-[24px] ml-[36px]"
        src="http://swwq59hya.hn-bkt.clouddn.com/img/personal/%E5%B8%AE%E5%8A%A9%E4%B8%AD%E5%BF%83.png?e=1748420488&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:T2XSJhQ79xhTtTE1MmP5fCpTrvw="
      />
      <p class="text-[16px] ml-[17px] text-black">帮助中心</p>
      <view
        class="absolute right-[20px] text-gray-500 text-[22px]"
        @click="navigateTo('/pages/personal/help')"
      >
        >
      </view>
    </view>
    <view class="min-h-[100px]"></view>
  </view>
  <view class="bottom-[55px] left-0 right-0 px-[15px]">
    <view
      class="h-[52px] border border-red-500 bg-white rounded-lg flex items-center justify-center"
      @click="logout"
    >
      <text class="text-[20px] text-red-500">退出登录</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { piniaUseStore, piniaUseStoreRefs } from '@/store'
import { onPullDownRefresh } from '@dcloudio/uni-app'
const { loading, error, data, upload } = useUpload()

const { clearUserInfo, userInfo } = piniaUseStore()
const userID = userInfo.user_id
const name = ref('')
const url = ref('')
const isRefreshing = ref(false) // 刷新状态

// 用户信息获取接口
onMounted(async () => {
  await fetchUserInfo()
  console.log('登录拦截', userInfo.role)
  if (userInfo.username === '') {
    uni.redirectTo({ url: '/pages/login/login' })
  }
})

const fetchUserInfo = async () => {
  try {
    const req: any = await uni.$api.user.getUserInfo({
      user_id: userID,
    })
    name.value = req.name
    url.value = req.avatar_url
    return req
  } catch (error) {
    uni.showToast({
      title: '获取用户信息失败',
      icon: 'none',
    })
    throw error
  }
}

onPullDownRefresh(async () => {
  isRefreshing.value = true
  try {
    await fetchUserInfo()
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
    })
  } catch (error) {
    console.error('刷新失败:', error)
  } finally {
    isRefreshing.value = false
    uni.stopPullDownRefresh() // 停止下拉刷新动画
  }
})

// 路由跳转方法
const navigateTo = (path) => {
  uni.navigateTo({ url: path })
}
const imagePath = ref('')
const uploadFile = async () => {
  try {
    const res = await uni.chooseImage({
      count: 1, // 默认选择1张图片
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
      sourceType: ['album', 'camera'], // 可以从相册选择或拍照
    })

    const tempFilePath = res.tempFilePaths[0]
    console.log('检查1:', tempFilePath)

    // 2. 上传图片
    const formData = {
      user_id: userID,
      avatar_file: tempFilePath,
    }
    // 假设 tempFilePath 是 uni.chooseImage 返回的临时路径
    uni.uploadFile({
      url: 'http://192.168.16.154:8980/api/upload_avatar',
      filePath: tempFilePath,
      name: 'avatar_file', // 这个name对应后端接收文件的字段名
      formData: { user_id: userID }, // 只传其他表单数据
      success(res) {
        console.log('上传成功', res.data)
        uni.showToast({
          title: '上传成功',
          icon: 'none',
        })
      },
      fail(err) {
        console.error('上传失败', err)
      },
    })
    uni.switchTab({ url: '/pages/personal/personal' })
    console.log('检查2345453:', formData, tempFilePath)
    const uploadRes = await uni.$api.user.uploadAvatar(formData)
    console.log('检查:', uploadRes, tempFilePath)

    console.log('检查:', uploadRes, tempFilePath, url.value)

    console.log('检查123:', uploadRes)
  } catch (error) {
    uni.showToast({
      title: error.message,
      icon: 'none',
    })
    console.error('上传失败:', error)
  }
}

const logout = async () => {
  // 退出登录
  const req = await uni.$api.user.logout()
  console.log('1111', req)
  clearUserInfo()
  console.log(userInfo)
  uni.reLaunch({ url: '/pages/login/login' })
}
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  background: #f5f5f5 !important;
}
</style>
