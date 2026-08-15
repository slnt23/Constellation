import type { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/shared/styles/index.scss'
import { createPinia } from 'pinia'
import router from '@/core/router/index.js'
import { setupEcharts } from './echarts'

export function setupAppProviders(app: App) {
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(ElementPlus)
  setupEcharts(app)
}
