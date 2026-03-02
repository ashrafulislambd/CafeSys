import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  appType: 'spa',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api-order': {
        target: 'http://order:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-order/, ''),
      },
      '/auth': {
        target: 'http://order:8000',
        changeOrigin: true,
      },
      '/api-stock': {
        target: 'http://stock:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-stock/, ''),
      },
      '/ws-notify': {
        target: 'http://notification:8765',
        ws: true,
        rewrite: (path) => path.replace(/^\/ws-notify/, ''),
      },
    },
  },
})
