<template>
  <div v-show="isLoggedIn">
    user info
    <a-button> test</a-button>
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
