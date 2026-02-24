import { api } from 'boot/axios'
import type { GetTradesResponse } from '../types/trade.types'

export async function getTrades(page = 1, rpp = 10): Promise<GetTradesResponse> {
  const { data } = await api.get<GetTradesResponse>('/trades', {
    params: { page, rpp }
  })

  return data
}
