import { prisma } from './prisma';
import { eventBus } from './event-bus';

const LOW_STOCK_THRESHOLD = 5;

interface StockItem {
  productId: string;
  quantity: number;
}

export interface InventoryResult {
  success: boolean;
  productId: string;
  previousStock: number;
  newStock: number;
  action: 'SELL' | 'RETURN' | 'RECEIVE' | 'AUDIT';
}

export interface StockCheckResult {
  available: boolean;
  insufficientItems: { productId: string; requested: number; available: number }[];
}

// Supported inventory actions tracked in BarcodeScan
export type InventoryAction = 'SELL' | 'RETURN' | 'RECEIVE' | 'AUDIT' | 'ADJUST';

class InventoryService {
  private static instance: InventoryService;

  private constructor() {}

  static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  /**
   * Deduct stock for each item in a paid order (SELL).
   * Logs a BarcodeScan record per item for traceability.
   */
  async deductForSale(
    items: StockItem[],
    orderRef?: string,
    performedBy = 'system'
  ): Promise<InventoryResult[]> {
    const results: InventoryResult[] = [];

    for (const item of items) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product) return null;

          const previousStock = product.stock;
          const newStock = Math.max(0, previousStock - item.quantity);

          await tx.product.update({
            where: { id: item.productId },
            data: { stock: newStock },
          });

          await tx.barcodeScan.create({
            data: {
              barcode: product.barcode,
              productId: item.productId,
              action: 'SELL',
              quantity: -item.quantity,
              scannedBy: performedBy,
              notes: orderRef ? `Order: ${orderRef}` : 'Manual sale',
            },
          });

          return {
            previousStock,
            newStock,
            productName: product.name,
            sku: product.sku,
          };
        });

        // Emit low-stock alert when stock falls to or below the threshold
        if (result && result.newStock <= LOW_STOCK_THRESHOLD) {
          eventBus.emit('inventory.low_stock', {
            productId: item.productId,
            productName: result.productName,
            sku: result.sku,
            currentStock: result.newStock,
            threshold: LOW_STOCK_THRESHOLD,
          }).catch(() => {});
        }

        results.push({
          success: !!result,
          productId: item.productId,
          previousStock: result?.previousStock ?? 0,
          newStock: result?.newStock ?? 0,
          action: 'SELL',
        });
      } catch (e) {
        console.error(`[inventory] deductForSale failed for ${item.productId}:`, e);
        results.push({ success: false, productId: item.productId, previousStock: 0, newStock: 0, action: 'SELL' });
      }
    }

    return results;
  }

  /**
   * Restore stock for each item in a credit/return (RETURN).
   * Logs a BarcodeScan record per item for traceability.
   */
  async restoreForCredit(
    items: StockItem[],
    orderRef?: string,
    reason?: string,
    performedBy = 'system'
  ): Promise<InventoryResult[]> {
    const results: InventoryResult[] = [];

    for (const item of items) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product) return null;

          const previousStock = product.stock;
          const newStock = previousStock + item.quantity;

          await tx.product.update({
            where: { id: item.productId },
            data: { stock: newStock },
          });

          await tx.barcodeScan.create({
            data: {
              barcode: product.barcode,
              productId: item.productId,
              action: 'RETURN',
              quantity: item.quantity,
              scannedBy: performedBy,
              notes: [orderRef ? `Order: ${orderRef}` : null, reason ?? 'Customer return']
                .filter(Boolean)
                .join(' | '),
            },
          });

          return { previousStock, newStock };
        });

        results.push({
          success: !!result,
          productId: item.productId,
          previousStock: result?.previousStock ?? 0,
          newStock: result?.newStock ?? 0,
          action: 'RETURN',
        });
      } catch (e) {
        console.error(`[inventory] restoreForCredit failed for ${item.productId}:`, e);
        results.push({ success: false, productId: item.productId, previousStock: 0, newStock: 0, action: 'RETURN' });
      }
    }

    return results;
  }

  /**
   * Fetch all items from a PAID order and deduct them from stock.
   * Called automatically by the Stripe webhook on payment confirmation.
   */
  async processOrderPayment(orderId: string, performedBy = 'system'): Promise<InventoryResult[]> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order) return [];

      return this.deductForSale(
        order.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        order.orderNumber,
        performedBy
      );
    } catch (e) {
      console.error('[inventory] processOrderPayment failed:', e);
      return [];
    }
  }

  /**
   * Fetch all items from an order and restore them to stock.
   * Call this when an order is credited (returned / refunded).
   */
  async processOrderCredit(
    orderId: string,
    reason?: string,
    performedBy = 'system'
  ): Promise<InventoryResult[]> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order) return [];

      return this.restoreForCredit(
        order.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        order.orderNumber,
        reason,
        performedBy
      );
    } catch (e) {
      console.error('[inventory] processOrderCredit failed:', e);
      return [];
    }
  }

  /**
   * Verify that all requested items can be fulfilled before accepting an order.
   */
  async checkAvailability(items: StockItem[]): Promise<StockCheckResult> {
    const insufficientItems: StockCheckResult['insufficientItems'] = [];

    for (const item of items) {
      try {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        });
        if (!product || product.stock < item.quantity) {
          insufficientItems.push({
            productId: item.productId,
            requested: item.quantity,
            available: product?.stock ?? 0,
          });
        }
      } catch {
        // DB unavailable — skip check and allow (demo-safe)
      }
    }

    return { available: insufficientItems.length === 0, insufficientItems };
  }

  /** Get the current stock level for a single product. */
  async getStockLevel(productId: string): Promise<number> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { stock: true },
      });
      return product?.stock ?? 0;
    } catch {
      return 0;
    }
  }

  /** Add stock for a received shipment / purchase order. */
  async receiveStock(
    productId: string,
    quantity: number,
    notes?: string,
    performedBy = 'system'
  ): Promise<InventoryResult | null> {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { id: productId } });
        if (!product) return null;

        const previousStock = product.stock;
        const newStock = previousStock + quantity;

        await tx.product.update({ where: { id: productId }, data: { stock: newStock } });
        await tx.barcodeScan.create({
          data: {
            barcode: product.barcode,
            productId,
            action: 'RECEIVE',
            quantity,
            scannedBy: performedBy,
            notes,
          },
        });

        return { previousStock, newStock };
      });

      if (!result) return null;
      return { success: true, productId, ...result, action: 'RECEIVE' };
    } catch (e) {
      console.error(`[inventory] receiveStock failed for ${productId}:`, e);
      return null;
    }
  }

  /** Set exact stock count from a physical audit. */
  async auditStock(
    productId: string,
    exactQuantity: number,
    notes?: string,
    performedBy = 'system'
  ): Promise<InventoryResult | null> {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { id: productId } });
        if (!product) return null;

        const previousStock = product.stock;
        const newStock = Math.max(0, exactQuantity);

        await tx.product.update({ where: { id: productId }, data: { stock: newStock } });
        await tx.barcodeScan.create({
          data: {
            barcode: product.barcode,
            productId,
            action: 'AUDIT',
            quantity: newStock,
            scannedBy: performedBy,
            notes,
          },
        });

        return { previousStock, newStock };
      });

      if (!result) return null;
      return { success: true, productId, ...result, action: 'AUDIT' };
    } catch (e) {
      console.error(`[inventory] auditStock failed for ${productId}:`, e);
      return null;
    }
  }
}

export const inventoryService = InventoryService.getInstance();
