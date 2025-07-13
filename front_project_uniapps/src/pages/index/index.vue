<route lang="json5" type="home">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true,
    backgroundColor: '#ffffff',
  },
}
</route>

<template>
  <!-- 生产商首页 -->
  <view v-if="user === 'producer'">
    <p class="text-[20px] font-bold mt-[50px] ml-[10px]">今日数据</p>
    <view class="mt-[30px] flex justify-around">
      <view>
        <p class="text-[14px] text-[#999999]">今日检测数量</p>
        <p class="text-[32px] font-bold mt-[10px]">{{ inspectedDayCount }}</p>
        <view class="flex justify-center items-center mt-[10px]">
          <p class="text-[12px] text-[#999999]">较昨日</p>
          <img
            class="size-[12px] ml-[10px] mt-[2px]"
            :src="
              countRate > 0
                ? 'http://swwq59hya.hn-bkt.clouddn.com/img/index/%E5%88%86%E7%BB%84%201.png?e=1748418207&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:oRDADkbSMWepsnkrHM63A4GS6KQ='
                : 'http://swwq59hya.hn-bkt.clouddn.com/img/index/%E7%BA%A2%E8%89%B2%E7%AE%AD%E5%A4%B4.png?e=1748418591&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:rFrMOz47yyXFPiizYz-U_B0xAeU='
            "
          />
          <p class="ml-[2px] text-[12px] text-[#999999]">{{ Math.abs(countRate) }}</p>
        </view>
      </view>
      <view>
        <p class="text-[14px] text-[#999999]">合格率</p>
        <p class="text-[32px] font-bold mt-[10px]">{{ qualifiedDayRate }}%</p>
        <view class="flex justify-center items-center mt-[10px]">
          <p class="text-[12px] text-[#999999]">较昨日</p>
          <img
            class="size-[12px] ml-[10px] mt-[2px]"
            :src="
              rate > 0
                ? 'http://swwq59hya.hn-bkt.clouddn.com/img/index/%E5%88%86%E7%BB%84%201.png?e=1748418207&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:oRDADkbSMWepsnkrHM63A4GS6KQ='
                : 'http://swwq59hya.hn-bkt.clouddn.com/img/index/%E7%BA%A2%E8%89%B2%E7%AE%AD%E5%A4%B4.png?e=1748418591&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:rFrMOz47yyXFPiizYz-U_B0xAeU='
            "
          />
          <p class="ml-[2px] text-[12px] text-[#999999]">{{ Math.abs(rate) }}%</p>
        </view>
      </view>
    </view>
    <view class="mt-[100px]">
      <view class="flex items-center">
        <p class="text-[20px] font-bold ml-[10px] whitespace-nowrap">监控画面</p>
        <view @click="closeOutside" class="ml-auto mr-5">
          <wd-drop-menu>
            <wd-drop-menu-item v-model="value1" :options="option1" @change="handleChange1" />
          </wd-drop-menu>
        </view>
      </view>
      <view class="h-[228px] w-full relative mt-[10px]">
        <video
          class="w-full"
          :controls="true"
          :autoplay="true"
          :loop="true"
          object-fit="fill"
          muted
          :src="videoUrl"
        ></video>
      </view>
    </view>
  </view>

  <!-- 质检员首页 -->
  <view v-if="user === 'inspector'">
    <view class="flex items-center">
      <p class="text-[20px] font-bold ml-[10px]">监控画面</p>
    </view>
    <view class="h-[228px] w-full relative mt-[15px]">
      <video
        class="w-full"
        :controls="true"
        :autoplay="true"
        :loop="true"
        object-fit="fill"
        muted
        :src="videoUrl"
      ></video>
    </view>
    <view
      class="flex flex-col justify-center w-full items-center"
      style="border: 1px solid #ebf4ff; border-bottom-color: black"
    >
      <p class="text-[20px] my-[5px] font-bold">今日数据</p>
    </view>
    <view class="flex flex-col">
      <view
        v-for="(option, index) in optionsList"
        :key="index"
        class="mt-[15px] pb-[5px] last:mb-[40px]"
        style="border-bottom: 1px solid #ebf4ff; border-bottom-color: #6ec4a6"
      >
        <view class="text-[18px] ml-[25px]">{{ select[index] }}</view>
        <view class="mt-[30px] flex justify-around">
          <view>
            <p class="text-[14px] text-[#999999]">今日检测数量</p>
            <p class="text-[32px] font-bold mt-[10px]">{{ option.todayDefectCount }}</p>
            <view class="flex justify-center items-center mt-[10px]">
              <p class="text-[12px] text-[#999999]">较昨日</p>
              <img
                class="size-[12px] ml-[10px] mt-[2px]"
                :src="
                  option.countChange > 0
                    ? 'http://swwq59hya.hn-bkt.clouddn.com/img/index/%E7%BA%A2%E8%89%B2%E7%AE%AD%E5%A4%B4.png?e=1749438862&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:iAJurmtfUQLnFTg7eoBe_6yns3A='
                    : 'http://swwq59hya.hn-bkt.clouddn.com/img/index/%E7%BB%BF%E8%89%B2%E7%AE%AD%E5%A4%B4.png?e=1749438881&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:bLjkJcuBRO9rjiRoE6sI6ioUmY0='
                "
              />
              <p class="ml-[2px] text-[12px] text-[#999999]">{{ Math.abs(option.countChange) }}</p>
            </view>
          </view>
          <view class="mb-[5px]">
            <p class="text-[14px] text-[#999999]">缺陷率</p>
            <p class="text-[32px] font-bold mt-[10px]">{{ option.todayDefectRatio }}%</p>
            <view class="flex justify-center items-center mt-[10px]">
              <p class="text-[12px] text-[#999999]">较昨日</p>
              <img
                class="size-[12px] ml-[10px] mt-[2px]"
                :src="
                  option.ratioChange > 0
                    ? 'http://swwq59hya.hn-bkt.clouddn.com/img/index/%E7%BA%A2%E8%89%B2%E7%AE%AD%E5%A4%B4.png?e=1749438862&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:iAJurmtfUQLnFTg7eoBe_6yns3A='
                    : 'http://swwq59hya.hn-bkt.clouddn.com/img/index/%E7%BB%BF%E8%89%B2%E7%AE%AD%E5%A4%B4.png?e=1749438881&token=P52M2UidIZTDAOkX3ldRUcogV79es_qlJI4bUKmA:bLjkJcuBRO9rjiRoE6sI6ioUmY0='
                "
              />
              <p class="ml-[2px] text-[12px] text-[#999999]">{{ Math.abs(option.ratioChange) }}%</p>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view
      class="fixed bottom-15 right-8 w-12 h-12 rounded-full flex items-center justify-center bg-[#40AE36] shadow-lg z-50"
      @touchstart="isPressed = true"
      @touchend="isPressed = false"
      @click="handleCameraClick"
    >
      <!-- 相机图标 - 使用WD-ICON组件 -->
      <!-- <wd-icon name="camera-fill" size="22px" color="white"></wd-icon> -->
      <wd-icon name="camera" size="22px" color="white"></wd-icon>

      <!-- 或者使用UniApp内置图标 -->
      <!-- <uni-icons type="camera" size="22" color="#fff"></uni-icons> -->
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useQueue } from 'wot-design-uni'
import { piniaUseStore } from '@/store'
import { onPullDownRefresh } from '@dcloudio/uni-app'
const { userInfo, setUserInfo, setToken, clearUserInfo } = piniaUseStore()
const userStore = piniaUseStore()
const isRefreshing = ref(false) // 刷新状态

