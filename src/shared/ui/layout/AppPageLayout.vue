<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  maxWidth?: 'md' | 'lg' | 'xl'
  hideHeader?: boolean
}>(), {
  maxWidth: 'xl',
  hideHeader: false
})
</script>

<template>
  <q-page class="app-page-layout">

    <!-- HEADER -->
    <div v-if="!hideHeader" class="page-header">
      <div class="page-header__content" :class="`page-max-${maxWidth}`">

        <div class="page-header__titles">
          <slot name="title">
            <h1 class="page-title text-display">
              {{ title }}
            </h1>
          </slot>

          <slot name="subtitle">
            <p v-if="subtitle" class="page-subtitle">
              {{ subtitle }}
            </p>
          </slot>
        </div>

        <div v-if="$slots.actions" class="page-actions">
          <slot name="actions" />
        </div>

      </div>
    </div>

    <!-- CONTENT -->
    <div class="page-container" :class="`page-max-${maxWidth}`">
      <slot />
    </div>

  </q-page>
</template>

<style scoped lang="scss">
.app-page-layout {
  display: flex;
  flex-direction: column;
}

/* max widths */
.page-max-md {
  max-width: 900px;
}

.page-max-lg {
  max-width: 1280px;
}

.page-max-xl {
  max-width: 1440px;
}

/* HEADER */
.page-header {
  width: 100%;
  border-bottom: 1px solid var(--surface-border);

  /* subtle glass to feel premium */
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);

  padding: var(--space-5) var(--space-6);
}

.page-header__content {
  width: 100%;
  margin: 0 auto;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-6);
}

.page-header__titles {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.page-title {
  font-size: var(--text-hero);
  font-weight: 800;
  margin: 0;
}

.page-subtitle {
  margin-top: var(--space-2);
  font-size: var(--text-subtitle);
  color: var(--text-muted);
}

/* ACTIONS */
.page-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  flex-wrap: wrap;
}

/* CONTENT */
.page-container {
  width: 100%;
  margin: 0 auto;
  padding: var(--space-6);
}

/* responsive */
@media (max-width: 700px) {
  .page-header__content {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-4);
  }

  .page-actions {
    justify-content: flex-start;
  }

  .page-title {
    font-size: 32px;
  }
}
</style>
