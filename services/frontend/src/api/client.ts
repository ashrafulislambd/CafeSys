import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL ?? ''
const stockApiUrl = import.meta.env.VITE_STOCK_API_URL ?? ''

export const orderClient = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
})

export const stockClient = axios.create({
  baseURL: stockApiUrl,
})

export function getWsUrl(): string {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}/ws-notify`
}
