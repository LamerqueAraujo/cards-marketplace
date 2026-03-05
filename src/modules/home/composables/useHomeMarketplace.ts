import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTrades } from 'src/modules/trades/composables/useTrades'
import { useAuthStore } from 'src/modules/auth/store/auth.store'
import type { TradeCardModel } from 'src/modules/trades/types/trade-card.model.types'

export function useHomeMarketplace() {
  const router = useRouter()
  const authStore = useAuthStore()

  const { trades, loading, error, fetchTrades } = useTrades()

  const isAuthenticated = computed(() => Boolean(authStore.token))
  const limitedTrades = computed(() => trades.value.slice(0, 6))

  const subtitle = computed(() =>
    isAuthenticated.value
      ? 'Explore trocas abertas e negocie com estratégia'
      : 'Explore trocas abertas — faça login para criar suas próprias negociações'
  )

  const createTradeOpen = ref(false)

  const detailsOpen = ref(false)
  const selectedTrade = ref<TradeCardModel | null>(null)

  function openTradeDetails(trade: TradeCardModel) {
    selectedTrade.value = trade
    detailsOpen.value = true
  }

  function closeTradeDetails() {
    detailsOpen.value = false
    selectedTrade.value = null
  }

  function goTrades(tradeId?: string) {
    const to = tradeId
      ? { name: 'trades', query: { trade: tradeId } }
      : { name: 'trades' }

    void router.push(to)
  }

  function goLogin() { void router.push({ name: 'login' }) }
  function goRegister() { void router.push({ name: 'register' }) }
  function goMyCards() { void router.push({ name: 'my-cards' }) }

  function goCreateTrade() {
    if (!isAuthenticated.value) {
      void router.push({ name: 'login' })
      return
    }
    createTradeOpen.value = true
  }

  function onTradeCreated() {
    void fetchTrades({ reset: true, silent: true })
  }

  onMounted(() => {
    void fetchTrades({ reset: true, silent: true })
  })

  return {
    trades: limitedTrades,
    loading,
    error,
    isAuthenticated,
    subtitle,
    fetchTrades,
    goTrades,
    goLogin,
    goRegister,
    goMyCards,
    goCreateTrade,
    createTradeOpen,
    onTradeCreated,
    detailsOpen,
    selectedTrade,
    openTradeDetails,
    closeTradeDetails,
  }
}
