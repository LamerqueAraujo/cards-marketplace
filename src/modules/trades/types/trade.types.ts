export interface TradeCard {
  id: string
  cardId: string
  tradeId: string
  type: 'OFFERING' | 'RECEIVING'
  card: {
    id: string
    name: string
    description: string
    imageUrl: string
    createdAt: string
  }
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
