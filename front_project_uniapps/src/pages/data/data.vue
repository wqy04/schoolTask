<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '数据',
    enablePullDownRefresh: true,
    backgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view
    class="fixed w-full top-0 left-0 right-0 z-50 bg-white flex flex-col py-[10px] shadow-sm"
    :style="{ paddingTop: 'env(safe-area-inset-top)' }"
  >
    <view class="flex justify-between items-center">
      <view @click="closeOutside" class="ml-[2px]" v-if="userInfo.role === 'producer'">
        <wd-drop-menu>
          <wd-drop-menu-item v-model="value1" :options="option1" @change="handleChange1" />
        </wd-drop-menu>
      </view>
      <view @click="closeOutside" class="ml-[2px]" v-if="!show">
        <wd-drop-menu>
          <wd-drop-menu-item v-model="value3" :options="select" @change="handleChange1" />
        </wd-drop-menu>
      </view>
      <view @click="closeOutside" class="ml-[2px]" v-if="!show">
        <wd-drop-menu>
          <wd-drop-menu-item v-model="value4" :options="option4" @change="handleChange1" />
        </wd-drop-menu>
      </view>
      <view @click="closeOutside" class="ml-[2px]" v-if="userInfo.role !== 'producer' && show">
        {{ option1[userInfo.workshop_id].label }}
      </view>
      <wd-icon
        @click="changeVersion"
        name="refresh1"
        size="19px"
        class="ml-[11px]"
        color="#09B6BA"
      ></wd-icon>
    </view>
    <view @click="closeOutside" class="ml-[2px]" v-if="!show">
      <wd-calendar v-if="value4 === 3" ref="calendarRef" v-model="date" @confirm="handleChange1" />
    </view>
  </view>

  <view
    :style="{ paddingTop: `calc(50px + env(safe-area-inset-top))` }"
    class="pt-[170px]"
    v-if="show"
  >
    <view v-for="(vision, index) in visionList" :key="index">
      <view class="flex justify-between mt-[31px] px-[8px]">
        <p class="text-[16px] text-black">{{ vision.name }}</p>
        <view @click="closeOutside" class="mr-[21px]">
          <wd-drop-menu>
            <wd-drop-menu-item
              v-model="vision.timeRange"
              :options="option2"
              @change="(val) => handleChartTimeRangeChange(val, vision.type, index)"
            />
          </wd-drop-menu>
        </view>
      </view>
      <LEchart
        class="echart"
        :ref="
          (el) => {
            chartsRef[index] = el
          }
        "
        @finished="() => initChart(index)"
        :style="{ height: '300px' }"
      />
    </view>
  </view>

  <view class="pt-[100px]" v-if="!show">
    <view v-for="(changed, index) in changedList" :key="index">
      <view class="bg-white rounded-xl shadow-lg mt-[30px] mx-4 my-4 relative pl-4 h-[147px]">
        <view class="absolute left-0 top-0 bottom-0 w-[5px] bg-[#A5E8D0] rounded-l-xl"></view>

        <!-- 卡片内容区域 -->
        <view>
          <view class="justify-between mt-[31px] px-[10px] flex">
            <p class="text-[20px]" color="#475669">{{ changed.date }}</p>
            <p class="text-[20px] mr-[8px]" color="#475669">{{ changed.type }}</p>
          </view>
          <view class="flex">
            <p v-if="no" class="text-[20px] ml-[76px] mt-[25px]" color="#475669">检测数量</p>
            <p v-if="!no" class="text-[20px] ml-[76px] mt-[25px]" color="#475669">缺陷数量</p>
            <p class="text-[25px] ml-[20px] mt-[25px]" text-black>{{ changed.count }}</p>
          </view>
          <view class="flex">
            <p v-if="yes" class="text-[20px] ml-[76px] mt-[17px]" color="#475669">合格率</p>
            <p v-if="!yes" class="text-[20px] ml-[76px] mt-[17px]" color="#475669">缺陷率</p>
            <p class="text-[25px] ml-[40px] mt-[17px]" text-black>{{ changed.percent }}%</p>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { useQueue } from 'wot-design-uni'
import * as echarts from 'echarts/dist/echarts'
import LEchart from '@/components/l-echart/l-echart.vue'
import { piniaUseStore, piniaUseStoreRefs } from '@/store'
const isRefreshing = ref(false) // 刷新状态
const chartsRef = ref<Array<any>>([])
const yes = ref(true)
const no = ref(true)

