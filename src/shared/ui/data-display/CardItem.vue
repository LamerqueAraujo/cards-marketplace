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
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const rarity = computed(() => getCardRarity(props.card.id))
const isInteractive = computed(() => !props.selectable && !props.static)

const tiltX = ref(0)
const tiltY = ref(0)
const revealed = ref(false)

function handleMouseMove(e: MouseEvent) {
  if (!isInteractive.value) return

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

function handleClick() {
  emit('click')
}

function handleKeydown(e: KeyboardEvent) {
  if (!isInteractive.value) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('click')
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
  <div class="card-entry" :class="{ selected, static }" :style="{ animationDelay: `${index * 80}ms` }">
    <div class="card-flip" :class="{ flipped: revealed }">

      <div class="card-face card-back">
        <img :src="cardBack" alt="Card back" />
      </div>

      <div class="card-face card-front">
        <div class="card-tilt" :class="[`rarity-${rarity}`, { selectable }]" @mousemove="handleMouseMove"
          @mouseleave="resetTilt" @click="handleClick" @keydown="handleKeydown" :tabindex="isInteractive ? 0 : -1"
          :role="isInteractive ? 'button' : undefined" :aria-label="`Ver carta ${card.name}`" :style="isInteractive
            ? { transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }
            : undefined">
          <img :src="card.imageUrl" :alt="card.name" width="421" height="614" loading="lazy" />

          <div v-if="selected" class="selection-overlay">
            ✓
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

.card-entry:not(.static):not(.selected):hover {
  transform: translateY(-6px) scale(1.045);
  filter: brightness(1.06);
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
}

.card-tilt:focus-visible {
  box-shadow:
    0 0 0 2px var(--focus-ring),
    var(--shadow-card-base),
    0 0 22px var(--glow-primary);
}

.card-face img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.rarity-rare {
  box-shadow:
    var(--shadow-card-base),
    0 0 20px var(--glow-rare);
}

.rarity-epic {
  box-shadow:
    var(--shadow-card-base),
    0 0 24px var(--glow-epic);
}

.rarity-legendary {
  box-shadow:
    var(--shadow-card-base),
    0 0 30px var(--glow-legendary);
}

.card-entry:not(.static):not(.selected):hover .card-tilt {
  box-shadow:
    0 0 0 2px rgba(139, 92, 246, 0.40),
    0 30px 50px rgba(0, 0, 0, .80);
}

.card-entry.selected .card-tilt {
  transform: scale(1.06);
  box-shadow:
    0 0 0 3px var(--focus-ring),
    0 0 25px rgba(139, 92, 246, .55),
    0 30px 50px rgba(0, 0, 0, .80);
}

.selection-overlay {
  position: absolute;
  inset: 0;

  background: linear-gradient(to bottom,
      rgba(139, 92, 246, .14),
      rgba(139, 92, 246, .26));

  display: flex;
  align-items: center;
  justify-content: center;

  animation: fadeIn 180ms var(--ease-smooth);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-entry {
    animation: none;
    opacity: 1;
  }

  .card-flip {
    transition: none;
  }

  .card-tilt {
    transition: none;
  }

  .card-entry:hover {
    transform: none;
    filter: none;
  }
}
</style>
