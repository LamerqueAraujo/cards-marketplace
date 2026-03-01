<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'grid' | 'page'
  title?: string
}>(), {
  type: 'page',
  title: 'Carregando...'
})
</script>

<template>
  <div class="ds-loading" :class="`ds-loading--${type}`" role="status" aria-live="polite" aria-busy="true">
    <q-spinner size="42px" class="ds-loading__spinner" />
    <div class="ds-loading__title">{{ title }}</div>

    <div v-if="type === 'grid'" class="ds-loading__grid">
      <div v-for="i in 12" :key="i" class="ds-loading__skeleton" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ds-loading {
  width: 100%;
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.ds-loading__spinner {
  filter: drop-shadow(0 0 18px var(--glow-primary));
  opacity: 0.95;
}

.ds-loading__title {
  font-size: var(--text-body);
  color: var(--text-muted);
}

.ds-loading__grid {
  width: 100%;
  margin-top: var(--space-4);

  display: grid;
  gap: var(--grid-gap);
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-card-min), 1fr));
}

.ds-loading__skeleton {
  aspect-ratio: 421 / 614;
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
  background: rgba(255, 255, 255, 0.045);
  overflow: hidden;
  position: relative;
}

/* Subtle shimmer (premium, not noisy) */
.ds-loading__skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-60%);
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.06),
      transparent);
  animation: shimmer 1.25s var(--ease-smooth) infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-60%);
  }

  100% {
    transform: translateX(60%);
  }
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  .ds-loading__skeleton::after {
    animation: none;
    display: none;
  }
}
</style>
