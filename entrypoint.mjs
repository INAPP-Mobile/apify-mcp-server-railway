// Railway entrypoint for Apify MCP Server
// Adds a health check endpoint and binds to 0.0.0.0 for Railway compatibility

import { createExpressApp } from './dist/dev_server.js';

const PORT = Number(process.env.PORT) || 3001;
const HOST = '0.0.0.0';

const app = createExpressApp();

// Add a health check that responds before MCP session logic
// The dev server's GET / returns 404 without a session, which breaks Railway health checks
app.use((req, res, next) => {
  if (req.method === 'GET' && (req.path === '/' || req.path === '/health')) {
    // Only handle as health check if no MCP session header is present
    if (!req.headers['mcp-session-id']) {
      res.status(200).json({ status: 'ok', service: 'apify-mcp-server' });
      return;
    }
  }
  next();
});

app.listen(PORT, HOST, () => {
  console.log(`Apify MCP Server listening on ${HOST}:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
