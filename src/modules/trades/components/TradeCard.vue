<script setup lang="ts">
import { computed, ref, onBeforeUnmount, watchEffect, onMounted } from 'vue'
import type { TradeCardModel } from '../types/trade-card.model.types'
import { useAuthStore } from 'src/modules/auth/store/auth.store'
import type { ComponentPublicInstance } from 'vue'
import AppCard from 'src/shared/ui/base/AppCard.vue'
import AppIconButton from 'src/shared/ui/base/AppIconButton.vue'
import AppChip from 'src/shared/ui/base/AppChip.vue'
import cardBack from 'src/assets/card-back.jpg'

const props = defineProps<{
  trade: TradeCardModel
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  (e: 'delete', tradeId: string): void
  (e: 'open-details', trade: TradeCardModel): void
}>()

const authStore = useAuthStore()

const isOwner = computed(() => props.trade.userId === authStore.userId)
const formattedDate = computed(() =>
  new Date(props.trade.createdAt).toLocaleDateString('pt-BR')
)

const offeringCount = computed(() => props.trade.offering.length)
const receivingCount = computed(() => props.trade.receiving.length)

const offeringJustify = computed(() =>
  offeringCount.value <= 1 ? 'center' : 'flex-start'
)
const receivingJustify = computed(() =>
  receivingCount.value <= 1 ? 'center' : 'flex-start'
)

const MAX_THUMBS = 3
const offeringThumbs = computed(() => props.trade.offering.slice(0, MAX_THUMBS))
const receivingThumbs = computed(() => props.trade.receiving.slice(0, MAX_THUMBS))

const offeringOverflow = computed(() => Math.max(0, offeringCount.value - MAX_THUMBS))
const receivingOverflow = computed(() => Math.max(0, receivingCount.value - MAX_THUMBS))

function openDetails() {
  emit('open-details', props.trade)
}

const cardRef = ref<HTMLElement | ComponentPublicInstance | null>(null)
const isInView = ref(false)
let io: IntersectionObserver | null = null

function getObservedEl(): HTMLElement | null {
  const v = cardRef.value
  if (!v) return null
  if (v instanceof HTMLElement) return v
  const el = v?.$el
  return el instanceof HTMLElement ? el : null
}

function triggerFlip() {
  if (isInView.value) return

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (reduce) {
    isInView.value = true
    return
  }

  requestAnimationFrame(() => {
    setTimeout(() => {
      isInView.value = true
    }, 70)
  })
}

onMounted(() => {
  setTimeout(() => {
    triggerFlip()
  }, 900)
})

watchEffect(() => {
  const el = getObservedEl()
  if (!el) return

  if (typeof IntersectionObserver === 'undefined') {
    triggerFlip()
    return
  }

  io?.disconnect()
  io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry) return
      if (entry.isIntersecting) {
        triggerFlip()
        io?.disconnect()
      }
    },
    { threshold: 0.25 }
  )

  io.observe(el)
})

onBeforeUnmount(() => {
  io?.disconnect()
})
</script>

