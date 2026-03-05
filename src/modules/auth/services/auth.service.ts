import { api } from 'boot/axios'
import type { LoginPayload, LoginResponse, RegisterPayload } from '../types/auth.types'
import { isAxiosError } from 'src/shared/utils/http.utils'

type ApiErrorBody = {
  message?: string
  error?: string
  statusCode?: number
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
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
  } catch (error: unknown) {
    if (isAxiosError<ApiErrorBody>(error)) {
      const status = error.response?.status
      const msg = (error.response?.data?.message ?? '').toLowerCase()

      const alreadyExists =
        status === 409 ||
        msg.includes('already exists') ||
        msg.includes('user already exists') ||
        msg.includes('email already exists')

      if (alreadyExists) throw new Error('EMAIL_ALREADY_EXISTS')
    }

    throw new Error('REGISTER_FAILED')
  }
}
