<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '登录',
  },
}
</route>

<template>
  <view class="flex flex-col justify-center">
    <p class="text-[20px] mt-[141px] ml-[37px] font-bold">账号密码登录</p>
    <view class="mt-[30px] mx-[37px]">
      <wd-input type="text" v-model="userID" placeholder="请输入用户名" />
      <wd-input
        clearable
        show-password
        class="mt-[18px]"
        v-model="password"
        placeholder="请输入密码"
      />
      <button
        class="mt-[25px] flex justify-center items-center w-[315px] h-[45px] text-white text-[15px] rounded-full bg-[#40AE36]"
        @click="login"
      >
        登录
      </button>
      <wd-toast />
    </view>
    <!-- <view class="flex flex-col justify-center items-center mt-[60px]">
      <p class="text-[#999393]">其他登录方式</p>
      <img
        class="size-[50px] mt-[20px]"
        src="http://swwq59hya.hn-bkt.clouddn.com/img/login/%E5%BD%A2%E7%8A%B6.png?e=1748416613&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:MWlPplFIEFvqUtV0PbGnmmokboc="
      />
    </view> -->
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { piniaUseStore, piniaUseStoreRefs } from '@/store'
import { useToast } from 'wot-design-uni'

const userID = ref<string>('')
const password = ref<string>('')
const toast = useToast()
const { setUserInfo, setToken } = piniaUseStore()

const login = async () => {
  // 登录接口
  const req: any = await uni.$api.user.login({
    username: userID.value,
    password: password.value,
  })
  console.log('32123213213213123132123', req.success)
  if (req.success === false) {
    uni.showToast({
      title: req.message,
      icon: 'none',
      mask: true,
    })
  }
  if (!userID.value) {
    console.log('22222', userID.value)
    uni.showToast({
      title: '请输入用户名',
      icon: 'none',
      mask: true,
    })
    console.log('2333332', userID.value)
  } else if (!password.value) {
    console.log('1111', password.value)
    uni.showToast({
      title: '请输入密码',
      icon: 'none',
      mask: true,
    })
  } else {
    if (req.success) {
      uni.switchTab({ url: '/pages/index/index' })
      uni.showToast({
        title: '登录成功',
        icon: 'success',
        mask: true,
      })
      setUserInfo(req.user_info)
      setToken(req.access_token)
      console.log('kkankan', req.user_info)
    }
  }
}
</script>

<style lang="scss" scoped></style>
