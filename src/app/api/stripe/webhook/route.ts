import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { inventoryService } from '@/lib/inventory-service';
import { eventBus } from '@/lib/event-bus';
import '@/lib/whatsapp-observer'; // register WhatsApp listeners

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 });
  }

  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, secret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderNumber = session.metadata?.orderNumber;
      const orderId = session.metadata?.orderId;

      if (orderNumber) {
        // Mark order as PAID, fetching items + products for the event payload
        const order = await prisma.order.update({
          where: { orderNumber },
          data: { status: 'PAID', paymentStatus: 'paid', stripeId: session.id },
          include: {
            items: { include: { product: true } },
          },
        }).catch(() => null);

        // Deduct inventory for every item
        if (order?.id || orderId) {
          await inventoryService.processOrderPayment(
            order?.id ?? orderId!,
            'stripe-webhook'
          );
        }

        // Emit order.paid — observer sends WhatsApp receipt to the customer
        if (order) {
          await eventBus.emit('order.paid', {
            orderNumber: order.orderNumber,
            customerPhone: order.guestPhone ?? undefined,
            customerName: order.guestName ?? undefined,
            items: order.items.map((i) => ({
              name: i.product.name,
              quantity: i.quantity,
              price: i.price,
            })),
            subtotal: order.subtotal,
            tax: order.tax,
            total: order.total,
            paymentType: 'CARD',
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('Stripe webhook error:', e);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}
