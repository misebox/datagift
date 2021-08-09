import * as VueRouter from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue';
import UserHome from '@/components/UserHome.vue';
import ItemList from '@/components/ItemList.vue';
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
  {
    path: '/item_list',
    name: 'item_list',
    component: ItemList,
  },
];
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to);
  if (to.query.code && to.query.state) {
    const {code, state} = to.query;
    store.dispatch('auth/authorizeCode', {code})
    next({query: null})
    return
  }
  if (!store.getters['auth/isLoggedIn']) {
    store.dispatch('auth/tryGetTokens')
  }

  next()
});
router.afterEach((to, from) => {
});
export default router;
