import { api } from 'boot/axios'
import type { LoginPayload, LoginResponse } from '../types/auth.types'

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/login', payload)
  return data
}
