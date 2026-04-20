import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: '..',
  server: {
    port: 3001,
    proxy: {
      '/': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        bypass(req) {
          // Serve SPA for browser navigation requests
          if (req.headers.accept?.includes('text/html')) {
            return '/index.html';
          }
          // Let Vite handle its own internal routes and source files
          const path = req.url?.split('?')[0] ?? '';
          if (path.startsWith('/@') || path.startsWith('/__') || path.startsWith('/src/') || /\.\w+$/.test(path)) {
            return req.url;
          }
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import'],
      },
    },
  },
  build: {
    outDir: 'build',
  },
});
