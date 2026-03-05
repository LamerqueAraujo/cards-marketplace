<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  closable?: boolean
}>(), {
  closable: false
})

const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <div class="app-sidebar-banner">
    <div class="app-sidebar-banner__left">
      <div class="app-sidebar-banner__mark" aria-hidden="true">
        <div class="app-sidebar-banner__dot" />
      </div>

      <div class="app-sidebar-banner__content">
        <div v-if="title" class="app-sidebar-banner__title">{{ title }}</div>
        <div v-if="subtitle" class="app-sidebar-banner__subtitle">{{ subtitle }}</div>
      </div>
    </div>

    <q-btn v-if="closable" flat round dense icon="close" class="app-sidebar-banner__close" aria-label="Fechar menu"
      @click="emit('close')" />
  </div>
</template>

<style scoped lang="scss">
.app-sidebar-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  top: 7px;
  padding: 12px 12px;

  /* “capsule glass” igual o resto */
  background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.045),
      rgba(255, 255, 255, 0.018));
  border: 1px solid rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px);

  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.35),
    0 0 22px rgba(139, 92, 246, 0.10);
}

.app-sidebar-banner::after {
  content: "";
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: -10px;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  opacity: 0.9;
}

.app-sidebar-banner__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.app-sidebar-banner__mark {
  width: 40px;
  height: 40px;
  border-radius: 16px;

  display: grid;
  place-items: center;

  background:
    radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.22), transparent 55%),
    rgba(139, 92, 246, 0.10);
  border: 1px solid rgba(139, 92, 246, 0.22);

  box-shadow:
    0 0 18px rgba(139, 92, 246, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.app-sidebar-banner__dot {
  width: 11px;
  height: 11px;
  border-radius: 999px;

  background: var(--gradient-primary);
  box-shadow: 0 0 14px rgba(139, 92, 246, 0.38);
}

.app-sidebar-banner__content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.12;
}

.app-sidebar-banner__title {
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.96);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-sidebar-banner__subtitle {
  margin-top: 3px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.60);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-sidebar-banner__close {
  width: 38px;
  height: 38px;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);

  transition: background 180ms ease, transform 180ms ease, border-color 180ms ease;
}

.app-sidebar-banner__close:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(139, 92, 246, 0.20);
  transform: translateY(-1px);
}
</style>
