import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Импортируем глобальные стили
import './assets/css/theme.css'

const app = createApp(App)
app.use(router)
app.mount('#app')