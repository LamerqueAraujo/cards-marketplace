<script setup lang="ts">
defineProps<{
  clickable?: boolean
}>()
</script>

<template>
  <div class="app-card" :class="{ clickable }">
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  background: #1a1a2e;
  border: 1px solid #2e2e4d;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  transition: all .2s ease;
}

.app-card.clickable {
  cursor: pointer;
}

.app-card.clickable:hover {
  transform: translateY(-2px);
  border-color: #9370DB;
  box-shadow:
    0 0 12px rgba(147, 112, 219, 0.35),
    0 0 24px rgba(75, 0, 130, 0.35);
}
</style>
