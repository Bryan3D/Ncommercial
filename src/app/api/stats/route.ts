import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { SalesStats } from '@/types';

// Returns sales statistics: daily (30 days), monthly (12 months), and 6-month forecast.
// Falls back to mock data when DB is empty / unavailable.
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    }).catch(() => [] as Awaited<ReturnType<typeof prisma.order.findMany>>);

    if (!orders.length) {
      return NextResponse.json(generateMockStats());
    }

    // Real aggregation
    return NextResponse.json(buildStats(orders));
  } catch (e) {
    console.error('[stats]', e);
    return NextResponse.json(generateMockStats());
  }
}

interface OrderLike {
  total: number;
  createdAt: Date;
  items: Array<{ quantity: number; price: number; product?: { name: string } | null }>;
}

function buildStats(orders: OrderLike[]): SalesStats {
  const now = new Date();

  // Daily — last 30 days
  const daily: { date: string; revenue: number; orders: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayStart = new Date(d.setHours(0, 0, 0, 0));
    const dayEnd = new Date(d.setHours(23, 59, 59, 999));
    const dayOrders = orders.filter((o) => o.createdAt >= dayStart && o.createdAt <= dayEnd);
    daily.push({
      date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    });
  }

  // Monthly — last 12 months
  const monthly: { month: string; revenue: number; orders: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = d;
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const m = orders.filter((o) => o.createdAt >= monthStart && o.createdAt <= monthEnd);
    monthly.push({
      month: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      revenue: m.reduce((s, o) => s + o.total, 0),
      orders: m.length,
    });
  }

  // Forecast — linear regression on monthly data
  const forecast = projectNext6Months(monthly);

  // Top products
  const productAgg = new Map<string, { name: string; sold: number; revenue: number }>();
  for (const o of orders) {
    for (const it of o.items) {
      const name = it.product?.name || 'Unknown';
      const cur = productAgg.get(name) || { name, sold: 0, revenue: 0 };
      cur.sold += it.quantity;
      cur.revenue += it.price * it.quantity;
      productAgg.set(name, cur);
    }
  }
  const topProducts = Array.from(productAgg.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;

  return {
    daily, monthly, forecast, topProducts,
    totalRevenue, totalOrders,
    averageOrder: totalOrders ? totalRevenue / totalOrders : 0,
  };
}

// Linear regression projection
function projectNext6Months(monthly: { month: string; revenue: number }[]) {
  const n = monthly.length;
  if (n < 2) return [];
  const xMean = (n - 1) / 2;
  const yMean = monthly.reduce((s, m) => s + m.revenue, 0) / n;
  let num = 0, den = 0;
  monthly.forEach((m, i) => {
    num += (i - xMean) * (m.revenue - yMean);
    den += (i - xMean) ** 2;
  });
  const slope = den ? num / den : 0;
  const intercept = yMean - slope * xMean;

  const forecast: { month: string; projected: number }[] = [];
  const now = new Date();
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    forecast.push({
      month: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      projected: Math.max(0, Math.round(intercept + slope * (n - 1 + i))),
    });
  }
  return forecast;
}

// Mock stats for empty DB
function generateMockStats(): SalesStats {
  const daily: { date: string; revenue: number; orders: number }[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const base = 1500 + Math.sin(i / 5) * 400 + (i % 7 === 0 ? -300 : 0);
    daily.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.round(base + Math.random() * 500),
      orders: Math.round(15 + Math.random() * 12),
    });
  }
  const monthly: { month: string; revenue: number; orders: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthly.push({
      month: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      revenue: Math.round(35000 + i * 800 + Math.random() * 8000),
      orders: Math.round(280 + Math.random() * 80),
    });
  }
  const forecast = projectNext6Months(monthly);

  return {
    daily, monthly, forecast,
    topProducts: [
      { name: 'DEWALT 20V Cordless Drill', sold: 124, revenue: 24798.76 },
      { name: 'BEHR Premium Plus Paint', sold: 412, revenue: 13587.76 },
      { name: 'Quikrete Concrete Mix', sold: 1820, revenue: 11793.60 },
      { name: 'LED 60W Bulb 4-Pack', sold: 980, revenue: 9770.60 },
      { name: 'Moen Kitchen Faucet', sold: 58, revenue: 9222.00 },
      { name: 'Stanley Tape Measure', sold: 412, revenue: 6167.64 },
      { name: 'Romex 12/2 Wire', sold: 31, revenue: 5859.00 },
      { name: 'Miracle-Gro Soil', sold: 624, revenue: 5597.28 },
    ],
    totalRevenue: monthly.reduce((s, m) => s + m.revenue, 0),
    totalOrders: monthly.reduce((s, m) => s + m.orders, 0),
    averageOrder: 127.40,
  };
}
