import * as VueRouter from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue';
import UserHome from '@/components/UserHome.vue';

const routes = [
  {
    path: '/',
    name: 'hello',
    component: HelloWorld,
  },
  {
    path: '/home',
    name: 'home',
    component: UserHome,
  },
];
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});
export default router;
