import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  server: {
    proxy: {
      '/rss': {
        target: 'https://feeds.bloomberg.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss/, '/markets/news.rss')
      }
    }
  }
})
