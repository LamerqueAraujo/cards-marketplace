import { ref } from 'vue'
import { getTrades, deleteTrade } from '../services/trade.service'
import { mapTradeToCardModel } from '../mappers/trade.mapper'
import type { TradeCardModel } from '../types/trade-card.model.types'

export function useTrades() {
  const trades = ref<TradeCardModel[]>([])
  const loading = ref(false)
  const error = ref('')
  const page = ref(1)
  const rpp = 10
  const hasMore = ref(false)

  async function fetchTrades(reset = false) {
    try {
      if (reset) {
        page.value = 1
        trades.value = []
      }

      loading.value = true
      error.value = ''

      const response = await getTrades(page.value, rpp)
      const mapped = response.list.map(mapTradeToCardModel)

      trades.value = page.value === 1
        ? mapped
        : [...trades.value, ...mapped]

      hasMore.value = response.more
    } catch {
      error.value = 'Erro ao carregar trades'
    } finally {
      loading.value = false
    }
  }

  async function deleteTradeById(tradeId: string) {
    try {
      loading.value = true
      error.value = ''
      await deleteTrade(tradeId)
      trades.value = trades.value.filter(t => t.id !== tradeId)
    } catch {
      error.value = 'Erro ao deletar trade'
    } finally {
      loading.value = false
    }
  }

  function loadMore() {
    if (!hasMore.value || loading.value) return
    page.value++
    void fetchTrades()
  }

  return {
    trades,
    loading,
    error,
    hasMore,
    fetchTrades,
    loadMore,
    deleteTradeById
  }
}
