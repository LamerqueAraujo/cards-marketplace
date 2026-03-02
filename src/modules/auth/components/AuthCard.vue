<script setup lang="ts">
import AppCard from '../../../shared/ui/base/AppCard.vue'
</script>

<template>
  <AppCard class="auth-card" padding="lg" variant="elevated">
    <slot />
  </AppCard>
</template>

<style scoped lang="scss">
.auth-card {
  width: min(460px, 92vw);
  margin: 0 auto;

  box-shadow:
    0 0 70px rgba(139, 92, 246, 0.16),
    0 30px 60px rgba(0, 0, 0, 0.55);

  transition:
    transform 220ms var(--ease-smooth),
    box-shadow 220ms var(--ease-smooth);
}

.auth-card--focus {
  transform: translateY(-2px) scale(1.01);
  box-shadow:
    0 0 100px rgba(139, 92, 246, 0.28),
    0 44px 80px rgba(0, 0, 0, 0.70);
}

.auth-card--focus :deep(.brand-orb) {
  box-shadow: 0 0 34px rgba(139, 92, 246, 0.28);
  border-color: rgba(139, 92, 246, 0.38);
}
</style>