const isPressed = ref(false)

const handleCameraClick = async () => {
  try {
    const res = await uni.chooseImage({
      count: 1, // 默认选择1张图片
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
      sourceType: ['album', 'camera'], // 可以从相册选择或拍照
    })

    const tempFilePath = res.tempFilePaths[0]
    console.log('检查1:', tempFilePath, userInfo.user_id)

    // 2. 上传图片
    const formData = {
      user_id: userInfo.user_id,
      workshop_id: userInfo.workshop_id,
      avatar_file: tempFilePath,
    }
    // 假设 tempFilePath 是 uni.chooseImage 返回的临时路径
    uni.uploadFile({
      url: 'http://192.168.16.154:8980/api/predict_image',
      filePath: tempFilePath,
      name: 'avatar_file', // 这个name对应后端接收文件的字段名
      formData: { inspector_id: userInfo.user_id, workshop_id: userInfo.workshop_id },
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
  } catch (error) {
    uni.showToast({
      title: error.message,
      icon: 'none',
    })
    console.error('上传失败:', error)
  }
}

const { closeOutside } = useQueue()

// 时间下拉框
const value1 = ref<number>(0)
const option1 = ref<Record<string, any>[]>([
  { label: '车间1', value: 0 },
  { label: '车间2', value: 1 },
  { label: '车间3', value: 2 },
  { label: '车间4', value: 3 },
  { label: '车间5', value: 4 },
  { label: '车间6', value: 5 },
  { label: '车间7', value: 6 },
  { label: '车间8', value: 7 },
  { label: '车间9', value: 8 },
  { label: '车间10', value: 9 },
])
async function handleChange1({ value }) {
  const viewRes = await uni.$api.workshop.getMonitorView({ workshop_id: value1.value + 1 })
  console.log('数据加载成功:', viewRes)
}

// 质检员首页分类控制
const select = [
  '不导电',
  '擦花',
  '横条压凹',
  '桔皮',
  '漏底',
  '碰伤',
  '起坑',
  '凸粉',
  '涂层开裂',
  '脏点',
  '其他',
]

// 监控画面地址
const videoUrl = ref('')
// 用户信息
const user = ref('')

// 今日数据列表
const dayList: any = ref([])
// 今日所有车间的生产数量
const totalProductionCount = ref(0)
// 今日所有车间的合格数量
const qualifiedDayCount = ref(0)
// 今日所有车间的合格率
const qualifiedDayRate = ref(0)
// 今日所有车间的缺陷数量
const inspectedDayCount = ref(0)
// 过去一天数据列表
const yesterdayList = ref([])
// 数量上传过去今天的比率
const countRate = ref(0)
// 合格率之差
const rate = ref(0)
// 昨日所有车间的合格率
const qualifiedYesterDayRate = ref(0)
// 昨日所有车间检测数量
const inspectedYesterDayCount = ref(0)
// 过去一天所有车间合格数量
const qualifiedYesterDayCount = ref(0)
// 单独分类今日数据列表
const typeList = ref([])
// 单独分类过去一日数据列表
const typeYesterdayList = ref([])
// 单独分类实际显示用的列表
const optionsList = ref([])
// 页面挂载时调用监控接口和今日数据接口

const initData = async () => {
  try {
    console.log('传递的 workshop_id:', value1.value)
    // 首页调用监控
    if (userInfo.role === 'producer') {
      const viewRes: any = await uni.$api.workshop.getMonitorView({ workshop_id: value1.value + 1 })
      console.log('数据加载成功:', viewRes.video_url)
      videoUrl.value = viewRes.video_url
      // 获取今日数据
      const dayData = await uni.$api.data.getTodayData({})
      dayList.value = dayData.data
      console.log('获取今日数据', dayData)
      // 获取过去一日的数据
      const historyData = await uni.$api.data.getYesterdayData({})
      yesterdayList.value = historyData.data
      console.log('获取过去一日数据', historyData)
      // 计算页面显示数据
      // 今日所有车间生产数量
      totalProductionCount.value = dayList.value.reduce(
        (acc, item) => acc + item.total_production_count,
        0,
      )
      // 今日所有车间合格数量
      qualifiedDayCount.value = dayList.value.reduce((acc, item) => acc + item.qualified_count, 0)
      // 今日所有车间被检测的数量
      inspectedDayCount.value = dayList.value.reduce((acc, item) => acc + item.inspected_count, 0)
      // 今日所有车间合格率
      qualifiedDayRate.value = Math.round((qualifiedDayCount.value / inspectedDayCount.value) * 100)
      // 昨日所有车间检测数量
      inspectedYesterDayCount.value = yesterdayList.value.reduce(
        (acc, item) => acc + item.inspected_count,
        0,
      )
      // 昨日所有车间合格数量
      qualifiedYesterDayCount.value = yesterdayList.value.reduce(
        (acc, item) => acc + item.qualified_count,
        0,
      )
      // 昨日所有车间合格率
      qualifiedYesterDayRate.value =
        (qualifiedYesterDayCount.value / inspectedYesterDayCount.value) * 100
      // 数量
      countRate.value = inspectedDayCount.value - inspectedYesterDayCount.value
      // 合格率之差
      rate.value = Math.round((qualifiedDayRate.value - qualifiedYesterDayRate.value) * 100) / 100
    } else {
      const viewRes: any = await uni.$api.workshop.getMonitorView({
        workshop_id: userInfo.workshop_id,
      })
      console.log('数据加载成功:', viewRes.video_url, userInfo.workshop_id)
      videoUrl.value = viewRes.video_url
      let i = 1
      for (i = 1; i < 12; i++) {
        const typeRes: any = await uni.$api.data.getTodayDefectStats({
          defect_type: i,
        })
        // typeList.value.push(typeRes)
        const typeYesterdayRes: any = await uni.$api.data.getYesterdayDefectStats({
          defect_type: i,
        })
        console.log('看一下今日单独分类', typeRes)
        console.log('看一下昨日单独分类', typeYesterdayRes)
        // typeYesterdayList.value.push(typeYesterdayRes)
        // 某分类的数量变化
        const countChange = typeRes.defect_count - typeYesterdayRes.defect_count
        console.log(
          'chakna数量变化',
          countChange,
          typeRes.defect_count,
          typeYesterdayRes.inspected_count,
        )
        // 某分类合格率的变化
        const ratioChange =
          Math.round((typeRes.defect_ratio - typeYesterdayRes.defect_ratio) * 100) / 100
        optionsList.value.push({
          todayDefectCount: typeRes.defect_count,
          todayDefectRatio: typeRes.defect_ratio,
          countChange,
          ratioChange,
        })
      }
    }
  } catch (err) {
    console.error('数据加载失败:', err)
  }
}
onPullDownRefresh(async () => {
  isRefreshing.value = true
  try {
    initData()
    optionsList.value = []
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
onMounted(async () => {
  initData()
})

onLoad(() => {
  console.log('登录拦截', userStore.userInfo.role)
  user.value = userStore.userInfo.role
  if (userStore.userInfo.username === '') {
    uni.redirectTo({ url: '/pages/login/login' })
  } else {
    uni.switchTab({ url: '/pages/index/index' })
    console.log('123321')
  }
})
</script>

<style lang="scss" scoped>
.fullscreen-video {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 999 !important;
  width: 100vh !important;
  height: 100vw !important;
  overflow: hidden !important;
  background: #000 !important;
  transform: rotate(90deg) translateY(-100%);
  transform-origin: left top;
  :deep(.custom-button) {
    box-sizing: border-box;
    width: 32px !important;
    min-width: auto !important;
    height: 32px !important;
    margin: 8rpx;
    border-radius: 16px !important;
  }

  :deep(.custom-radio) {
    height: 32px !important;
    line-height: 32px !important;
  }
}
</style>