const { closeOutside } = useQueue()
const value1 = ref<number>(0)
const value3 = ref<number>(0)
const value4 = ref<number>(0)
const flag = ref(false)
const { clearUserInfo, userInfo } = piniaUseStore()
const weekResponse: { data: any[] } = { data: [] } // 过去一周的数据存储
const monthResponse: { data: any[] } = { data: [] } // 过去一月的数据存储
const isAllWorkshop = ref(true) // 车间id 初始化为全部车间0
// 定义存储缺陷数据的变量
const weekDefectRes: any = [{ name: null, total: 0 }] // 过去一周的缺陷数据存储
const monthDefectRes: any = [{ name: null, total: 0 }] // 过去一月的缺陷数据存储// 日历选择器
const calendarRef = ref(null)

watch(value4, (newVal) => {
  if (newVal === 3) {
    // 当选择第四个选项时
    nextTick(() => {
      calendarRef.value?.open() // 调用 open 方法打开日历
    })
  }
})

interface EChartOption {
  title?: any
  tooltip?: any
  legend?: any
  grid?: any
  xAxis?: {
    type: string
    data: string[]
    axisLabel?: {
      interval?: number
    }
  }
  yAxis?: {
    type: string
    name?: string
    axisLabel?: {
      formatter?: string
    }
  }
  series: Array<{
    name: string
    type: string
    data: any
    smooth?: boolean
    radius?: string
    emphasis?: any
    itemStyle?: any
    barGap?: number
  }>
  dataZoom?: Array<{
    type?: string
    xAxisIndex?: number
    start?: number
    end?: number
  }>
}

const option1 = ref<Record<string, any>[]>([
  { label: '所有车间', value: 0 },
  { label: '车间1', value: 1 },
  { label: '车间2', value: 2 },
  { label: '车间3', value: 3 },
  { label: '车间4', value: 4 },
  { label: '车间5', value: 5 },
  { label: '车间6', value: 6 },
  { label: '车间7', value: 7 },
  { label: '车间8', value: 8 },
  { label: '车间9', value: 9 },
  { label: '车间10', value: 10 },
])

const optionIns = ref<Record<string, any>[]>([])

const option2 = ref<Record<string, any>[]>([
  { label: '过去一周', value: 0 },
  { label: '过去一月', value: 1 },
])

const select = ref([
  { label: '全部类型', value: 0 },
  { label: '不导电', value: 1 },
  { label: '擦花', value: 2 },
  { label: '横条压凹', value: 3 },
  { label: '桔皮', value: 4 },
  { label: '漏底', value: 5 },
  { label: '碰伤', value: 6 },
  { label: '起坑', value: 7 },
  { label: '凸粉', value: 8 },
  { label: '涂层开裂', value: 9 },
  { label: '脏点', value: 10 },
  { label: '其他', value: 11 },
])

const option4 = ref<Record<string, any>[]>([
  { label: '当天', value: 0 },
  { label: '过去一周', value: 1 },
  { label: '过去一月', value: 2 },
  { label: '具体日期', value: 3 },
])

interface VisionItem {
  name: string
  type: 'bar' | 'line' | 'pie'
  timeRange: number
  option: EChartOption
}
// 数据统计变量

const weeklyDefectStats = ref([]) // 过去一周特定缺陷类型统计

// 负责循坏列表显示
const changedList = ref([])
// date数组
const weeklyDate = ref([])

// 列表形式的数据初始化
const todayAllDataCount = ref(0)
const today = ref('')
const qualifiedDayCount = ref(0)
const qualifiedDayRate = ref(0)
const date1 = new Date()
const year = date1.getFullYear()
const month = String(date1.getMonth() + 1).padStart(2, '0')
const day = String(date1.getDate()).padStart(2, '0')
today.value = `${year}-${month}-${day}`
const date = ref(today.value)

// 数据页初始化
const initTableData = async () => {
  // 获取今日所有车间的所有数据
  changedList.value = []
  if (userInfo.role === 'producer') {
    console.log('获取今日日期', today.value)
    yes.value = true
    const res = await uni.$api.data.getTodayData()
    console.log('查看今日所有车间的所有数据', res.data)
    const todayAllData = res.data
    // 计算出今日所有车间的检测数量
    todayAllDataCount.value = todayAllData.reduce((acc, item) => acc + item.inspected_count, 0)
    qualifiedDayCount.value = todayAllData.reduce((acc, item) => acc + item.qualified_count, 0)
    qualifiedDayRate.value =
      todayAllData === 0 ? 0 : Math.round((qualifiedDayCount.value / todayAllDataCount.value) * 100)
    console.log(
      '查看shuju',
      todayAllDataCount.value,
      qualifiedDayCount.value,
      qualifiedDayRate.value,
    )
    if (changedList.value.length === 0) {
      changedList.value.push({
        date: today.value,
        type: '全部类型',
        count: todayAllDataCount.value,
        percent: qualifiedDayRate.value,
      })
    }
    console.log('查看changedList', changedList.value)
  } else {
    // 获取特定车间的数据
    // 获取特定车间的数据
    date.value = today.value
    const res: any = await uni.$api.workshop.getTodaySpecificWorkshopData({
      workshop_id: value1.value,
    })
    console.log('获取特定车间数据列表', res)
    if (changedList.value.length === 0) {
      changedList.value.push({
        date: today.value,
        type: '全部类型',
        count: res.count,
        percent: res.pass_rate * 100,
      })
    }
    const temp = changedList.value.reduce((acc, item) => acc + item.count, 0)
    changedList.value[0].count = temp
    yes.value = true
  }
}

