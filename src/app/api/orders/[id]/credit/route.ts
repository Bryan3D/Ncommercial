import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inventoryService } from '@/lib/inventory-service';
import { eventBus } from '@/lib/event-bus';
import { getSessionUser } from '@/lib/auth';
import '@/lib/whatsapp-observer'; // register WhatsApp listeners

/**
 * POST /api/orders/[id]/credit
 *
 * Marks an order as CANCELLED, restores all item quantities to stock,
 * and emits order.credited so the WhatsApp observer notifies the customer.
 *
 * Body: { reason?: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    // Restrict to ADMIN / STAFF in production
    // if (!session || (session.role !== 'ADMIN' && session.role !== 'STAFF')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id } = params;
    const { reason } = await req.json().catch(() => ({ reason: undefined }));

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Order is already cancelled' }, { status: 409 });
    }

    await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED', paymentStatus: 'refunded' },
    });

    const inventoryRestored = await inventoryService.processOrderCredit(
      id,
      reason ?? 'Order credit / return',
      session?.userId ?? 'admin'
    );

    // Emit order.credited — observer sends WhatsApp notification to the customer
    await eventBus.emit('order.credited', {
      orderNumber: order.orderNumber,
      customerPhone: order.guestPhone ?? undefined,
      customerName: order.guestName ?? undefined,
      total: order.total,
      reason,
    });

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      inventoryRestored,
    });
  } catch (e) {
    console.error('[orders/credit]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