<template>
  <AppCard ref="cardRef" class="trade-card" clickable role="button" tabindex="0" @click="openDetails">
    <div class="trade-header">
      <div class="meta">
        <div class="user">{{ trade.userName }}</div>
        <div class="date">{{ formattedDate }}</div>
      </div>

      <div class="right">
        <AppChip size="sm" label="Oferecendo" variant="primary" />
        <AppChip size="sm" label="Recebendo" variant="info" />

        <AppIconButton v-if="isOwner" icon="delete" variant="danger" size="sm" :loading="!!isDeleting"
          :disabled="!!isDeleting" aria-label="Cancelar troca" @click.stop="emit('delete', trade.id)" />
      </div>
    </div>

    <div class="summary">
      <div class="side">
        <div class="side-head">
          <div class="side-title">OFERECENDO</div>
          <div class="side-count">{{ offeringCount }}</div>
        </div>

        <div class="thumb-row" aria-hidden="true" :style="{ justifyContent: offeringJustify }">
          <div v-for="(c, idx) in offeringThumbs" :key="c.id" class="thumb flip" :class="{ 'is-flipped': isInView }"
            :style="{ transitionDelay: `${(idx * 90) + 120}ms` }">
            <div class="flip-inner">
              <div class="flip-face flip-back">
                <img :src="cardBack" alt="" />
              </div>
              <div class="flip-face flip-front">
                <img :src="c.imageUrl" :alt="c.name" />
              </div>
            </div>
          </div>

          <div v-if="offeringOverflow > 0" class="more-pill">+{{ offeringOverflow }}</div>
        </div>
      </div>

      <div class="mid" aria-hidden="true">
        <div class="mid-icon">⇄</div>
        <div class="mid-line" />
      </div>

      <div class="side">
        <div class="side-head">
          <div class="side-title receiving">RECEBENDO</div>
          <div class="side-count">{{ receivingCount }}</div>
        </div>

        <div class="thumb-row" aria-hidden="true" :style="{ justifyContent: receivingJustify }">
          <div v-for="(c, idx) in receivingThumbs" :key="c.id" class="thumb flip" :class="{ 'is-flipped': isInView }"
            :style="{ transitionDelay: `${(idx * 90) + 120}ms` }">
            <div class="flip-inner">
              <div class="flip-face flip-back">
                <img :src="cardBack" alt="" />
              </div>
              <div class="flip-face flip-front">
                <img :src="c.imageUrl" :alt="c.name" />
              </div>
            </div>
          </div>

          <div v-if="receivingOverflow > 0" class="more-pill">+{{ receivingOverflow }}</div>
        </div>
      </div>
    </div>

    <div class="hint">Toque para ver os detalhes da troca</div>
  </AppCard>
</template>

<style scoped lang="scss">
.trade-card {
  padding: 16px 18px;
  cursor: pointer;
}

.trade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
}

.meta .user {
  font-weight: 800;
  font-size: 15px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.meta .date {
  margin-top: 2px;
  font-size: 12px;
  color: var(--text-secondary);
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 74px minmax(0, 1fr);
  align-items: start;
}

.side {
  min-width: 0;
}

.side-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}

.side-title {
  font-size: 11px;
  letter-spacing: 1px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.62);
}

.side-title.receiving {
  color: rgba(30, 144, 255, 0.9);
}

.side-count {
  font-size: 12px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.52);
}

.thumb-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap;
  overflow: hidden;
  min-width: 0;
  height: 92px;
  padding: 2px 0;
}

.thumb {
  flex: 0 0 auto;
  width: 56px;
  height: 84px;
}

.flip {
  perspective: 900px;
}

.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateY(0deg);
  transition: transform 1200ms var(--ease-smooth, ease);
  will-change: transform;
}

.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.flip-face img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

.flip-back {
  transform: rotateY(0deg);
}

.flip-front {
  transform: rotateY(180deg);
}

.flip.is-flipped .flip-inner {
  transform: rotateY(180deg);
}

.trade-card:hover .flip-face {
  filter: brightness(1.04);
}

.more-pill {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;

  padding: 8px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;

  background: rgba(15, 15, 26, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  white-space: nowrap;
}

.mid {
  position: relative;
  height: 100%;
  display: grid;
  place-items: center;
  padding-top: 22px;
}

.mid-icon {
  font-size: 20px;
  opacity: 0.8;
  color: rgba(138, 43, 226, 0.95);
  filter: drop-shadow(0 0 16px rgba(138, 43, 226, 0.18));
}

.mid-line {
  position: absolute;
  width: 2px;
  height: 130px;
  background: linear-gradient(to bottom,
      rgba(255, 255, 255, 0.04),
      rgba(138, 43, 226, 0.22),
      rgba(255, 255, 255, 0.04));
  opacity: 0.7;
}

.hint {
  margin-top: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
}

@media (prefers-reduced-motion: reduce) {
  .flip-inner {
    transition: none !important;
  }
}

@media (max-width: 740px) {
  .summary {
    grid-template-columns: 1fr;
  }

  .mid {
    display: none;
  }

  .thumb {
    width: 52px;
    height: 78px;
  }

  .thumb-row {
    justify-content: center !important;
  }

  .meta .user {
    max-width: 100px;
  }
}
</style>
