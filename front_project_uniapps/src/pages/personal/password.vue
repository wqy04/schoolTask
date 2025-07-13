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
    <p class="text-[20px] mt-[141px] ml-[37px] font-bold">修改密码</p>
    <view class="mt-[30px] mx-[37px]">
      <wd-input type="text" v-model="userID" placeholder="请输入工号ID" />
      <wd-input
        clearable
        show-password
        class="mt-[18px]"
        v-model="password"
        placeholder="请输入新密码"
      />
      <wd-input
        clearable
        show-password
        class="mt-[18px]"
        v-model="passwordNew"
        placeholder="请再次输入新密码"
      />
      <view class="mt-[25px] flex justify-center items-center">
        <wd-button
          plain
          @click="returnPersonal"
          type="success"
          class="ml-[35px] w-[158px] text-[16px] rounded-full"
        >
          取消
        </wd-button>
        <button
          @click="passwordConfirm()"
          class="flex justify-center items-center ml-[35px] w-[158px] h-[35px] text-white text-[15px] rounded-full bg-[#40AE36]"
        >
          确认
        </button>
      </view>
      <wd-toast />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useToast } from 'wot-design-uni'
const password = ref<string>('')
const passwordNew = ref<string>('')
const userID = ref<string>('')
const toast = useToast()
const returnPersonal = () => {
  uni.switchTab({ url: '/pages/personal/personal' })
}

const passwordConfirm = async () => {
  if (userID.value === '') {
    uni.showToast({
      title: '请输入用户名',
      icon: 'none',
      mask: true,
    })
  } else if (password.value === '') {
    uni.showToast({
      title: '请输入新密码',
      icon: 'none',
      mask: true,
    })
  } else if (password.value === passwordNew.value) {
    const req: any = await uni.$api.user.changePassword({
      user_name: userID.value,
      new_password: password.value,
    })
    uni.reLaunch({
      url: '/pages/login/login',
    })
  } else {
    uni.showToast({
      title: '两次密码输入不一致',
      icon: 'none',
      mask: true,
    })
  }
}
</script>
