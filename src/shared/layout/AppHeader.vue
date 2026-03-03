<script setup lang="ts">
const emit = defineEmits<{ (e: 'toggle-menu'): void }>()
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <q-btn flat round icon="menu" class="app-header__icon" aria-label="Abrir menu" @click="emit('toggle-menu')" />

      <div class="app-header__brand" aria-label="Duel Market">
        <div class="app-header__title">Duel Market</div>
        <div class="app-header__subtitle">Trade. Build. Dominate.</div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  height: 62px;
  padding: 0 var(--space-6);

  display: flex;
  align-items: center;
  justify-content: space-between;

  background:
    linear-gradient(to bottom,
      rgba(15, 15, 26, 0.72),
      rgba(15, 15, 26, 0.52));
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(18px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25);
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.app-header__icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;

  transition: background 180ms var(--ease-smooth), transform 180ms var(--ease-smooth);
}

.app-header__icon:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}

.app-header__brand {
  display: flex;
  flex-direction: column;
  line-height: 1.08;
}

.app-header__title {
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #fff;
  font-size: 15px;
}

.app-header__subtitle {
  margin-top: 2px;
  font-size: var(--text-caption);
  color: rgba(255, 255, 255, 0.58);
}
</style>
