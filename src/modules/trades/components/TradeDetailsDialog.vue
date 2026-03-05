<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { TradeCardModel } from '../types/trade-card.model.types'
import type { BaseCard } from 'src/shared/types/card.types'
import BaseDialog from 'src/shared/ui/base/BaseDialog.vue'
import AppButton from 'src/shared/ui/base/AppButton.vue'
import AppChip from 'src/shared/ui/base/AppChip.vue'
import AppCard from 'src/shared/ui/base/AppCard.vue'
import CardItem from 'src/shared/ui/data-display/CardItem.vue'

import { getMyCards } from 'src/modules/cards/services/cards.service'
import { useToast } from 'src/shared/ui/notification/composables/useToast'
import cardBack from 'src/assets/card-back.jpg'

const toast = useToast()

const props = defineProps<{
  modelValue: boolean
  trade: TradeCardModel | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'cancel-trade', tradeId: string): void
  (e: 'request-trade', tradeId: string): void
  (e: 'preview-card', cardId: string): void
}>()

const tab = ref<'receive' | 'send'>('receive')

const STRICT_MATCH_RECEIVING_IDS = true

const subtitle = computed(() => {
  if (!props.trade) return undefined
  const date = new Date(props.trade.createdAt).toLocaleDateString('pt-BR')
  return `${props.trade.userName} • ${date}`
})

function close() {
  emit('update:modelValue', false)
}

const myCards = ref<BaseCard[]>([])
const loadingMyCards = ref(false)
const myCardsError = ref('')

const selectedSendIds = ref<string[]>([])
const receiveCards = computed(() => props.trade?.offering ?? [])
const sendRequested = computed(() => props.trade?.receiving ?? [])

const maxSendCount = computed(() => sendRequested.value.length)

const requestedIdSet = computed(() => new Set(sendRequested.value.map(c => c.id)))

const eligibleToSend = computed(() => {
  if (!STRICT_MATCH_RECEIVING_IDS) return myCards.value
  return myCards.value.filter(c => requestedIdSet.value.has(c.id))
})

const missingRequested = computed(() => {
  if (!STRICT_MATCH_RECEIVING_IDS) return []
  const have = new Set(myCards.value.map(c => c.id))
  return sendRequested.value.filter(c => !have.has(c.id))
})

const missingRequestedCount = computed(() => missingRequested.value.length)

const canFinalize = computed(() => {
  if (!props.trade) return false
  if (maxSendCount.value <= 0) return false
  if (STRICT_MATCH_RECEIVING_IDS && missingRequestedCount.value > 0) return false
  return selectedSendIds.value.length === maxSendCount.value
})

function toggleSend(cardId: string) {
  if (!props.trade) return

  if (STRICT_MATCH_RECEIVING_IDS && !requestedIdSet.value.has(cardId)) {
    toast.warning('Esta carta não faz parte do que o usuário está pedindo.')
    return
  }

  if (selectedSendIds.value.includes(cardId)) {
    selectedSendIds.value = selectedSendIds.value.filter(id => id !== cardId)
    return
  }

  if (selectedSendIds.value.length >= maxSendCount.value) {
    toast.warning(`Você só pode selecionar ${maxSendCount.value} carta(s) para enviar.`)
    return
  }

  selectedSendIds.value = [...selectedSendIds.value, cardId]
}

function onCardPreview(card: BaseCard) {
  emit('preview-card', card.id)
}

async function fetchMy() {
  try {
    loadingMyCards.value = true
    myCardsError.value = ''
    myCards.value = await getMyCards()
  } catch {
    myCardsError.value = 'Não foi possível carregar seu inventário.'
    toast.error('Não foi possível carregar seu inventário.')
  } finally {
    loadingMyCards.value = false
  }
}

function resetLocalState() {
  tab.value = 'receive'
  selectedSendIds.value = []
  myCards.value = []
  myCardsError.value = ''
  flipped.value = false
}

function finalize() {
  if (!props.trade) return

  if (STRICT_MATCH_RECEIVING_IDS && missingRequestedCount.value > 0) {
    tab.value = 'send'
    toast.error('Você não possui todas as cartas necessárias para esta troca.')
    return
  }

  if (!canFinalize.value) {
    tab.value = 'send'
    toast.warning('Selecione as cartas que você vai enviar para finalizar.')
    return
  }

  toast.info('Funcionalidade de finalização está em desenvolvimento.')
}

const flipped = ref(false)

function triggerFlip() {
  flipped.value = false
  window.setTimeout(() => {
    flipped.value = true
  }, 90)
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      resetLocalState()
      return
    }

    resetLocalState()
    if (props.trade) void fetchMy()
    triggerFlip()
  }
)

watch(
  () => props.trade?.id,
  () => {
    if (!props.modelValue) return
    triggerFlip()
  }
)
</script>

