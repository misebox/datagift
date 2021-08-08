import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import awsconfig from '@/aws-exports';
import store from '@/store'
console.log(import.meta.env.MODE)


createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
