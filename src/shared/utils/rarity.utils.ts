export type CardRarity =
  | 'common'
  | 'rare'
  | 'epic'
  | 'legendary'

export function getCardRarity(cardId: string): CardRarity {
  let hash = 0

  for (let i = 0; i < cardId.length; i++) {
    hash = cardId.charCodeAt(i) + ((hash << 5) - hash)
  }

  const value = Math.abs(hash) % 100

  if (value > 95) return 'legendary'
  if (value > 75) return 'epic'
  if (value > 40) return 'rare'

  return 'common'
}
