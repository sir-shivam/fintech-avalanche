import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env': process.env, // Ensures environment variables work correctly
  },
  build: {
    sourcemap: false,
  },
  server: {
    port: 3000, // Change if needed
  },
})
