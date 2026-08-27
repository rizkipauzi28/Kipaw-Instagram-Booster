import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Server-Side Real SMM Gateway API Proxy (Bypasses Browser CORS & Handles standard SMM v2 protocol)
  app.post('/api/smm/proxy', async (req, res) => {
    try {
      const { apiUrl, apiKey, action, service, link, quantity, order, comments, customParams } = req.body;

      if (!apiUrl) {
        return res.status(400).json({ error: 'Parameter apiUrl is required' });
      }

      const activeApiKey = (apiKey || process.env.INDOSMM_API_KEY || '').trim();
      if (!activeApiKey) {
        return res.status(400).json({ error: 'API Key is required to call SMM Gateway' });
      }

      const postParams: Record<string, string> = {
        key: activeApiKey,
        action: action || 'balance',
      };

      if (service) postParams.service = String(service);
      if (link) postParams.link = String(link);
      if (quantity) postParams.quantity = String(quantity);
      if (order) postParams.order = String(order);
      if (comments) postParams.comments = String(comments);

      if (customParams && typeof customParams === 'object') {
        Object.entries(customParams).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            postParams[k] = String(v);
          }
        });
      }

      const bodyPayload = new URLSearchParams(postParams);

      console.log(`[SMM Server Proxy] Forwarding to ${apiUrl} action: ${postParams.action}, service: ${postParams.service || 'N/A'}, link: ${postParams.link || 'N/A'}, qty: ${postParams.quantity || 'N/A'}`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'KIPAW-IG-Booster-Gateway/2.0',
          'Accept': 'application/json, text/plain, */*',
        },
        body: bodyPayload.toString(),
      });

      const rawText = await response.text();
      let responseData: any = null;

      try {
        responseData = JSON.parse(rawText);
      } catch (jsonErr) {
        responseData = { rawResponse: rawText };
      }

      console.log(`[SMM Server Proxy] Status ${response.status} Response:`, responseData);

      return res.status(response.status).json(responseData);
    } catch (err: any) {
      console.error('[SMM Server Proxy] Connection Error:', err);
      return res.status(500).json({
        error: `Gagal terhubung ke SMM Provider: ${err?.message || 'Network error'}`,
        details: err?.toString(),
      });
    }
  });

  // Dedicated endpoints
  app.post('/api/smm/balance', async (req, res) => {
    try {
      const { apiUrl, apiKey } = req.body;
      const targetUrl = apiUrl || 'https://indosmm.id/api/v2';
      const key = (apiKey || process.env.INDOSMM_API_KEY || 'be46a9d3f067bb66d308663fafb79758').trim();

      const bodyPayload = new URLSearchParams({ key, action: 'balance' });
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'KIPAW-IG-Booster-Gateway/2.0',
        },
        body: bodyPayload.toString(),
      });

      const data = await response.json();
      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/smm/services', async (req, res) => {
    try {
      const { apiUrl, apiKey } = req.body;
      const targetUrl = apiUrl || 'https://indosmm.id/api/v2';
      const key = (apiKey || process.env.INDOSMM_API_KEY || 'be46a9d3f067bb66d308663fafb79758').trim();

      const bodyPayload = new URLSearchParams({ key, action: 'services' });
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'KIPAW-IG-Booster-Gateway/2.0',
        },
        body: bodyPayload.toString(),
      });

      const data = await response.json();
      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
