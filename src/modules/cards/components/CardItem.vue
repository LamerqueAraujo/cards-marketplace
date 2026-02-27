<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { UserCard } from '../types/cards.types'
import { getCardRarity } from '../utils/rarity.utils'
import cardBack from 'src/assets/card-back.jpg'

const props = defineProps<{
  card: UserCard
  index: number
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const rarity = computed(() => getCardRarity(props.card.id))

const tiltX = ref(0)
const tiltY = ref(0)

function handleMouseMove(e: MouseEvent) {
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
const revealed = ref(false)

onMounted(() => {
  setTimeout(() => {
    revealed.value = true
  }, props.index * 80 + 600)
})
</script>

<template>
  <div class="card-entry" :style="{ animationDelay: `${props.index * 80}ms` }">
    <div class="card-flip" :class="{ flipped: revealed }">
      <!-- VERSO -->
      <div class="card-face card-back">
        <img :src="cardBack" />
      </div>

      <!-- FRENTE -->
      <div class="card-face card-front">
        <div class="card-tilt" :class="`rarity-${rarity}`" @mousemove="handleMouseMove" @mouseleave="resetTilt"
          @click="emit('click')" :style="{
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
          }">
          <img :src="props.card.imageUrl" :alt="props.card.name" width="421" height="614" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes dealCard {
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
  }
}

.card-root {
  position: relative;
  overflow: hidden;
  background: #0f0f1a;
  transition: transform .18s ease, box-shadow .3s ease;
  cursor: pointer;

  box-shadow:
    0 14px 25px rgba(0, 0, 0, .7);
}

.card-root:hover {
  box-shadow:
    0 28px 45px rgba(0, 0, 0, .9);
}

.card-image {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
}

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

.card-entry {
  position: relative;
  width: 100%;
  aspect-ratio: 421 / 614;
  perspective: 1200px;
  box-shadow: 0 25px 35px rgba(0, 0, 0, .6);
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
  transform: rotateY(0deg);
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

.card-face img {
  width: 100%;
  height: auto;
  display: block;
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
  transition: transform .15s ease;
  transform-style: preserve-3d;
}
</style>
