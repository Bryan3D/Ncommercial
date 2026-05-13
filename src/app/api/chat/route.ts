import { NextRequest, NextResponse } from 'next/server';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import { retrieve, formatContext } from '@/lib/rag';

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

const TOP_LEVEL_CATS = mockCategories
  .filter((c) => !c.parentSlug)
  .map((c) => c.name)
  .join(', ');

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };
    const userMsg = messages[messages.length - 1]?.content || '';

    // Retrieve relevant Q&A pairs from the bilingual knowledge base
    const ragPairs = retrieve(userMsg, 6);
    const ragContext = formatContext(ragPairs);

    if (process.env.ANTHROPIC_API_KEY) {
      const systemPrompt = buildSystemPrompt(ragContext);

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 500,
          system: systemPrompt,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ reply: data.content?.[0]?.text || '¿En qué te puedo ayudar?' });
      }
    }

    // Rule-based fallback — also uses RAG for accurate answers
    return NextResponse.json({ reply: ruleBasedReply(userMsg, ragPairs) });
  } catch (e) {
    console.error('[chat]', e);
    return NextResponse.json({
      reply: 'Lo siento, tuve un problema. / Sorry, I had trouble responding. Please try WhatsApp at (787) 874-2120.',
    });
  }
}

// ── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(ragContext: string): string {
  const featuredSample = mockProducts
    .filter((p) => p.featured)
    .slice(0, 6)
    .map((p) => `${p.name} — $${p.price.toFixed(2)} (SKU: ${p.sku})`)
    .join('\n  ');

  return `You are the friendly, knowledgeable 24/7 bilingual assistant for Naguabo Commercial — a hardware and home-improvement store in Naguabo, Puerto Rico (similar to Home Depot or Lowe's).

IDENTITY & LANGUAGE
• Respond in the same language the customer uses. If they write in Spanish, reply in Spanish. If English, reply in English. If mixed, mirror their mix.
• Be warm, concise, and helpful. Use emoji sparingly (1 per reply max).

STORE DETAILS
• Address: 20 Calle Venecia, Naguabo, Puerto Rico 00718
• Phone: (787) 874-2120 | Email: info@naguabo-commercial.com
• Online: Open 24/7 | Physical store: 7 AM – 9 PM daily
• Free in-store pickup in ~1 hour | Fast delivery across Puerto Rico
• Secure checkout via Stripe | 90-day returns

DEPARTMENTS
${TOP_LEVEL_CATS}

FEATURED PRODUCTS (sample)
  ${featuredSample}

INSTRUCTIONS
1. Use the KNOWLEDGE BASE FACTS below when they are relevant — they contain verified answers about products, prices, and store policies.
2. If the customer asks about a product you don't have a fact for, give general guidance and suggest they check the store website or contact via WhatsApp.
3. Never make up prices or stock levels beyond what is in the facts.
4. Keep answers under 4 sentences unless the customer explicitly asks for more detail.
5. If you can't help, direct them to WhatsApp at (787) 874-2120.
${ragContext}`;
}

// ── Rule-based fallback (no API key) ─────────────────────────────────────────

function ruleBasedReply(msg: string, ragPairs: ReturnType<typeof retrieve>): string {
  // If RAG found a high-confidence match, use it directly
  if (ragPairs.length > 0) {
    const top = ragPairs[0];
    // Only use it if the answer is substantive (more than a few words)
    if (top.answer.split(' ').length > 6) {
      return top.answer;
    }
  }

  const m = msg.toLowerCase();

  if (/horario|hours|open|abierto|cuándo|cuando/.test(m)) {
    return 'Estamos abiertos 24/7 online. Our physical store in Naguabo is open daily 7 AM – 9 PM. / La tienda física está abierta de 7 AM a 9 PM todos los días. ¿Algo más?';
  }
  if (/envío|shipping|delivery|entrega/.test(m)) {
    return 'Hacemos entregas en todo Puerto Rico. / We ship across Puerto Rico in 1–2 business days. Free in-store pickup in ~1 hour!';
  }
  if (/devolución|return|reembolso|refund/.test(m)) {
    return 'Ofrecemos devoluciones en 90 días. / We offer 90-day returns. Bring the item with receipt to our Naguabo store or contact us via WhatsApp.';
  }
  if (/pago|payment|pay|stripe|tarjeta|card|ath/.test(m)) {
    return 'Aceptamos Visa, Mastercard, Amex, ATH Móvil y más — todo seguro con Stripe. / We accept major cards + ATH Móvil, secured by Stripe. Guest checkout available, no account needed.';
  }
  if (/precio|price|cost|cuesta|cuanto/.test(m)) {
    const matches = mockProducts
      .filter((p) =>
        p.name.toLowerCase().split(' ').some((w) => w.length > 3 && m.includes(w.toLowerCase()))
      )
      .slice(0, 3);
    if (matches.length) {
      return matches.map((p) => `• ${p.name}: $${p.price.toFixed(2)}`).join('\n') + '\n\n¿Deseas añadir algo al carrito? / Want to add any to your cart?';
    }
  }
  if (/herramienta|tool|drill|saw|martillo|taladro/.test(m)) {
    return 'Tenemos herramientas DEWALT, RYOBI, Stanley y más. / We stock DEWALT, RYOBI, Stanley, and more. Browse at /store?category=tools';
  }
  if (/pintura|paint/.test(m)) {
    return 'BEHR Premium Plus Interior Paint — $32.98/gal en miles de colores. / Available in thousands of colors. Ver más en /store?category=paint';
  }
  if (/techo|roof|impermeab|sealant|sellado/.test(m)) {
    return 'Tenemos productos CROSSCO® y Bull-Bond® para impermeabilizar techos. / We carry CROSSCO® and Bull-Bond® roof sealants and coatings. Browse at /store?category=roof-sealing';
  }
  if (/cemento|concreto|mortero|grout|thinset|azulejo|tile/.test(m)) {
    return 'Tenemos una amplia selección de morteros, lechadas y adhesivos WECO, Bull-Bond® y más. / We carry WECO, Bull-Bond®, and more. Browse at /store?category=building-materials';
  }
  if (/hola|hi|hello|buenos|good|hey/.test(m)) {
    return '¡Hola! 👋 Soy tu asistente de Naguabo Commercial. / I\'m your Naguabo Commercial assistant. Ask me about products, prices, hours, shipping, or returns. ¿Qué buscas hoy?';
  }
  if (/whatsapp|número|number|teléfono|phone/.test(m)) {
    return 'Puedes contactarnos por WhatsApp al (787) 874-2120 o llamarnos directamente. / You can reach us on WhatsApp or by phone at (787) 874-2120.';
  }

  return 'Puedo ayudarte con productos, precios, pedidos, envíos, devoluciones y más. / I can help with products, orders, shipping, returns, or store info. También puedes contactarnos por WhatsApp al (787) 874-2120. ¿Qué necesitas?';
}
