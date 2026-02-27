export interface UserCard {
  id: string
  name: string
  description: string
  imageUrl: string
  createdAt: string
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary'
}
