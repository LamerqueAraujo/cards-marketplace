<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <q-page>

    <div class="page-header">
      <div class="header-content">
        <div class="page-actions">
          <slot name="actions" />
        </div>
      </div>
    </div>


    <div class="page-container">
      <slot />
    </div>

  </q-page>
</template>

<style scoped>
.page-header {
  width: 100%;
  padding: 0px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-content {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-container {
  padding: 10px 30px;
  margin: 0 auto;
}
</style>
