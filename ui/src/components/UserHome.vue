<template>
  <div>
    <h1>* WORKING IN PROGRESS *</h1>
    <div class="container" v-if="isLoggedIn && userInfo.sub">
      <div class="row">
        <div class="cell label">User ID</div>
        <div class="cell value">
          <small>{{ userInfo.sub }}</small>
        </div>
      </div>
      <div class="row">
        <div class="cell label">Username</div>
        <div class="cell value">{{ userInfo.username }}</div>
      </div>
      <div class="row">
        <div class="cell label">Download count</div>
        <div class="cell value">{{ userInfo.downloadCount }}</div>
      </div>
      <div class="row">
        <div class="cell label">Max item count</div>
        <div class="cell value">{{ userInfo.maxItemCount }}</div>
      </div>
      <div class="row">
        <div class="cell label">Max item size</div>
        <div class="cell value">{{ userInfo.maxItemSize }} bytes</div>
      </div>
      <div class="row">
        <div class="cell label">Plan</div>
        <div class="cell value">{{ userInfo.plan }}</div>
      </div>
      <div class="row">
        <div class="cell label">Since</div>
        <div class="cell value">{{ userInfo.since }}</div>
      </div>
    </div>
    <div v-else-if="loading">
      <img src="/oval.svg" />
    </div>
    <div v-else>guest</div>
  </div>
</template>

<script setup>
import { onMounted, computed, watch, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
let userInfo = computed(() => store.getters['auth/userInfo']);
let loading = ref(false);

watch(
  () => store.getters['auth/isLoggedIn'],
  (newVal, oldVal) => {
    if (!oldVal && newVal && !userInfo.value.sub) {
      loading.value = true;
      store.dispatch('auth/getUserInfo');
    }
  }
);
watch(loading, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    loading = false;
  }
});
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