onPullDownRefresh(async () => {
  isRefreshing.value = true
  try {
    value1.value = 0
    value3.value = 0
    value4.value = 0
    initTableData()
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

const visionList = ref<VisionItem[]>([
  // 柱状图示例
  {
    name: '质量统计',
    type: 'bar',
    timeRange: 0, // 0: 过去一周, 1: 过去一月
    option: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow', // 鼠标悬停时的指示器类型
        },
        formatter: '{b}{a0}: {c0}{a1}: {c1}', // 自定义提示框内容
      },
      xAxis: {
        type: 'category',
        data: [],
        axisLabel: { interval: 0 },
      },
      yAxis: { type: 'value', name: '数量(个)' },
      series: [
        {
          name: '合格数量',
          type: 'bar',
          data: [],
        },
        { name: '缺陷数量', type: 'bar', data: [] },
      ],
    },
  }, // 折线图示例
  {
    name: '合格率趋势',
    type: 'line',
    timeRange: 0, // 0: 过去一周, 1: 过去一月
    option: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line', // 鼠标悬停时的指示器类型
        },
        formatter: '{b}{a0}: {c0}%', // 自定义提示框内容
      },
      xAxis: {
        type: 'category',
        data: [],
      },
      yAxis: {
        type: 'value',
        name: '百分比(%)',
        axisLabel: { formatter: '{value}%' },
      },
      series: [
        {
          name: '合格率',
          type: 'line',
          data: [],
          smooth: true,
        },
      ],
    },
  }, // 饼图示例
  {
    name: '缺陷分布',
    type: 'pie',
    timeRange: 0, // 0: 过去一周, 1: 过去一月
    option: {
      tooltip: { trigger: 'item' },
      series: [
        {
          name: '缺陷类型',
          type: 'pie',
          radius: '50%',
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 5,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    },
  },
])
// 今日特定车间检测数量

