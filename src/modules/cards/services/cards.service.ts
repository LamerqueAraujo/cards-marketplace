import { api } from 'boot/axios'
import type { UserCard } from '../types/cards.types'

export async function getMyCards(): Promise<UserCard[]> {
  const { data } = await api.get<UserCard[]>('/me/cards')
  return data
}
