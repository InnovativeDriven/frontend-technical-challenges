/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 9040 },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' }
    }
  },
  test: {
    environment: 'node'
  }
});
