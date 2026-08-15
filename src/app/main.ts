import { createApp } from 'vue'
import App from './App.vue'
import { setupAppProviders } from './providers'

const app = createApp(App)

setupAppProviders(app)
app.mount('#app')
