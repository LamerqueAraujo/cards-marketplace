import type { BaseCard } from "../../../shared/types/card.types"

export interface TradeCard {
  id: string
  cardId: string
  tradeId: string
  type: 'OFFERING' | 'RECEIVING'
  card: BaseCard
}

export interface Trade {
  id: string
  userId: string
  createdAt: string
  user: {
    name: string
  }
  tradeCards: TradeCard[]
}

export interface GetTradesResponse {
  list: Trade[]
  rpp: number
  page: number
  more: boolean
}
