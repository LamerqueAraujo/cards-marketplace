<script setup lang="ts">
defineProps<{
  value: string | number
  label: string
  highlight?: boolean
}>()
</script>

<template>
  <div class="stat-card" :class="{ 'stat-highlight': highlight }">

    <div class="stat-value">
      {{ value }}
    </div>

    <div class="stat-label">
      {{ label }}
    </div>

  </div>
</template>

<style scoped lang="scss">
.stat-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 18px 20px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
}

.stat-label {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.stat-highlight {
  border-color: rgba(75, 0, 130, 0.4);
  background: rgba(75, 0, 130, 0.08);
}
</style>
