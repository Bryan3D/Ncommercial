import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockProducts } from '@/lib/mock-data';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, sku, barcode, price, comparePrice, stock,
      categoryId, brand, imageUrl, description, featured,
    } = body;

    if (!name || !sku || !barcode || price == null || stock == null || !categoryId || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Make slug unique if a collision exists
    const baseSlug = toSlug(name);
    const existing = await prisma.product.count({ where: { slug: { startsWith: baseSlug } } });
    const slug = existing === 0 ? baseSlug : `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        barcode,
        price: Number(price),
        comparePrice: comparePrice ? Number(comparePrice) : null,
        stock: Number(stock),
        categoryId,
        brand: brand || null,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600',
        description,
        featured: Boolean(featured),
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    // Unique constraint violation (sku or barcode already exists)
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'SKU or barcode already exists' }, { status: 409 });
    }
    console.error('[POST /api/products]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() ?? '';

  try {
    const products = await prisma.product.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { sku: { contains: q, mode: 'insensitive' } },
              { barcode: { contains: q } },
              { brand: { contains: q, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: { category: true },
      take: 30,
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(products);
  } catch {
    // DB unavailable — search mock data
    const results = q
      ? mockProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.barcode.includes(q) ||
            (p.brand ?? '').toLowerCase().includes(q)
        )
      : mockProducts.slice(0, 30);
    return NextResponse.json(results);
  }
}
