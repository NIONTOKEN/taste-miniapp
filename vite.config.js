import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process'],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.jpg', 'icons/*.png', 'offline.html'],
      manifest: {
        name: 'TASTE Token — Gastronomy on TON',
        short_name: 'TASTE',
        description: 'Community-driven gastronomy token on the TON blockchain. Join the TASTE community and be part of the culinary revolution.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'en',
        categories: ['finance', 'utilities'],
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB limit
        runtimeCaching: [
          // Supabase API - NetworkFirst (güncel veri önemli)
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 dakika
              },
            },
          },
          // TON blockchain - NetworkOnly (kesinlikle cache yapma)
          {
            urlPattern: /^https:\/\/(.*\.ton\.org|.*\.orbs\.com|.*\.toncenter\.com)\/.*/i,
            handler: 'NetworkOnly',
          },
          // TonConnect - NetworkOnly
          {
            urlPattern: /^https:\/\/bridge\.tonapi\.io\/.*/i,
            handler: 'NetworkOnly',
          },
          // Harici görseller - CacheFirst
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 gün
              },
            },
          },
          // Video dosyaları - CacheFirst (precache'de değil, runtime'da)
          {
            urlPattern: /\.(?:mp4|webm|ogg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'video-cache',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 gün
              },
              rangeRequests: true,
            },
          },
          // Google Fonts - CacheFirst
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 yıl
              },
            },
          },
        ],
        // Offline fallback
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/tonconnect-manifest\.json/],
      },
      devOptions: {
        enabled: false, // dev'de service worker kapalı (debugging kolaylaşır)
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'ton-core': ['@ton/core', '@ton/crypto'],
          'tonconnect': ['@tonconnect/ui-react'],
          'react-vendor': ['react', 'react-dom'],
          'framer': ['framer-motion'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
})
