import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ceylon-software-hub-server.vercel.app/api', // Backend development URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
      },
    },
  },
});

// http://localhost:5000/api

// https://ceylon-software-hub-server.vercel.app/api

// CgVercel.json
// ,
//   "env": {
//     "VITE_API_URL": "https://ceylon-software-hub-server.vercel.app/"
//   }