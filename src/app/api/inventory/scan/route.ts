import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    // In production, restrict to ADMIN/STAFF
    // if (!session || (session.role !== 'ADMIN' && session.role !== 'STAFF')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { barcode, productId, action, quantity, notes } = await req.json();
    if (!barcode || !action) {
      return NextResponse.json({ error: 'barcode and action are required' }, { status: 400 });
    }

    // Log the scan
    try {
      await prisma.barcodeScan.create({
        data: {
          barcode,
          productId,
          action,
          quantity: Number(quantity),
          scannedBy: session?.userId || 'unknown',
          notes,
        },
      });
    } catch (e) {
      console.warn('[scan] DB unavailable, skipped log', e);
    }

    // Update stock
    if (productId) {
      try {
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (product) {
          const newStock = action === 'AUDIT'
            ? Math.max(0, Number(quantity))
            : Math.max(0, product.stock + Number(quantity));
          await prisma.product.update({ where: { id: productId }, data: { stock: newStock } });
          return NextResponse.json({ ok: true, newStock });
        }
      } catch (e) {
        console.warn('[scan] DB update failed', e);
      }
    }

    return NextResponse.json({ ok: true, mock: true });
  } catch (e) {
    console.error('[scan]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
