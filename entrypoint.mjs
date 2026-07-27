// Railway entrypoint for Apify MCP Server
// Streamable HTTP transport using the published npm package

import express from 'express';
import { randomUUID } from 'node:crypto';
import { InMemoryTaskStore } from '@modelcontextprotocol/sdk/experimental/tasks/stores/in-memory.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

const { ActorsMcpServer } = await import('@apify/actors-mcp-server');

const PORT = Number(process.env.PORT) || 3001;
const HOST = '0.0.0.0';

// In-memory session store
const transports = {};

// Health check endpoint
function handleHealth(req, res) {
  res.status(200).json({ status: 'ok', service: 'apify-mcp-server' });
}

// Extract Bearer token from Authorization header
function extractToken(req, res) {
  const auth = req.headers['authorization'];
  if (!auth) {
    res.status(401).json({ error: 'Authorization header required' });
    return null;
  }
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    res.status(401).json({ error: 'Invalid Authorization format, expected: Bearer <token>' });
    return null;
  }
  return match[1];
}

async function main() {
  const app = express();
  app.use(express.json());

  // Health check — Railway pings this
  app.get(['/', '/health'], handleHealth);

  // MCP Streamable HTTP endpoint (POST)
  app.post('/', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];

    try {
      let transport;

      if (sessionId && transports[sessionId]) {
        // Reuse existing session
        transport = transports[sessionId];
        await transport.handleRequest(req, res, req.body);
        return;
      }

      // New session — requires auth token
      const apifyToken = extractToken(req, res);
      if (!apifyToken) return;

      const newSessionId = randomUUID();

      transport = new StreamableHTTPServerTransport({
        sessionId: newSessionId,
        streamableHttp: true,
      });
      transports[newSessionId] = transport;

      const taskStore = new InMemoryTaskStore();

      const mcpServer = new ActorsMcpServer({
        taskStore,
        setupSigintHandler: false,
        transportType: 'http',
        telemetry: {
          enabled: false,
        },
        token: apifyToken,
      });

      // Clean up on session close
      transport.onclose = () => {
        delete transports[newSessionId];
      };

      await mcpServer.connect(transport);
      res.setHeader('mcp-session-id', newSessionId);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      console.error('MCP request error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  app.listen(PORT, HOST, () => {
    console.log(`Apify MCP Server listening on ${HOST}:${PORT}`);
    console.log(`Health: http://${HOST}:${PORT}/health`);
    console.log(`MCP endpoint: http://${HOST}:${PORT}/ (POST)`);
  });
}

main().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
