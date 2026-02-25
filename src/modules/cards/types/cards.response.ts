import type { UserCard } from './cards.types'

export interface GetCardsResponse {
  list: UserCard[]
  rpp: number
  page: number
  more: boolean
}
