import { api } from 'boot/axios'
import type { GetTradesResponse } from '../types/trade.types'

export async function getTrades(
  page = 1,
  rpp = 10
): Promise<GetTradesResponse> {
  const { data } = await api.get<GetTradesResponse>('/trades', {
    params: { page, rpp }
  })

  return data
}

export async function createTrade(payload: {
  cards: { cardId: string; type: 'OFFERING' | 'RECEIVING' }[]
}) {
  const { data } = await api.post('/trades', payload)
  return data
}

export async function deleteTrade(tradeId: string) {
  await api.delete(`/trades/${tradeId}`)
}

export async function completeTrade(
  tradeId: string,
  selectedCardIds: string[]
) {
  await api.post(`/trades/${tradeId}/complete`, {
    selectedCardIds
  })
}
