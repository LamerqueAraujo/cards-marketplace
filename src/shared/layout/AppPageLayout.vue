<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    maxWidth?: 'md' | 'lg' | 'xl'
    hideHeader?: boolean
  }>(),
  {
    maxWidth: 'xl',
    hideHeader: false,
  }
)
</script>

<template>
  <div class="app-page">
    <div v-if="!hideHeader" class="app-page__header">
      <div class="app-page__shell" :class="`app-page__shell--${maxWidth}`">
        <div class="app-page__headerRow">
          <div class="app-page__titles">
            <slot name="title">
              <h1 class="app-page__title text-display">{{ title }}</h1>
            </slot>

            <slot name="subtitle">
              <p v-if="subtitle" class="app-page__subtitle">{{ subtitle }}</p>
            </slot>
          </div>

          <div v-if="$slots.actions" class="app-page__actions">
            <slot name="actions" />
          </div>
        </div>
      </div>

      <div class="app-page__headerDivider" />
    </div>

    <div class="app-page__shell app-page__content" :class="`app-page__shell--${maxWidth}`">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
/* seu CSS permanece igual */
.app-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.app-page__shell {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.app-page__shell--md {
  max-width: 1000px;
}

.app-page__shell--lg {
  max-width: 1300px;
}

.app-page__shell--xl {
  max-width: 1570px;
}

.app-page__header {
  padding: var(--space-5) 0 var(--space-4);

  background:
    radial-gradient(circle at 10% 0%, rgba(139, 92, 246, 0.14), transparent 55%),
    linear-gradient(to bottom,
      rgba(15, 15, 26, 0.30),
      rgba(15, 15, 26, 0));
}

.app-page__headerRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-6);
}

.app-page__title {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--space-2);
  margin: 0;
  font-size: var(--text-hero);
  font-weight: 800;
}

.app-page__subtitle {
  font-size: var(--text-subtitle);
  color: var(--text-muted);
}

.app-page__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.app-page__headerDivider {
  height: 1px;
  width: 100%;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0.00),
      rgba(255, 255, 255, 0.06),
      rgba(255, 255, 255, 0.00));
}

.app-page__content {
  padding-top: var(--space-4);
  padding-bottom: var(--space-6);
}

@media (max-width: 1024px) {
  .app-page__actions {
    justify-content: center;
  }
}

@media (max-width: 785px) {
  .app-page__headerRow {
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
  }

  .app-page__titles {
    align-items: center;
    text-align: center;
  }

  .app-page__actions {
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: var(--space-3);
  }

  .app-page__actions>* {
    width: 100%;
    max-width: 360px;
  }

  .app-page__title {
    font-size: 32px;
  }
}

@media (max-width: 600px) {
  .app-page__shell {
    padding: 0 var(--space-4);
    padding-bottom: var(--space-3);
  }

  .app-page__header {
    padding: var(--space-4) 0 var(--space-3);
  }

  .app-page__content {
    padding-top: var(--space-5);
    padding-bottom: var(--space-6);
    flex: 1;
    min-height: 0;
  }

  .app-page__headerRow {
    align-items: center;
    text-align: center;
  }

  .app-page__titles {
    align-items: center;
  }

  .app-page__subtitle {
    max-width: 34ch;
    margin-left: auto;
    margin-right: auto;
  }

  .app-page__actions {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 420px) {

  .app-page__actions :deep(.q-btn),
  .app-page__actions :deep(.app-button) {
    flex-basis: 100%;
    min-width: 0;
  }
}
</style>
