import { ref, computed } from 'vue'
import { createTrade } from '../services/trade.service'
import { getCards, getMyCards } from 'src/modules/cards/services/cards.service'
import { useToast } from 'src/shared/ui/notification/composables/useToast'
import type { UserCard } from 'src/modules/cards/types/cards.types'
import type { GetCardsResponse } from 'src/modules/cards/types/cards.response'
import { toggleSelection } from 'src/shared/utils/selection.utils'

interface Options {
  onSuccess?: () => void
}

type FetchOptions = { silent?: boolean }

export function useCreateTrade(options?: Options) {
  const toast = useToast()

  const myCards = ref<UserCard[]>([])
  const availableCards = ref<UserCard[]>([])

  const loadingMyCards = ref(false)
  const loadingAvailable = ref(false)

  const myCardsError = ref('')
  const availableError = ref('')

  const selectedOfferingIds = ref<string[]>([])
  const selectedReceivingIds = ref<string[]>([])

  const creatingTrade = ref(false)

  const isTradeValid = computed(
    () => selectedOfferingIds.value.length > 0 && selectedReceivingIds.value.length > 0
  )

  async function fetchMyCardsForTrade(opts: FetchOptions = {}) {
    try {
      loadingMyCards.value = true
      myCardsError.value = ''

      myCards.value = await getMyCards()
    } catch (err) {
      console.error('fetchMyCardsForTrade error:', err)
      myCardsError.value = 'Erro ao carregar suas cartas'
      if (!opts.silent) toast.error('Não foi possível carregar suas cartas.')
    } finally {
      loadingMyCards.value = false
    }
  }

  async function fetchAvailableCardsForTrade(opts: FetchOptions = {}) {
    try {
      loadingAvailable.value = true
      availableError.value = ''

      const response: GetCardsResponse = await getCards(1, 60)
      availableCards.value = response.list
    } catch (err) {
      console.error('fetchAvailableCardsForTrade error:', err)
      availableError.value = 'Erro ao carregar cartas disponíveis'
      if (!opts.silent) toast.error('Não foi possível carregar cartas disponíveis.')
    } finally {
      loadingAvailable.value = false
    }
  }

  function removeFrom(list: string[], id: string) {
    return list.filter(x => x !== id)
  }

  function toggleOffering(cardId: string) {
    if (selectedReceivingIds.value.includes(cardId)) {
      selectedReceivingIds.value = removeFrom(selectedReceivingIds.value, cardId)
    }

    selectedOfferingIds.value = toggleSelection(selectedOfferingIds.value, cardId)
  }

  function toggleReceiving(cardId: string) {
    if (myCards.value.some(c => c.id === cardId)) {
      toast.warning('Você já possui essa carta no seu inventário')
      return
    }

    if (selectedOfferingIds.value.includes(cardId)) {
      toast.warning('Esta carta já está selecionada para oferecer')
      return
    }

    selectedReceivingIds.value = toggleSelection(selectedReceivingIds.value, cardId)
  }

  function resetSelection() {
    selectedOfferingIds.value = []
    selectedReceivingIds.value = []
  }

  function buildTradePayload() {
    const cards = [
      ...selectedOfferingIds.value.map(id => ({
        cardId: id,
        type: 'OFFERING' as const,
      })),
      ...selectedReceivingIds.value.map(id => ({
        cardId: id,
        type: 'RECEIVING' as const,
      })),
    ]

    return { cards }
  }

  async function handleCreateTrade() {
    if (creatingTrade.value) return false

    if (!isTradeValid.value) {
      toast.warning('Selecione ao menos uma carta para oferecer e uma para receber.')
      return false
    }

    try {
      creatingTrade.value = true
      await createTrade(buildTradePayload())

      toast.success('Troca criada com sucesso!')
      resetSelection()
      options?.onSuccess?.()

      return true
    } catch (err) {
      console.error('handleCreateTrade error:', err)
      toast.error('Não foi possível criar a troca. Tente novamente.')
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
    resetSelection,
  }
}
