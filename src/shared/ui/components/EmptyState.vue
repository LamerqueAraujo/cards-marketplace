<script setup lang="ts">
defineProps<{
  title: string
  description?: string | undefined
  icon?: string | undefined
}>()
</script>

<template>
  <div class="empty-state">

    <q-icon :name="icon || 'inbox'" size="48px" class="empty-icon" />

    <div class="empty-title">
      {{ title }}
    </div>

    <div v-if="description" class="empty-description">
      {{ description }}
    </div>

    <div class="empty-actions">
      <slot />
    </div>

  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;

  background: rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.empty-icon {
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.4);
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.empty-description {
  margin-top: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-actions {
  margin-top: 16px;
}
</style>
