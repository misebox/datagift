<template>
  <div>
    <h1>User Home</h1>

    <p>
      <button type="button" @click="clickBack">BACK</button>
    </p>
    {{ items.length }}
    <div class="container">
      <div v-for="item in items" :key="item.etag" class="row">
        <div class="cell filename"> {{item.filename}} </div>
        <div class="cell etag"> {{item.etag }} </div>
        <div class="cell size"> {{item.size}} <small>bytes</small></div>
        <div class="cell last-modified"> {{item.lastModified }} </div>
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
import { useRouter, useRoute } from 'vue-router'
import rest from '@/http/rest'

const store = useStore();
const router = useRouter();

defineProps({
  msg: String
})

const items = computed(() => {return store.getters['gift/items']})


function clickBack() {
  router.push('/')
}
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
a {
  color: #42b983;
}
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
      background-color: #eee;
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
</style>
