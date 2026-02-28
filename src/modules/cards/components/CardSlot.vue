<script setup lang="ts">
defineProps<{
  interactive?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div class="card-slot" :class="{ interactive }" @click="$emit('click')">
    <div class="slot-content">
      <div class="slot-icon">+</div>
      <span class="slot-text">Adicionar carta</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-slot {
  position: relative;
  width: 100%;
  aspect-ratio: 421 / 614;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px dashed rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.02);

  transition:
    transform .25s ease,
    box-shadow .25s ease,
    border-color .25s ease,
    background .25s ease,
    filter .25s ease;

  box-shadow:
    0 10px 20px rgba(0, 0, 0, .4);

  will-change: transform;
}

.card-slot.interactive {
  cursor: pointer;
}

/* Hover consistente com CardItem */
.card-slot.interactive:hover {
  transform: translateY(-6px) scale(1.04);

  border-color: var(--primary);
  background: rgba(138, 43, 226, 0.06);

  box-shadow:
    0 0 0 2px rgba(138, 43, 226, .35),
    0 25px 45px rgba(0, 0, 0, .7);

  filter: brightness(1.05);
}

.slot-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;

  opacity: 0.6;
  transition: opacity .2s ease;
}

.card-slot.interactive:hover .slot-content {
  opacity: 1;
}

.slot-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;

  background: var(--gradient-primary);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 28px;
  font-weight: 600;
  color: white;

  box-shadow:
    0 10px 22px rgba(0, 0, 0, .5);
}

.slot-text {
  font-size: 13px;
  letter-spacing: .4px;
  color: var(--text-secondary);
}
</style>
