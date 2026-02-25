import { api } from 'boot/axios'
import type { GetTradesResponse, Trade } from '../types/trade.types'
import type { TradeCardModel } from '../types/trade-card.model'

export async function getTrades(page = 1, rpp = 10): Promise<GetTradesResponse> {
  const { data } = await api.get<GetTradesResponse>('/trades', {
    params: { page, rpp }
  })

  return data
}

export function mapTradeToCardModel(trade: Trade): TradeCardModel {
  const offering = trade.tradeCards
    .filter(tc => tc.type === 'OFFERING')
    .map(tc => ({
      id: tc.card.id,
      name: tc.card.name,
      imageUrl: tc.card.imageUrl
    }))

  const receiving = trade.tradeCards
    .filter(tc => tc.type === 'RECEIVING')
    .map(tc => ({
      id: tc.card.id,
      name: tc.card.name,
      imageUrl: tc.card.imageUrl
    }))

  return {
    id: trade.id,
    userName: trade.user.name,
    createdAt: trade.createdAt,
    offering,
    receiving
  }
}

export async function createTrade(payload: {
  cards: { cardId: string; type: 'OFFERING' | 'RECEIVING' }[]
}) {
  const { data } = await api.post('/trades', payload)
  return data
}
