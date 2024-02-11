import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './store/index'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import "bootstrap/dist/css/bootstrap.css";

const pinia = createPinia()

createApp(App).use(router).use(pinia).provide('userStore', useUserStore()).mount('#app')