<template>
  <h1>Hello World</h1>

  <p>
    ...
  </p>

  <button type="button" @click="state.count++">
    count is: {{ state.count }}
  </button>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  msg: String
})

const state = reactive({ count: 0 })
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
