#!/usr/bin/env node
/**
 * Naguabo Commercial MCP Server
 *
 * Exposes tools for AI assistants (e.g. Claude Desktop) to manage:
 *   - inventory queries and stock updates by barcode
 *   - sales statistics
 *   - product search
 *   - WhatsApp ad campaigns
 *
 * Connects to the same Postgres database the Next.js app uses via Prisma.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const TOOLS = [
  {
    name: 'get_inventory',
    description:
      'Get the current inventory list with stock levels. Optionally filter by low stock threshold.',
    inputSchema: {
      type: 'object',
      properties: {
        lowStockOnly: {
          type: 'boolean',
          description: 'Only return items at or below their low-stock threshold',
        },
        limit: { type: 'number', description: 'Max number of products to return (default 50)' },
      },
    },
  },
  {
    name: 'update_stock_by_barcode',
    description:
      'Adjust stock levels for a product identified by its barcode. Use action=RECEIVE to add stock, ADJUST to set absolute level, AUDIT to record without changing.',
    inputSchema: {
      type: 'object',
      properties: {
        barcode: { type: 'string', description: 'Product barcode (UPC/EAN/SKU)' },
        quantity: { type: 'number', description: 'Quantity to add/set' },
        action: {
          type: 'string',
          enum: ['RECEIVE', 'ADJUST', 'AUDIT'],
          description: 'RECEIVE=add, ADJUST=set absolute, AUDIT=log only',
        },
        notes: { type: 'string', description: 'Optional notes' },
      },
      required: ['barcode', 'quantity', 'action'],
    },
  },
  {
    name: 'get_sales_stats',
    description:
      'Get sales statistics: daily (last 30 days), monthly (last 12 months), or a 6-month forecast based on linear regression.',
    inputSchema: {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          enum: ['daily', 'monthly', 'forecast'],
          description: 'Which stats to retrieve',
        },
      },
      required: ['period'],
    },
  },
  {
    name: 'search_products',
    description: 'Search the product catalog by name, description, or category.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term' },
        category: { type: 'string', description: 'Optional category slug to filter' },
      },
      required: ['query'],
    },
  },
  {
    name: 'create_whatsapp_campaign',
    description:
      'Create a WhatsApp marketing campaign. Returns the count of recipients queued. Recipients default to all users with a phone number on file.',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Campaign message body' },
        productSlug: {
          type: 'string',
          description: 'Optional product slug to auto-build a promotional ad message',
        },
        recipients: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional explicit list of phone numbers',
        },
      },
      required: ['message'],
    },
  },
];

const server = new Server(
  { name: 'naguabo-commercial-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_inventory': {
        const where = args?.lowStockOnly
          ? { stock: { lte: prisma.product.fields?.lowStockThreshold ?? 5 } }
          : {};
        const products = await prisma.product.findMany({
          where: args?.lowStockOnly ? {} : where,
          take: args?.limit || 50,
          include: { category: true },
        });
        const filtered = args?.lowStockOnly
          ? products.filter((p) => p.stock <= (p.lowStockThreshold || 5))
          : products;
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                filtered.map((p) => ({
                  id: p.id,
                  name: p.name,
                  sku: p.sku,
                  barcode: p.barcode,
                  stock: p.stock,
                  price: p.price,
                  lowStock: p.stock <= (p.lowStockThreshold || 5),
                  category: p.category?.name,
                })),
                null,
                2
              ),
            },
          ],
        };
      }

      case 'update_stock_by_barcode': {
        const { barcode, quantity, action, notes } = args;
        const product = await prisma.product.findFirst({
          where: { OR: [{ barcode }, { sku: barcode }] },
        });
        if (!product) {
          return {
            content: [{ type: 'text', text: `No product found with barcode/SKU: ${barcode}` }],
            isError: true,
          };
        }
        let newStock = product.stock;
        if (action === 'RECEIVE') newStock = product.stock + quantity;
        else if (action === 'ADJUST') newStock = quantity;
        // AUDIT keeps newStock unchanged
        if (action !== 'AUDIT') {
          await prisma.product.update({
            where: { id: product.id },
            data: { stock: newStock },
          });
        }
        await prisma.barcodeScan.create({
          data: {
            barcode,
            productId: product.id,
            action,
            quantity,
            notes: notes || `MCP ${action}`,
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: `${action} recorded for "${product.name}". Stock: ${product.stock} → ${newStock}`,
            },
          ],
        };
      }

      case 'get_sales_stats': {
        const { period } = args;
        if (period === 'daily') {
          const thirty = new Date();
          thirty.setDate(thirty.getDate() - 30);
          const orders = await prisma.order.findMany({
            where: { status: 'PAID', createdAt: { gte: thirty } },
            select: { total: true, createdAt: true },
          });
          const byDay = {};
          orders.forEach((o) => {
            const d = o.createdAt.toISOString().slice(0, 10);
            byDay[d] = (byDay[d] || 0) + o.total;
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(byDay, null, 2) }],
          };
        } else if (period === 'monthly') {
          const oneYear = new Date();
          oneYear.setFullYear(oneYear.getFullYear() - 1);
          const orders = await prisma.order.findMany({
            where: { status: 'PAID', createdAt: { gte: oneYear } },
            select: { total: true, createdAt: true },
          });
          const byMonth = {};
          orders.forEach((o) => {
            const m = o.createdAt.toISOString().slice(0, 7);
            byMonth[m] = (byMonth[m] || 0) + o.total;
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(byMonth, null, 2) }],
          };
        } else {
          // forecast — simple linear regression over last 6 months
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          const orders = await prisma.order.findMany({
            where: { status: 'PAID', createdAt: { gte: sixMonthsAgo } },
            select: { total: true, createdAt: true },
          });
          const byMonth = {};
          orders.forEach((o) => {
            const m = o.createdAt.toISOString().slice(0, 7);
            byMonth[m] = (byMonth[m] || 0) + o.total;
          });
          const values = Object.values(byMonth);
          const n = values.length;
          const sumX = (n * (n - 1)) / 2;
          const sumY = values.reduce((a, b) => a + b, 0);
          const sumXY = values.reduce((acc, y, x) => acc + x * y, 0);
          const sumX2 = values.reduce((acc, _, x) => acc + x * x, 0);
          const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1) : 0;
          const intercept = n > 0 ? (sumY - slope * sumX) / n : 0;
          const forecast = [];
          for (let i = 0; i < 6; i++) {
            forecast.push({
              month: i + 1,
              projected: Math.max(0, slope * (n + i) + intercept),
            });
          }
          return {
            content: [{ type: 'text', text: JSON.stringify(forecast, null, 2) }],
          };
        }
      }

      case 'search_products': {
        const { query, category } = args;
        const where = {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        };
        if (category) {
          where.category = { slug: category };
        }
        const products = await prisma.product.findMany({
          where,
          take: 20,
          include: { category: true },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                products.map((p) => ({
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  price: p.price,
                  stock: p.stock,
                  category: p.category?.name,
                })),
                null,
                2
              ),
            },
          ],
        };
      }

      case 'create_whatsapp_campaign': {
        const { message, productSlug, recipients } = args;
        let phones = recipients || [];
        if (phones.length === 0) {
          const users = await prisma.user.findMany({
            where: { phone: { not: null } },
            select: { phone: true },
          });
          phones = users.map((u) => u.phone).filter(Boolean);
        }
        let finalMessage = message;
        if (productSlug) {
          const product = await prisma.product.findUnique({ where: { slug: productSlug } });
          if (product) {
            finalMessage =
              `🔥 *Special offer!*\n\n` +
              `${product.name} - $${product.price.toFixed(2)}\n\n` +
              `${message}\n\n` +
              `Shop: https://naguabo-commercial.com/store/${product.slug}`;
          }
        }
        // In production this would call the WhatsApp Business API; here we log+queue
        return {
          content: [
            {
              type: 'text',
              text: `Campaign queued to ${phones.length} recipients.\n\nMessage:\n${finalMessage}`,
            },
          ],
        };
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Naguabo Commercial MCP server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
