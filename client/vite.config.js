import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@firebase-config': path.resolve(__dirname, '../firebase/config.js'),
    },
  },
  server: {
    port: 5174,
  },
});
