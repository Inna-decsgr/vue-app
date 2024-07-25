import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//import store from './store/store.js'
import axios from 'axios'

// Axios 기본 설정
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.withCredentials = true; // 쿠키와 같은 자격 증명 포함 설정


const app = createApp(App);
// Axios를 Vue의 전역 속성으로 설정
app.config.globalProperties.$http = axios;

// Vue 애플리케이션과 함께 router와 store 사용
app.use(router)
//app.use(store)
app.mount('#app');