# Guía: Agente Conversacional de WhatsApp 🛠️

Guía de referencia para convertir el WhatsApp de Naguabo Commercial (hoy solo saliente:
campañas + confirmaciones) en un **agente conversacional entrante** que responde a clientes
usando el cerebro de chat existente (RAG + Claude) y, opcionalmente, herramientas reales
sobre tu base de datos.

> Estado actual del proyecto:
> - **Cerebro:** `src/app/api/chat/route.ts` (RAG bilingüe + Claude Haiku + fallback por reglas)
> - **Salida:** `sendWhatsAppMessage(to, body)` en `src/lib/whatsapp.ts` (Graph API v21)
> - **Tools:** `mcp-server/server.js` (inventario, ventas, búsqueda, campañas) vía MCP/stdio
> - **Falta:** el webhook entrante. Eso es lo que construye esta guía.

---

## Tabla de contenido
1. [Concepto: webhook](#1-concepto-webhook)
2. [Configuración en Meta](#2-configuración-en-meta)
3. [El webhook (GET + POST)](#3-el-webhook-get--post)
4. [Memoria de conversación](#4-memoria-de-conversación)
5. [Tool calling (que el agente actúe)](#5-tool-calling)
6. [Producción (Kubernetes)](#6-producción-kubernetes)
7. [Checklists](#7-checklists)

---

## 1. Concepto: webhook

Un **webhook** es una URL pública en la app que Meta llama automáticamente. No haces polling;
Meta te avisa. Responde a dos métodos:

- **`GET`** → handshake de verificación (una sola vez, al guardar la URL en Meta).
- **`POST`** → cada mensaje entrante de un cliente.

Flujo completo:
```
Cliente WhatsApp → Meta Cloud API → POST /api/whatsapp/webhook
   → extraer texto + número → (cargar historial) → RAG + Claude (+ tools)
   → sendWhatsAppMessage() → Cliente
```

---

## 2. Configuración en Meta

En [developers.facebook.com](https://developers.facebook.com): App → producto **WhatsApp**.

Meta te da:
- `WHATSAPP_PHONE_ID`
- `WHATSAPP_API_TOKEN`
- App Secret (`WHATSAPP_APP_SECRET`) → para verificar firmas en producción

Tú inventas:
- `WHATSAPP_VERIFY_TOKEN` → cualquier string secreto (ej. `naguabo_secreto_123`), igual en `.env` y en el panel de Meta.

Pasos:
1. Callback URL: `https://TU_DOMINIO/api/whatsapp/webhook`
2. Pega tu `VERIFY_TOKEN` en el panel.
3. Suscríbete al evento **`messages`**.

### Probar en local con ngrok
`localhost` no es público. ngrok crea un túnel HTTPS:
```bash
ngrok config add-authtoken TU_TOKEN   # una vez
npm run dev                           # terminal 1
ngrok http 3000                       # terminal 2
```
Usa la URL `https://xxxx.ngrok-free.app/api/whatsapp/webhook` como Callback.
- ⚠️ La URL gratis **cambia** en cada reinicio → re-verifica en Meta.
- Panel de debug: `http://localhost:4040` muestra cada request de Meta con su JSON.

---

## 3. El webhook (GET + POST)

Archivo: `src/app/api/whatsapp/webhook/route.ts`

### El JSON entrante de Meta (anotado)
```jsonc
{
  "entry": [{
    "changes": [{
      "value": {
        "contacts": [{ "profile": { "name": "Bryan" }, "wa_id": "17875559999" }],
        "messages": [{
          "from": "17875559999",                  // QUIÉN escribió
          "id": "wamid.HBgL...",                  // id único (para dedupe)
          "type": "text",                         // text | image | audio | button...
          "text": { "body": "¿tienen taladros?" } // QUÉ escribió
        }]
      }
    }]
  }]
}
```

**Trampas:**
- No todo POST es mensaje: los *status updates* (entregado/leído) llegan con `value.statuses`, sin `messages`. Ignóralos.
- `type` no siempre es `text` (fotos, audio, botones → `msg.text` es `undefined`).
- Devuelve `200` **rápido** o Meta reintenta (mensajes duplicados).

### Código base
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { prisma } from '@/lib/prisma';

// ─── HANDSHAKE ───
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  if (p.get('hub.mode') === 'subscribe' &&
      p.get('hub.verify_token') === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(p.get('hub.challenge'), { status: 200 }); // crudo, sin JSON
  }
  return new Response('Forbidden', { status: 403 });
}

// ─── MENSAJES ENTRANTES ───
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const value = body.entry?.[0]?.changes?.[0]?.value;
    const msg = value?.messages?.[0];
    if (!msg) return NextResponse.json({ ok: true }); // status update → ignorar

    const from = msg.from; // número del cliente = sessionId

    if (msg.type !== 'text') {
      await sendWhatsAppMessage(from, 'Por ahora solo leo texto 🙏');
      return NextResponse.json({ ok: true });
    }
    const text = msg.text.body;

    // (memoria + cerebro + respuesta — ver secciones 4 y 5)
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[whatsapp webhook]', e);
    return NextResponse.json({ ok: true }); // 200 igual para que Meta no reintente
  }
}
```

---

## 4. Memoria de conversación

El modelo `ChatMessage` usa **`sessionId`** (no `phone`) → **no necesitas migración**.
Para WhatsApp, el `sessionId` = el número del cliente. La misma tabla sirve para el widget web y WhatsApp.

```typescript
// Cargar historial
const history = await prisma.chatMessage.findMany({
  where: { sessionId: from },
  orderBy: { createdAt: 'asc' },
  take: 20, // límite para no pasarte de tokens
});

const messages = [
  ...history.map((h) => ({ role: h.role, content: h.content })),
  { role: 'user', content: text },
];

// ... llamar al cerebro (sección 5) → obtener `reply` ...

// Guardar ambos lados
await prisma.chatMessage.createMany({
  data: [
    { sessionId: from, role: 'user', content: text },
    { sessionId: from, role: 'assistant', content: reply },
  ],
});
```

### Conectar con el cerebro existente
- **Opción A (rápida):** `fetch(\`${process.env.APP_URL}/api/chat\`, { ... })` y usar `reply`.
- **Opción B (limpia):** extraer la lógica de `/api/chat` a `lib/chat-brain.ts` y llamarla como función desde el widget web y el webhook. Una sola fuente de verdad. Recomendada a futuro.

---

## 5. Tool calling

Convierte el agente de "responde preguntas" a "**hace cosas**" (busca stock real, etc.).

### ⚠️ Punto de arquitectura
El MCP server usa `StdioServerTransport` → es para **Claude Desktop** (proceso local). El webhook
HTTP **no habla MCP por stdio**. Lo que reúsas es la **lógica de Prisma**, no el protocolo.
La API HTTP de Claude (`/v1/messages`) tiene tool calling **nativo** — no necesitas MCP para esto.

### El loop de tool-use
```
1. Tú → Claude:  mensaje + lista de tools
2. Claude → Tú:  "llama search_products {query:'taladro'}"  (stop_reason: tool_use)
3. Tú ejecutas la query (TÚ tocas la DB, no Claude)
4. Tú → Claude:  tool_result con los datos
5. Claude → Tú:  respuesta final en texto  (stop_reason: end_turn)
```

### Definiciones (formato API de Claude)
Casi idéntico al MCP, pero `inputSchema` → `input_schema`:
```typescript
// lib/store-tools.ts
export const claudeTools = [{
  name: 'search_products',
  description: 'Busca productos por nombre, descripción o categoría.',
  input_schema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Término de búsqueda' },
      category: { type: 'string', description: 'Slug de categoría (opcional)' },
    },
    required: ['query'],
  },
}];

export async function runTool(name: string, args: any): Promise<string> {
  switch (name) {
    case 'search_products': {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: args.query, mode: 'insensitive' } },
            { description: { contains: args.query, mode: 'insensitive' } },
          ],
          ...(args.category && { category: { slug: args.category } }),
        },
        take: 10, include: { category: true },
      });
      return JSON.stringify(products.map((p) => ({
        name: p.name, price: p.price, stock: p.stock, slug: p.slug,
      })));
    }
    default: return `Tool desconocida: ${name}`;
  }
}
```

### El loop en el cerebro
```typescript
async function chatWithTools(messages, systemPrompt, tools) {
  while (true) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY,
                 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', max_tokens: 600,
        system: systemPrompt, tools, messages,
      }),
    });
    const data = await res.json();

    if (data.stop_reason === 'tool_use') {
      messages.push({ role: 'assistant', content: data.content });
      const toolResults = [];
      for (const block of data.content) {
        if (block.type === 'tool_use') {
          const result = await runTool(block.name, block.input);
          toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result });
        }
      }
      messages.push({ role: 'user', content: toolResults });
      continue; // Claude puede encadenar varias tools
    }
    return data.content.find((b) => b.type === 'text')?.text ?? '¿En qué te ayudo?';
  }
}
```

### 🔒 Seguridad de tools (CRÍTICO)
El agente de WhatsApp (cara al público) recibe SOLO tools de lectura segura.
Decides el conjunto **en código según el canal**, nunca según lo que diga el usuario.

| Tool | ¿Cliente WhatsApp? | Por qué |
|---|---|---|
| `search_products` | ✅ Sí | Solo lee catálogo público |
| `get_inventory` | ⚠️ Parcial | Stock sí; nunca costos/márgenes |
| `update_stock_by_barcode` | ❌ Nunca | Cliente podría reescribir inventario |
| `get_sales_stats` | ❌ Nunca | Datos financieros internos |
| `create_whatsapp_campaign` | ❌ Nunca | Cliente podría spamear tu lista |

```typescript
const customerTools = claudeTools.filter((t) => ['search_products'].includes(t.name));
```

---

## 6. Producción (Kubernetes)

### ✅ El Ingress ya cubre el webhook
`k8s/app.yaml` enruta `path: /` (Prefix) al app, así que `/api/whatsapp/webhook` ya es
accesible con TLS (cert-manager + Let's Encrypt). No necesitas regla nueva.
Callback URL de producción: `https://naguabo-commercial.com/api/whatsapp/webhook`

### 🐛 BUG a corregir antes de nada
- Código (`src/lib/whatsapp.ts`) lee `process.env.WHATSAPP_PHONE_ID`
- Secret (`k8s/secrets.yaml`) define `WHATSAPP_PHONE_NUMBER_ID`

**No coinciden** → en K8s `phoneId` será `undefined` y `sendWhatsAppMessage` no manda nada
(falla silenciosa). Unifica el nombre en ambos lados (recomendado: `WHATSAPP_PHONE_ID`).

### Secrets / config a añadir
```yaml
# k8s/secrets.yaml (stringData)
WHATSAPP_PHONE_ID: "CHANGE_ME"        # unificado (ver bug)
WHATSAPP_VERIFY_TOKEN: "CHANGE_ME"
WHATSAPP_APP_SECRET: "CHANGE_ME"
```
```yaml
# k8s/configmap.yaml
APP_URL: "https://naguabo-commercial.com"
```
Crear secrets reales (nunca en el repo):
```bash
kubectl create secret generic naguabo-secrets --from-env-file=.env.production -n naguabo-commercial
```

### 🔒 Verificar firma de Meta (`X-Hub-Signature-256`)
En prod el webhook es público; cualquiera puede mandar POSTs falsos. Meta firma cada POST con
HMAC-SHA256 del body usando tu App Secret. Verifícalo:
```typescript
import crypto from 'crypto';

function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.WHATSAPP_APP_SECRET!)
    .update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();   // text(), NO json() — necesitas el body crudo para el HMAC
  if (!verifySignature(rawBody, req.headers.get('x-hub-signature-256'))) {
    return new Response('Invalid signature', { status: 401 });
  }
  const body = JSON.parse(rawBody);   // verificado → ahora parseas
  // ...
}
```

### ⚡ El problema del timeout (IMPORTANTE)
Meta espera `200` en ~5s o **reintenta** (duplicados). Tu pipeline (Claude + tools) puede tardar
8-15s. Solución: **ACK primero, procesa después.**
```typescript
export async function POST(req: NextRequest) {
  // ...verificar firma, extraer msg...
  processMessage(from, text).catch((e) => console.error('[bg]', e)); // fire-and-forget
  return NextResponse.json({ ok: true }); // Meta feliz en <1s
}
```
- Funciona porque corres Next.js en un **contenedor Node persistente** (no serverless).
- Versión robusta a escala: **cola** (Redis/BullMQ) → el webhook encola, un worker procesa.

### Escala (3→10 réplicas vía HPA)
- ✅ Webhook stateless; estado en Postgres → cualquier pod atiende cualquier mensaje.
- ⚠️ Dedupe entre réplicas: guarda el `wamid` (`msg.id`) y verifica antes de procesar.
  Mejor: tabla/columna `messageId` con índice único (la DB rechaza el duplicado).

### Rate limits
- **WhatsApp Cloud API:** números nuevos arrancan bajos (~1.000 conv/día); sube con buen historial.
- **API de Claude:** límites por minuto; con tools cada mensaje son varias llamadas. Maneja `429` con backoff exponencial.

---

## 7. Checklists

### Construcción (orden sugerido)
1. ☐ Arreglar mismatch `WHATSAPP_PHONE_ID`
2. ☐ Añadir `WHATSAPP_VERIFY_TOKEN` y `APP_URL` al `.env`
3. ☐ Crear `route.ts` solo con `GET` (handshake)
4. ☐ Probar handshake con ngrok + panel de Meta
5. ☐ Añadir `POST` que solo loguee (verificar que llega el mensaje)
6. ☐ Conectar al cerebro `/api/chat` y responder (Opción A)
7. ☐ Añadir memoria con `ChatMessage` (sessionId = teléfono)
8. ☐ Tool calling con `customerTools` (lista recortada y segura)

### Producción
1. ☐ Bug `PHONE_ID` corregido
2. ☐ Secrets: `VERIFY_TOKEN`, `APP_SECRET`; config: `APP_URL`
3. ☐ Verificación de firma `X-Hub-Signature-256`
4. ☐ Patrón ACK-primero (200 rápido, proceso en background)
5. ☐ Deduplicación por `wamid`
6. ☐ Secrets reales vía `kubectl create secret` (no en repo)
7. ☐ Callback URL → `https://naguabo-commercial.com/api/whatsapp/webhook`
8. ☐ Manejo de `429` con backoff
9. ☐ (Futuro) cola Redis/BullMQ al crecer el volumen
