# Apify MCP Server on Railway
FROM node:24-alpine AS builder

RUN corepack enable

WORKDIR /app

# Create package.json
RUN echo '{"name":"apify-mcp-server-railway","version":"1.0.0","private":true,"type":"module","packageManager":"pnpm@11.11.0","dependencies":{"@apify/actors-mcp-server":"0.13.0","express":"^4.21.2","@modelcontextprotocol/sdk":"1.29.0"}}' > /app/package.json

# Create pnpm workspace config
RUN echo 'packages:\n  - "."\n  - "src/web"' > /app/pnpm-workspace.yaml

# Create web widget package.json
RUN mkdir -p /app/src/web && echo '{"name":"@apify/mcp-web-widget","version":"0.0.0","private":true}' > /app/src/web/package.json

# Install dependencies
RUN pnpm install

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
