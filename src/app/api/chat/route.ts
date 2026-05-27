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
      reply: 'Lo siento, tuve un problema. Contáctanos por WhatsApp al +1 (939) 382-3332 o por email a ferreteriarb2@gmail.com.',
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

  return `Eres ABO, el asistente amigable y experto de Naguabo Commercial disponible 24/7 — una ferretería y tienda de mejoras para el hogar en Naguabo, Puerto Rico (similar a Home Depot o Lowe's).

IDENTIDAD E IDIOMA
• Responde siempre en español. Si el cliente escribe en inglés, responde en español de todas formas, pero puedes incluir la traducción entre paréntesis si ayuda.
• Sé cálido, conciso y útil. Usa emojis con moderación (máximo 1 por respuesta).

STORE DETAILS
• Address: 20 Calle Venecia, Naguabo, Puerto Rico 00718
• WhatsApp / Phone: +1 (939) 382-3332 | Email: ferreteriarb2@gmail.com
• Online: Open 24/7 | Physical store: Monday–Saturday 7 AM – 5 PM (closed Sundays)
• Free in-store pickup in ~1 hour | Fast delivery across Puerto Rico
• Secure checkout via Stripe | Returns are handled case by case with manager approval

DEPARTMENTS
${TOP_LEVEL_CATS}

FEATURED PRODUCTS (sample)
  ${featuredSample}

INSTRUCTIONS
1. Use the KNOWLEDGE BASE FACTS below when they are relevant — they contain verified answers about products, prices, and store policies.
2. If the customer asks about a product you don't have a fact for, give general guidance and suggest they check the store website or contact via WhatsApp.
3. Never make up prices or stock levels beyond what is in the facts.
4. Keep answers under 4 sentences unless the customer explicitly asks for more detail.
5. If you can't help, direct them to WhatsApp at +1 (939) 382-3332 or email ferreteriarb2@gmail.com.
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
    return 'Estamos disponibles en línea 24/7. La tienda física en Naguabo abre de lunes a sábado, de 7 AM a 5 PM (cerrado los domingos). ¿Algo más en que pueda ayudarte?';
  }
  if (/envío|shipping|delivery|entrega/.test(m)) {
    return 'Hacemos entregas en todo Puerto Rico en 1–2 días hábiles. ¡Recogida en tienda gratis en aproximadamente 1 hora!';
  }
  if (/devolución|return|reembolso|refund/.test(m)) {
    return 'Las devoluciones se manejan caso por caso con aprobación del gerente. Contáctanos por WhatsApp al +1 (939) 382-3332 o escríbenos a ferreteriarb2@gmail.com y te atendemos enseguida.';
  }
  if (/pago|payment|pay|stripe|tarjeta|card|ath/.test(m)) {
    return 'Aceptamos Visa, Mastercard, Amex, ATH Móvil y más — todo de forma segura con Stripe. Puedes pagar como invitado sin necesidad de crear una cuenta.';
  }
  if (/precio|price|cost|cuesta|cuanto/.test(m)) {
    const matches = mockProducts
      .filter((p) =>
        p.name.toLowerCase().split(' ').some((w) => w.length > 3 && m.includes(w.toLowerCase()))
      )
      .slice(0, 3);
    if (matches.length) {
      return matches.map((p) => `• ${p.name}: $${p.price.toFixed(2)}`).join('\n') + '\n\n¿Deseas añadir alguno al carrito?';
    }
  }
  if (/herramienta|tool|drill|saw|martillo|taladro/.test(m)) {
    return 'Tenemos herramientas DEWALT, RYOBI, Stanley y más. Explora nuestra selección en /store?category=tools';
  }
  if (/pintura|paint/.test(m)) {
    return 'BEHR Premium Plus Interior Paint — $32.98/gal disponible en miles de colores. Ver más en /store?category=paint';
  }
  if (/techo|roof|impermeab|sealant|sellado/.test(m)) {
    return 'Tenemos productos CROSSCO® y Bull-Bond® para impermeabilizar techos. Ver más en /store?category=roof-sealing';
  }
  if (/cemento|concreto|mortero|grout|thinset|azulejo|tile/.test(m)) {
    return 'Tenemos una amplia selección de morteros, lechadas y adhesivos WECO, Bull-Bond® y más. Ver más en /store?category=building-materials';
  }
  if (/hola|hi|hello|buenos|good|hey/.test(m)) {
    return '¡Hola! 👋 Soy ABO, tu asistente de Naguabo Commercial. Puedo ayudarte con productos, precios, horarios, envíos o devoluciones. ¿Qué buscas hoy?';
  }
  if (/whatsapp|número|number|teléfono|phone/.test(m)) {
    return 'Puedes contactarnos por WhatsApp al +1 (939) 382-3332 o llamarnos directamente.';
  }

  return 'Puedo ayudarte con productos, precios, pedidos, envíos, devoluciones y más. También puedes contactarnos por WhatsApp al +1 (939) 382-3332. ¿Qué necesitas?';
}
