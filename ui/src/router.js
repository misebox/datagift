import * as VueRouter from 'vue-router';
import UserHome from '@/components/UserHome.vue';
import ItemList from '@/components/ItemList.vue';
import FileUploadForm from '@/components/FileUploadForm.vue';
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: UserHome,
    meta: { requiresAuth: false, title: 'HOME' }
  },
  {
    path: '/item_list',
    name: 'item_list',
    component: ItemList,
    meta: { requiresAuth: true, title: 'ITEM LIST' }
  },
  {
    path: '/file_upload_form',
    name: 'file_upload_form',
    component: FileUploadForm,
    meta: { requiresAuth: true, title: 'UPLOAD' }
  }
];
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to);
  if (to.query.code && to.query.state) {
    const { code, state } = to.query;
    store.dispatch('auth/authorizeCode', { code })
    next({ query: null })
  }
  else if (to.meta.requiresAuth && !store.getters['auth/isLoggedIn']) {
    store.dispatch('auth/tryGetTokens')
    next('/')
  } else {
    next()
  }
});
router.afterEach((to, from) => {
});
export default router;
