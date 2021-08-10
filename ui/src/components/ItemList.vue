<template>
  <div>
    <div v-show="store.getters['gift/isLoading']">
        <div class="loader">
          LOADING...
          <div class="inner one"></div>
          <div class="inner two"></div>
          <div class="inner three"></div>
        </div>
    </div>
    <div v-show="!store.getters['gift/isLoading']">
      {{ items.length }} files
      {{ pager.currentPage + 1 }} / {{ pager.totalPages }}
      <a-button type="button" @click="clickPaging(-1)">Prev Page</a-button>
      <a-button type="button" @click="clickPaging(+1)">Next Page</a-button>
      <transition-group name="fade" mode="out-in" class="container" tag="div">
        <div v-for="item, i in pager.pageItems" :key="item.etag" class="row">
          <div :key="item.etag" class="cell no"> {{ ('00' + (pager.currentPage * 10 + i+1)).slice(-2) }} </div>
          <div :key="item.etag" class="cell filename"> {{item.filename}} </div>
          <div :key="item.etag" class="cell size"> {{item.size}} <small>bytes</small></div>
          <div :key="item.etag" class="cell last-modified"> {{item.lastModified }} </div>
        </div>
      </transition-group>
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
import { useRouter, useRoute } from 'vue-router'
import rest from '@/http/rest'

const store = useStore();
const router = useRouter();

const items = computed(() => (store.getters['gift/items']))
const pager = reactive({
  clear: false,
  currentPage: 0,
  totalPages: computed(() => Math.ceil((items.value.length || 0) / 10)),
  pageItems: computed(() => (
    pager.clear
    ? []
    : items.value.slice(pager.currentPage * 10, (pager.currentPage + 1) * 10))
  ),
});
function clickPaging(step) {
  const nextPage = pager.currentPage + step;
  if (nextPage >= 0 && nextPage < pager.totalPages) {
    pager.currentPage = nextPage;
    pager.clear = true;
    setTimeout(() => {
      pager.clear = false;
    }, 300)
  }
}

defineProps({
  msg: String
})

function clickList() {
  store.dispatch('gift/listItems')
}
function clickGetBucket() {
  rest.getUploadingUrl({aa: 100})
  .then(res => {
    console.log(res)
  })
}

const currentRoute = useRoute();
onMounted(()=>{
  const {name, meta, fullPath, params, query} = currentRoute;
  if (store.getters['gift/isCacheExpired']) {
    console.log('cache has expired')
    store.dispatch('gift/listItems')
  } else {
    console.log('cache exists')
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
    margin: 10px 0;

    .cell {
      display: table-cell;
      padding: 4px;
      text-align: center;
      background-color: #f7f7f7;
      border: 4px solid white;
      &.filename {
        width: 200px;
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.loader {
  position: absolute;
  left: calc(50% - 32px);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  perspective: 800px;
}

.inner {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;  
}

.inner.one {
  left: 0%;
  top: 0%;
  animation: rotate-one 1s linear infinite;
  border-bottom: 3px solid #0b0be6;
}

.inner.two {
  right: 0%;
  top: 0%;
  animation: rotate-two 1s linear infinite;
  border-right: 3px solid #0b0be6;
}

.inner.three {
  right: 0%;
  bottom: 0%;
  animation: rotate-three 1s linear infinite;
  border-top: 3px solid #0b0be6;
}

@keyframes rotate-one {
    0% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(  0deg); }
  100% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); }
}

@keyframes rotate-two {
    0% { transform: rotateX(50deg) rotateY(10deg) rotateZ(  0deg); }
  100% { transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg); }
}

@keyframes rotate-three {
    0% { transform: rotateX(35deg) rotateY(55deg) rotateZ(  0deg); }
  100% { transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg); }
}

</style>
