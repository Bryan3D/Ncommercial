import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockCategories } from '@/lib/mock-data';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(mockCategories);
  }
}
