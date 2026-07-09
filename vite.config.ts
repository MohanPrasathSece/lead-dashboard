import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to mock Vercel API routes during local development
const vercelApiMock = () => ({
  name: 'vercel-api-mock',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url?.startsWith('/api/')) {
        try {
          const route = req.url.split('?')[0].replace('/api/', '');
          // Need to load environment variables manually for backend code in Vite
          const env = loadEnv('', process.cwd(), '');
          Object.assign(process.env, env);

          const module = await server.ssrLoadModule(`/api/${route}.ts`);

          // Parse JSON body for POST requests
          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            let body = '';
            req.on('data', (chunk: any) => body += chunk.toString());
            await new Promise((resolve) => req.on('end', resolve));
            if (body) {
              try { req.body = JSON.parse(body); } catch (e) {}
            }
          }

          // Mock Vercel res methods
          res.status = (code: number) => { res.statusCode = code; return res; };
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          await module.default(req, res);
        } catch (e: any) {
          console.error('[API Mock Error]', e);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e.message }));
        }
        return;
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), vercelApiMock()],
})
