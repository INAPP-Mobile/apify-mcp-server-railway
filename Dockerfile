# Stage 1: Build the Apify MCP Server from source
FROM node:24-alpine AS builder

RUN corepack enable

WORKDIR /app

# Clone the repo at the latest stable release
RUN apk add --no-cache git && \
    git clone --depth 1 --branch v0.13.0 https://github.com/apify/apify-mcp-server.git . && \
    rm -rf .git

# Install all dependencies (dev + prod)
RUN pnpm install --frozen-lockfile

# Build the project (tsc -b src)
RUN pnpm run build

# Stage 2: Runtime image
FROM node:24-alpine

RUN corepack enable

WORKDIR /app

# Copy the full build for pnpm deploy
COPY --from=builder /app /build

# Deploy production dependencies only
RUN cd /build && pnpm deploy --legacy --filter "@apify/actors-mcp-server" --prod /app && rm -rf /build

# Copy compiled output and runtime assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.json ./
COPY --from=builder /app/package.json ./

# Copy Railway entrypoint wrapper
COPY entrypoint.mjs ./

# Railway provides PORT env var; the dev server reads it (default 3001)
EXPOSE 8080

# Run via entrypoint that adds health check and binds to 0.0.0.0
ENTRYPOINT ["node", "entrypoint.mjs"]
