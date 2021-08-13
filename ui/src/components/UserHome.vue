<template>
  <div v-show="isLoggedIn && userInfo.sub">
    <div class="container">
      <div class="row">
        <div class="cell label">User ID</div>
        <div class="cell value"><small>{{ userInfo.sub }}</small></div>
      </div>
      <div class="row">
        <div class="cell label"> Username </div>
        <div class="cell value">{{ userInfo.username }}</div>
      </div>
      <div class="row">
        <div class="cell label"> Download count </div>
        <div class="cell value">{{ userInfo.download_count }}</div>
      </div>
      <div class="row">
        <div class="cell label"> Max item count </div>
        <div class="cell value">{{ userInfo.max_item_count }}</div>
      </div>
      <div class="row">
        <div class="cell label"> Max item size </div>
        <div class="cell value">{{ userInfo.max_item_size }} bytes</div>
      </div>
      <div class="row">
        <div class="cell label"> Plan </div>
        <div class="cell value">{{ userInfo.plan }}</div>
      </div>
      <div class="row">
        <div class="cell label"> Since </div>
        <div class="cell value">{{ userInfo.since }}</div>
      </div>
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
import { useRoute, useRouter } from 'vue-router'
import rest from '@/http/rest'

const store = useStore();

const isLoggedIn = computed(() => (store.getters['auth/isLoggedIn']))
let userInfo = computed(() => store.getters['auth/userInfo']);

function clickGetBucket() {
  rest.getUploadingUrl({aa: 100})
  .then(res => {
    console.log(res)
  })
}
const currentRoute = useRoute();
const router = useRouter();
onMounted(()=>{
  if (isLoggedIn.value && !userInfo.value.sub) {
    store.dispatch('auth/getUserInfo')
  }
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  .row {
    display: table;

    .cell {
      display: table-cell;
      padding: 4px;
      vertical-align: middle;
      background-color: #f7f7f7;
      border: 4px solid white;
      font-size: 0.8rem;
      text-align: center;
      &.label {
        width: 120px;
      }
      &.value {
        width: 240px;
      }
    }
  }
}
</style>
