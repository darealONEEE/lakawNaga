import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'leaflet', 'react-leaflet'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
          'r3f-vendor': ['@react-three/fiber', '@react-three/drei'],
          'motion-vendor': ['framer-motion'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
