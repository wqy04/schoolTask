import { http } from './http.index'

declare global {
  interface Uni {
    $api: typeof api
  }
}

// 定义 API 接口对象
const api = {
  base: {
    // 基础服务：登录登出、身份信息、菜单授权、切换系统、字典数据等
    login: (params: { username: string; password: string }): Promise<any> =>
      http.post('/login/pwd', {
        ...params,
        __login: true,
        param_deviceType: 'mobileApp',
        encode: false,
      }),
    logout: (params = {}) => http.get('/logout', params),
  },
  user: {
    // 用户登录接口
    login: (params = {}) => http.post('/login', params),
    // 头像上传接口
    uploadAvatar: (params = {}) => http.post('/upload_avatar', params),
    // 用户信息获取接口
    getUserInfo: (params = {}) => http.post('/user_info', params),
    // 密码修改接口
    changePassword: (params = {}) => http.post('/change_password', params),
    // 帮助中心接口
    getHelpCenter: (params = {}) => http.get('/help_center', params),
    // 退出登录接口
    logout: (params = {}) => http.post('/logout', params),
    // 照片上传接口
    predictImage: (params = {}) => http.post('/predict_image', params),
  },
  workshop: {
    // 获取车间监控
    getMonitorView: (params = {}) => http.post('/monitor_view', params),
    // 今日数据特定车间接口 12
    getTodaySpecificWorkshopData: (params = {}) =>
      http.post('/today_specific_workshop_data', params),
    // 一天历史数据特定车间接口13
    getYesterdaySpecificWorkshopData: (params = {}) =>
      http.post('/yesterday_specific_workshop_data', params),
    // 一周历史数据特定车间接口14
    getWeeklySpecificWorkshopData: (params = {}) =>
      http.post('/weekly_specific_workshop_data', params),
    // 一月历史数据特定车间接口15
    getMonthlySpecificWorkshopData: (params = {}) =>
      http.post('/monthly_specific_workshop_data', params),
    // 单独分类今日数据统计特定车间接口 16
    getTodaySpecificWorkshopDefectStats: (params = {}) =>
      http.post('/today_specific_workshop_defect_stats', params),
    // 单独分类过去一天数据统计特定车间接口 17
    getYesterdaySpecificWorkshopDefectStats: (params = {}) =>
      http.post('/yesterday_specific_workshop_defect_stats', params),
    // 单独分类过去一周数据统计特定车间接口 18
    getWeeklySpecificWorkshopDefectStats: (params = {}) =>
      http.post('/weekly_specific_workshop_defect_stats', params),
    // 单独分类过去一月数据统计特定车间接口 19
    getMonthlySpecificWorkshopDefectStats: (params = {}) =>
      http.post('/monthly_specific_workshop_defect_stats', params),
    // 特定日期数据统计特定车间接口 20
    getSpecificDateSpecificWorkshopDefectStats: (params = {}) =>
      http.post('/specific_date_specific_workshop_defect_stats', params),
  },
  data: {
    // 获取所有车间的今日检测数量和合格率
    getTodayData: (params = {}) => http.get('/today_data', params),
    // 获取所有车间的过去一天的检测数量和合格率
    getYesterdayData: (params = {}) => http.get('/yesterday_data', params),
    // 获取所有车间过去一周的检测数量和合格率
    getWeeklyData: (params = {}) => http.get('/weekly_data', params),
    // 获取所有车间过去一月的检测数量和合格率
    getMonthlyData: (params = {}) => http.get('/monthly_data', params),
    // 获取单独分类今日数据统计接口
    getTodayDefectStats: (params = {}) => http.post('/today_defect_stats', params),
    // 获取单独分类过去一天数据统计接口
    getYesterdayDefectStats: (params = {}) => http.post('/yesterday_defect_stats', params),
    // 获取单独分类一周数据统计接口
    getWeeklyDefectStats: (params = {}) => http.post('/weekly_defect_stats', params),
    // 获取单独分类一月数据统计接口
    getMonthlyDefectStats: (params = {}) => http.post('/monthly_defect_stats', params),
    // 获取特定日期数据统计接口
    getSpecificDateDefectStats: (params = {}) => http.post('/specific_date_defect_stats', params),
  },
}

// 将 API 挂载到全局
const httpApi = () => {
  uni.$api = api
}

export { httpApi }
