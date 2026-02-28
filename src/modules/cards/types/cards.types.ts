import type { BaseCard } from "../../../shared/types/card.types"

export interface UserCard extends BaseCard {
  id: string
  name: string
  description: string
  imageUrl: string
  createdAt: string
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary'
}