<template>
  <BaseDialog :model-value="modelValue" width="980px" title="Detalhes da troca" v-bind="subtitle ? { subtitle } : {}"
    @update:modelValue="emit('update:modelValue', $event)">
    <div v-if="trade" class="trade-details">
      <div class="topbar">
        <div class="tabs" role="tablist" aria-label="Etapas da troca">
          <AppChip size="sm" :label="`VOCÊ VAI RECEBER • ${receiveCards.length}`"
            :variant="tab === 'receive' ? 'primary' : 'default'" clickable role="tab"
            :aria-selected="tab === 'receive' ? 'true' : 'false'" @click="tab = 'receive'" />
          <AppChip size="sm" :label="`VOCÊ VAI ENVIAR • ${sendRequested.length}`"
            :variant="tab === 'send' ? 'info' : 'default'" clickable role="tab"
            :aria-selected="tab === 'send' ? 'true' : 'false'" @click="tab = 'send'" />
        </div>

        <div class="hint">
          <template v-if="tab === 'send'">
            Selecione exatamente <strong>{{ maxSendCount }}</strong> carta(s)
          </template>
          <template v-else>
            Veja o que você recebe nesta troca
          </template>
        </div>
      </div>

      <div class="content">
        <AppCard v-show="tab === 'receive'" class="panel" padding="md" variant="subtle" noTopBorder>
          <div class="panel-head">
            <div class="panel-title">VOCÊ VAI RECEBER</div>
            <div class="panel-sub">{{ receiveCards.length }} carta(s)</div>
          </div>

          <div class="cards-area app-scroll">
            <div v-if="receiveCards.length === 0" class="empty-text">
              Nada para receber nesta troca.
            </div>

            <div v-else class="cards-grid">
              <div v-for="(c, index) in receiveCards" :key="c.id" class="flip-card" :class="{ 'is-flipped': flipped }"
                :style="{ transitionDelay: `${(index * 70) + 80}ms` }">
                <div class="flip-inner">
                  <div class="flip-face flip-back">
                    <img :src="cardBack" alt="" />
                  </div>

                  <div class="flip-face flip-front">
                    <CardItem :card="c" :index="index" static class="card" @click.stop="onCardPreview(c)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        <AppCard v-show="tab === 'send'" class="panel" padding="md" variant="subtle" noTopBorder>
          <div class="panel-head">
            <div class="panel-title receiving">VOCÊ VAI ENVIAR</div>
            <div class="panel-sub">
              Selecionadas • <strong>{{ selectedSendIds.length }}</strong> / {{ maxSendCount }}
            </div>
          </div>

          <div v-if="STRICT_MATCH_RECEIVING_IDS && missingRequestedCount > 0" class="warning-box">
            <div class="warning-title">Faltando no seu inventário:</div>
            <ul class="warning-list">
              <li v-for="c in missingRequested" :key="c.id">{{ c.name }}</li>
            </ul>
          </div>

          <div class="cards-area app-scroll">
            <div v-if="loadingMyCards" class="empty-text">
              Carregando inventário...
            </div>

            <div v-else-if="myCardsError" class="empty-text">
              {{ myCardsError }}
            </div>

            <div v-else-if="eligibleToSend.length === 0" class="empty-text">
              Você não possui as cartas que esta troca está pedindo.
            </div>

            <div v-else class="cards-grid">
              <div v-for="(c, index) in eligibleToSend" :key="c.id" class="flip-card" :class="{ 'is-flipped': flipped }"
                :style="{ transitionDelay: `${(index * 70) + 80}ms` }">
                <div class="flip-inner">
                  <div class="flip-face flip-back">
                    <img :src="cardBack" alt="" />
                  </div>

                  <div class="flip-face flip-front">
                    <CardItem :card="c" :index="index" :selectable="true" :selected="selectedSendIds.includes(c.id)"
                      class="card" @click.stop="toggleSend(c.id)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </div>

    <template #footer>
      <AppButton label="Fechar" variant="ghost" @click="close" />
      <AppButton v-if="trade" label="Finalizar troca" icon="swap_horiz" :disabled="!canFinalize" @click="finalize" />
    </template>
  </BaseDialog>
</template>

<style scoped lang="scss">
.trade-details {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 3;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 12px 12px;
  margin: -6px -6px 10px;

  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 15, 26, 0.55);
  backdrop-filter: blur(12px);
  border-radius: 16px;

  box-shadow:
    0 14px 36px rgba(0, 0, 0, 0.28),
    0 0 18px rgba(139, 92, 246, 0.10);
}

.tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 0;
}

.hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  text-align: right;
  min-width: 0;
}

.content {
  display: grid;
  grid-template-columns: 1fr;
}

.panel {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.panel-title {
  font-weight: 900;
  letter-spacing: 1px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.70);
}

.panel-title.receiving {
  color: rgba(30, 144, 255, 0.92);
}

.panel-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
}

.cards-area {
  max-height: min(52vh, 520px);
  overflow: auto;
  padding-right: 6px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 120px);
  justify-content: center;
  gap: 12px;
}

.flip-card {
  width: 120px;
  aspect-ratio: 421 / 614;
  perspective: 900px;
}

.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateY(0deg);
  transition: transform 620ms var(--ease-smooth, ease);
  will-change: transform;
}

.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow: hidden;
}

.flip-face img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.flip-back {
  transform: rotateY(0deg);
}

.flip-front {
  transform: rotateY(180deg);
}

.flip-card.is-flipped .flip-inner {
  transform: rotateY(180deg);
}

.card :deep(.card-entry) {
  width: 120px;
  height: auto;
}

.empty-text {
  padding: 14px 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.62);
}

.warning-box {
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 215, 0, 0.07);
  border: 1px solid rgba(255, 215, 0, 0.20);
}

.warning-title {
  font-weight: 800;
  font-size: 12px;
  margin-bottom: 6px;
  color: rgba(255, 215, 0, 0.95);
}

.warning-list {
  margin: 0;
  padding-left: 16px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}

@media (prefers-reduced-motion: reduce) {
  .flip-inner {
    transition: none !important;
  }
}

@media (max-width: 740px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .hint {
    text-align: left;
  }

  .cards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-content: stretch;
  }

  .flip-card {
    width: 100%;
  }

  .card :deep(.card-entry) {
    width: 100%;
  }

  .cards-area {
    max-height: 56vh;
  }
}
</style>
