// Typed event bus — singleton that survives HMR (same pattern as prisma.ts).
// Emit events from any server-side code; observers subscribe once at module load.

export type Listener<T = unknown> = (payload: T) => void | Promise<void>;

/** Central registry of all application events and their payload shapes. */
export interface AppEvents {
  /** Fired when an order is fully paid (cash, card confirmed by Stripe, or credit). */
  'order.paid': {
    orderNumber: string;
    customerPhone?: string;
    customerName?: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    subtotal: number;
    tax: number;
    total: number;
    paymentType: 'CASH' | 'CARD' | 'CREDIT';
  };
  /** Fired when a previously paid order is credited / returned. */
  'order.credited': {
    orderNumber: string;
    customerPhone?: string;
    customerName?: string;
    total: number;
    reason?: string;
  };
  /** Fired by InventoryService after a SELL deduction drives stock to the low threshold. */
  'inventory.low_stock': {
    productId: string;
    productName: string;
    sku: string;
    currentStock: number;
    threshold: number;
  };
}

class EventBus {
  private static instance: EventBus;
  private listeners = new Map<string, Listener[]>();

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on<K extends keyof AppEvents>(event: K, listener: Listener<AppEvents[K]>): void {
    const list = this.listeners.get(event) ?? [];
    // Guard against duplicate registration caused by HMR re-evaluation
    if (!list.includes(listener as Listener)) {
      this.listeners.set(event, [...list, listener as Listener]);
    }
  }

  off<K extends keyof AppEvents>(event: K, listener: Listener<AppEvents[K]>): void {
    const list = this.listeners.get(event) ?? [];
    this.listeners.set(event, list.filter((l) => l !== (listener as Listener)));
  }

  /**
   * Emit an event and await all registered handlers concurrently.
   * A failing handler logs an error but does not interrupt others.
   */
  async emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]): Promise<void> {
    const handlers = this.listeners.get(event) ?? [];
    if (handlers.length === 0) return;

    const results = await Promise.allSettled(
      handlers.map((h) => h(payload as unknown))
    );
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[EventBus] Handler ${i} for "${event}" threw:`, r.reason);
      }
    });
  }

  /** Returns the number of listeners registered for a given event (useful for tests). */
  listenerCount(event: keyof AppEvents): number {
    return this.listeners.get(event)?.length ?? 0;
  }
}

const globalForBus = global as unknown as { eventBus: EventBus };
export const eventBus = globalForBus.eventBus || EventBus.getInstance();
if (process.env.NODE_ENV !== 'production') globalForBus.eventBus = eventBus;
