import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  server: {
    proxy: {
      '/rss_bloom': {
        target: 'https://feeds.bloomberg.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss/, '/markets/news.rss'),
      },
      '/rss_nytimes': {
        target: 'https://rss.nytimes.com',
        changeOrigin: true,
        rewrite: () => '/services/xml/rss/nyt/Business.xml',
      },
      '/rss_yahoo': {
        target: 'https://feeds.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/rss/,
            '/rss/2.0/headline?s=^GSPC,^DJI,^IXIC&region=US&lang=en-US',
          ),
      },
      '/rss_habr': {
        target: 'https://habr.com/ru',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/rss/, '/rss/articles/top/daily/?fl=ru'),
      },
    },
  },
});
