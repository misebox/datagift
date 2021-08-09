import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import awsconfig from '@/aws-exports';
import store from '@/store'
console.log(import.meta.env.MODE)
import ActionButton from '@/components/ActionButton.vue'
import NavLink from '@/components/NavLink.vue'


createApp(App)
  .use(router)
  .use(store)
  .component('a-button', ActionButton)
  .component('nav-link', NavLink)
  .mount('#app')
