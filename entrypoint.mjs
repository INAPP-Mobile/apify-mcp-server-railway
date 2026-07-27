// Railway entrypoint for Apify MCP Server
// Adds a health check endpoint and patches the bind address

// Patch process.env before the dev server loads
process.env.BIND_ADDRESS = '0.0.0.0';

import { createExpressApp } from './dev_server.js';

const PORT = Number(process.env.PORT) || 3001;
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Apify MCP Server listening on 0.0.0.0:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
