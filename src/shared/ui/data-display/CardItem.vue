<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { BaseCard } from 'src/shared/types/card.types'
import { getCardRarity } from 'src/shared/utils/rarity.utils'
import cardBack from 'src/assets/card-back.jpg'

const props = defineProps<{
  card: BaseCard
  index: number
  selected?: boolean
  selectable?: boolean
  static?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

const rarity = computed(() => getCardRarity(props.card.id))
const isClickable = computed(() => !props.static && !props.disabled)
const isTiltEnabled = computed(() => !props.static && !props.selectable && !props.disabled)

const tiltX = ref(0)
const tiltY = ref(0)
const revealed = ref(false)

function handleMouseMove(e: MouseEvent) {
  if (!isTiltEnabled.value) return

  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  tiltX.value = ((y - centerY) / centerY) * -8
  tiltY.value = ((x - centerX) / centerX) * 8
}

function resetTilt() {
  tiltX.value = 0
  tiltY.value = 0
}

function handleClick(ev: MouseEvent) {
  if (!isClickable.value) return
  emit('click', ev)
}

function handleKeydown(e: KeyboardEvent) {
  if (!isClickable.value) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('click', e as unknown as MouseEvent)
  }
}

onMounted(() => {
  if (props.static) {
    revealed.value = true
    return
  }

  setTimeout(() => {
    revealed.value = true
  }, props.index * 80 + 600)
})
</script>

<template>
  <div class="card-entry" :class="{ selected, static, disabled }" :style="{ animationDelay: `${index * 80}ms` }"
    @click="handleClick" @keydown="handleKeydown" :tabindex="isClickable ? 0 : -1"
    :role="isClickable ? 'button' : undefined" :aria-label="`Selecionar carta ${card.name}`"
    :aria-disabled="disabled ? 'true' : undefined">
    <div class="card-flip" :class="{ flipped: revealed }">
      <div class="card-face card-back" aria-hidden="true">
        <img :src="cardBack" alt="Verso da carta" />
      </div>

      <div class="card-face card-front">
        <div class="card-tilt" :class="[`rarity-${rarity}`, { selectable, disabled }]" @mousemove="handleMouseMove"
          @mouseleave="resetTilt" :style="(!static && !selectable && !disabled)
            ? { transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }
            : undefined">
          <img :src="card.imageUrl" :alt="card.name" width="421" height="614" loading="lazy" />

          <div v-if="selected" class="selection-overlay" aria-hidden="true"></div>

          <div v-if="disabled" class="disabled-overlay" aria-hidden="true">
            <div class="disabled-badge">Já na coleção</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-entry {
  position: relative;
  width: 100%;
  aspect-ratio: 421 / 614;
  perspective: 1200px;

  opacity: 0;
  animation: dealCard 220ms var(--ease-smooth) forwards;

  transition: transform 220ms var(--ease-smooth), filter 220ms var(--ease-smooth);
  will-change: transform, opacity;
}

@keyframes dealCard {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-face img {
  pointer-events: none;
}

.card-flip {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 520ms var(--ease-smooth);
}

.card-flip.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  transform: rotateY(0deg);
}

.card-front {
  transform: rotateY(180deg);
}

.card-tilt {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;

  transition:
    transform 140ms var(--ease-smooth),
    box-shadow 220ms var(--ease-smooth),
    filter 220ms var(--ease-smooth);

  outline: none;
  will-change: transform;

  cursor: default;
}

.card-entry:not(.static):not(.disabled) .card-tilt {
  cursor: pointer;
}

.card-tilt:focus-visible {
  box-shadow:
    var(--shadow-card-base),
    0 0 0 2px var(--focus-ring),
    0 0 22px var(--glow-primary);
}

.card-face img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.rarity-rare {
  box-shadow: var(--shadow-card-base), 0 0 20px var(--glow-rare);
}

.rarity-epic {
  box-shadow: var(--shadow-card-base), 0 0 24px var(--glow-epic);
}

.rarity-legendary {
  box-shadow: var(--shadow-card-base), 0 0 30px var(--glow-legendary);
}

.card-entry:not(.static):not(.disabled):not(.selected):hover {
  transform: translateY(-10px) scale(1.06);
  filter: brightness(1.08) saturate(1.05);
}

.card-entry:not(.static):not(.disabled):not(.selected):hover .card-tilt {
  box-shadow:
    0 0 0 2px rgba(139, 92, 246, 0.55),
    0 35px 65px rgba(0, 0, 0, 0.78),
    0 0 26px rgba(139, 92, 246, 0.18);
}

.card-entry.selected .card-tilt {
  animation: selectedPulse 1.4s var(--ease-smooth) infinite;
  transform: scale(1.06);
  box-shadow:
    0 0 0 3px rgba(139, 92, 246, 0.55),
    0 0 28px rgba(139, 92, 246, 0.22),
    0 30px 55px rgba(0, 0, 0, 0.78);
}

.selection-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;

  background: radial-gradient(circle at 50% 40%,
      rgba(139, 92, 246, 0.14),
      rgba(139, 92, 246, 0.00) 55%);

  animation: fadeIn 180ms var(--ease-smooth);
}

.selection-overlay::after {
  content: "✓";
  position: absolute;
  top: 10px;
  right: 10px;

  width: 28px;
  height: 28px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  font-weight: 900;
  font-size: 14px;

  color: rgba(255, 255, 255, 0.92);
  background: rgba(15, 15, 26, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.35),
    0 0 18px rgba(139, 92, 246, 0.18);
}

.card-entry.disabled {
  opacity: 0.92;
}

.card-entry.disabled:hover {
  transform: none !important;
  filter: none !important;
}

.card-entry.disabled .card-tilt {
  cursor: not-allowed;
  transform: none !important;
  filter: grayscale(0.15) brightness(0.95);
}

.disabled-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: grid;
  place-items: end center;
  padding: 12px;

  background: linear-gradient(to bottom,
      rgba(15, 15, 26, 0.10),
      rgba(15, 15, 26, 0.55));
}

.disabled-badge {
  width: 100%;
  text-align: center;
  padding: 10px 12px;
  border-radius: 14px;

  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  color: rgba(255, 255, 255, 0.92);
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes selectedPulse {

  0%,
  100% {
    filter: none;
  }

  50% {
    filter: brightness(1.06) saturate(1.06);
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-entry.selected .card-tilt {
    animation: none;
  }

  .card-entry {
    animation: none;
    opacity: 1;
  }

  .card-flip,
  .card-tilt {
    transition: none;
  }

  .card-entry:hover {
    transform: none;
    filter: none;
  }
}
</style>
