<script setup lang="ts">
import SurfaceCard from 'src/shared/ui/base/SurfaceCard.vue'
</script>

<template>
  <SurfaceCard class="auth-card" padding="lg">
    <slot />
  </SurfaceCard>
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

.auth-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 90px rgba(139, 92, 246, 0.22),
    0 40px 72px rgba(0, 0, 0, 0.62);
}

@media (max-width: 600px) {
  .auth-card {
    width: min(420px, 92vw);
  }
}
</style>
