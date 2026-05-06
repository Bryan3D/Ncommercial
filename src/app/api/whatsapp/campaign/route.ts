import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, buildAdMessage } from '@/lib/whatsapp';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipients, message, productId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let phones: string[] = Array.isArray(recipients) ? recipients : [];

    // If no recipients provided, try to use opted-in users from DB
    if (phones.length === 0) {
      try {
        const users = await prisma.user.findMany({
          where: { phone: { not: null } },
          select: { phone: true },
        });
        phones = users.map((u) => u.phone!).filter(Boolean);
      } catch {
        // Fallback to empty - will return queued: 0
        phones = [];
      }
    }

    let finalMessage = message;
    if (productId) {
      try {
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (product) {
          finalMessage = buildAdMessage(product.name, product.price, product.slug);
        }
      } catch {
        // Use original message
      }
    }

    let queued = 0;
    for (const phone of phones) {
      const ok = await sendWhatsAppMessage(phone, finalMessage);
      if (ok) queued++;
    }

    return NextResponse.json({
      queued,
      total: phones.length,
      message: finalMessage,
    });
  } catch (error) {
    console.error('WhatsApp campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to queue campaign', queued: 0 },
      { status: 500 }
    );
  }
}
