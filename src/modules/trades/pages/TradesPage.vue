<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTrades, mapTradeToCardModel } from '../services/trade.service'
import TradeCard from '../components/TradeCard.vue'
import type { TradeCardModel } from '../types/trade-card.model'
import type { UserCard } from 'src/modules/cards/types/cards.types'
import { getMyCards } from 'src/modules/cards/services/cards.service'
import { toggleSelection } from 'src/shared/utils/selection.utils'

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
  void fetchMyCardsForTrade()
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

function toggleOffering(cardId: string) {
  selectedOfferingIds.value =
    toggleSelection(selectedOfferingIds.value, cardId)
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
      <TradeCard v-for="trade in trades" :key="trade.id" :trade="trade" />
    </div>

    <div v-if="hasMore" class="text-center q-mt-md">
      <q-btn label="Carregar mais" color="primary" outline @click="loadMore" :loading="loading" />
    </div>

    <q-dialog v-model="showCreateTradeDialog">
      <q-card style="min-width: 700px">

        <q-card-section class="row items-center justify-between">
          <div class="text-h6">
            Criar nova troca
          </div>

          <q-btn flat round dense icon="close" @click="showCreateTradeDialog = false" />
        </q-card-section>

        <q-separator />

        <q-card-section>

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

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showCreateTradeDialog = false" />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </q-page>
</template>
