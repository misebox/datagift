<template>
  <div class="container">
    <HeaderMenu />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount } from 'vue';
import store from '@/store';
import HeaderMenu from '@/components/HeaderMenu.vue';

const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
function clickLogin() {
  store.dispatch('auth/jumpToAuthorize');
}
function clickLogout() {
  store.dispatch('auth/logout');
}
// check if tokens are about to expire every 3 minutes
function checkTokenExpiration() {
  const expiresAt = store.getters['auth/expiresAt'];
  if (expiresAt) {
    const criteria = new Date(new Date().getTime() + 5 * 60 * 1000);
    if (expiresAt < criteria) {
      // expires in 3 mins
      store.dispatch('auth/refreshToken');
    } else {
      console.log(
        `Token expires in ${Math.floor(
          (expiresAt - criteria) / (60 * 1000)
        )} minutes`
      );
    }
  }
}
let timer = setInterval(checkTokenExpiration, 3 * 60 * 1000);

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style lang="scss">
nav li:hover,
nav li.router-link-active,
nav li.router-link-exact-active {
  background-color: indianred;
  cursor: pointer;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  button {
    margin: 1rem;
  }
  a {
    margin: 1rem;
  }
}

img.favicon {
  width: 100px;
  height: 100px;
  padding: 0 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// hide scrollbar
html::-webkit-scrollbar {
  display: none;
}
html {
  scrollbar-width: none;
}
</style>
