import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import replace from '@rollup/plugin-replace'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    replace({
      'process.env': JSON.stringify(import.meta.env)
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      path: 'path-browserify',
      url: 'url',
      'source-map': 'source-map-js',
    },
  },
  optimizeDeps: {
    include: ['path-browserify', 'url', 'source-map-js'],
  },
  build: {
    sourcemap: false,
  },
})
