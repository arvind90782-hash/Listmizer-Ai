import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('react-router')) return 'router';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('@google/genai')) return 'gemini';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('motion')) return 'motion';
            if (id.includes('sonner')) return 'sonner';
            if (id.includes('react-razorpay')) return 'razorpay';
            return 'vendor';
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Re-enable file watching only when you need hot reload locally.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
