# Apify MCP Server

![Apify MCP Server](https://raw.githubusercontent.com/apify/apify-mcp-server/refs/heads/master/docs/apify_mcp_server_dark_background.png)

Self-host the [Apify MCP Server](https://github.com/apify/apify-mcp-server) on Railway. This gives your AI assistants (Claude, Cursor, Windsurf, etc.) access to thousands of Apify Actors for web scraping, data extraction, and automation — via the Model Context Protocol (MCP).

## Features

- **Hosted MCP endpoint** — Exposes Apify's MCP server via Streamable HTTP transport on a Railway public URL
- **Thousands of Actors** — Access the full [Apify Store](https://apify.com/store) of scrapers and automations
- **Authentication** — Token-based auth via your Apify API token
- **Zero configuration** — Deploy with just your Apify API token

## How it works

The Apify MCP Server provides a standardized MCP interface to the Apify platform. AI assistants use MCP tools to:

- **Search & discover** Actors in the Apify Store
- **Run Actors** with custom input — scrape Google, Amazon, Twitter, TikTok, and hundreds more
- **Get results** — retrieve and inspect Actor run outputs
- **Manage datasets** and scheduled tasks

This Railway deployment runs the server with Streamable HTTP transport, making it accessible to any MCP-compatible client.

## Getting an Apify API Token

1. Sign up or log in at [console.apify.com](https://console.apify.com)
2. Go to **Settings → Integrations** (or [direct link](https://console.apify.com/settings/integrations))
3. Click **Create token** and copy the value
4. Paste it as the `APIFY_TOKEN` variable when deploying this template

## Usage

### Configuring MCP Clients

Once deployed, add the server to any MCP-compatible client.

#### Claude Desktop

Edit `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "apify": {
      "type": "streamable-http",
      "url": "https://<your-railway-url>.railway.app/",
      "headers": {
        "Authorization": "Bearer <apify-token>"
      }
    }
  }
}
```

Replace `<your-railway-url>` with your Railway deployment URL and `<apify-token>` with your Apify API token.

#### Cursor / Windsurf

Add the MCP server in the MCP configuration panel:

| Field | Value |
|-------|-------|
| Type | `streamable-http` |
| URL | `https://<your-railway-url>.railway.app/` |
| Headers | `{"Authorization": "Bearer <apify-token>"}` |

#### Any MCP Client

Use the Streamable HTTP transport pointing to your Railway URL with the `Authorization: Bearer <token>` header.

### Available Tools

The server exposes tools for every Actor in the Apify Store. Key categories include:

- **E-commerce** — Amazon, eBay, Shopify product data
- **Social Media** — Twitter, TikTok, Instagram, Reddit
- **Search Engines** — Google, Bing, Yandex
- **Business** — LinkedIn, Crunchbase, Google Maps
- **News & Media** — News sites, RSS, YouTube
- **Developer tools** — GitHub, NPM, Docker Hub

Full list: [apify.com/store](https://apify.com/store)

## Dependencies for Apify MCP Server

### Deployment Dependencies

- **Apify API Token** — Required for authentication to the Apify platform. Get it from [console.apify.com/settings/integrations](https://console.apify.com/settings/integrations)
- **Node.js 24** — The server runs on Node 24 (Alpine) for optimal performance

## Technical Details

- **Transport**: Streamable HTTP (MCP specification)
- **Server package**: [`@apify/actors-mcp-server`](https://www.npmjs.com/package/@apify/actors-mcp-server) v0.13.0
- **Source**: [github.com/apify/apify-mcp-server](https://github.com/apify/apify-mcp-server)
- **Default port**: `8080` (overridable via `PORT` env var)

## Resources

- [Apify MCP Server Documentation](https://docs.apify.com/integrations/mcp)
- [Apify Store](https://apify.com/store)
- [MCP Specification](https://modelcontextprotocol.io)
