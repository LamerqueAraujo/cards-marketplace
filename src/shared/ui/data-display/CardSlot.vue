<script setup lang="ts">
const props = withDefaults(defineProps<{
  interactive?: boolean
  label?: string
}>(), {
  interactive: false,
  label: 'Adicionar carta'
})

const emit = defineEmits<{
  (e: 'click', ev: Event): void
}>()

function onClick(e: MouseEvent) {
  if (!props.interactive) return
  emit('click', e)
}

function onKeydown(e: KeyboardEvent) {
  if (!props.interactive) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('click', e)
  }
}
</script>

<template>
  <div class="app-cardSlot" :class="{ 'app-cardSlot--interactive': interactive }"
    :role="interactive ? 'button' : undefined" :tabindex="interactive ? 0 : -1"
    :aria-label="interactive ? label : undefined" @click="onClick" @keydown="onKeydown">
    <div class="app-cardSlot__content">
      <div class="app-cardSlot__icon" aria-hidden="true">+</div>
      <span class="app-cardSlot__text">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-cardSlot {
  position: relative;
  width: 100%;
  aspect-ratio: 421 / 614;

  display: grid;
  place-items: center;

  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.14);

  box-shadow: var(--shadow-card-base, 0 12px 30px rgba(0, 0, 0, 0.28));

  transition:
    transform 220ms var(--ease-smooth),
    box-shadow 220ms var(--ease-smooth),
    border-color 220ms var(--ease-smooth),
    background-color 220ms var(--ease-smooth),
    filter 220ms var(--ease-smooth);
}

.app-cardSlot__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;

  opacity: 0.7;
  transition: opacity 180ms var(--ease-smooth);
}

.app-cardSlot__icon {
  width: 52px;
  height: 52px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.22);

  font-size: 28px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.92);

  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.45),
    0 0 18px rgba(139, 92, 246, 0.10);
}

.app-cardSlot__text {
  font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.app-cardSlot--interactive {
  cursor: pointer;
}

.app-cardSlot--interactive:hover {
  transform: translateY(-2px) scale(1.04);
  border-color: rgba(139, 92, 246, 0.45);
  background: rgba(139, 92, 246, 0.06);

  box-shadow:
    0 0 0 2px rgba(139, 92, 246, 0.35),
    0 30px 55px rgba(0, 0, 0, 0.75),
    0 0 22px rgba(139, 92, 246, 0.14);

  filter: brightness(1.05);
}

.app-cardSlot--interactive:hover .app-cardSlot__content {
  opacity: 1;
}

.app-cardSlot--interactive:active {
  transform: translateY(-6px) scale(1.03);
}

.app-cardSlot--interactive:focus-visible {
  outline: none;
  box-shadow:
    var(--shadow-card-base, 0 12px 30px rgba(0, 0, 0, 0.28)),
    0 0 0 2px var(--focus-ring, rgba(139, 92, 246, 0.35)),
    0 0 22px var(--glow-primary, rgba(139, 92, 246, 0.18));
}

@media (prefers-reduced-motion: reduce) {
  .app-cardSlot {
    transition: none;
  }

  .app-cardSlot--interactive:hover,
  .app-cardSlot--interactive:active {
    transform: none;
    filter: none;
  }
}
</style>
