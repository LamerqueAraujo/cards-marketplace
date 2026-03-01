<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title: string
  description?: string
}>(), {
  icon: 'inbox'
})
</script>

<template>
  <div class="ds-state ds-state--empty" role="status" aria-live="polite">
    <q-icon :name="icon" class="ds-state__icon" />
    <div class="ds-state__title">{{ title }}</div>

    <div v-if="description" class="ds-state__desc">
      {{ description }}
    </div>

    <div v-if="$slots.actions" class="ds-state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ds-state {
  width: 100%;
  max-width: var(--feedback-max-width);
  margin: 0 auto;
  padding: var(--space-6);
  text-align: center;

  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  background: var(--surface-2);
  backdrop-filter: blur(10px);

  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

/* Empty variant */
.ds-state--empty {
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.25),
    0 0 18px var(--glow-soft);
}

.ds-state__icon {
  font-size: 44px;
  margin-bottom: var(--space-3);
  filter: drop-shadow(0 0 16px var(--glow-soft));
  opacity: 0.9;
}

.ds-state__title {
  font-size: var(--text-subtitle);
  font-weight: 700;
  color: #fff;
}

.ds-state__desc {
  margin-top: var(--space-2);
  font-size: var(--text-body);
  color: var(--text-muted);
}

.ds-state__actions {
  margin-top: var(--space-5);
  display: flex;
  justify-content: center;
  gap: var(--space-3);
}
</style>
