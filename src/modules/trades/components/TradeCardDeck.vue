<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { BaseCard } from 'src/shared/types/card.types'

const props = withDefaults(defineProps<{
  cards: BaseCard[]
  label: string
  autoplay?: boolean
  intervalMs?: number
}>(), {
  autoplay: true,
  intervalMs: 1400,
})

const emit = defineEmits<{
  (e: 'preview', cardId: string): void
}>()

const idx = ref(0)
let timer: number | null = null

const count = computed(() => props.cards.length)
const hasMany = computed(() => count.value > 1)

const current = computed(() => props.cards[idx.value])
const overflow = computed(() => Math.max(0, count.value - 3))

const stack = computed(() => props.cards.slice(0, 3))

function next() {
  if (!hasMany.value) return
  idx.value = (idx.value + 1) % count.value
}

function start() {
  if (!props.autoplay || !hasMany.value) return
  stop()
  timer = window.setInterval(next, props.intervalMs)
}

function stop() {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

function onClick() {
  const c = current.value
  if (c) emit('preview', c.id)
}

onMounted(() => start())
onBeforeUnmount(() => stop())
</script>

<template>
  <div class="deck" role="button" tabindex="0" :aria-label="`Inspecionar cartas de ${label}`" @click.stop="onClick"
    @mouseenter="stop" @mouseleave="start" @keydown.enter.prevent="onClick" @keydown.space.prevent="onClick">
    <div class="deck__label">{{ label }}</div>

    <div class="deck__stack">
      <div v-for="(c, i) in stack" :key="c.id" class="deck__card" :style="{
        transform: `translate(${i * 8}px, ${i * 6}px) rotate(${i * 2}deg)`
      }">
        <img class="deck__img" :src="c.imageUrl" :alt="c.name" loading="lazy" />
      </div>

      <div v-if="overflow > 0" class="deck__more">
        +{{ overflow }}
      </div>
    </div>

    <div class="deck__hint">
      <span v-if="hasMany">hover para pausar • clique para inspecionar</span>
      <span v-else>clique para inspecionar</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.deck {
  position: relative;
  padding: 12px 12px 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: transform 180ms var(--ease-smooth), border-color 180ms var(--ease-smooth);
}

.deck:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.14);
}

.deck__label {
  font-size: 11px;
  letter-spacing: 1px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.72);
  text-transform: uppercase;
  margin-bottom: 10px;
}

.deck__stack {
  position: relative;
  width: 148px;
  height: 204px;
}

.deck__card {
  position: absolute;
  inset: 0;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(15, 15, 26, 0.5);
}

.deck__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.deck__more {
  position: absolute;
  right: -6px;
  bottom: -6px;
  padding: 8px 10px;
  font-weight: 900;
  font-size: 12px;
  background: rgba(15, 15, 26, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.deck__hint {
  margin-top: 10px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.50);
}
</style>
