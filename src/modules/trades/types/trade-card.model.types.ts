import type { BaseCard } from 'src/shared/types/card.types'

export interface TradeCardModel {
  id: string
  userName: string
  userId: string
  createdAt: string
  offering: BaseCard[]
  receiving: BaseCard[]
}
