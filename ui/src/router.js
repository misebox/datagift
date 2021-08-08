import * as VueRouter from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue';
import UserHome from '@/components/UserHome.vue';
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: UserHome,
    meta: { requiresAuth: true }
  },
  {
    path: '/hello',
    name: 'hello',
    component: HelloWorld,
  },
];
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to);
  if (to.query.clear) {
    return
  }
  if (to.query.code && to.query.state) {
    const {code, state} = to.query;
    store.dispatch('auth/authorizeCode', {code})
    next({query: null})
    return
  } else {
    store.dispatch('auth/tryGetTokens');
    next()
  }
});
router.afterEach((to, from) => {
});
export default router;
