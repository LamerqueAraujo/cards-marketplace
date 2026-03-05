import { api } from 'boot/axios'
import type { UserCard } from '../types/cards.types'
import type { GetCardsResponse } from '../types/cards.response'
import { fetchWithCache } from 'src/shared/utils/fetchWithCache'
import { invalidateByTag } from 'src/shared/utils/cache'

export async function getMyCards(): Promise<UserCard[]> {
  const data = await fetchWithCache(
    'me:profile',
    async () => {
      const res = await api.get('/me')
      return res.data as { cards?: UserCard[] }
    },
    { ttlMs: 30_000, tags: ['me:cards'] }
  )

  return data.cards ?? []
}

export async function getCards(page = 1, rpp = 20): Promise<GetCardsResponse> {
  return fetchWithCache(
    `cards:list:${page}:${rpp}`,
    async () => {
      const { data } = await api.get<GetCardsResponse>('/cards', { params: { page, rpp } })
      return data
    },
    { ttlMs: 10 * 60_000, tags: ['cards:list'] }
  )
}

export async function addCardsToUser(cardIds: string[]): Promise<void> {
  await api.post('/me/cards', { cardIds })
  invalidateByTag('me:cards')
}
