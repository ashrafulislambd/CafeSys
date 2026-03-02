import { stockClient } from './client'

export interface StockStatus {
  key: string
  value: number
}

export async function getStockStatus(): Promise<StockStatus> {
  const { data } = await stockClient.get<StockStatus>('/status')
  return data
}

export async function setStock(quantity: number): Promise<{ success?: string; error?: string }> {
  const { data } = await stockClient.post<{ success?: string; error?: string }>('/setstock', {
    quantity,
  })
  return data
}
