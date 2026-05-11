// WhatsApp observer — registers listeners on the EventBus at module load time.
// Import this file as a side-effect in any route that emits application events:
//   import '@/lib/whatsapp-observer';
//
// Adding a new notification type only requires a new eventBus.on() call here —
// no changes needed in the routes that emit events.

import { eventBus } from './event-bus';
import { sendWhatsAppMessage, WHATSAPP_NUMBER } from './whatsapp';

// Manager phone receives low-stock alerts. Falls back to the store's own number.
const MANAGER_PHONE = process.env.WHATSAPP_MANAGER_PHONE || WHATSAPP_NUMBER;

// ── order.paid ────────────────────────────────────────────────────────────────
// Sends an itemised receipt to the customer.
eventBus.on('order.paid', async (e) => {
  if (!e.customerPhone) return;

  const payLabel =
    e.paymentType === 'CASH'
      ? 'Efectivo'
      : e.paymentType === 'CREDIT'
      ? 'Crédito'
      : 'Tarjeta';

  const lines = e.items
    .map((i) => `  ${i.name} ×${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
    .join('\n');

  await sendWhatsAppMessage(
    e.customerPhone,
    `🛠️ *Naguabo Commercial*\n` +
    `Recibo: *${e.orderNumber}*\n\n` +
    `${lines}\n\n` +
    `Subtotal: $${e.subtotal.toFixed(2)}\n` +
    `IVU (11.5%): $${e.tax.toFixed(2)}\n` +
    `*Total: $${e.total.toFixed(2)}*\n` +
    `Pago: ${payLabel}\n\n` +
    `¡Gracias por su compra! 🙏`
  );
});

// ── order.credited ────────────────────────────────────────────────────────────
// Notifies the customer that their return/credit has been processed.
eventBus.on('order.credited', async (e) => {
  if (!e.customerPhone) return;

  await sendWhatsAppMessage(
    e.customerPhone,
    `🛠️ *Naguabo Commercial*\n` +
    `Su crédito para el pedido *${e.orderNumber}* fue procesado.\n` +
    `Monto: *$${e.total.toFixed(2)}*\n` +
    (e.reason ? `Razón: ${e.reason}\n` : '') +
    `¡Gracias! Contáctenos si tiene preguntas.`
  );
});

// ── inventory.low_stock ───────────────────────────────────────────────────────
// Alerts the store manager when a product falls below the minimum threshold.
eventBus.on('inventory.low_stock', async (e) => {
  await sendWhatsAppMessage(
    MANAGER_PHONE,
    `⚠️ *Naguabo Commercial — Inventario Bajo*\n\n` +
    `*${e.productName}*\n` +
    `SKU: ${e.sku}\n` +
    `Stock actual: *${e.currentStock}* unidades\n` +
    `Umbral mínimo: ${e.threshold}\n\n` +
    `Por favor realice un pedido de reposición.`
  );
});
