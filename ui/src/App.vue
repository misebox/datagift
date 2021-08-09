<template>
  <div>
    <img src="/favicon.ico">
    <div v-show="!isLoggedIn">
      <button type="button" @click="clickLogin">Login</button>
    </div>
    <div v-show="isLoggedIn">
      <button type="button" @click="clickRefresh">Refresh</button>
      <button type="button" @click="clickLogout">Logout</button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount} from 'vue'
import store from '@/store'

const isLoggedIn = computed(() => (store.getters['auth/isLoggedIn']))
function clickLogin() {
  store.dispatch('auth/jumpToAuthorize')
}
function clickRefresh() {
  store.dispatch('auth/refreshToken')
}
function clickLogout() {
  store.dispatch('auth/logout')
}
// check if tokens are about to expire every 3 minutes
function checkTokenExpiration() {
  const expiresAt = store.getters['auth/expiresAt'];
  if (expiresAt) {
    const criteria = new Date((new Date()).getTime() + 5 * 60 * 1000);
    if (expiresAt < criteria) {
      // expires in 3 mins
      store.dispatch('auth/refreshToken')
    } else {
      console.log(`Token expires in ${Math.floor((expiresAt - criteria) / (60 * 1000))} minutes`) 
    }
  }
}
let timer = setInterval(checkTokenExpiration, 3 * 60 * 1000)

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
