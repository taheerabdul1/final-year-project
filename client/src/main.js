import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useUserStore } from "./store/index";
import { watch } from "vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import "bootstrap/dist/css/bootstrap.css";

const pinia = createPinia();

// createApp(App).use(router).use(pinia).provide('userStore', useUserStore()).mount('#app')
createApp(App).use(router).use(pinia).mount("#app");

const userStore = useUserStore();

watch(
  userStore,
  (state) => {
    localStorage.setItem("user", JSON.stringify(state));
  },
  { deep: true }
);
