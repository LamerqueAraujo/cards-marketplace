<script setup lang="ts">
withDefaults(defineProps<{
  spaced?: boolean
}>(), {
  spaced: true
})
</script>

<template>
  <div class="app-separator" :class="{ 'app-separator--spaced': spaced }" />
</template>

<style scoped lang="scss">
.app-separator {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.10);
}

.app-separator--spaced {
  margin: var(--space-4) 0;
}
</style>
