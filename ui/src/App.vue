<template>
  <div>
    <img src="/favicon.ico">
    <router-view></router-view>
  </div>
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'
import {onBeforeUnmount} from 'vue'
import store from '@/store'

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
