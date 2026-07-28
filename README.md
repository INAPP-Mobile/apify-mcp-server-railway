# Apify MCP Server

![Apify MCP Server](https://raw.githubusercontent.com/apify/apify-mcp-server/refs/heads/master/docs/apify_mcp_server_dark_background.png)

Self-host the [Apify MCP Server](https://github.com/apify/apify-mcp-server) on Railway. This gives your AI assistants (Claude, Cursor, Windsurf, etc.) access to thousands of Apify Actors for web scraping, data extraction, and automation — via the Model Context Protocol (MCP).

## Deploy and Host

Deploy the Apify MCP Server on Railway with a single click. The template provisions a Node.js server that exposes Apify's MCP interface via Streamable HTTP transport, ready for any MCP-compatible client.

## Dependencies for

- **Apify API token** — Required for authentication. Get one at [console.apify.com](https://console.apify.com/settings/integrations)
- **MCP-compatible client** — Claude Desktop, Cursor, Windsurf, or any client supporting MCP Streamable HTTP

### Deployment Dependencies

Railway handles all infrastructure — no server management needed. The template uses the NIXPACKS builder with Node.js and npm dependencies declared in `package.json`.

## About Hosting

This service runs on Railway's infrastructure using the NIXPACKS builder. It requires an Apify API token for authentication. Once deployed, Railway assigns a public HTTPS URL that serves as your MCP endpoint.

## Why Deploy

- **Thousands of Actors** — Access the full [Apify Store](https://apify.com/store) of scrapers and automations  
- **Bearer auth** — Secure your endpoint with your Apify API token  
- **Zero configuration** — Deploy with just your APIFY_TOKEN  
- **Always-on endpoint** — Your MCP server stays available whenever you need it  

## Common Use Cases

- **Web research** — Give Claude the ability to scrape Google, Amazon, Twitter, TikTok, and hundreds more  
- **Data extraction** — Run Apify Actors on demand via MCP tools  
- **AI assistant integration** — Connect Claude Desktop, Cursor, Windsurf, or any MCP client  
- **Automated monitoring** — Schedule recurring scrapes through Apify's platform  

## How it works

The Apify MCP Server provides a standardized MCP interface to the Apify platform. AI assistants use MCP tools to:

- **Search & discover** Actors in the Apify Store
- **Run Actors** with custom input
- **Get results** — retrieve and inspect Actor run outputs
- **Manage datasets** and scheduled tasks

This Railway deployment runs the server with Streamable HTTP transport, making it accessible to any MCP-compatible client over HTTPS.

## Getting an Apify API Token

1. Sign up or log in at [console.apify.com](https://console.apify.com)
2. Go to **Settings → Integrations** (or [direct link](https://console.apify.com/settings/integrations))
3. Click **Create token** and copy the value
4. Use it as the `APIFY_TOKEN` variable when deploying this template

## Usage

### Configuring MCP Clients

Once deployed, add the server to any MCP-compatible client.

#### Claude Desktop

Edit `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "apify": {
      "url": "https://your-railway-url.up.railway.app",
      "headers": {
        "Authorization": "Bearer YOUR_APIFY_TOKEN"
      }
    }
  }
}
```

Replace `YOUR_APIFY_TOKEN` with your actual Apify API token.

#### Cursor / Windsurf / Other Clients

Use the same URL and Bearer token pattern to configure your MCP client of choice.

### Testing the endpoint

```bash
curl -X POST https://your-railway-url.up.railway.app/health
# {"status": "ok", "service": "apify-mcp-server"}
```

## Environment Variables

| Variable       | Required | Description |
|---------------|----------|-------------|
| `APIFY_TOKEN` | Yes      | Your Apify API token. Get it from [Apify Console](https://console.apify.com/settings/integrations) |

## Resources

- [Apify MCP Server GitHub](https://github.com/apify/apify-mcp-server)
- [Apify Store](https://apify.com/store)
- [Model Context Protocol](https://modelcontextprotocol.io)
