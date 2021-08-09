<template>
  <div>
    <div v-show="isLoggedIn">
      <p>
        <button type="button" @click="clickList">ITEM LIST</button>
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
import { useRoute, useRouter } from 'vue-router'
import rest from '@/http/rest'

const store = useStore();

defineProps({
  msg: String
})

const isLoggedIn = computed(() => (store.getters['auth/isLoggedIn']))

function clickList() {
  router.push('item_list')
}
function clickGetBucket() {
  rest.getUploadingUrl({aa: 100})
  .then(res => {
    console.log(res)
  })
}
const currentRoute = useRoute();
const router = useRouter();
onMounted(()=>{
  const {name, meta, fullPath, params, query} = currentRoute;
})
</script>

<style lang="scss" scoped>
</style>
