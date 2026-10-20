import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const providersFilePath = path.resolve(__dirname, '../../data/providers.json');

function ensureDataFile() {
  const dir = path.dirname(providersFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(providersFilePath)) {
    fs.writeFileSync(providersFilePath, '[]', 'utf-8');
  }
}

function readProviders() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(providersFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[LYNX API] Error reading providers.json:', err);
    return [];
  }
}

function writeProviders(providers) {
  ensureDataFile();
  try {
    fs.writeFileSync(providersFilePath, JSON.stringify(providers, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[LYNX API] Error writing providers.json:', err);
    return false;
  }
}

export function lynxApiPlugin() {
  const handleApiRequest = (req, res, next) => {
    // Only intercept requests starting with /api/
    if (!req.url.startsWith('/api/')) {
      return next();
    }

    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;

    // Set standard JSON and no-cache headers
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    // 1. GET /api/providers
    if (pathname === '/api/providers' && req.method === 'GET') {
      const providers = readProviders();
      res.statusCode = 200;
      return res.end(JSON.stringify(providers));
    }

    // 2. POST /api/providers (Upsert provider or sync array)
    if (pathname === '/api/providers' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          let current = readProviders();

          if (Array.isArray(payload)) {
            current = payload;
          } else if (payload && typeof payload === 'object' && payload.id) {
            const index = current.findIndex(p => p.id === payload.id);
            if (index >= 0) {
              current[index] = { ...current[index], ...payload };
            } else {
              current = [payload, ...current];
            }
          } else {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Formato de datos de trabajador inválido' }));
          }

          writeProviders(current);
          res.statusCode = 201;
          return res.end(JSON.stringify({ success: true, count: current.length, providers: current }));
        } catch (err) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'JSON malformado en la petición' }));
        }
      });
      return;
    }

    // 3. POST /api/providers/:id/reviews
    const reviewMatch = pathname.match(/^\/api\/providers\/([^/]+)\/reviews$/);
    if (reviewMatch && req.method === 'POST') {
      const providerId = decodeURIComponent(reviewMatch[1]);
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const review = JSON.parse(body);
          let current = readProviders();
          const index = current.findIndex(p => p.id === providerId);

          if (index === -1) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Trabajador no encontrado' }));
          }

          const provider = current[index];
          const updatedReviews = [review, ...(provider.reviews || [])];
          const total = updatedReviews.length;
          const sumRatings = updatedReviews.reduce((acc, r) => acc + (Number(r.ratingOverall) || 0), 0);
          const avgRating = total > 0 ? parseFloat((sumRatings / total).toFixed(1)) : null;

          const updatedProvider = {
            ...provider,
            reviews: updatedReviews,
            totalReviews: total,
            rating: avgRating
          };

          current[index] = updatedProvider;
          writeProviders(current);

          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true, provider: updatedProvider, providers: current }));
        } catch (err) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'JSON malformado para la reseña' }));
        }
      });
      return;
    }

    // 4. DELETE /api/providers/:id
    const deleteMatch = pathname.match(/^\/api\/providers\/([^/]+)$/);
    if (deleteMatch && req.method === 'DELETE') {
      const providerId = decodeURIComponent(deleteMatch[1]);
      let current = readProviders();
      const initialLen = current.length;
      current = current.filter(p => p.id !== providerId);

      writeProviders(current);
      res.statusCode = 200;
      return res.end(JSON.stringify({ 
        success: true, 
        deletedId: providerId, 
        deleted: current.length < initialLen, 
        providers: current 
      }));
    }

    // Default 404 for unknown /api/* endpoints
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
  };

  return {
    name: 'lynx-api-backend-plugin',
    configureServer(server) {
      server.middlewares.use(handleApiRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApiRequest);
    }
  };
}
