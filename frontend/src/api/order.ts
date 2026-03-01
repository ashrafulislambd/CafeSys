import { orderClient } from './client'

export async function placeOrder(quantity: number) {
  const { data } = await orderClient.post<{ success?: string; error?: string }>('/order', {
    quantity,
  })
  return data
}
