import type { Trade } from '../types/trade.types'
import type { TradeCardModel } from '../types/trade-card.model.types'

export function mapTradeToCardModel(trade: Trade): TradeCardModel {
  const offering = trade.tradeCards
    .filter(tc => tc.type === 'OFFERING')
    .map(tc => tc.card)

  const receiving = trade.tradeCards
    .filter(tc => tc.type === 'RECEIVING')
    .map(tc => tc.card)

  return {
    id: trade.id,
    userName: trade.user.name,
    userId: trade.userId,
    createdAt: trade.createdAt,
    offering,
    receiving
  }
}
