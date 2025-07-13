<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '帮助中心',
  },
}
</route>

<template>
  <view class="help-container p-[20px] bg-gray-50 min-h-screen">
    <view
      v-for="(help, index) in questionList"
      :key="index"
      class="help-item bg-white rounded-lg shadow-sm p-[20px] mb-[16px]"
    >
      <view class="flex items-start">
        <text
          class="question-mark bg-blue-500 text-white rounded-full w-[24px] h-[24px] flex items-center justify-center mr-[12px] flex-shrink-0"
        >
          Q
        </text>
        <text class="text-[18px] font-medium text-gray-800 leading-relaxed">
          {{ help.question }}
        </text>
      </view>
      <view class="flex items-start mt-[12px]">
        <text
          class="answer-mark bg-green-500 text-white rounded-full w-[24px] h-[24px] flex items-center justify-center mr-[12px] flex-shrink-0"
        >
          A
        </text>
        <text class="text-[16px] text-gray-600 leading-relaxed">
          {{ help.answer }}
        </text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const questionList = ref([])

onMounted(async () => {
  // 帮助中心
  const req: any = await uni.$api.user.getHelpCenter()
  questionList.value = req
  console.log('帮助中心数据:', questionList.value)
  questionList.value.forEach((help, index) => {
    console.log(`问题 ${index + 1}:`, help)
  })
})
</script>

<style lang="scss" scoped>
//
</style>
