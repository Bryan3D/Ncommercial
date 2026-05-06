# Naguabo Commercial MCP Server

This MCP (Model Context Protocol) server lets AI assistants like Claude Desktop manage the Naguabo Commercial store.

## Tools exposed

| Tool | Purpose |
|---|---|
| `get_inventory` | List products with stock levels (optional low-stock filter) |
| `update_stock_by_barcode` | RECEIVE / ADJUST / AUDIT stock changes by barcode or SKU |
| `get_sales_stats` | Daily, monthly, or 6-month forecast sales data |
| `search_products` | Search the catalog by name/description, optionally by category |
| `create_whatsapp_campaign` | Queue a WhatsApp ad campaign to opted-in customers |

## Install

```bash
cd mcp-server
npm install
```

The server uses the same Prisma client as the main app, so it expects `DATABASE_URL` in the environment.

## Run standalone

```bash
DATABASE_URL="postgresql://..." node server.js
```

## Wire up to Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "naguabo-commercial": {
      "command": "node",
      "args": ["/absolute/path/to/naguabo-commercial/mcp-server/server.js"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@host:5432/naguabo"
      }
    }
  }
}
```

After restarting Claude Desktop, you can ask things like:

- "What products are running low on stock?"
- "I just received 50 units of barcode 0123456789. Update the inventory."
- "Show me last month's sales."
- "Send a WhatsApp campaign about our drill sale to all customers."
