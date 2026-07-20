/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          animations: ['framer-motion'],
          ui: ['lucide-react'],
          utils: ['date-fns', 'idb', 'zustand', 'axios', 'zod'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 18926,
    proxy: {
      '/api': {
        target: 'http://localhost:18925',
        changeOrigin: true,
      },
      '/status.json': {
        target: 'http://localhost:18925',
        changeOrigin: true,
      },
      '/breaking.json': {
        target: 'http://localhost:18925',
        changeOrigin: true,
      },
      '/rescan': {
        target: 'http://localhost:18925',
        changeOrigin: true,
      },
      '/feeds.json': {
        target: 'http://localhost:18925',
        changeOrigin: true,
      },
      '/bookmarks.json': {
        target: 'http://localhost:18925',
        changeOrigin: true,
      },
      '/upsc-feed.json': {
        target: 'http://localhost:18925',
        changeOrigin: true,
      },
      '/api/earnings.json': {
        target: 'http://localhost:18925',
        changeOrigin: true,
      },
      '/api/economy-brief.json': {
        target: 'http://localhost:18925',
        changeOrigin: true,
      },
      '/api/pipeline-health.json': {
        target: 'http://localhost:18925',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
  },
});