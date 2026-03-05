import { api } from 'boot/axios'
import type { GetTradesResponse } from '../types/trade.types'
import { fetchWithCache } from 'src/shared/utils/fetchWithCache'
import { invalidateByTag } from 'src/shared/utils/cache'

export async function getTrades(
  page = 1,
  rpp = 10
): Promise<GetTradesResponse> {
  const key = `trades:list?page=${page}&rpp=${rpp}`

  return fetchWithCache<GetTradesResponse>(
    key,
    async () => {
      const { data } = await api.get<GetTradesResponse>('/trades', {
        params: { page, rpp },
      })
      return data
    },
    {
      ttlMs: 30 * 1000,
      tags: ['trades:list'],
    }
  )
}

export async function createTrade(payload: {
  cards: { cardId: string; type: 'OFFERING' | 'RECEIVING' }[]
}) {
  const { data } = await api.post('/trades', payload)
  invalidateByTag('trades:list')
  return data
}

export async function deleteTrade(tradeId: string) {
  await api.delete(`/trades/${tradeId}`)
  invalidateByTag('trades:list')
}

export async function completeTrade(
  tradeId: string,
  selectedCardIds: string[]
) {
  await api.post(`/trades/${tradeId}/complete`, {
    selectedCardIds,
  })
}
