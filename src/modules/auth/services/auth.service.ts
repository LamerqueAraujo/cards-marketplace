import { api } from 'boot/axios'
import type { LoginPayload, LoginResponse, RegisterPayload } from '../types/auth.types'
import { isAxiosError } from 'src/shared/utils/http.utils'

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  try {
    const { data } = await api.post<LoginResponse>('/login', payload)
    return data
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 401) {
      throw new Error('INVALID_CREDENTIALS')
    }

    throw new Error('LOGIN_FAILED')
  }
}

export async function register(payload: RegisterPayload): Promise<void> {
  try {
    await api.post('/register', payload)
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 409) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }
    throw error
  }
}
