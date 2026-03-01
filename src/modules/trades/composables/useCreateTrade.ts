import { ref, computed } from 'vue'
import { createTrade } from '../services/trade.service'
import { getCards, getMyCards } from 'src/modules/cards/services/cards.service'
import type { UserCard } from 'src/modules/cards/types/cards.types'
import type { GetCardsResponse } from 'src/modules/cards/types/cards.response'
import { toggleSelection } from 'src/shared/utils/selection.utils'

interface Options {
  onSuccess?: () => void
}

export function useCreateTrade(options?: Options) {
  const myCards = ref<UserCard[]>([])
  const availableCards = ref<UserCard[]>([])

  const loadingMyCards = ref(false)
  const loadingAvailable = ref(false)

  const myCardsError = ref('')
  const availableError = ref('')

  const selectedOfferingIds = ref<string[]>([])
  const selectedReceivingIds = ref<string[]>([])

  const creatingTrade = ref(false)

  const isTradeValid = computed(() =>
    selectedOfferingIds.value.length > 0 &&
    selectedReceivingIds.value.length > 0
  )

  async function fetchMyCardsForTrade() {
    try {
      loadingMyCards.value = true
      myCardsError.value = ''
      myCards.value = await getMyCards()
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

  function resetSelection() {
    selectedOfferingIds.value = []
    selectedReceivingIds.value = []
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
    if (!isTradeValid.value) return false

    try {
      creatingTrade.value = true

      await createTrade(buildTradePayload())

      resetSelection()
      options?.onSuccess?.()

      return true
    } catch (err) {
      console.error('Erro ao criar trade:', err)
      return false
    } finally {
      creatingTrade.value = false
    }
  }

  return {
    myCards,
    availableCards,
    loadingMyCards,
    loadingAvailable,
    myCardsError,
    availableError,
    selectedOfferingIds,
    selectedReceivingIds,
    creatingTrade,
    isTradeValid,
    fetchMyCardsForTrade,
    fetchAvailableCardsForTrade,
    toggleOffering,
    toggleReceiving,
    handleCreateTrade,
    resetSelection
  }
}
