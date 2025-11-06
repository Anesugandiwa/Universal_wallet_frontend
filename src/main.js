import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import api from './services/api'

const app = createApp(App)
const pinia = createPinia()

// Make axios globally available
app.config.globalProperties.$api = api

// Or use provide/inject (recommended for Vue 3)
app.provide('api', api)

app.use(pinia)
app.use(router)
app.mount('#app')
