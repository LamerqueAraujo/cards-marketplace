import { ref } from 'vue'
import { getCards, getMyCards, addCardsToUser } from '../services/cards.service'
import type { UserCard } from '../types/cards.types'
import type { GetCardsResponse } from '../types/cards.response'

export function useMyCards() {
  const myCards = ref<UserCard[]>([])
  const availableCards = ref<UserCard[]>([])
  const loading = ref(false)
  const loadingAvailable = ref(false)
  const error = ref('')
  const availableError = ref('')
  const addError = ref('')

  const selectedCardIds = ref<string[]>([])
  const addingCards = ref(false)

  async function fetchMyCards() {
    try {
      loading.value = true
      error.value = ''
      myCards.value = await getMyCards()
    } catch {
      error.value = 'Não foi possível carregar suas cartas.'
    } finally {
      loading.value = false
    }
  }

  async function fetchAvailableCards() {
    try {
      loadingAvailable.value = true
      availableError.value = ''
      const response: GetCardsResponse = await getCards()
      availableCards.value = response.list
    } catch {
      availableError.value = 'Não foi possível carregar as cartas disponíveis.'
    } finally {
      loadingAvailable.value = false
    }
  }

  function resetSelection() {
    selectedCardIds.value = []
    addError.value = ''
  }

  function toggleCardSelection(cardId: string) {
    if (selectedCardIds.value.includes(cardId)) {
      selectedCardIds.value = selectedCardIds.value.filter((id) => id !== cardId)
      return
    }

    selectedCardIds.value = [...selectedCardIds.value, cardId]
  }

  async function addSelectedCards(): Promise<boolean> {
    if (!selectedCardIds.value.length) return false

    try {
      addingCards.value = true
      addError.value = ''

      await addCardsToUser(selectedCardIds.value)
      await fetchMyCards()

      resetSelection()
      return true
    } catch {
      addError.value = 'Não foi possível adicionar as cartas à sua coleção.'
      return false
    } finally {
      addingCards.value = false
    }
  }

  return {
    myCards,
    availableCards,
    loading,
    loadingAvailable,
    error,
    availableError,
    addError,
    selectedCardIds,
    addingCards,
    fetchMyCards,
    fetchAvailableCards,
    toggleCardSelection,
    addSelectedCards,
    resetSelection
  }
}
