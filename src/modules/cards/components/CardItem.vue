<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { UserCard } from '../types/cards.types'
import { getCardRarity } from '../utils/rarity.utils'
import cardBack from 'src/assets/card-back.jpg'

const props = defineProps<{
  card: UserCard
  index: number
  selected?: boolean
  selectable?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const rarity = computed(() => getCardRarity(props.card.id))
const isInteractive = computed(() => !props.selectable)

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
  setTimeout(() => {
    revealed.value = true
  }, props.index * 80 + 600)
})
</script>

<template>
  <div class="card-entry" :class="{ selected }" :style="{ animationDelay: `${index * 80}ms` }">
    <div class="card-flip" :class="{ flipped: revealed }">

      <div class="card-face card-back">
        <img :src="cardBack" alt="Card back" />
      </div>

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
  will-change: transform, opacity;
}

@keyframes dealCard {
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}

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

/* FACES */
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
  transition: transform .15s ease, box-shadow .25s ease;
  transform-style: preserve-3d;
}

/* IMAGE */
.card-face img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* RARITY EFFECTS */
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

.card-entry.selected .card-tilt {
  box-shadow:
    0 0 0 3px var(--primary),
    0 25px 40px rgba(0, 0, 0, .7);
}

.card-tilt.selectable {
  cursor: pointer;
  transition: transform .15s ease,
    box-shadow .25s ease,
    filter .25s ease;
}

.card-tilt.selectable:hover {
  transform: scale(1.04);
  filter: brightness(1.05);
  box-shadow:
    0 0 0 2px rgba(138, 43, 226, .5),
    0 20px 35px rgba(0, 0, 0, .6);
}

.card-entry.selected .card-tilt {
  transform: scale(1.06);
  box-shadow:
    0 0 0 3px var(--primary),
    0 0 25px rgba(138, 43, 226, .6),
    0 25px 40px rgba(0, 0, 0, .7);
}

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

.selection-overlay::after {
  font-size: 32px;
  font-weight: 700;
  color: white;
  text-shadow: 0 0 15px rgba(138, 43, 226, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes pop {
  from {
    transform: scale(.6);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
