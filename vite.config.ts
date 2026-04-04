import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage } from 'http';
import path from 'path';
import { defineConfig } from 'vite';

async function readRequestBody(req: IncomingMessage) {
  return await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    req.on('error', reject);
  });
}

function localApiPlugin() {
  const routes = new Map([
    ['/api/generate-images', './api/generate-images.ts'],
    ['/api/generate-listing', './api/generate-listing.ts'],
    ['/api/generate-keywords', './api/generate-keywords.ts'],
    ['/api/generate-shipping', './api/generate-shipping.ts'],
  ]);

  return {
    name: 'local-api-routes',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const route = routes.get(req.url || '');
        if (!route) {
          next();
          return;
        }

        try {
          req.body = await readRequestBody(req);
          const module = await import(new URL(route, import.meta.url).href);
          await module.default(req, res);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Local API route failed';
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: message }));
            return;
          }
          next(error);
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss(), localApiPlugin()],
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
