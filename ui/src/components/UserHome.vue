<template>
  <h1>User Home</h1>

  <p>
  </p>

</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  msg: String
})

const state = reactive({ count: 0 })

const currentRoute = useRoute();
onMounted(()=>{
  const {name, meta, fullPath, params, query} = currentRoute;
  console.log('(currentRoute)', name, fullPath, meta, params, query)
})
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
