// WhatsApp Business API integration for communication and ads
const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';

export const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '19393823332';

/**
 * Build a click-to-chat WhatsApp link.
 * Used throughout the site (chat button, ads, order confirmations).
 */
export function buildWhatsAppLink(message: string, phone?: string): string {
  const number = phone || WHATSAPP_NUMBER;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

/**
 * Send a message via the WhatsApp Business API.
 * Used for order confirmations, marketing campaigns, and the chat assistant.
 */
export async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) {
    console.warn('[WhatsApp] Missing API credentials, message not sent.');
    return false;
  }
  try {
    const res = await fetch(`${WHATSAPP_API_URL}/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body },
      }),
    });
    return res.ok;
  } catch (e) {
    console.error('[WhatsApp] send failed', e);
    return false;
  }
}

/**
 * Build a marketing/ad message for promotional campaigns.
 */
export function buildAdMessage(productName: string, price: number, url: string): string {
  return `🛠️ *Naguabo Commercial Special!*\n\n${productName}\n💰 Just $${price.toFixed(2)}\n\n👉 Order now: ${url}\n\n_Reply STOP to unsubscribe._`;
}
