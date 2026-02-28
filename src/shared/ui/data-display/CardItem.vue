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

// Interativo apenas se NÃO for selectable e NÃO for static
const isInteractive = computed(() =>
  !props.selectable && !props.static
)

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

      <!-- BACK -->
      <div class="card-face card-back">
        <img :src="cardBack" alt="Card back" />
      </div>

      <!-- FRONT -->
      <div class="card-face card-front">
        <div class="card-tilt" :class="[`rarity-${rarity}`, { selectable }]" @mousemove="handleMouseMove"
          @mouseleave="resetTilt" @click="handleClick" :style="isInteractive
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
  transform: translateY(-60px) rotate(-12deg);
  animation: dealCard .6s cubic-bezier(.22, 1, .36, 1) forwards;

  transition: transform .25s ease, filter .25s ease;
  will-change: transform, opacity;
}

/* Entrada */
@keyframes dealCard {
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}

/* Hover global (somente se não for static e não estiver selecionado) */
.card-entry:not(.static):not(.selected):hover {
  transform: translateY(-6px) scale(1.06);
  filter: brightness(1.06);
}

/* Flip */
.card-flip {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform .6s cubic-bezier(.4, .2, .2, 1);
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
  transition:
    transform .15s ease,
    box-shadow .25s ease,
    filter .25s ease;
  transform-style: preserve-3d;
}

.card-face img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* RARIDADE */
.rarity-rare {
  box-shadow:
    0 14px 25px rgba(0, 0, 0, .7),
    0 0 20px rgba(30, 144, 255, .25);
}

.rarity-epic {
  box-shadow:
    0 14px 25px rgba(0, 0, 0, .7),
    0 0 24px rgba(138, 43, 226, .35);
}

.rarity-legendary {
  box-shadow:
    0 14px 25px rgba(0, 0, 0, .7),
    0 0 30px rgba(255, 215, 0, .45);
}

/* Hover adicional de profundidade */
.card-entry:not(.static):not(.selected):hover .card-tilt {
  box-shadow:
    0 0 0 2px rgba(138, 43, 226, .4),
    0 30px 50px rgba(0, 0, 0, .8);
}

/* Selecionado */
.card-entry.selected .card-tilt {
  transform: scale(1.07);
  box-shadow:
    0 0 0 3px var(--primary),
    0 0 25px rgba(138, 43, 226, .6),
    0 30px 50px rgba(0, 0, 0, .8);
}

/* Overlay seleção */
.selection-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom,
      rgba(138, 43, 226, .15),
      rgba(138, 43, 226, .25));

  display: flex;
  align-items: center;
  justify-content: center;

  animation: fadeIn .18s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
