import { NextRequest, NextResponse } from 'next/server';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { inventoryService } from '@/lib/inventory-service';
import { eventBus } from '@/lib/event-bus';
import '@/lib/whatsapp-observer'; // register WhatsApp listeners

export async function POST(req: NextRequest) {
  try {
    const { items, customer, totals } = await req.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Verify stock before accepting the order
    const stockCheck = await inventoryService.checkAvailability(
      items.map((it: { productId: string; quantity: number }) => ({
        productId: it.productId,
        quantity: it.quantity,
      }))
    );
    if (!stockCheck.available) {
      return NextResponse.json(
        { error: 'Some items are out of stock', insufficientItems: stockCheck.insufficientItems },
        { status: 409 }
      );
    }

    // Generate order number
    const orderNumber = 'NC-' + Date.now().toString().slice(-8);

    // Persist order (pending) to DB
    let order;
    try {
      order = await prisma.order.create({
        data: {
          orderNumber,
          guestEmail: customer.email,
          guestName: customer.name,
          guestPhone: customer.phone,
          status: 'PENDING',
          subtotal: totals.subtotal,
          tax: totals.tax,
          shipping: totals.shipping,
          total: totals.total,
          items: {
            create: items.map((it: { productId: string; quantity: number; price: number }) => ({
              productId: it.productId,
              quantity: it.quantity,
              price: it.price,
            })),
          },
        },
      });
    } catch (dbError) {
      console.warn('[checkout] DB unavailable, mocking order:', dbError);
      order = { id: 'mock', orderNumber };
    }

    // Create Stripe checkout session — payment confirmation handled by the webhook
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_dummy') {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: items.map((it: { name: string; price: number; quantity: number; imageUrl: string }) => ({
          price_data: {
            currency: 'usd',
            product_data: { name: it.name, images: [it.imageUrl] },
            unit_amount: formatAmountForStripe(it.price),
          },
          quantity: it.quantity,
        })),
        customer_email: customer.email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?order=${orderNumber}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
        metadata: { orderNumber, orderId: order.id },
      });

      return NextResponse.json({ url: session.url, orderNumber });
    }

    // Demo fallback (no Stripe configured) — emit order.paid so the observer sends WhatsApp
    await eventBus.emit('order.paid', {
      orderNumber,
      customerPhone: customer.phone,
      customerName: customer.name,
      items: items.map((it: { name: string; quantity: number; price: number }) => ({
        name: it.name,
        quantity: it.quantity,
        price: it.price,
      })),
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      paymentType: 'CARD',
    });

    return NextResponse.json({ orderNumber, mock: true });
  } catch (e) {
    console.error('[checkout]', e);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
