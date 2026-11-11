import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import apiRouter from './server/routes/index';
import { connectDB } from './server/config/db';
import { seedDatabase } from './server/data/seedData';

dotenv.config();

const app = express();
// Runtime port - AI Studio preview iframe requires port 3000
//const PORT = 3000;
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Mount API routes
app.use('/api', apiRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'CareerMind AI Intelligence Engine',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  try {
    // Initialize DB and Seed data
    await connectDB();
    seedDatabase();

    if (!isProduction) {
      // Dev mode: Mount Vite middleware
      const { createServer } = await import('vite');
      const vite = await createServer({
        server: {
          middlewareMode: true,
          hmr: false,
          watch: null,
        },
        appType: 'spa',
      });

      app.use(vite.middlewares);

      // Dev SPA fallback for client routes
      app.use('*', async (req, res, next) => {
        const url = req.originalUrl;
        if (url.startsWith('/api')) {
          return next();
        }
        try {
          const fs = await import('fs/promises');
          const indexPath = path.resolve(process.cwd(), 'index.html');
          let template = await fs.readFile(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    } else {
      // Production mode: Serve dist folder
      const distPath = path.resolve(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 CareerMind AI server is live on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('Fatal server startup error:', err);
    process.exit(1);
  }
}

startServer();
