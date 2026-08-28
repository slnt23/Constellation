import { createApp } from 'vue'
import App from './App.vue'
import { setupAppProviders } from './providers'
import { initializeUiTheme } from '@/shared/theme'

initializeUiTheme()
const app = createApp(App)

setupAppProviders(app)
app.mount('#app')
