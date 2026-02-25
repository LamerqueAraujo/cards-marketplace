export interface TradeCardModel {
  id: string
  userName: string
  userId: string
  createdAt: string
  offering: {
    id: string
    name: string
    imageUrl: string
  }[]
  receiving: {
    id: string
    name: string
    imageUrl: string
  }[]
}
