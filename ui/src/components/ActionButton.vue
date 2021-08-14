<template>
  <a @click.prevent.stop="click()" :class="[type, size]">
    <slot />
  </a>
</template>

<script setup>
import { defineProps, defineEmits, getCurrentInstance } from 'vue';

const props = defineProps({
  type: { type: String, default: '' },
  size: { type: String, default: '' },
});

defineEmits(['click']);
const { emit } = getCurrentInstance();
function click() {
  emit('click');
}
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
