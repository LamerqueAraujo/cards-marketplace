<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="error-state">

    <q-icon name="error_outline" size="48px" class="error-icon" />

    <div class="error-title">
      {{ title || 'Ocorreu um erro ao carregar os dados' }}
    </div>

    <div v-if="description" class="error-description">
      {{ description }}
    </div>

    <div class="error-actions">
      <slot />
    </div>

  </div>
</template>

<style scoped lang="scss">
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;

  background: rgba(255, 69, 0, 0.05);
  border-radius: 14px;
  border: 1px solid rgba(255, 69, 0, 0.2);
}

.error-icon {
  margin-bottom: 16px;
  color: rgba(255, 69, 0, 0.8);
}

.error-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.error-description {
  margin-top: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
}

.error-actions {
  margin-top: 16px;
}
</style>
