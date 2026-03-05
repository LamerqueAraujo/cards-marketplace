import { ref } from 'vue'
import { getCards, getMyCards, addCardsToUser } from '../services/cards.service'
import { useToast } from 'src/shared/ui/notification/composables/useToast'

import type { UserCard } from '../types/cards.types'
import type { GetCardsResponse } from '../types/cards.response'

export function useMyCards() {
  const toast = useToast()

  const myCards = ref<UserCard[]>([])
  const availableCards = ref<UserCard[]>([])

  const loading = ref(false)
  const loadingAvailable = ref(false)

  const error = ref('')
  const availableError = ref('')
  const addError = ref('')

  const selectedCardIds = ref<string[]>([])
  const addingCards = ref(false)

  async function fetchMyCards(options?: { silent?: boolean }) {
    try {
      loading.value = true
      error.value = ''

      myCards.value = await getMyCards()
    } catch (err) {
      console.error('Erro ao carregar cartas do usuário', err)

      error.value = 'Não foi possível carregar suas cartas.'

      if (!options?.silent) {
        toast.error('Não foi possível carregar suas cartas.')
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchAvailableCards(options?: { silent?: boolean }) {
    try {
      loadingAvailable.value = true
      availableError.value = ''

      const response: GetCardsResponse = await getCards()

      availableCards.value = response.list
    } catch (err) {
      console.error('Erro ao carregar cartas disponíveis', err)

      availableError.value = 'Não foi possível carregar as cartas disponíveis.'

      if (!options?.silent) {
        toast.error('Não foi possível carregar as cartas disponíveis.')
      }
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
    if (!selectedCardIds.value.length) {
      toast.warning('Selecione ao menos uma carta.')
      return false
    }

    try {
      addingCards.value = true
      addError.value = ''

      await addCardsToUser(selectedCardIds.value)

      toast.success('Cartas adicionadas à sua coleção!')

      await fetchMyCards({ silent: true })

      resetSelection()

      return true
    } catch (err) {
      console.error('Erro ao adicionar cartas ao usuário', err)

      addError.value = 'Não foi possível adicionar as cartas.'

      toast.error('Não foi possível adicionar as cartas à sua coleção.')

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
