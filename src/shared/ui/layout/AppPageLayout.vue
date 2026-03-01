<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <q-page class="app-page-layout">

    <!-- HEADER -->
    <div class="page-header">
      <div class="page-header__content">

        <div class="page-header__titles">
          <h1 class="page-title text-display">
            {{ title }}
          </h1>

          <p v-if="subtitle" class="page-subtitle">
            {{ subtitle }}
          </p>
        </div>

        <div class="page-actions">
          <slot name="actions" />
        </div>

      </div>
    </div>

    <!-- CONTENT -->
    <div class="page-container">
      <slot />
    </div>

  </q-page>
</template>

<style scoped lang="scss">
.app-page-layout {
  display: flex;
  flex-direction: column;
}

/* HEADER */
.page-header {
  width: 100%;
  border-bottom: 1px solid var(--surface-border);
  padding: var(--space-5) var(--space-6);
}

.page-header__content {
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-6);
}

.page-header__titles {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: var(--text-hero);
  font-weight: 800;
  margin: 0;
}

.page-subtitle {
  margin-top: var(--space-2);
  font-size: var(--text-subtitle);
  color: rgba(255, 255, 255, 0.6);
}

/* ACTIONS */
.page-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

/* CONTENT */
.page-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  padding: var(--space-6);
}
</style>