async function handleChange1({ value }) {
  if (show.value === true) {
    // 根据选择的车间更新数据
    await loadChartData(value) // 等待数据加载完成
    await loadChartDefectData(value) // 等待缺陷数据加载完成
    // 更新所有图表的数据
    visionList.value.forEach((item, index) => {
      updateChartData(item.timeRange, item.type, index)
    })
  } else {
    changedList.value = []
    const d = new Date(parseInt(date.value))
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    date.value = `${year}-${month}-${day}`
    if (date.value === '1970-01-01') {
      date.value = today.value
    }
    console.log('触发点击事件后的日期', date.value)
    // 选项均没有选时
    if (userInfo.role === 'producer') {
      console.log('进入了生产商数据页')
      if (value1.value === 0 && value3.value === 0 && value4.value === 0) {
        initTableData()
      } else if (value1.value !== 0 && value3.value === 0 && value4.value === 0) {
        // 获取特定车间的数据
        const res: any = await uni.$api.workshop.getTodaySpecificWorkshopData({
          workshop_id: value1.value,
        })
        console.log('获取特定车间数据列表', res)
        changedList.value.push({
          date: today.value,
          type: '全部类型',
          count: res.count,
          percent: res.pass_rate * 100,
        })
        const temp = changedList.value.reduce((acc, item) => acc + item.count, 0)
        changedList.value[0].count = temp
        yes.value = true
      } else if (value1.value === 0 && value3.value !== 0 && value4.value === 0) {
        const res: any = await uni.$api.data.getTodayDefectStats({ defect_type: value3.value })
        console.log('只选了缺陷种类', res)
        no.value = false
        yes.value = false
        changedList.value.push({
          date: today.value,
          type: select.value[value3.value].label,
          count: res.defect_count,
          percent: res.defect_ratio,
        })
      } else if (value1.value === 0 && value3.value === 0 && value4.value !== 0) {
        if (value4.value === 1) {
          const res: any = await uni.$api.data.getWeeklyData()
          console.log('获取一周的数据', res.data)
          let i = 0
          no.value = true
          yes.value = true
          for (i = 0; i < 7; i++) {
            changedList.value.push({
              date: res.data[i].date,
              type: '全部类型',
              count: res.data[i].inspected_count,
              percent: res.data[i].qualified_rate,
            })
          }
          const temp = changedList.value.reduce((acc, item) => acc + item.count, 0)
          changedList.value[0].count = temp
        } else if (value4.value === 2) {
          const res: any = await uni.$api.data.getMonthlyData()
          console.log('获取一月的数据', res.data)
          let i = 0
          no.value = true
          yes.value = true
          for (i = 0; i < res.data.length; i++) {
            changedList.value.push({
              date: res.data[i].date,
              type: '全部类型',
              count: res.data[i].inspected_count,
              percent: res.data[i].qualified_rate,
            })
          }
        } else {
          if (value4.value === 3 && date.value !== today.value) {
            let i = 0
            const defectCount = ref(0)
            const defectRate = ref(0)
            console.log('具体日期时间', date.value)
            no.value = false
            yes.value = false
            for (i = 0; i < select.value.length; i++) {
              const res: any = await uni.$api.data.getSpecificDateDefectStats({
                defect_type: i,
                date: date.value,
              })
              console.log('查看所有车间特定日期的数据', res)
              defectCount.value = res.defect_count + defectCount.value
              defectRate.value = res.defect_ratio + defectRate.value
            }
            changedList.value.push({
              date: date.value,
              type: '全部类型',
              count: defectCount.value,
              percent: defectRate.value.toFixed(2),
            })
          }
        }
      } else if (value1.value !== 0 && value3.value !== 0 && value4.value === 0) {
        console.log('123321')
        const res: any = await uni.$api.workshop.getTodaySpecificWorkshopDefectStats({
          workshop_id: value1.value,
          defect_type: value3.value,
        })
        console.log('选择某车间某类型今日', res)
        no.value = false
        yes.value = false
        changedList.value.push({
          date: today.value,
          type: select.value[value3.value].label,
          count: res.defect_count,
          percent: res.defect_ratio * 100,
        })
      } else if (value1.value !== 0 && value3.value === 0 && value4.value !== 0) {
        if (value4.value === 1) {
          const res: any = await uni.$api.workshop.getWeeklySpecificWorkshopData({
            workshop_id: value1.value,
          })
          console.log('选择某车间全部类型一周', res)
          let i = 0
          no.value = true
          yes.value = true
          for (i = 0; i < res.data.length; i++) {
            console.log('循环次数', i)
            changedList.value.push({
              date: res.data[i].date,
              type: '全部类型',
              count: res.data[i].pass_count,
              percent: res.data[i].pass_rate * 100,
            })
          }
        } else if (value4.value === 2) {
          const res: any = await uni.$api.workshop.getMonthlySpecificWorkshopData({
            workshop_id: value1.value,
          })
          console.log('选择某车间全部类型一月', res.data)
          let i = 0
          no.value = true
          yes.value = true
          for (i = 0; i < res.data.length; i++) {
            changedList.value.push({
              date: res.data[i].date,
              type: '全部类型',
              count: res.data[i].pass_count,
              percent: res.data[i].pass_rate * 100,
            })
          }
        } else {
          if (value4.value === 3 && date.value !== today.value) {
            let i = 0
            no.value = false
            yes.value = false
            const defectCount = ref(0)
            const defectRate = ref(0)
            for (i = 0; i < select.value.length; i++) {
              const res: any = await uni.$api.workshop.getSpecificDateSpecificWorkshopDefectStats({
                workshop_id: value1.value,
                defect_type: i,
                date: date.value,
              })
              defectCount.value = res.defect_count + defectCount.value
              defectRate.value = res.defect_ratio + defectRate.value
            }
            changedList.value.push({
              date: date.value,
              type: '全部类型',
              count: defectCount.value,
              percent: (defectRate.value * 100).toFixed(2),
            })
          }
        }
      } else if (value1.value === 0 && value3.value !== 0 && value4.value !== 0) {
        if (value4.value === 1) {
          const res: any = await uni.$api.data.getWeeklyDefectStats({
            defect_type: value3.value,
          })
          console.log('选择所有车间某类型一周', res.data)
          let i = 0
          no.value = false
          yes.value = false
          for (i = 0; i < res.data.length; i++) {
            changedList.value.push({
              date: res.data[i].date,
              type: select.value[value3.value].label,
              count: res.data[i].defect_count,
              percent: res.data[i].defect_ratio,
            })
          }
        } else if (value4.value === 2) {
          const res: any = await uni.$api.data.getMonthlyDefectStats({
            defect_type: value3.value,
          })
          console.log('选择所有车间某类型一月', res.data)
          let i = 0
          no.value = false
          yes.value = false
          for (i = 0; i < res.data.length; i++) {
            changedList.value.push({
              date: res.data[i].date,
              type: select.value[value3.value].label,
              count: res.data[i].defect_count,
              percent: res.data[i].defect_ratio,
            })
          }
        } else {
          if (value4.value === 3 && date.value !== today.value) {
            const res: any = await uni.$api.data.getSpecificDateDefectStats({
              defect_type: value3.value,
              date: date.value,
            })
            console.log('选择所有车间某类型特定日期', res)
            no.value = false
            yes.value = false
            changedList.value.push({
              date: date.value,
              type: select.value[value3.value].label,
              count: res.defect_count,
              percent: res.defect_ratio,
            })
          }
        }
      } else if (value1.value !== 0 && value3.value !== 0 && value4.value !== 0) {
        if (value4.value === 1) {
          const res: any = await uni.$api.workshop.getWeeklySpecificWorkshopDefectStats({
            workshop_id: value1.value,
            defect_type: value3.value,
          })
          console.log('选择某车间某类型一周', res.data)
          let i = 0
          no.value = true
          yes.value = true
          for (i = 0; i < res.data.length; i++) {
            changedList.value.push({
              date: res.data[i].date,
              type: select.value[value3.value].label,
              count: res.data[i].defect_count,
              percent: res.data[i].defect_ratio * 100,
            })
          }
          yes.value = false
          no.value = false
          console.log(changedList.value)
        } else if (value4.value === 2) {
          const res: any = await uni.$api.workshop.getMonthlySpecificWorkshopDefectStats({
            workshop_id: value1.value,
            defect_type: value3.value,
          })
          console.log('选择某车间某类型一月', res.data)
          no.value = true
          yes.value = true
          let i = 0
          for (i = 0; i < res.data.length; i++) {
            changedList.value.push({
              date: res.data[i].date,
              type: select.value[value3.value].label,
              count: res.data[i].defect_count,
              percent: res.data[i].defect_ratio * 100,
            })
          }
        } else {
          if (value4.value === 3 && date.value !== today.value) {
            const res: any = await uni.$api.workshop.getSpecificDateSpecificWorkshopDefectStats({
              workshop_id: value1.value,
              defect_type: value3.value,
              date: date.value,
            })
            console.log('选择某车间某类型某日期', res)
            no.value = false
            yes.value = false
            changedList.value.push({
              date: date.value,
              type: select.value[value3.value].label,
              count: res.defect_count,
              percent: res.defect_ratio * 100,
            })
          }
        }
      }
    } else {
      console.log('进入了质检员数据页')
      changedList.value = []
      const value = value1.value + 1
      if (value3.value === 0 && value4.value === 0) {
        // 获取特定车间的数据
        const res: any = await uni.$api.workshop.getTodaySpecificWorkshopData({
          workshop_id: value,
        })
        console.log('获取特定车间数据列表', res)
        changedList.value.push({
          date: today.value,
          type: '全部类型',
          count: res.count,
          percent: res.pass_rate * 100,
        })
        console.log('检查changedList', changedList.value)
        yes.value = true
      } else if (value3.value !== 0 && value4.value === 0) {
        console.log('123321')
        const res: any = await uni.$api.workshop.getTodaySpecificWorkshopDefectStats({
          workshop_id: value,
          defect_type: value3.value,
        })
        console.log('选择某车间某类型今日', res)
        no.value = false
        yes.value = false
        changedList.value.push({
          date: today.value,
          type: select.value[value3.value].label,
          count: res.defect_count,
          percent: res.defect_ratio * 100,
        })
      } else if (value3.value === 0 && value4.value !== 0) {
        if (value4.value === 1) {
          const res: any = await uni.$api.workshop.getWeeklySpecificWorkshopData({
            workshop_id: value,
          })
          console.log('选择某车间全部类型一周', res, value)
          let i = 0
          no.value = true
          yes.value = true
          for (i = 0; i < res.data.length; i++) {
            console.log('循环次数', i)
            changedList.value.push({
              date: res.data[i].date,
              type: '全部类型',
              count: res.data[i].pass_count,
              percent: (res.data[i].pass_rate * 100).toFixed(2),
            })
          }
          console.log('查看changed', changedList.value)
        } else if (value4.value === 2) {
          const res: any = await uni.$api.workshop.getMonthlySpecificWorkshopData({
            workshop_id: value,
          })
          console.log('选择某车间全部类型一月', res)
          let i = 0
          no.value = true
          yes.value = true
          for (i = 0; i < res.data.length; i++) {
            changedList.value.push({
              date: res.data[i].date,
              type: '全部类型',
              count: res.data[i].pass_count,
              percent: (res.data[i].pass_rate * 100).toFixed(2),
            })
          }
        } else {
          if (value4.value === 3 && date.value !== today.value) {
            let i = 0
            no.value = false
            yes.value = false
            const defectCount = ref(0)
            const defectRate = ref(0)
            for (i = 0; i < select.value.length; i++) {
              const res: any = await uni.$api.workshop.getSpecificDateSpecificWorkshopDefectStats({
                workshop_id: value,
                defect_type: i,
                date: date.value,
              })
              defectCount.value = res.defect_count + defectCount.value
              defectRate.value = res.defect_ratio + defectRate.value
              console.log(res)
            }

            changedList.value.push({
              date: date.value,
              type: '全部类型',
              count: defectCount.value,
              percent: defectRate.value * 100,
            })
            changedList.value[0].count = changedList.value.reduce(
              (acc, item) => acc + item.count,
              0,
            )
          }
        }
      } else {
        if (value4.value === 1) {
          const res: any = await uni.$api.workshop.getWeeklySpecificWorkshopDefectStats({
            workshop_id: value,
            defect_type: value3.value,
          })
          console.log('选择某车间某类型一周', res.data)
          let i = 0
          no.value = true
          yes.value = true
          for (i = 0; i < res.data.length; i++) {
            changedList.value.push({
              date: res.data[i].date,
              type: select.value[value3.value].label,
              count: res.data[i].defect_count,
              percent: res.data[i].defect_ratio * 100,
            })
          }
        } else if (value4.value === 2) {
          const res: any = await uni.$api.workshop.getMonthlySpecificWorkshopDefectStats({
            workshop_id: value,
            defect_type: value3.value,
          })
          console.log('选择某车间某类型一月', res.data)
          no.value = true
          yes.value = true
          let i = 0
          for (i = 0; i < res.data.length; i++) {
            changedList.value.push({
              date: res.data[i].date,
              type: select.value[value3.value].label,
              count: res.data[i].defect_count,
              percent: res.data[i].defect_ratio * 100,
            })
          }
        } else {
          if (value4.value === 3 && date.value !== today.value) {
            const res: any = await uni.$api.workshop.getSpecificDateSpecificWorkshopDefectStats({
              workshop_id: value,
              defect_type: value3.value,
              date: date.value,
            })
            console.log('选择某车间某类型某日期', res)
            no.value = false
            yes.value = false
            changedList.value.push({
              date: date.value,
              type: select.value[value3.value].label,
              count: res.defect_count,
              percent: res.defect_ratio * 100,
            })
          }
        }
      }
    }
  }
}

