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
      <span class="slot-text">Vazio</span>
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

  border: 2px dashed rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.02);

  transition: all .25s ease;
}

.card-slot.interactive {
  cursor: pointer;
}

.card-slot.interactive:hover {
  border-color: var(--primary);
  background: rgba(138, 43, 226, 0.06);
  transform: translateY(-4px);
}

.slot-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0.6;
  transition: opacity .2s ease;
}

.card-slot.interactive:hover .slot-content {
  opacity: 1;
}

.slot-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  color: white;
  box-shadow: 0 8px 18px rgba(0, 0, 0, .4);
}

.slot-text {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
