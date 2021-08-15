import { createWebHistory, createRouter } from 'vue-router';
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
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  console.log(to.fullPath, to.query);
  const isLoggedIn = store.getters['auth/isLoggedIn'];
  if (to.query.code && to.query.state) {
    if (!isLoggedIn) {
      const { code } = to.query;
      store.dispatch('auth/authorizeCode', { code })
    }
    return { query: null, replace: true }
  } else if (to.meta.requiresAuth && !isLoggedIn) {
    store.dispatch('auth/tryGetTokens')
  } else if (to.path === '/' && !isLoggedIn) {
    store.dispatch('auth/tryGetTokens')
  }
});
router.afterEach((to, from) => {
});
export default router;
