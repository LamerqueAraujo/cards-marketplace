<script setup lang="ts">
</script>

<template>
  <div class="auth-card">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.auth-card {
  width: 100%;
  padding: 40px 32px;
  border-radius: 20px;

  background: rgba(26, 26, 46, 0.85);
  backdrop-filter: blur(12px);

  border: 1px solid rgba(75, 0, 130, 0.25);

  box-shadow:
    0 0 60px rgba(75, 0, 130, 0.15),
    0 30px 60px rgba(0, 0, 0, 0.5);

  transition: transform .2s ease, box-shadow .2s ease;
}

.auth-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 80px rgba(75, 0, 130, 0.25),
    0 40px 70px rgba(0, 0, 0, 0.6);
}

/* Mobile */
@media (max-width: 600px) {
  .auth-card {
    padding: 32px 24px;
    border-radius: 16px;
  }
}
</style>
