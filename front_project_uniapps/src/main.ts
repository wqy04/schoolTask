import '@/style/index.scss'
import { VueQueryPlugin } from '@tanstack/vue-query'
import 'virtual:uno.css'
import { createSSRApp } from 'vue'

import App from './App.vue'
import { prototypeInterceptor, routeInterceptor, initRequest, httpApi } from './interceptors'
import store from './store'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(routeInterceptor)
  app.use(prototypeInterceptor)
  app.use(VueQueryPlugin)
  app.use(initRequest)
  app.use(httpApi)
  return {
    app,
  }
}
