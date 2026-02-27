<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  getTrades,
  mapTradeToCardModel,
  createTrade,
  deleteTrade
} from '../services/trade.service'
import TradeCard from '../components/TradeCard.vue'
import type { TradeCardModel } from '../types/trade-card.model'
import type { UserCard } from 'src/modules/cards/types/cards.types'
import { getCards, getMyCards } from 'src/modules/cards/services/cards.service'
import { toggleSelection } from 'src/shared/utils/selection.utils'
import type { GetCardsResponse } from 'src/modules/cards/types/cards.response'
import LoadingSkeleton from 'src/shared/ui/components/LoadingSkeleton.vue'
import EmptyState from 'src/shared/ui/components/EmptyState.vue'
import CardThumbnail from 'src/shared/ui/components/CardThumbnail.vue'

const trades = ref<TradeCardModel[]>([])
const loading = ref(false)
const error = ref('')
const page = ref(1)
const rpp = 10
const hasMore = ref(false)
const showCreateTradeDialog = ref(false)

const myCards = ref<UserCard[]>([])
const loadingMyCards = ref(false)
const myCardsError = ref('')

const availableCards = ref<UserCard[]>([])
const loadingAvailable = ref(false)
const availableError = ref('')

const selectedOfferingIds = ref<string[]>([])
const selectedReceivingIds = ref<string[]>([])

const creatingTrade = ref(false)

const isTradeValid = computed(() =>
  selectedOfferingIds.value.length > 0 &&
  selectedReceivingIds.value.length > 0
)

async function fetchTrades() {
  try {
    loading.value = true

    const response = await getTrades(page.value, rpp)
    const mapped = response.list.map(mapTradeToCardModel)

    if (page.value === 1) {
      trades.value = mapped
    } else {
      trades.value.push(...mapped)
    }

    hasMore.value = response.more
  } catch {
    error.value = 'Erro ao carregar trades'
  } finally {
    loading.value = false
  }
}

function loadMore() {
  page.value++
  void fetchTrades()
}

function openCreateTradeDialog() {
  showCreateTradeDialog.value = true
  selectedOfferingIds.value = []
  selectedReceivingIds.value = []

  void fetchMyCardsForTrade()
  void fetchAvailableCardsForTrade()
}

async function fetchMyCardsForTrade() {
  try {
    loadingMyCards.value = true
    myCardsError.value = ''

    const response = await getMyCards()
    myCards.value = response
  } catch {
    myCardsError.value = 'Erro ao carregar suas cartas'
  } finally {
    loadingMyCards.value = false
  }
}

async function fetchAvailableCardsForTrade() {
  try {
    loadingAvailable.value = true
    availableError.value = ''

    const response: GetCardsResponse = await getCards()
    availableCards.value = response.list
  } catch {
    availableError.value = 'Erro ao carregar cartas disponíveis'
  } finally {
    loadingAvailable.value = false
  }
}

function toggleOffering(cardId: string) {
  selectedOfferingIds.value =
    toggleSelection(selectedOfferingIds.value, cardId)
}

function toggleReceiving(cardId: string) {
  selectedReceivingIds.value =
    toggleSelection(selectedReceivingIds.value, cardId)
}

function buildTradePayload() {
  const cards = [
    ...selectedOfferingIds.value.map(id => ({
      cardId: id,
      type: 'OFFERING' as const
    })),
    ...selectedReceivingIds.value.map(id => ({
      cardId: id,
      type: 'RECEIVING' as const
    }))
  ]

  return { cards }
}

async function handleCreateTrade() {
  if (!isTradeValid.value) return

  try {
    creatingTrade.value = true

    const payload = buildTradePayload()
    await createTrade(payload)

    showCreateTradeDialog.value = false
    selectedOfferingIds.value = []
    selectedReceivingIds.value = []

    page.value = 1
    await fetchTrades()
  } catch {
    console.error('Erro ao criar trade')
  } finally {
    creatingTrade.value = false
  }
}

async function handleDeleteTrade(tradeId: string) {
  const confirmed = confirm('Deseja cancelar esta troca?')
  if (!confirmed) return

  try {
    await deleteTrade(tradeId)
    trades.value = trades.value.filter(t => t.id !== tradeId)
  } catch {
    console.error('Erro ao deletar trade')
  }
}

onMounted(fetchTrades)
</script>

<template>
  <q-page class="q-pa-md">

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <div class="page-title">
          Trocas
        </div>
        <div class="page-subtitle">
          Trocas ativas do marketplace
        </div>
      </div>

      <q-btn label="Criar troca" color="primary" icon="add" @click="openCreateTradeDialog" />
    </div>

    <!-- Loading -->
    <LoadingSkeleton v-if="loading" type="list" />

    <!-- Error -->
    <div v-else-if="error">
      {{ error }}
    </div>

    <!-- Empty -->
    <EmptyState v-else-if="trades.length === 0" icon="swap_horiz" title="Nenhuma troca disponível"
      description="Seja o primeiro a criar uma troca." />

    <!-- List -->
    <div v-else>
      <TradeCard v-for="trade in trades" :key="trade.id" :trade="trade" @delete="handleDeleteTrade" />
    </div>

    <!-- Pagination -->
    <div v-if="hasMore" class="text-center q-mt-md">
      <q-btn label="Carregar mais" color="primary" outline @click="loadMore" :loading="loading" />
    </div>

    <!-- Create Trade Dialog -->
    <q-dialog v-model="showCreateTradeDialog">
      <q-card class="trade-dialog">

        <q-card-section class="trade-dialog-header">
          <div>
            <div class="text-h6">Criar nova troca</div>
            <div class="text-caption text-grey-5">
              Escolha cartas para oferecer e receber
            </div>
          </div>

          <q-btn flat round dense icon="close" @click="showCreateTradeDialog = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="trade-dialog-content">

          <div class="section-title">
            Suas cartas (oferecendo)
          </div>

          <LoadingSkeleton v-if="loadingMyCards" type="grid" />

          <div v-else-if="myCardsError">
            {{ myCardsError }}
          </div>

          <div v-else-if="myCards.length === 0">
            Você não possui cartas para oferecer.
          </div>

          <div v-else class="trade-cards-grid">
            <CardThumbnail v-for="card in myCards" :key="card.id" :image-url="card.imageUrl" :name="card.name"
              :selected="selectedOfferingIds.includes(card.id)" @click="toggleOffering(card.id)" />
          </div>

          <q-separator class="q-my-lg" />

          <div class="section-title">
            Cartas desejadas (recebendo)
          </div>

          <LoadingSkeleton v-if="loadingAvailable" type="grid" />

          <div v-else-if="availableError">
            {{ availableError }}
          </div>

          <div v-else class="trade-cards-grid">
            <CardThumbnail v-for="card in availableCards" :key="card.id" :image-url="card.imageUrl" :name="card.name"
              :selected="selectedReceivingIds.includes(card.id)" @click="toggleReceiving(card.id)" />
          </div>

        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showCreateTradeDialog = false" />
          <q-btn label="Criar troca" color="primary" :disable="!isTradeValid" :loading="creatingTrade"
            @click="handleCreateTrade" />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
}

.page-subtitle {
  font-size: 13px;
  color: #8b8bb3;
  margin-top: 2px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #d0d0ff;
}

.trade-dialog {
  width: 900px;
  max-width: 92vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: #1a1a2e;
}

.trade-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trade-dialog-content {
  overflow-y: auto;
  padding: 12px 4px 0;
}

.trade-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 14px;
}
</style>