const handleChartTimeRangeChange = async ({ value }, chartType: string, index: number) => {
  flag.value = true
  visionList.value[index].timeRange = value
  await updateChartData(value, chartType, index)
}

// 图表更新
const updateChartData = async (timeRange: number, chartType: string, chartIndex: number) => {
  const isWeek = timeRange === 0 // 是否为一周数据
  if (userInfo.role === 'inspector') {
    isAllWorkshop.value = false
  } else {
    isAllWorkshop.value = value1.value === 0 // 是否为所有车间数据
  }
  const chartItem = visionList.value[chartIndex] // 根据图表类型和索引决定如何更新数据
  switch (chartType) {
    case 'bar': // 质量统计柱状图
      console.log('1111111', isWeek, timeRange)
      chartItem.option = {
        ...chartItem.option,
        xAxis: {
          type: 'category',
          data: isWeek
            ? weekResponse.data.map((item) => item.date.split('-')[2] + '日')
            : monthResponse.data.map((item) => item.date.split('-')[2] + '日'),
          axisLabel: { interval: 0 },
        },
        series: [
          {
            ...chartItem.option.series[0],
            data: isWeek
              ? isAllWorkshop.value
                ? weekResponse.data.map((item) => item.qualified_count)
                : weekResponse.data.map((item) => item.pass_count)
              : isAllWorkshop.value
                ? monthResponse.data.map((item) => item.qualified_count)
                : monthResponse.data.map((item) => item.pass_count),
          },
          {
            ...chartItem.option.series[1],
            data: isWeek
              ? isAllWorkshop.value
                ? weekResponse.data.map((item) => item.unqualified_count)
                : weekResponse.data.map((item) => item.count - item.pass_count)
              : isAllWorkshop.value
                ? monthResponse.data.map((item) => item.unqualified_count)
                : monthResponse.data.map((item) => item.count - item.pass_count),
          },
        ],
        dataZoom: isWeek
          ? []
          : [
              { type: 'slider', xAxisIndex: 0, start: 0, end: 30 },
              { type: 'inside', xAxisIndex: 0 },
            ],
      }
      break
    case 'line': // 合格率趋势折线图
      chartItem.option = {
        ...chartItem.option,
        xAxis: {
          type: 'category',
          data: isWeek
            ? weekResponse.data.map((item) => item.date.split('-')[2] + '日')
            : monthResponse.data.map((item) => item.date.split('-')[2] + '日'),
        },
        series: [
          {
            ...chartItem.option.series[0],
            data: isWeek
              ? isAllWorkshop.value
                ? weekResponse.data.map((item) => item.qualified_rate)
                : weekResponse.data.map((item) => item.pass_rate)
              : isAllWorkshop.value
                ? monthResponse.data.map((item) => item.qualified_rate)
                : monthResponse.data.map((item) => item.pass_rate),
          },
        ],
        dataZoom: isWeek
          ? []
          : [
              { type: 'slider', xAxisIndex: 0, start: 0, end: 30 },
              { type: 'inside', xAxisIndex: 0 },
            ],
      }
      break
    case 'pie': // 缺陷分布饼图
      chartItem.option = {
        ...chartItem.option,
        tooltip: { trigger: 'item' },
        series: [
          {
            name: '缺陷类型',
            type: 'pie',
            radius: '50%',
            data: isWeek
              ? weekDefectRes.map((item) => ({
                  name: item.name,
                  value: item.total,
                }))
              : monthDefectRes.map((item) => ({
                  name: item.name,
                  value: item.total,
                })),
            emphasis: {
              itemStyle: {
                shadowBlur: 5,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
      break
  }
  // 更新图表
  if (chartsRef.value[chartIndex]) {
    chartsRef.value[chartIndex].setOption(chartItem.option, true)
  }
}
// 切换视图表现
const show = ref(true)
const changeVersion = () => {
  initTableData()
  initChart(0)
  initChart(1)
  initChart(2)
  show.value = !show.value
}
// 挂载时加载图表
// 初始化图表函数
const initChart = (index: number) => {
  const chartItem = visionList.value[index]
  const chartInstance = chartsRef.value[index]
  if (chartInstance) {
    chartInstance.init(echarts, (chart: any) => {
      // 根据不同类型设置不同的基础配置
      const baseOption = {
        tooltip: { trigger: 'axis' },
        legend: { data: chartItem.option.series.map((s: any) => s.name) },
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
        ...chartItem.option,
      } // 根据不同类型设置颜色

      if (chartItem.type === 'bar') {
        baseOption.series = baseOption.series.map((s: any, i: number) => ({
          ...s,
          // itemStyle: {
          //   color: i === 0 ? '#91cc75' : '#ee6666', // 第一个系列绿色，其他红色
          // },
        }))
      } else if (chartItem.type === 'line') {
        baseOption.series[0].itemStyle = { color: '#5470c6' }
      }
      chart.setOption(baseOption)
    })
  }
}

// 加载缺陷数据
const loadChartDefectData = async (workshopId: number) => {
  try {
    if (userInfo.role === 'inspector') {
      workshopId = userInfo.workshop_id
      isAllWorkshop.value = false
    } else {
      isAllWorkshop.value = value1.value === 0 // 是否为所有车间数据
      workshopId = value1.value
    }
    // 直接定义11种缺陷类型（排除"全部类型"）
    const defectTypes = select.value.filter((opt) => opt.value !== 0)
    if (isAllWorkshop.value) {
      console.log('加载所有车间缺陷数据')
      const weekRes = await Promise.all(
        defectTypes.map((defectTypes) =>
          uni.$api.data.getWeeklyDefectStats({
            workshop_id: workshopId,
            defect_type: defectTypes.value,
          }),
        ),
      )
      // 数组weekRes中的每个元素对应一个 getWeeklyDefectStats 请求的结果
      const monthRes = await Promise.all(
        defectTypes.map((defectTypes) =>
          uni.$api.data.getMonthlyDefectStats({
            workshop_id: workshopId,
            defect_type: defectTypes.value,
          }),
        ),
      )
      for (let i = 0; i < 11; i++) {
        const sumRes = weekRes[i].data.reduce((acc, item) => acc + item.defect_count, 0)
        weekDefectRes[i] = { name: defectTypes[i].label, total: sumRes }
      }
      for (let i = 0; i < 11; i++) {
        const sumRes = monthRes[i].data.reduce((acc, item) => acc + item.defect_count, 0)
        monthDefectRes[i] = { name: defectTypes[i].label, total: sumRes }
      }
      console.log('缺陷数据加载成功:', weekDefectRes, monthDefectRes)
    } else {
      // 加载特定车间缺陷数据
      console.log('加载特定车间缺陷数据', workshopId)
      // 加载缺陷类型数据
      const weekRes = await Promise.all(
        defectTypes.map((type) =>
          uni.$api.workshop.getWeeklySpecificWorkshopDefectStats({
            workshop_id: workshopId,
            defect_type: type.value,
          }),
        ),
      )
      // 加载月缺陷数据
      const monthRes = await Promise.all(
        defectTypes.map((type) =>
          uni.$api.workshop.getMonthlySpecificWorkshopDefectStats({
            workshop_id: workshopId,
            defect_type: type.value,
          }),
        ),
      )
      for (let i = 0; i < 11; i++) {
        const sumRes = weekRes[i].data.reduce((acc, item) => acc + item.defect_count, 0)
        weekDefectRes[i] = { name: defectTypes[i].label, total: sumRes }
      }
      for (let i = 0; i < 11; i++) {
        console.log('月缺陷数据', monthRes[i].data)
        const sumRes = monthRes[i].data.reduce((acc, item) => acc + item.defect_count, 0)
        console.log('ssssssssss', sumRes)
        monthDefectRes[i] = { name: defectTypes[i].label, total: sumRes }
      }
      console.log('缺陷数据加载成功:', weekDefectRes, monthDefectRes)
    }
  } catch (err) {
    console.error('数据加载失败:', err)
  }
}

const loadChartData = async (workshopId: number) => {
  try {
    if (userInfo.role === 'inspector') {
      workshopId = userInfo.workshop_id
      isAllWorkshop.value = false
    } else {
      isAllWorkshop.value = value1.value === 0 // 是否为所有车间数据
      workshopId = value1.value
    }
    if (isAllWorkshop.value) {
      console.log('加载所有车间数据', workshopId)
      // 加载所有车间数据
      const [weekRes, monthRes] = await Promise.all([
        uni.$api.data.getWeeklyData(),
        uni.$api.data.getMonthlyData(),
      ])
      if (weekRes.data) {
        console.log('数据加载成功:', weekRes.data)
        weekResponse.data = weekRes.data
      } else {
        console.error('获取数据失败:', weekRes)
      }
      if (monthRes.data) {
        console.log('数据加载成功:', monthRes.data)
        monthResponse.data = monthRes.data
        console.log('数据加载成功:', monthResponse.data)
      } else {
        console.error('获取数据失败:', monthRes)
      }
    } else {
      // 加载特定车间数据
      console.log('加载特定车间数据', workshopId, value1.value)
      const weekRes = await uni.$api.workshop.getWeeklySpecificWorkshopData({
        workshop_id: workshopId,
      })
      const monthRes = await uni.$api.workshop.getMonthlySpecificWorkshopData({
        workshop_id: workshopId,
      })
      if (weekRes.data) {
        console.log('数据加载成功:', weekRes.data)
        weekResponse.data = weekRes.data
        console.log('某车间数据加载成功:', weekResponse.data)
      } else {
        console.error('获取某车间数据失败:', weekRes)
      }
      if (monthRes.data) {
        console.log('车间月数据加载成功:', monthRes.data)
        monthResponse.data = monthRes.data
      } else {
        console.error('获取车间月数据失败:', monthRes)
      }
    }
  } catch (err) {
    console.error('数据加载失败:', err)
  }
}

onMounted(async () => {
  date.value = today.value
  initTableData()
  if (userInfo.role === 'inspector') {
    optionIns.value.push({ label: option1.value[userInfo.workshop_id].label, value: 0 })
  }
  try {
    // 初始化图表
    if (userInfo.role === 'producer') {
      value1.value = 0
    } else {
      isAllWorkshop.value = false
    }
    initChart(0)
    initChart(1)
    initChart(2)
    console.log('车间', value1.value)
    await loadChartData(value1.value)
    await loadChartDefectData(value1.value)
    // 更新所有图表
    visionList.value.forEach((item, index) => {
      updateChartData(item.timeRange, item.type, index)
    })
  } catch (err) {
    console.error('数据加载失败:', err)
  }
})
onLoad(() => {
  console.log('登录拦截', userInfo.role)
  if (userInfo.username === '') {
    uni.redirectTo({ url: '/pages/login/login' })
  }
})
</script>

<style lang="scss" scoped>
//
</style>
