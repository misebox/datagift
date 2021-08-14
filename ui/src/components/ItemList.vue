<template>
  <div>
    <div v-show="store.getters['gift/isLoading']">
      <img src="/oval.svg" />
    </div>
    <div v-show="!store.getters['gift/isLoading']">
      {{ items.length }} files
      <div v-show="pager.totalPages > 1">
        {{ pager.currentPage + 1 }} / {{ pager.totalPages }}
        <a-button type="button" @click="clickPaging(-1)">Prev Page</a-button>
        <a-button type="button" @click="clickPaging(+1)">Next Page</a-button>
      </div>
      <transition-group name="slide" mode="out-in" class="container" tag="div">
        <div v-for="(item, i) in pager.pageItems" :key="item.etag" class="row">
          <div :key="item.etag" class="cell no">
            {{ ('00' + (pager.currentPage * 10 + i + 1)).slice(-2) }}
          </div>
          <div :key="item.etag" class="cell filename">{{ item.filename }}</div>
          <div :key="item.etag" class="cell size">
            {{ item.size }} <small>bytes</small>
          </div>
          <div :key="item.etag" class="cell last-modified">
            {{ item.lastModified }}
          </div>
          <div :key="item.etag" class="cell">
            <a-button @click="clickDownload(item)">DOWNLOAD</a-button>
          </div>
          <div :key="item.etag" class="cell" v-if="item.progress === 'stored'">
            <transition name="fade" mode="out-in" tag="div">
              <a-button
                v-if="delIndex !== i"
                :key="item.etag + (delIndex === i)"
                @click="delIndex = i"
                >DELETE</a-button
              >
              <div v-else :key="item.etag + (delIndex === i)">
                <a-button @click="clickDelete(item)"
                  ><small>OK</small></a-button
                >
                <a-button @click="delIndex = null"
                  ><small>CANCEL</small></a-button
                >
              </div>
            </transition>
          </div>
          <div :key="item.etag" class="cell" v-else>
            <img src="/oval.svg" width="32" height="32" />
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import rest from '@/http/rest';

const store = useStore();
const router = useRouter();

const items = computed(() => store.getters['gift/items']);
const delIndex = ref(null);
const pager = reactive({
  clear: false,
  currentPage: 0,
  totalPages: computed(() => Math.ceil((items.value.length || 0) / 10)),
  pageItems: computed(() =>
    pager.clear
      ? []
      : items.value.slice(pager.currentPage * 10, (pager.currentPage + 1) * 10)
  ),
});
function clickPaging(step) {
  const nextPage = pager.currentPage + step;
  if (nextPage >= 0 && nextPage < pager.totalPages) {
    pager.currentPage = nextPage;
    pager.clear = true;
    setTimeout(() => {
      pager.clear = false;
    }, 300);
  }
}

defineProps({
  msg: String,
});

function clickList() {
  store.dispatch('gift/listItems');
}
function clickDownload(item) {
  store.dispatch('gift/downloadItem', item);
}
function clickDelete(item) {
  store.dispatch('gift/deleteItem', item);
  delIndex.value = null;
}

const currentRoute = useRoute();
onMounted(() => {
  const { name, meta, fullPath, params, query } = currentRoute;
  if (store.getters['gift/isCacheExpired']) {
    console.log('cache has expired');
    store.dispatch('gift/listItems');
  } else {
    console.log('cache exists');
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
    margin: 2px 0;

    .cell {
      vertical-align: middle;
      display: table-cell;
      padding: 4px;
      text-align: center;
      background-color: #f7f7f7;
      border: 4px solid white;
      border-radius: 8px;
      &.filename {
        width: 320px;
        padding: 0 16px;
        text-align: left;
      }
      &.etag {
        width: 200px;
        font-size: 0.7rem;
      }
      &.size {
        width: 160px;
        font-size: 0.9rem;
        text-align: right;
      }
      &.last-modified {
        width: 180px;
        font-size: 0.8rem;
      }
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
</style>
