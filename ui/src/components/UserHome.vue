<template>
  <div>
    <h1>User Home</h1>

    <p>
    </p>
    <div v-show="!isLoggedIn">
      <button type="button" @click="clickLogin">Login</button>
    </div>
    <div v-show="isLoggedIn">
      <button type="button" @click="clickRefresh">Refresh</button>
      <button type="button" @click="clickLogout">Logout</button>
      <p>
        <button type="button" @click="clickList">LIST</button>
      </p>
      <p>
        <button type="button" @click="clickGetBucket">GET</button>
      </p>
    </div>
  </div>

</template>

<script setup>
import {
  reactive,
  onMounted,
  computed,
  ref,
} from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore();

defineProps({
  msg: String
})

const state = reactive({
  count: 0,
})
const isLoggedIn = computed(() => (store.getters['auth/isLoggedIn']))
const items = computed(() => store.getters['gift/getItems'])

function clickLogin() {
  store.dispatch('auth/jumpToAuthorize')
}
function clickRefresh() {
  store.dispatch('auth/refreshToken')
}
function clickLogout() {
  store.dispatch('auth/logout')
}
function clickList() {
  store.dispatch('gift/getItems')
}
function clickGetBucket() {
  store.dispatch('gift/get')
}
const currentRoute = useRoute();
onMounted(()=>{
  const {name, meta, fullPath, params, query} = currentRoute;
})
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
