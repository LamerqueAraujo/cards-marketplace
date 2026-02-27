<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="page-context">

    <div class="page-context-content">

      <div class="page-context-text">
        <h1 class="page-title">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="page-subtitle">
          {{ subtitle }}
        </p>
      </div>

      <div class="page-context-actions">
        <slot />
      </div>

    </div>

  </div>
</template>

<style scoped lang="scss">
.page-context {
  margin: 20px 0 28px;
  padding: 20px 24px;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.page-context-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-context-text {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.4px;
}

.page-subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.page-context-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
