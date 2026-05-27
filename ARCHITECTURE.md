# Naguabo Commercial — Architecture & Procedures

> Puerto Rico hardware store platform — bilingual, AI-assisted, Kubernetes-ready.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Patterns](#3-architecture-patterns)
4. [Directory Structure](#4-directory-structure)
5. [Data Models](#5-data-models)
6. [API Reference](#6-api-reference)
7. [Authentication Flow](#7-authentication-flow)
8. [Checkout & Payment Flow](#8-checkout--payment-flow)
9. [Inventory Management Flow](#9-inventory-management-flow)
10. [AI Chatbot Flow](#10-ai-chatbot-flow)
11. [WhatsApp Event Flow](#11-whatsapp-event-flow)
12. [Product Variant System](#12-product-variant-system)
13. [Admin Dashboard](#13-admin-dashboard)
14. [MCP Server](#14-mcp-server)
15. [Environment Variables](#15-environment-variables)
16. [Local Development](#16-local-development)
17. [Docker Deployment](#17-docker-deployment)
18. [Kubernetes Deployment](#18-kubernetes-deployment)
19. [Demo / Mock Mode](#19-demo--mock-mode)
20. [Key File Index](#20-key-file-index)

---

## 1. System Overview

Naguabo Commercial is a **full-stack e-commerce platform** for a hardware store in Naguabo, Puerto Rico. It handles the complete retail lifecycle: catalog browsing, cart checkout, payment, inventory tracking, AI customer support, and WhatsApp marketing.

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER CLIENTS                         │
│   Customer Storefront  │  Admin Dashboard  │  POS Terminal      │
└──────────────┬──────────────────┬───────────────────┬──────────┘
               │                  │                   │
               ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS 14 APP ROUTER                        │
│         (SSR + Client Components, TypeScript, Tailwind)         │
│                                                                 │
│  /store        /checkout    /account    /admin    /api/*        │
└──────────────┬──────────────────────────────────────┬──────────┘
               │                                      │
        ┌──────┴──────┐                    ┌──────────┴──────────┐
        │   STRIPE    │                    │   POSTGRESQL (DB)   │
        │  Payments   │                    │   via Prisma ORM    │
        └─────────────┘                    └─────────────────────┘
               │                                      │
        ┌──────┴──────┐                    ┌──────────┴──────────┐
        │  ANTHROPIC  │                    │  WHATSAPP BUSINESS  │
        │  Claude API │                    │       API           │
        │ (Chatbot)   │                    │ (Notifications)     │
        └─────────────┘                    └─────────────────────┘
               │
        ┌──────┴──────┐
        │  MCP SERVER │
        │ (AI Tools)  │
        └─────────────┘
```

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | [Next.js](https://nextjs.org) | 14.2 | SSR + App Router + API routes |
| **Language** | TypeScript | 5.7 | Type safety across full stack |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS, dark mode |
| **Database** | PostgreSQL | 15+ | Relational data store |
| **ORM** | Prisma | 5.22 | Type-safe DB client + migrations |
| **State** | Zustand | 5.x | Client-side cart + UI state |
| **Auth** | JWT + bcryptjs | - | httpOnly cookie sessions |
| **Payments** | Stripe | 4.x | Checkout, webhooks |
| **AI Chat** | Anthropic Claude | Haiku | Bilingual customer assistant |
| **AI Tools** | MCP SDK | 1.x | Admin inventory tools via Claude |
| **Charts** | Recharts | 2.13 | Sales analytics dashboards |
| **Barcode** | html5-qrcode | 2.3 | Camera / USB scanner in browser |
| **Containers** | Docker | - | Multi-stage production build |
| **Orchestration** | Kubernetes | - | HPA, rolling updates, secrets |
| **Icons** | lucide-react | 0.468 | UI icon library |

---

## 3. Architecture Patterns

### 3.1 Next.js App Router (Server + Client Split)

Pages are **Server Components by default** — they fetch data directly via Prisma without an API round-trip. Interactive UI is marked `"use client"` and hydrates on the browser.

```
src/app/
  page.tsx              → Server Component (no "use client")
  store/page.tsx        → Server Component + client filter components
  admin/stats/page.tsx  → Server Component, fetches from /api/stats
  api/products/route.ts → Route Handler (server-only)
```

### 3.2 Event-Driven Architecture

Loose coupling between subsystems via a typed in-process EventBus. When an order is paid, multiple side-effects fire without tight dependencies:

```
Stripe Webhook
    └─► processOrderPayment()
             ├─► Deduct inventory (inventory-service)
             ├─► emit("order.paid", { orderId, items, customer })
             │        └─► WhatsApp receipt sent to customer
             │        └─► Low-stock alert to manager (if stock ≤ 5)
             └─► Update order status to PAID
```

**Key files:**
- [`src/lib/event-bus.ts`](src/lib/event-bus.ts) — Typed EventEmitter
- [`src/lib/whatsapp-observer.ts`](src/lib/whatsapp-observer.ts) — Event subscribers
- [`src/lib/inventory-service.ts`](src/lib/inventory-service.ts) — Stock operations

### 3.3 RAG (Retrieval-Augmented Generation)

The chatbot enhances Claude's responses with store-specific knowledge without fine-tuning:

```
User Message
    └─► Detect language (ES/EN)
    └─► Tokenize query
    └─► Score 400 Q&A pairs by token overlap
    └─► Top-6 pairs injected into Claude system prompt
    └─► Claude responds in user's language
```

**Key files:**
- [`src/lib/rag.ts`](src/lib/rag.ts) — Scoring + retrieval logic
- [`mcp-server/naguabo_commercial_rag_400_qa_en_es_expanded.jsonl`](mcp-server/naguabo_commercial_rag_400_qa_en_es_expanded.jsonl) — Knowledge base

### 3.4 Demo / Graceful Degradation

Every external dependency has a local fallback so the app runs without credentials:

| Dependency | Fallback |
|-----------|---------|
| PostgreSQL | `mock-data.ts` products & categories |
| Stripe | Synthetic `order.paid` event, no real charge |
| Claude API | Rule-based bilingual matcher |
| WhatsApp API | Log warning, skip send |

---

## 4. Directory Structure

```
naguabo-commercial/
├── prisma/
│   ├── schema.prisma          ← DB models & relations
│   └── seed.js                ← 18 categories + 12+ products + admin user
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← Root layout (theme, language providers)
│   │   ├── page.tsx           ← Landing page
│   │   ├── store/
│   │   │   ├── page.tsx       ← Product catalog (filters, variants)
│   │   │   └── [slug]/page.tsx← Product detail
│   │   ├── cart/page.tsx      ← Shopping cart
│   │   ├── checkout/
│   │   │   ├── page.tsx       ← Checkout form + Stripe
│   │   │   └── success/page.tsx
│   │   ├── account/page.tsx   ← Profile + order history
│   │   ├── admin/
│   │   │   ├── layout.tsx     ← Admin nav + auth guard
│   │   │   ├── page.tsx       ← Dashboard KPIs
│   │   │   ├── stats/page.tsx ← Analytics charts + forecast
│   │   │   ├── inventory/page.tsx
│   │   │   ├── products/new/page.tsx
│   │   │   ├── scanner/page.tsx
│   │   │   ├── pos/page.tsx
│   │   │   └── whatsapp/page.tsx
│   │   └── api/
│   │       ├── auth/          ← login, register, logout
│   │       ├── products/
│   │       ├── categories/
│   │       ├── checkout/
│   │       ├── stripe/webhook/
│   │       ├── orders/[id]/credit/
│   │       ├── inventory/scan/
│   │       ├── stats/
│   │       ├── account/
│   │       ├── chat/
│   │       ├── pos/order/
│   │       └── whatsapp/campaign/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ChatWidget.tsx     ← Floating AI assistant
│   │   ├── WhatsAppFloat.tsx  ← Floating WhatsApp button
│   │   ├── ThemeProvider.tsx
│   │   ├── LanguageProvider.tsx
│   │   └── AdBanner.tsx
│   ├── lib/
│   │   ├── auth.ts            ← JWT + bcrypt helpers
│   │   ├── prisma.ts          ← Singleton Prisma client
│   │   ├── stripe.ts          ← Stripe client
│   │   ├── cart-store.ts      ← Zustand cart (localStorage)
│   │   ├── inventory-service.ts
│   │   ├── event-bus.ts
│   │   ├── whatsapp-observer.ts
│   │   ├── whatsapp.ts
│   │   ├── rag.ts
│   │   ├── mock-data.ts
│   │   └── translations.ts
│   └── types/
│       └── index.ts           ← Shared TypeScript interfaces
├── mcp-server/
│   ├── server.js              ← MCP tool definitions
│   ├── package.json
│   ├── Dockerfile
│   └── *.jsonl                ← RAG knowledge base
├── k8s/
│   ├── namespace.yaml
│   ├── secrets.yaml
│   ├── configmap.yaml
│   ├── postgres.yaml          ← StatefulSet + PVC
│   ├── migrate-job.yaml       ← prisma migrate deploy
│   ├── app.yaml               ← Deployment + Service + Ingress
│   ├── mcp.yaml               ← MCP server deployment
│   └── hpa.yaml               ← Horizontal Pod Autoscaler
├── Dockerfile                 ← Multi-stage production build
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.example               ← All required env vars
└── package.json
```

---

## 5. Data Models

Defined in [`prisma/schema.prisma`](prisma/schema.prisma).

### User
```
User {
  id          String   (uuid)
  email       String   (unique)
  name        String
  phone       String?
  password    String   (bcrypt hash)
  role        Role     (CUSTOMER | ADMIN | STAFF)
  createdAt   DateTime
  orders      Order[]
}
```

### Product
```
Product {
  id             String   (uuid)
  name           String
  slug           String   (unique)
  description    String?
  price          Float
  comparePrice   Float?   (strike-through MSRP)
  stock          Int
  barcode        String   (unique)
  sku            String   (unique)
  imageUrl       String
  brand          String?
  size           String?  (for size filter)
  variantGroupId String?  (groups same product in different sizes/colors)
  rating         Float
  reviewCount    Int
  featured       Boolean
  categoryId     String
  category       Category
}
```

### Order + OrderItem
```
Order {
  id            String   (uuid)
  orderNumber   String   (unique, human-readable)
  userId        String?  (null for guest)
  guestEmail    String?
  status        OrderStatus (PENDING|PAID|SHIPPED|DELIVERED|CANCELLED)
  subtotal      Float
  tax           Float    (11.5% Puerto Rico IVU)
  shipping      Float    (free ≥ $99, else $9.99)
  total         Float
  stripeId      String?
  paymentStatus String
  items         OrderItem[]
}
```

### Category
```
Category {
  id         String  (uuid)
  name       String  (unique)
  slug       String  (unique)
  icon       String
  parentSlug String? (points to parent category slug)
  products   Product[]
}
```

### ChatMessage
```
ChatMessage {
  id        String   (uuid)
  sessionId String   (browser-generated)
  role      String   (user | assistant)
  content   String
  createdAt DateTime
}
```

### BarcodeScan
```
BarcodeScan {
  id        String
  barcode   String
  productId String
  action    ScanAction (RECEIVE|ADJUST|AUDIT|SELL)
  quantity  Int
  scannedBy String
  scannedAt DateTime
  notes     String?
}
```

---

## 6. API Reference

All routes live under `src/app/api/`.

### Auth

| Method | Endpoint | Body | Returns |
|--------|---------|------|---------|
| POST | `/api/auth/register` | `{name, email, password, phone?}` | User + sets `auth-token` cookie |
| POST | `/api/auth/login` | `{email, password}` | User + sets `auth-token` cookie |
| POST | `/api/auth/logout` | — | Clears `auth-token` cookie |

### Products & Categories

| Method | Endpoint | Query | Returns |
|--------|---------|-------|---------|
| GET | `/api/products` | `?search=&category=&brand=&size=&minPrice=&maxPrice=&featured=` | `Product[]` |
| POST | `/api/products` | `{name, sku, barcode, price, stock, ...}` | Created `Product` |
| GET | `/api/categories` | — | `Category[]` with hierarchy |

### Orders & Checkout

| Method | Endpoint | Body | Returns |
|--------|---------|------|---------|
| POST | `/api/checkout` | `{items, customer, shippingAddress}` | `{checkoutUrl}` (Stripe) or demo success |
| POST | `/api/stripe/webhook` | Stripe event (raw body) | `200 OK` |
| POST | `/api/orders/[id]/credit` | `{reason}` | Updated order + inventory restored |
| POST | `/api/pos/order` | `{items, paymentMethod, customer?}` | Created POS order |

### Inventory

| Method | Endpoint | Body | Returns |
|--------|---------|------|---------|
| POST | `/api/inventory/scan` | `{barcode, action, quantity, scannedBy, notes?}` | Updated stock + scan log |

### Analytics

| Method | Endpoint | Returns |
|--------|---------|---------|
| GET | `/api/stats` | `{daily[], monthly[], forecast[], topProducts[], totals}` |

### AI & Messaging

| Method | Endpoint | Body | Returns |
|--------|---------|------|---------|
| POST | `/api/chat` | `{message, sessionId, language?}` | `{reply, language}` |
| POST | `/api/whatsapp/campaign` | `{message, productUrl?}` | Campaign queued |

### Account

| Method | Endpoint | Returns |
|--------|---------|---------|
| GET | `/api/account` | User profile + `Order[]` |
| POST | `/api/account` | Update profile fields |

---

## 7. Authentication Flow

```
1. User submits login form
        │
        ▼
2. POST /api/auth/login
   - Fetch User by email from DB
   - bcryptjs.compare(password, hash)
        │
        ├── FAIL → 401 { error: "Invalid credentials" }
        │
        └── PASS ▼
3. signToken({ userId, role }) → JWT (7-day expiry, HS256)
4. Set httpOnly cookie "auth-token"
5. Return { user }
        │
        ▼
6. Protected pages call getSessionUser()
   - Read "auth-token" cookie
   - verifyToken(token) → { userId, role }
   - Admin layout: redirect non-ADMIN to /
```

**Key file:** [`src/lib/auth.ts`](src/lib/auth.ts)

---

## 8. Checkout & Payment Flow

```
Customer fills cart
        │
        ▼
POST /api/checkout
   1. checkAvailability(items) → error if out of stock
   2. Create Order (status: PENDING)
   3. Create Stripe CheckoutSession
        │
        ├── Demo mode (no STRIPE_SECRET_KEY) ─────────┐
        │   emit("order.paid") immediately             │
        │   return { checkoutUrl: "/checkout/success" }│
        │                                              │
        └── Production ───────────────────────────────►│
            redirect to Stripe hosted page             │
            Customer completes payment                 │
                    │                                  │
                    ▼                                  │
            POST /api/stripe/webhook                   │
              Verify signature                         │
              On checkout.session.completed:           │
                processOrderPayment(orderId) ──────────┘
                   - Order status → PAID
                   - Deduct inventory (SELL scan)
                   - emit("order.paid")
                          │
                          ▼
                   WhatsApp receipt → customer phone
                   Low-stock alert  → manager (if stock ≤ 5)
```

**Tax rate:** 11.5% (Puerto Rico IVU)
**Free shipping threshold:** $99+

**Key files:**
- [`src/app/api/checkout/route.ts`](src/app/api/checkout/route.ts)
- [`src/app/api/stripe/webhook/route.ts`](src/app/api/stripe/webhook/route.ts)
- [`src/lib/inventory-service.ts`](src/lib/inventory-service.ts)

---

## 9. Inventory Management Flow

### Receiving Stock (Barcode Scanner)
```
Admin opens /admin/scanner
   │
   ├── Camera mode: html5-qrcode reads barcode
   └── USB scanner: keydown events captured
        │
        ▼
POST /api/inventory/scan
   { barcode, action: "RECEIVE", quantity: 50 }
        │
        ▼
   Find product by barcode
   product.stock += quantity
   Create BarcodeScan log entry
   Return updated product
```

### Stock Deduction (Order Paid)
```
inventory-service.deductForSale(orderId)
   ├── For each OrderItem: product.stock -= quantity
   ├── Create BarcodeScan (action: SELL)
   └── If stock ≤ 5: emit("inventory.low_stock") → WhatsApp alert
```

### Returns / Credits
```
POST /api/orders/[id]/credit
   └── inventory-service.restoreForCredit(orderId, reason)
        ├── product.stock += quantity (per item)
        ├── Create BarcodeScan (action: RETURN or ADJUST)
        ├── Order status → CANCELLED
        └── emit("order.credited") → WhatsApp refund notice
```

**Scan actions:** `RECEIVE` | `ADJUST` | `AUDIT` | `SELL` | `RETURN`

**Key file:** [`src/lib/inventory-service.ts`](src/lib/inventory-service.ts)

---

## 10. AI Chatbot Flow

```
User types message in ChatWidget
        │
        ▼
POST /api/chat { message, sessionId }
   │
   ├── 1. Detect language (ES if diacritics / keywords, else EN)
   │
   ├── 2. RAG retrieval (src/lib/rag.ts)
   │      - Tokenize query
   │      - Score 400 JSONL Q&A pairs by token overlap
   │      - Return top-6 matches
   │
   ├── 3. Build system prompt
   │      - Store info (address, hours, phone, WhatsApp)
   │      - Injected RAG pairs
   │      - Language instruction
   │
   ├── 4a. ANTHROPIC_API_KEY present
   │       └─► Claude Haiku API call
   │
   └── 4b. No API key (demo)
           └─► Rule-based matcher returns canned response
                    │
                    ▼
            Return { reply, language }
            Save ChatMessage to DB (sessionId)
            Display in ChatWidget
```

**Model:** `claude-haiku-4-5` (fast, cost-efficient for chat)
**Knowledge base:** 400 bilingual Q&A pairs in JSONL

**Key files:**
- [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts)
- [`src/lib/rag.ts`](src/lib/rag.ts)
- [`src/components/ChatWidget.tsx`](src/components/ChatWidget.tsx)
- [`mcp-server/naguabo_commercial_rag_400_qa_en_es_expanded.jsonl`](mcp-server/naguabo_commercial_rag_400_qa_en_es_expanded.jsonl)

---

## 11. WhatsApp Event Flow

```
EventBus events → WhatsApp notifications

order.paid
   └─► buildWhatsAppLink(receipt, customer.phone)
       → Sends itemized receipt to customer via WhatsApp API

order.credited
   └─► Sends refund confirmation to customer

inventory.low_stock
   └─► Sends alert to WHATSAPP_NUMBER (manager)
       "⚠️ Low stock: [Product] — only [N] units left"
```

### WhatsApp Campaign (Admin)
```
Admin drafts message at /admin/whatsapp
        │
        ▼
POST /api/whatsapp/campaign { message }
        │
        ▼
Fetch all users with phone number
Send WhatsApp Business API message to each
```

**Key files:**
- [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts)
- [`src/lib/whatsapp-observer.ts`](src/lib/whatsapp-observer.ts)
- [`src/lib/event-bus.ts`](src/lib/event-bus.ts)
- [`src/app/admin/whatsapp/page.tsx`](src/app/admin/whatsapp/page.tsx)

---

## 12. Product Variant System

Products with the same item in different sizes/colors share a `variantGroupId`.

```
variantGroupId: "paint-exterior-truper"
  ├── Product: "Pintura Exterior Blanca 1 gal"  (size: "1 gal")
  ├── Product: "Pintura Exterior Blanca 5 gal"  (size: "5 gal")
  └── Product: "Pintura Exterior Blanca 1 qt"   (size: "1 qt")
```

**Store page deduplication:**
1. Build a `Map<variantGroupId, Product[]>` from all products
2. Show only the **first** product card per variant group
3. Size-selector in card navigates to the correct slug for that size
4. Price range filter applies across ALL variants in the group

**Key file:** [`src/app/store/page.tsx`](src/app/store/page.tsx)

---

## 13. Admin Dashboard

All admin routes are protected by role check in [`src/app/admin/layout.tsx`](src/app/admin/layout.tsx).

| Route | Feature |
|-------|---------|
| `/admin` | KPI cards: today's revenue, orders, inventory alerts |
| `/admin/stats` | Area chart (30-day daily), bar chart (12-month), 6-month linear forecast, top products table |
| `/admin/inventory` | Search products, stock badges (In Stock / Low / Critical / Out of Stock) |
| `/admin/products/new` | Add product form: name, SKU, barcode, price, stock, category, images |
| `/admin/scanner` | Barcode scanner (camera or USB), real-time scan log |
| `/admin/pos` | Point-of-sale terminal: add items by barcode/search, cash/card/credit checkout |
| `/admin/whatsapp` | Draft and send WhatsApp marketing campaigns |

### Sales Forecast Algorithm
6-month linear regression in [`src/app/api/stats/route.ts`](src/app/api/stats/route.ts):
```
x = month index (0..N-1)
y = monthly revenue
slope = (N·Σxy − Σx·Σy) / (N·Σx² − (Σx)²)
intercept = (Σy − slope·Σx) / N
forecast[i] = intercept + slope · (N + i)
```

---

## 14. MCP Server

The MCP server at [`mcp-server/server.js`](mcp-server/server.js) exposes store tools to Claude Desktop or any MCP-compatible AI client.

### Tools Available

| Tool | Arguments | Description |
|------|-----------|-------------|
| `get_inventory` | `{ lowStockThreshold? }` | List all products with stock levels |
| `update_stock_by_barcode` | `{ barcode, action, quantity, notes? }` | RECEIVE / ADJUST / AUDIT stock |
| `get_sales_stats` | `{ period: "daily"|"monthly"|"forecast" }` | Revenue analytics |
| `search_products` | `{ query }` | Full-text product search |
| `create_whatsapp_campaign` | `{ message, targetPhone? }` | Send WhatsApp blast |

### Setup in Claude Desktop
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "naguabo-commercial": {
      "command": "node",
      "args": ["K:/3D60Creations-Projects/NGC/naguabo-commercial/mcp-server/server.js"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/naguabo",
        "MCP_API_KEY": "your-mcp-secret"
      }
    }
  }
}
```

### Example AI Queries via MCP
- "What products are running low on stock?"
- "Receive 50 units for barcode 7501234567890"
- "Show me this month's sales forecast"
- "Send a WhatsApp campaign about our weekend deals"

---

## 15. Environment Variables

Reference: [`.env.example`](.env.example)

| Variable | Required | Description |
|---------|---------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing auth tokens (min 32 chars) |
| `STRIPE_SECRET_KEY` | Prod | Stripe secret key (`sk_live_...` or `sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Prod | Stripe publishable key (`pk_...`) |
| `STRIPE_WEBHOOK_SECRET` | Prod | Stripe webhook signing secret (`whsec_...`) |
| `ANTHROPIC_API_KEY` | Recommended | Claude API key for chatbot |
| `WHATSAPP_NUMBER` | Recommended | Manager's WhatsApp number (E.164 format, e.g. `17875551234`) |
| `WHATSAPP_API_TOKEN` | Optional | WhatsApp Business API token |
| `WHATSAPP_PHONE_ID` | Optional | WhatsApp Business phone ID |
| `MCP_SERVER_PORT` | Optional | Port for MCP server (default: 3333) |
| `MCP_API_KEY` | Optional | Secret key for MCP server auth |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of the app (e.g. `https://naguabo-commercial.com`) |

---

## 16. Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or use Docker)
- Git

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd naguabo-commercial

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your values

# 4. Start PostgreSQL (if using Docker)
docker run -d \
  --name naguabo-db \
  -e POSTGRES_DB=naguabo \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# 5. Run database migrations
npx prisma migrate dev

# 6. Seed the database (18 categories, 12+ products, admin user)
node prisma/seed.js

# 7. Start development server
npm run dev

# App runs at http://localhost:3000
# Admin at http://localhost:3000/admin
```

### Default Admin Credentials
```
Email:    admin@naguabo-commercial.com
Password: admin123
```

### Running the MCP Server (optional)
```bash
cd mcp-server
npm install
node server.js
# MCP server runs at port 3333
```

### Prisma Studio (DB browser)
```bash
npx prisma studio
# Opens at http://localhost:5555
```

### Useful Dev Commands
```bash
npm run dev          # Start dev server (HMR)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npx prisma migrate dev      # Apply new migrations
npx prisma migrate reset    # Reset DB + reseed (DESTRUCTIVE)
npx prisma generate         # Regenerate Prisma client
npx prisma db push          # Push schema without migration file
```

---

## 17. Docker Deployment

### Build & Run Locally
```bash
# Build the image
docker build -t naguabo-commercial:latest .

# Run with environment variables
docker run -d \
  --name naguabo-app \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/naguabo" \
  -e JWT_SECRET="your-secret-here" \
  -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
  naguabo-commercial:latest
```

### Multi-Stage Build Stages
Defined in [`Dockerfile`](Dockerfile):

| Stage | Base | Purpose |
|-------|------|---------|
| `base` | node:20-alpine | Shared base with OS deps |
| `deps` | base | `npm ci` + copy prisma schema |
| `builder` | base | `prisma generate` + `next build` |
| `runner` | base | Minimal production image, non-root user `nextjs` |

Output: `next build --output standalone` — copies only what's needed, no `node_modules` in production image.

### Build Optimization
- `.dockerignore` excludes `node_modules`, `.next`, `.git`
- Prisma client generated inside builder stage
- Final image < 300MB

---

## 18. Kubernetes Deployment

All manifests in the [`k8s/`](k8s/) directory.

### Apply Order (first deployment)
```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Create secrets (edit values first!)
kubectl apply -f k8s/secrets.yaml

# 3. Create config map
kubectl apply -f k8s/configmap.yaml

# 4. Deploy PostgreSQL
kubectl apply -f k8s/postgres.yaml

# 5. Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n naguabo-commercial --timeout=120s

# 6. Run database migrations
kubectl apply -f k8s/migrate-job.yaml
kubectl wait --for=condition=complete job/prisma-migrate -n naguabo-commercial --timeout=120s

# 7. Deploy the application
kubectl apply -f k8s/app.yaml

# 8. Deploy MCP server
kubectl apply -f k8s/mcp.yaml

# 9. Enable autoscaling
kubectl apply -f k8s/hpa.yaml
```

### Update Deployment (rolling update)
```bash
# Build and push new image
docker build -t your-registry/naguabo-commercial:v2.0 .
docker push your-registry/naguabo-commercial:v2.0

# Update image in deployment
kubectl set image deployment/naguabo-commercial \
  naguabo-commercial=your-registry/naguabo-commercial:v2.0 \
  -n naguabo-commercial
```

### Kubernetes Resources

| Manifest | Resources Created |
|---------|------------------|
| [`k8s/namespace.yaml`](k8s/namespace.yaml) | Namespace: `naguabo-commercial` |
| [`k8s/secrets.yaml`](k8s/secrets.yaml) | Secret: DB URL, Stripe keys, JWT, WhatsApp, Anthropic |
| [`k8s/configmap.yaml`](k8s/configmap.yaml) | ConfigMap: app URL, WhatsApp number |
| [`k8s/postgres.yaml`](k8s/postgres.yaml) | StatefulSet (1 replica) + PVC (10Gi) + Service |
| [`k8s/migrate-job.yaml`](k8s/migrate-job.yaml) | Job: `prisma migrate deploy` (runs once) |
| [`k8s/app.yaml`](k8s/app.yaml) | Deployment (3 replicas) + Service + Ingress (TLS) |
| [`k8s/mcp.yaml`](k8s/mcp.yaml) | Deployment (1 replica) + Service |
| [`k8s/hpa.yaml`](k8s/hpa.yaml) | HPA: 3–10 replicas on CPU/memory |

### App Deployment Specs
- **Replicas:** 3 (min) → 10 (max under load)
- **Resources per pod:** 256Mi–1Gi memory, 100m–1000m CPU
- **Probes:** HTTP GET `/api/products` (readiness + liveness)
- **Strategy:** RollingUpdate (maxUnavailable: 1, maxSurge: 1)
- **Ingress:** TLS via cert-manager / Let's Encrypt
- **Domains:** `naguabo-commercial.com`, `www.naguabo-commercial.com`

---

## 19. Demo / Mock Mode

The app runs fully in demo mode with just `npm run dev` and no external services.

### What works without credentials

| Feature | Demo Behavior |
|---------|-------------|
| Product catalog | Loads 12 products from `mock-data.ts` |
| Categories | 18 categories from `mock-data.ts` |
| Cart | Fully functional (Zustand + localStorage) |
| Checkout | No charge, synthetic `order.paid` event |
| Chatbot | Rule-based bilingual matcher (no Claude API needed) |
| Admin stats | Realistic mock sales data with forecast |
| WhatsApp float | Click-to-chat link (no API needed) |
| Barcode scanner | Camera scan works, DB write skipped if no DB |

### Enabling Real Features

| Feature | Required Env Var |
|---------|----------------|
| Real DB | `DATABASE_URL` |
| Stripe payments | `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` |
| Claude chatbot | `ANTHROPIC_API_KEY` |
| WhatsApp sends | `WHATSAPP_API_TOKEN` + `WHATSAPP_PHONE_ID` |

---

## 20. Key File Index

### Configuration
- [`package.json`](package.json) — Dependencies and scripts
- [`next.config.js`](next.config.js) — Next.js config (standalone output, image domains)
- [`tailwind.config.js`](tailwind.config.js) — Brand colors (orange + blue)
- [`tsconfig.json`](tsconfig.json) — TypeScript config (`@/*` path alias)
- [`.env.example`](.env.example) — All environment variable templates
- [`Dockerfile`](Dockerfile) — Multi-stage production Docker build

### Database
- [`prisma/schema.prisma`](prisma/schema.prisma) — All data models
- [`prisma/seed.js`](prisma/seed.js) — Initial data (categories, products, admin)

### Core Libraries
- [`src/lib/auth.ts`](src/lib/auth.ts) — JWT + bcrypt authentication
- [`src/lib/prisma.ts`](src/lib/prisma.ts) — Singleton DB client
- [`src/lib/stripe.ts`](src/lib/stripe.ts) — Stripe client + formatters
- [`src/lib/cart-store.ts`](src/lib/cart-store.ts) — Zustand cart state
- [`src/lib/inventory-service.ts`](src/lib/inventory-service.ts) — Stock operations
- [`src/lib/event-bus.ts`](src/lib/event-bus.ts) — Typed event emitter
- [`src/lib/whatsapp-observer.ts`](src/lib/whatsapp-observer.ts) — Event → WhatsApp
- [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts) — WhatsApp API helpers
- [`src/lib/rag.ts`](src/lib/rag.ts) — RAG retrieval for chatbot
- [`src/lib/mock-data.ts`](src/lib/mock-data.ts) — Demo products & categories
- [`src/lib/translations.ts`](src/lib/translations.ts) — EN/ES strings
- [`src/types/index.ts`](src/types/index.ts) — Shared TypeScript interfaces

### Key Pages
- [`src/app/page.tsx`](src/app/page.tsx) — Landing page
- [`src/app/store/page.tsx`](src/app/store/page.tsx) — Product catalog + filters + variants
- [`src/app/checkout/page.tsx`](src/app/checkout/page.tsx) — Checkout + Stripe
- [`src/app/admin/stats/page.tsx`](src/app/admin/stats/page.tsx) — Analytics + forecast
- [`src/app/admin/scanner/page.tsx`](src/app/admin/scanner/page.tsx) — Barcode scanner
- [`src/app/admin/pos/page.tsx`](src/app/admin/pos/page.tsx) — POS terminal

### Key API Routes
- [`src/app/api/auth/login/route.ts`](src/app/api/auth/login/route.ts)
- [`src/app/api/checkout/route.ts`](src/app/api/checkout/route.ts)
- [`src/app/api/stripe/webhook/route.ts`](src/app/api/stripe/webhook/route.ts)
- [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts)
- [`src/app/api/inventory/scan/route.ts`](src/app/api/inventory/scan/route.ts)
- [`src/app/api/stats/route.ts`](src/app/api/stats/route.ts)

### Components
- [`src/components/ChatWidget.tsx`](src/components/ChatWidget.tsx) — Floating AI chat
- [`src/components/WhatsAppFloat.tsx`](src/components/WhatsAppFloat.tsx) — WhatsApp CTA
- [`src/components/ProductCard.tsx`](src/components/ProductCard.tsx) — Product tile
- [`src/components/Header.tsx`](src/components/Header.tsx) — Nav + search + cart

### Kubernetes
- [`k8s/app.yaml`](k8s/app.yaml) — Main deployment
- [`k8s/postgres.yaml`](k8s/postgres.yaml) — Database StatefulSet
- [`k8s/hpa.yaml`](k8s/hpa.yaml) — Autoscaling
- [`k8s/secrets.yaml`](k8s/secrets.yaml) — Credentials

### MCP Server
- [`mcp-server/server.js`](mcp-server/server.js) — AI tool definitions
- [`mcp-server/naguabo_commercial_rag_400_qa_en_es_expanded.jsonl`](mcp-server/naguabo_commercial_rag_400_qa_en_es_expanded.jsonl) — Knowledge base

---

*Last updated: 2026-05-27 | Stack: Next.js 14 · Prisma · PostgreSQL · Stripe · Claude API · Kubernetes*
