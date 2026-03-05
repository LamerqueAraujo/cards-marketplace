import { api } from 'boot/axios'
import type { UserCard } from '../types/cards.types'
import type { GetCardsResponse } from '../types/cards.response'

export async function getMyCards(): Promise<UserCard[]> {
  const { data } = await api.get('/me')
  return data.cards ?? []
}

export async function getCards(page = 1, rpp = 20): Promise<GetCardsResponse> {
  const { data } = await api.get<GetCardsResponse>('/cards', {
    params: { page, rpp },
  })
  return data
}

export async function getCardById(cardId: string): Promise<UserCard> {
  const { data } = await api.get<UserCard>(`/cards/${cardId}`)
  return data
}

export async function addCardsToUser(cardIds: string[]): Promise<void> {
  await api.post('/me/cards', { cardIds })
}
