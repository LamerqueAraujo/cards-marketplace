<script setup lang="ts">
defineProps<{
  clickable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div class="surface-card" :class="[
    `surface-padding-${padding || 'md'}`,
    { 'surface-clickable': clickable }
  ]">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.surface-card {
  position: relative;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
  transition: all 0.2s ease;
}

.surface-padding-none {
  padding: 0;
}

.surface-padding-sm {
  padding: 12px;
}

.surface-padding-md {
  padding: 20px;
}

.surface-padding-lg {
  padding: 28px;
}

.surface-clickable {
  cursor: pointer;
}

.surface-clickable:hover {
  border-color: rgba(75, 0, 130, 0.35);
  background: rgba(75, 0, 130, 0.06);
  transform: translateY(-1px);
}
</style>
