<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTrades, mapTradeToCardModel, createTrade, deleteTrade } from '../services/trade.service'
import TradeCard from '../components/TradeCard.vue'
import type { TradeCardModel } from '../types/trade-card.model'
import type { UserCard } from 'src/modules/cards/types/cards.types'
import { getCards, getMyCards } from 'src/modules/cards/services/cards.service'
import { toggleSelection } from 'src/shared/utils/selection.utils'
import type { GetCardsResponse } from 'src/modules/cards/types/cards.response'

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
const selectedOfferingIds = ref<string[]>([])
const availableCards = ref<UserCard[]>([])
const loadingAvailable = ref(false)
const availableError = ref('')
const selectedReceivingIds = ref<string[]>([])
const creatingTrade = ref(false)

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

function isTradeValid() {
  return (
    selectedOfferingIds.value.length > 0 &&
    selectedReceivingIds.value.length > 0
  )
}

async function handleCreateTrade() {
  if (!isTradeValid()) return

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

    <div class="row justify-between items-center q-mb-md">
      <div class="text-h6">
        Trocas
      </div>

      <q-btn label="Criar troca" color="primary" icon="add" @click="openCreateTradeDialog" />
    </div>

    <div v-if="loading">
      Carregando...
    </div>

    <div v-else-if="error">
      {{ error }}
    </div>

    <div v-else>
      <TradeCard v-for="trade in trades" :key="trade.id" :trade="trade" @delete="handleDeleteTrade" />
    </div>

    <div v-if="hasMore" class="text-center q-mt-md">
      <q-btn label="Carregar mais" color="primary" outline @click="loadMore" :loading="loading" />
    </div>

    <q-dialog v-model="showCreateTradeDialog">
      <q-card>

        <q-card-section class="row items-center justify-between">
          <div class="text-h6">
            Criar nova troca
          </div>

          <q-btn flat round dense icon="close" @click="showCreateTradeDialog = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="col scroll" style="overflow-y: auto;">

          <div class="text-subtitle1 q-mb-md">
            Selecione as cartas que você quer oferecer
          </div>

          <div v-if="loadingMyCards">
            Carregando suas cartas...
          </div>

          <div v-else-if="myCardsError">
            {{ myCardsError }}
          </div>

          <div v-else-if="myCards.length === 0">
            Você não possui cartas para oferecer.
          </div>

          <div v-else class="row q-col-gutter-md">
            <div v-for="card in myCards" :key="card.id" class="col-6 col-md-3 cursor-pointer"
              @click="toggleOffering(card.id)">
              <q-img :src="card.imageUrl" ratio="1" />

              <div class="text-caption q-mt-xs">
                {{ card.name }}
              </div>

              <q-badge v-if="selectedOfferingIds.includes(card.id)" color="primary" class="q-mt-xs">
                Selecionada
              </q-badge>
            </div>
          </div>

        </q-card-section>

        <q-card-section class="col scroll" style="overflow-y: auto;">

          <div class="text-subtitle1 q-mb-md">
            Selecione as cartas que você quer receber
          </div>

          <div v-if="loadingAvailable">
            Carregando cartas disponíveis...
          </div>

          <div v-else-if="availableError">
            {{ availableError }}
          </div>

          <div v-else class="row q-col-gutter-md">
            <div v-for="card in availableCards" :key="card.id" class="col-6 col-md-3 cursor-pointer"
              @click="toggleReceiving(card.id)">
              <q-img :src="card.imageUrl" ratio="1" />

              <div class="text-caption q-mt-xs">
                {{ card.name }}
              </div>

              <q-badge v-if="selectedReceivingIds.includes(card.id)" color="secondary" class="q-mt-xs">
                Selecionada
              </q-badge>
            </div>
          </div>

        </q-card-section>

        <q-separator class="q-my-md" />

        <q-btn label="Criar troca" color="primary" :disable="!isTradeValid()" @click="handleCreateTrade" />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showCreateTradeDialog = false" />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </q-page>
</template>
