<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTrades, mapTradeToCardModel } from '../services/trade.service'
import TradeCard from '../components/TradeCard.vue'
import type { TradeCardModel } from '../types/trade-card.model'

const trades = ref<TradeCardModel[]>([])
const loading = ref(false)
const error = ref('')
const page = ref(1)
const rpp = 10
const hasMore = ref(false)

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

onMounted(fetchTrades)
</script>

<template>
  <q-page class="q-pa-md">

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

  </q-page>
</template>
