import { defineConfig } from 'vite';
export default defineConfig({ base: './', server: { port: 5173, strictPort: true }, build: { chunkSizeWarningLimit:650,rollupOptions: { output: { manualChunks: { three: ['three'] } } } } });
