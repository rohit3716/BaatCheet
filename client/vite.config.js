import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'baat-cheet.svg'],
      manifest: {
        name: 'BaatCheet Chat App',
        short_name: 'BaatCheet',
        description: 'A modern real-time chat application',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/baat-cheet.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/baat-cheet.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  server:{
    port:3000,
    proxy:{
      "/api":{
        target:"http://localhost:5001",
      }
    }
  }
})
