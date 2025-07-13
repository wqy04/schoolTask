import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'uniapp',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f03',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#a5e8d0',
    backgroundColor: '#fff',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: 'static/tabbar/index.png',
        selectedIconPath: 'static/tabbar/indexHL.png',
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        iconPath: 'static/tabbar/data.png',
        selectedIconPath: 'static/tabbar/dataHL.png',
        pagePath: 'pages/data/data',
        text: '数据',
      },
      {
        iconPath: 'static/tabbar/personal.png',
        selectedIconPath: 'static/tabbar/personalHL.png',
        pagePath: 'pages/personal/personal',
        text: '个人中心',
      },
    ],
  },
})
