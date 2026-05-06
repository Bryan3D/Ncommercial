import { NextRequest, NextResponse } from 'next/server';
import { mockProducts, mockCategories } from '@/lib/mock-data';

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

// Naguabo Commercial 24/7 chat assistant.
// Uses Anthropic Claude when ANTHROPIC_API_KEY is set, otherwise falls back
// to a pattern-based responder so the demo runs without any keys.
export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };
    const userMsg = messages[messages.length - 1]?.content || '';

    // Try Anthropic API first
    if (process.env.ANTHROPIC_API_KEY) {
      const systemPrompt = `You are the friendly 24/7 customer assistant for Naguabo Commercial, a hardware/home improvement store in Naguabo, Puerto Rico (similar to Home Depot or Lowe's). You speak both English and Spanish — match the customer's language. Help with product questions, prices, store hours (open 24/7 online, physical store 7am-9pm), shipping, returns, and recommendations. Be concise and friendly. If you can't help, suggest WhatsApp at (787) 555-1234.

Available product categories: ${mockCategories.map((c) => c.name).join(', ')}.
Sample products: ${mockProducts.slice(0, 5).map((p) => `${p.name} ($${p.price})`).join('; ')}.`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: systemPrompt,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ reply: data.content?.[0]?.text || 'How can I help?' });
      }
    }

    // Fallback rule-based responder so the demo works without any keys
    return NextResponse.json({ reply: ruleBasedReply(userMsg) });
  } catch (e) {
    console.error('[chat]', e);
    return NextResponse.json({
      reply: 'Sorry, I had trouble responding. Please try WhatsApp at (787) 555-1234.',
    });
  }
}

function ruleBasedReply(msg: string): string {
  const m = msg.toLowerCase();

  if (/horario|hours|open|abierto|cuándo|cuando/.test(m)) {
    return 'Estamos abiertos 24/7 online. Our physical store in Naguabo is open daily from 7 AM to 9 PM. ¿Algo más en lo que te pueda ayudar?';
  }
  if (/envío|shipping|delivery|entrega/.test(m)) {
    return 'We ship across Puerto Rico in 1-2 business days. Free shipping on orders over $99! You can also pick up in-store within 1 hour of ordering.';
  }
  if (/devolución|return|reembolso|refund/.test(m)) {
    return 'We offer 90-day returns on most items. Bring the item with the receipt to our Naguabo store, or contact us via WhatsApp to arrange a return.';
  }
  if (/pago|payment|pay|stripe|tarjeta|card/.test(m)) {
    return 'We accept Visa, Mastercard, Amex, ATH Móvil, and more — all secured by Stripe. You can also checkout as a guest, no account needed.';
  }
  if (/precio|price|cost|cuesta|cuanto/.test(m)) {
    const matches = mockProducts.filter((p) =>
      p.name.toLowerCase().split(' ').some((w) => w.length > 3 && m.includes(w.toLowerCase()))
    ).slice(0, 3);
    if (matches.length) {
      return matches.map((p) => `• ${p.name}: $${p.price.toFixed(2)}`).join('\n') + '\n\nWant me to add any to your cart?';
    }
  }
  if (/herramienta|tool|drill|saw|martillo/.test(m)) {
    return 'Tools we stock include the DEWALT 20V Cordless Drill ($199.99), RYOBI 18V Circular Saw ($79), and Stanley 25ft Tape Measure ($14.97). Browse all tools at /store?category=tools.';
  }
  if (/pintura|paint/.test(m)) {
    return 'BEHR Premium Plus Interior Paint is $32.98/gal in thousands of colors. Visit /store?category=paint to see more.';
  }
  if (/hola|hi|hello|buenos|good/.test(m)) {
    return '¡Hola! 👋 I can help with products, prices, orders, store hours, shipping, returns and more. ¿Qué buscas hoy?';
  }
  return `I can help with products, orders, shipping, returns, or store info. You can also reach a human via WhatsApp at (787) 555-1234. ¿Qué necesitas?`;
}
