# Naguabo Commercial 🛠️

A full-stack hardware store e-commerce platform for **Naguabo, Puerto Rico** — built in the style of Home Depot and Lowe's. Includes everything from a public storefront to barcode-driven inventory management, WhatsApp marketing, Stripe checkout, sales analytics, an MCP server for AI-driven operations, and Kubernetes manifests for production deployment.

## Features

| Area | Capability |
|---|---|
| **Storefront** | Bilingual (EN/ES) landing page, browsable catalog with search/filter/sort, product detail pages, shopping cart, deals carousel |
| **Checkout** | Guest checkout or login/register, Stripe payment processing, order confirmation with WhatsApp tracking |
| **Auth** | Email + password (bcrypt), JWT cookies, role-based admin access |
| **Admin** | Dashboard with KPIs, inventory management, **barcode scanner** (camera or USB scanner), sales statistics with forecasting, WhatsApp campaign composer |
| **AI Assistant** | 24/7 floating chat widget powered by Claude (with rule-based bilingual fallback) |
| **WhatsApp** | Floating CTA button, deep-link to chat, marketing campaign blasts, order confirmation messages |
| **Analytics** | Daily (30-day), monthly (12-month), and 6-month linear-regression forecast with recharts visualizations |
| **MCP Server** | Standalone Model Context Protocol server exposing inventory/sales/campaign tools to AI assistants like Claude Desktop |
| **Backend** | Postgres + Prisma ORM with mock data fallback so the demo runs without DB setup |
| **Deployment** | Multi-stage Dockerfile, full Kubernetes manifests (deployment, service, ingress, HPA, PVC, secrets) |

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, TailwindCSS, Zustand
- **Backend:** Next.js API routes, Prisma, PostgreSQL
- **Mixed languages:** TypeScript (app) + JavaScript (Prisma seed, MCP server)
- **Payments:** Stripe Checkout
- **AI:** Anthropic Claude API
- **Infra:** Docker, Kubernetes, NGINX Ingress, cert-manager

## Project Structure

```
naguabo-commercial/
├── prisma/
│   ├── schema.prisma          # User, Product, Order, BarcodeScan, ChatMessage models
│   └── seed.js                # 8 categories, 12 products, admin user
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── store/             # Catalog + product detail
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Guest/login/register checkout
│   │   ├── account/           # User profile + order history
│   │   ├── admin/             # Dashboard, inventory, scanner, stats, WhatsApp
│   │   └── api/               # auth, checkout, chat, inventory, stats, whatsapp
│   ├── components/            # Header, Footer, ChatWidget, ProductCard, WhatsAppFloat
│   └── lib/                   # prisma, auth, stripe, whatsapp, cart-store, mock-data
├── mcp-server/                # MCP server (JavaScript)
├── k8s/                       # Kubernetes manifests
├── Dockerfile
└── package.json
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env
```

Fill in:

```bash
DATABASE_URL="postgresql://localhost:5432/naguabo"
JWT_SECRET="$(openssl rand -hex 32)"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
ANTHROPIC_API_KEY="sk-ant-..."
NEXT_PUBLIC_WHATSAPP_NUMBER="17875551234"
```

> **Demo mode:** the app gracefully falls back to mock data and a rule-based chatbot if the DB or API keys are absent — so you can `npm run dev` immediately without setting anything up.

### 3. Set up the database (optional for live data)

```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

The seed creates an admin user — `admin@naguabo-commercial.com` / `admin123` — plus categories and products.

### 4. Run the dev server

```bash
npm run dev
```

Visit **http://localhost:3000**.

## Admin Tools

After logging in as admin (`/login` then `/admin`):

- **`/admin/scanner`** — Use your phone/laptop camera or a USB barcode scanner to RECEIVE, ADJUST, or AUDIT stock. Every scan is logged.
- **`/admin/inventory`** — Search and review stock levels with low-stock badges.
- **`/admin/stats`** — Charts for daily/monthly sales and a 6-month forecast.
- **`/admin/whatsapp`** — Compose marketing campaigns; preview before queuing.

## MCP Server

The `mcp-server/` directory ships a standalone Node MCP server. After `cd mcp-server && npm install`, register it in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "naguabo-commercial": {
      "command": "node",
      "args": ["/abs/path/to/naguabo-commercial/mcp-server/server.js"],
      "env": { "DATABASE_URL": "postgresql://..." }
    }
  }
}
```

You can then ask Claude Desktop things like *"Update stock for barcode 0123456789, I just received 50 units"* or *"What's our sales forecast for the next 6 months?"*

## Deployment

### Docker

```bash
docker build -t naguabo/commercial-app .
docker build -t naguabo/commercial-mcp -f mcp-server/Dockerfile .
```

### Kubernetes

```bash
# 1. Create namespace and secrets
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
# Edit k8s/secrets.yaml with real values, then:
kubectl apply -f k8s/secrets.yaml

# 2. Deploy Postgres
kubectl apply -f k8s/postgres.yaml

# 3. Run DB migrations
kubectl apply -f k8s/migrate-job.yaml

# 4. Deploy app, MCP server, and autoscaler
kubectl apply -f k8s/app.yaml
kubectl apply -f k8s/mcp.yaml
kubectl apply -f k8s/hpa.yaml
```

The app deployment runs 3 replicas with rolling updates, an ingress with TLS via cert-manager, and a Horizontal Pod Autoscaler that scales 3 → 10 pods on CPU/memory.

## Architecture Notes

- **Mock data fallback:** every API route tries Prisma first; if the DB is down or unconfigured, it returns mock data so the public storefront never breaks.
- **Chat assistant:** uses Anthropic's Claude API when `ANTHROPIC_API_KEY` is set, otherwise falls back to bilingual pattern-matched replies.
- **Stripe:** when `STRIPE_SECRET_KEY` is missing or set to `sk_test_dummy`, checkout uses a mock success flow — convenient for demos.
- **Cart:** Zustand store with `localStorage` persistence; survives page reloads.
- **PR sales tax:** 11.5% configured.
- **Free shipping:** orders over $99.

## License

MIT — built for the people of Naguabo. 🇵🇷
