import { computed, ref } from 'vue'
import { getTrades, deleteTrade } from '../services/trade.service'
import { mapTradeToCardModel } from '../mappers/trade.mapper'
import type { TradeCardModel } from '../types/trade-card.model.types'
import { useToast } from 'src/shared/ui/notification/composables/useToast'
import { useAuthStore } from 'src/modules/auth/store/auth.store'

type FetchTradesOptions = { reset?: boolean; silent?: boolean }
type FetchTradesArg = boolean | FetchTradesOptions | undefined

export function useTrades() {
  const toast = useToast()
  const authStore = useAuthStore()

  const trades = ref<TradeCardModel[]>([])
  const myTrades = ref<TradeCardModel[]>([])

  const loadingList = ref(false)
  const loadingMore = ref(false)
  const loadingMine = ref(false)

  const error = ref('')
  const deletingById = ref<Record<string, boolean>>({})
  const page = ref(1)
  const rpp = 10
  const hasMore = ref(false)
  const requestId = ref(0)

  async function fetchTrades(arg?: FetchTradesArg) {
    const opts: FetchTradesOptions =
      typeof arg === 'boolean' ? { reset: arg } : (arg ?? {})

    const reset = opts.reset ?? false
    const silent = opts.silent ?? false

    if (!reset && (loadingList.value || loadingMore.value)) return
    const currentRequest = ++requestId.value

    try {
      if (reset) {
        page.value = 1
        trades.value = []
        hasMore.value = false
        loadingMore.value = false
      }

      loadingList.value = true
      error.value = ''

      const response = await getTrades(page.value, rpp)
      if (currentRequest !== requestId.value) return

      const mapped = response.list.map(mapTradeToCardModel)
      trades.value = page.value === 1 ? mapped : [...trades.value, ...mapped]
      hasMore.value = response.more
    } catch (err) {
      if (currentRequest !== requestId.value) return
      error.value = 'Erro ao carregar trades'
      if (!silent) toast.error('Não foi possível carregar as trocas. Tente novamente.')
      console.error('fetchTrades error:', err)
    } finally {
      if (currentRequest === requestId.value) loadingList.value = false
    }
  }

  async function loadMore() {
    if (!hasMore.value || loadingList.value || loadingMore.value) return
    const currentRequest = ++requestId.value

    loadingMore.value = true
    error.value = ''

    try {
      page.value += 1
      const response = await getTrades(page.value, rpp)
      if (currentRequest !== requestId.value) return

      const mapped = response.list.map(mapTradeToCardModel)
      trades.value = [...trades.value, ...mapped]
      hasMore.value = response.more
    } catch (err) {
      if (currentRequest !== requestId.value) return
      page.value = Math.max(1, page.value - 1)
      toast.error('Não foi possível carregar mais trocas.')
      console.error('loadMore error:', err)
    } finally {
      if (currentRequest === requestId.value) loadingMore.value = false
    }
  }

  async function fetchMyTrades(opts?: { silent?: boolean }) {
    const silent = opts?.silent ?? false
    const myId = authStore.userId
    if (!myId) {
      myTrades.value = []
      return
    }

    const currentRequest = ++requestId.value

    try {
      loadingMine.value = true
      error.value = ''
      myTrades.value = []

      let p = 1
      let more = true
      const RPP_MINE = 50
      const MAX_PAGES = 20

      while (more && p <= MAX_PAGES) {
        const resp = await getTrades(p, RPP_MINE)
        if (currentRequest !== requestId.value) return

        const mapped = resp.list.map(mapTradeToCardModel)
        const onlyMine = mapped.filter(t => t.userId === myId)

        if (onlyMine.length) {
          myTrades.value = [...myTrades.value, ...onlyMine]
        }

        more = resp.more
        p += 1
      }
    } catch (err) {
      if (currentRequest !== requestId.value) return
      error.value = 'Erro ao carregar suas trocas'
      if (!silent) toast.error('Não foi possível carregar suas trocas. Tente novamente.')
      console.error('fetchMyTrades error:', err)
    } finally {
      if (currentRequest === requestId.value) loadingMine.value = false
    }
  }

  async function deleteTradeById(tradeId: string) {
    if (deletingById.value[tradeId]) return

    try {
      deletingById.value = { ...deletingById.value, [tradeId]: true }
      error.value = ''

      await deleteTrade(tradeId)

      trades.value = trades.value.filter(t => t.id !== tradeId)
      myTrades.value = myTrades.value.filter(t => t.id !== tradeId)

      toast.success('Troca cancelada com sucesso')

      void fetchTrades({ reset: true, silent: true })
      void fetchMyTrades({ silent: true })
    } catch (err) {
      error.value = 'Erro ao deletar trade'
      toast.error('Não foi possível cancelar a troca. Tente novamente.')
      console.error('deleteTradeById error:', err)
    } finally {
      const next = { ...deletingById.value }
      delete next[tradeId]
      deletingById.value = next
    }
  }

  const isEmpty = computed(() =>
    !loadingList.value && !error.value && trades.value.length === 0
  )

  return {
    trades,
    myTrades,
    loading: computed(() => loadingList.value || loadingMore.value),
    loadingList,
    loadingMore,
    loadingMine,
    error,
    hasMore,
    page,
    rpp,
    isEmpty,
    deletingById,
    fetchTrades,
    fetchMyTrades,
    loadMore,
    deleteTradeById,
  }
}
