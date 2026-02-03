import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base relativa './' permite que la app funcione en cualquier subruta (como /nombre-repo/)
  base: './',
})
