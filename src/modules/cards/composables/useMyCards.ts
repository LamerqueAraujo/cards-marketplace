import { ref } from 'vue'
import {
  getCards,
  getMyCards,
  addCardsToUser
} from '../services/cards.service'
import type { UserCard } from '../types/cards.types'
import type { GetCardsResponse } from '../types/cards.response'

export function useMyCards() {
  const myCards = ref<UserCard[]>([])
  const availableCards = ref<UserCard[]>([])

  const loading = ref(false)
  const loadingAvailable = ref(false)

  const error = ref('')
  const availableError = ref('')

  const selectedCardIds = ref<string[]>([])
  const addingCards = ref(false)

  async function fetchMyCards() {
    try {
      loading.value = true
      error.value = ''
      myCards.value = await getMyCards()
    } catch {
      error.value = 'Erro ao carregar suas cartas'
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
      availableError.value = 'Erro ao carregar cartas disponíveis'
    } finally {
      loadingAvailable.value = false
    }
  }

  function toggleCardSelection(cardId: string) {
    selectedCardIds.value = selectedCardIds.value.includes(cardId)
      ? selectedCardIds.value.filter(id => id !== cardId)
      : [...selectedCardIds.value, cardId]
  }

  async function addSelectedCards(): Promise<boolean> {
    if (!selectedCardIds.value.length) return false

    try {
      addingCards.value = true
      await addCardsToUser(selectedCardIds.value)
      await fetchMyCards()
      selectedCardIds.value = []
      return true
    } catch {
      error.value = 'Erro ao adicionar cartas'
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
    selectedCardIds,
    addingCards,
    fetchMyCards,
    fetchAvailableCards,
    toggleCardSelection,
    addSelectedCards
  }
}
