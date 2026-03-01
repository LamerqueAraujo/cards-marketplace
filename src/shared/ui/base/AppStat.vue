<script setup lang="ts">
import SurfaceCard from '../base/SurfaceCard.vue'

withDefaults(defineProps<{
  value: string | number
  label: string
  highlight?: boolean
}>(), {
  highlight: false
})
</script>

<template>
  <SurfaceCard padding="sm" :variant="highlight ? 'elevated' : 'subtle'" class="app-stat">
    <div class="app-stat__value">
      {{ value }}
    </div>

    <div class="app-stat__label">
      {{ label }}
    </div>
  </SurfaceCard>
</template>

<style scoped lang="scss">
.app-stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.app-stat__value {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
}

.app-stat__label {
  font-size: var(--text-caption);
  color: var(--text-muted);
}

.app-stat.surface-variant-elevated {
  border-color: rgba(139, 92, 246, 0.45);
}
</style>
