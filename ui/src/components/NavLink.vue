<template>
  <router-link :to="props.to" :class="[type, size]">
    <slot />
  </router-link>
</template>

<script setup="props, context">
// Styled Router-Link
import { defineProps } from 'vue';
const props = defineProps({
  to: { type: String, default: '' },
  type: { type: String, default: '' },
  size: { type: String, default: '' },
});
</script>

<style lang="scss" scoped>
a {
  color: #3330cf;
  display: inline-block;
  cursor: pointer;
  text-decoration: none;
  padding: 4px;
  border-radius: 10px;
  &:hover {
    background-color: #f0f0ff;
  }
  &.small {
    font-size: 0.8rem;
  }
  transition: background-color 0.1s ease;
}
</style>
