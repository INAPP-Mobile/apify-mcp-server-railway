# Apify MCP Server on Railway
# Uses the published npm package @apify/actors-mcp-server

FROM node:24-alpine AS builder

RUN corepack enable

WORKDIR /app

# Create minimal workspace files for pnpm install
RUN mkdir -p src/web
COPY <<'EOF' ./package.json
{
  "name": "apify-mcp-server-railway",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.11.0",
  "dependencies": {
    "@apify/actors-mcp-server": "0.13.0",
    "express": "^4.21.2",
    "@modelcontextprotocol/sdk": "1.29.0"
  }
}
EOF

COPY <<'EOF' ./pnpm-workspace.yaml
packages:
  - '.'
  - 'src/web'
EOF

COPY <<'EOF' ./src/web/package.json
{
  "name": "@apify/mcp-web-widget",
  "version": "0.0.0",
  "private": true
}
EOF

# Generate lockfile
RUN pnpm install --frozen-lockfile 2>/dev/null; pnpm install

# Stage 2: Runtime
FROM node:24-alpine

RUN corepack enable

WORKDIR /app

# Copy installed packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Copy the entrypoint
COPY entrypoint.mjs ./

EXPOSE 8080

ENTRYPOINT ["node", "entrypoint.mjs"]
