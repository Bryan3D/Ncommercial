import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { inventoryService } from '@/lib/inventory-service';
import { eventBus } from '@/lib/event-bus';
import { getSessionUser } from '@/lib/auth';
import '@/lib/whatsapp-observer'; // register WhatsApp listeners

const TAX_RATE = 0.115; // Puerto Rico IVU 11.5%

interface POSItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    const { items, customer, paymentType, tenderedAmount } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }
    if (!['CASH', 'CARD', 'CREDIT'].includes(paymentType)) {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
    }
    if (paymentType === 'CREDIT' && !customer?.name?.trim()) {
      return NextResponse.json({ error: 'Customer name required for credit sales' }, { status: 400 });
    }

    // Verify stock before accepting the order
    const stockCheck = await inventoryService.checkAvailability(
      items.map((it: POSItem) => ({ productId: it.productId, quantity: it.quantity }))
    );
    if (!stockCheck.available) {
      return NextResponse.json(
        { error: 'Some items are out of stock', insufficientItems: stockCheck.insufficientItems },
        { status: 409 }
      );
    }

    const subtotal = items.reduce((s: number, it: POSItem) => s + it.price * it.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    const orderNumber = 'POS-' + Date.now().toString().slice(-8);
    const performedBy = session?.userId ?? 'pos-cashier';

    // Persist order to DB
    let order: { id: string; orderNumber: string } = { id: 'mock', orderNumber };
    try {
      order = await prisma.order.create({
        data: {
          orderNumber,
          guestName: customer?.name,
          guestPhone: customer?.phone,
          status: paymentType === 'CARD' ? 'PENDING' : 'PAID',
          subtotal,
          tax,
          shipping: 0,
          total,
          paymentStatus:
            paymentType === 'CASH' ? 'paid' : paymentType === 'CREDIT' ? 'credit' : 'pending',
          items: {
            create: items.map((it: POSItem) => ({
              productId: it.productId,
              quantity: it.quantity,
              price: it.price,
            })),
          },
        },
      });
    } catch (dbError) {
      console.warn('[pos/order] DB unavailable, mocking order:', dbError);
    }

    // CARD → redirect to Stripe (inventory deducted by webhook on payment confirmation)
    if (paymentType === 'CARD') {
      if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_dummy') {
        const stripeSession = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: items.map((it: POSItem) => ({
            price_data: {
              currency: 'usd',
              product_data: { name: it.name },
              unit_amount: formatAmountForStripe(it.price),
            },
            quantity: it.quantity,
          })),
          customer_email: customer?.email,
          success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/pos?paid=${orderNumber}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/pos`,
          metadata: { orderNumber, orderId: order.id },
        });
        return NextResponse.json({ paymentType: 'CARD', url: stripeSession.url, orderNumber });
      }
      // Demo fallback — fall through and treat as CASH
    }

    // CASH / CREDIT → deduct inventory immediately
    if (order.id !== 'mock') {
      await inventoryService.processOrderPayment(order.id, performedBy);
    } else {
      await inventoryService.deductForSale(
        items.map((it: POSItem) => ({ productId: it.productId, quantity: it.quantity })),
        orderNumber,
        performedBy
      );
    }

    // Emit order.paid — the WhatsApp observer handles the receipt message
    await eventBus.emit('order.paid', {
      orderNumber,
      customerPhone: customer?.phone,
      customerName: customer?.name,
      items: items.map((it: POSItem) => ({
        name: it.name,
        quantity: it.quantity,
        price: it.price,
      })),
      subtotal,
      tax,
      total,
      paymentType: paymentType as 'CASH' | 'CARD' | 'CREDIT',
    });

    const change =
      paymentType === 'CASH' && tenderedAmount ? Math.max(0, tenderedAmount - total) : 0;

    return NextResponse.json({ paymentType, orderNumber, subtotal, tax, total, change });
  } catch (e) {
    console.error('[pos/order]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
