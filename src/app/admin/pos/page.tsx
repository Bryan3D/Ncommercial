'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search, ShoppingCart, Trash2, Plus, Minus, Printer,
  MessageSquare, X, Banknote, CreditCard, BookOpen, CheckCircle,
} from 'lucide-react';
import type { Product } from '@/types';

interface CartLine {
  productId: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  sku: string;
  imageUrl: string;
}

interface ReceiptData {
  orderNumber: string;
  paymentType: 'CASH' | 'CARD' | 'CREDIT';
  subtotal: number;
  tax: number;
  total: number;
  change: number;
  items: CartLine[];
  customerName?: string;
  customerPhone?: string;
}

const TAX_RATE = 0.115;

function buildReceiptHTML(r: ReceiptData): string {
  const payLabel =
    r.paymentType === 'CASH' ? 'Efectivo' : r.paymentType === 'CARD' ? 'Tarjeta' : 'Crédito';
  const rows = r.items
    .map(
      (i) => `
        <tr><td colspan="2">${i.name}</td></tr>
        <tr>
          <td style="padding-left:8px;color:#555">${i.quantity} × $${i.price.toFixed(2)}</td>
          <td style="text-align:right">$${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Recibo ${r.orderNumber}</title>
  <style>
    body{font-family:'Courier New',monospace;font-size:13px;padding:16px;max-width:300px;margin:0 auto}
    h2{text-align:center;font-size:16px;margin-bottom:4px}
    .center{text-align:center}
    hr{border:none;border-top:1px dashed #666;margin:8px 0}
    table{width:100%;border-collapse:collapse}
    td{padding:2px 0;vertical-align:top}
    .total td{font-weight:bold;font-size:15px;border-top:1px solid #333;padding-top:4px}
    .footer{text-align:center;margin-top:12px;font-size:11px;color:#555}
  </style>
</head>
<body>
  <h2>Naguabo Commercial</h2>
  <p class="center" style="margin:0;font-size:11px">Naguabo, Puerto Rico</p>
  <hr/>
  <p><strong>Recibo:</strong> ${r.orderNumber}</p>
  <p><strong>Pago:</strong> ${payLabel}</p>
  ${r.customerName ? `<p><strong>Cliente:</strong> ${r.customerName}</p>` : ''}
  <hr/>
  <table>${rows}</table>
  <hr/>
  <table>
    <tr><td>Subtotal</td><td style="text-align:right">$${r.subtotal.toFixed(2)}</td></tr>
    <tr><td>IVU (11.5%)</td><td style="text-align:right">$${r.tax.toFixed(2)}</td></tr>
    <tr class="total"><td>TOTAL</td><td style="text-align:right">$${r.total.toFixed(2)}</td></tr>
    ${r.paymentType === 'CASH' ? `
    <tr><td>Recibido</td><td style="text-align:right">$${(r.total + r.change).toFixed(2)}</td></tr>
    <tr><td><strong>Cambio</strong></td><td style="text-align:right"><strong>$${r.change.toFixed(2)}</strong></td></tr>
    ` : ''}
    ${r.paymentType === 'CREDIT' ? `<tr><td colspan="2" style="color:#c2410c">Pendiente de pago — ${r.customerName}</td></tr>` : ''}
  </table>
  <div class="footer">
    <p>¡Gracias por su compra!</p>
    <p>${new Date().toLocaleString('es-PR')}</p>
  </div>
</body>
</html>`;
}

function POSTerminal() {
  const searchParams = useSearchParams();
  const paidOrder = searchParams.get('paid');

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [modal, setModal] = useState<null | 'cash' | 'credit'>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [tendered, setTendered] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show card payment success banner when redirected back from Stripe
  useEffect(() => {
    if (paidOrder) {
      setReceipt({
        orderNumber: paidOrder,
        paymentType: 'CARD',
        subtotal: 0,
        tax: 0,
        total: 0,
        change: 0,
        items: [],
      });
    }
  }, [paidOrder]);

  // Debounced product search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
        setResults(await res.json());
      } catch {
        setResults([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((l) =>
          l.productId === product.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          quantity: 1,
          sku: product.sku,
          imageUrl: product.imageUrl,
        },
      ];
    });
  }, []);

  const updateQty = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const subtotal = cart.reduce((s, l) => s + l.price * l.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const tenderedNum = parseFloat(tendered) || 0;
  const change = modal === 'cash' ? Math.max(0, tenderedNum - total) : 0;
  const insufficientCash = modal === 'cash' && tendered !== '' && tenderedNum < total;

  const submitOrder = async (paymentType: 'CASH' | 'CARD' | 'CREDIT') => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pos/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((l) => ({
            productId: l.productId,
            name: l.name,
            price: l.price,
            quantity: l.quantity,
          })),
          customer: customer.name || customer.phone ? customer : undefined,
          paymentType,
          tenderedAmount: paymentType === 'CASH' ? tenderedNum : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Error processing sale');
        return;
      }
      if (paymentType === 'CARD' && data.url) {
        window.location.href = data.url;
        return;
      }
      setReceipt({
        orderNumber: data.orderNumber,
        paymentType,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        change: data.change ?? 0,
        items: [...cart],
        customerName: customer.name || undefined,
        customerPhone: customer.phone || undefined,
      });
      setCart([]);
      setModal(null);
      setTendered('');
      setCustomer({ name: '', phone: '' });
      setQuery('');
      setResults([]);
    } catch {
      setError('Network error — try again');
    } finally {
      setIsLoading(false);
    }
  };

  const printReceipt = () => {
    if (!receipt || receipt.items.length === 0) return;
    const w = window.open('', '_blank', 'width=400,height=600');
    if (!w) return;
    w.document.write(buildReceiptHTML(receipt));
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 250);
  };

  const newSale = () => {
    setReceipt(null);
    // remove ?paid= param from URL without reloading
    window.history.replaceState(null, '', '/admin/pos');
  };

  return (
    <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 160px)', minHeight: 480 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-brand" /> POS Terminal
        </h1>
        {cart.length > 0 && (
          <button
            onClick={() => setCart([])}
            className="text-sm text-red-500 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" /> Clear cart
          </button>
        )}
      </div>

      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* ── Left: product search ── */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, SKU, or barcode…"
              className="w-full pl-9 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              autoFocus
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1 space-y-1 pr-1">
            {results.length === 0 && query && (
              <p className="text-center text-gray-400 py-10 text-sm">No products found</p>
            )}
            {results.length === 0 && !query && (
              <div className="text-center text-gray-400 py-10 text-sm">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Type a product name, SKU, or scan a barcode
              </div>
            )}
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="flex items-center gap-3 p-3 border rounded-lg hover:border-brand hover:bg-brand/5 cursor-pointer transition-colors"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{product.name}</div>
                  <div className="text-xs text-gray-500">
                    {product.sku}
                    {product.brand ? ` · ${product.brand}` : ''}
                    {' · '}
                    <span className={product.stock === 0 ? 'text-red-500' : product.stock < 5 ? 'text-yellow-600' : 'text-green-600'}>
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-brand">${product.price.toFixed(2)}</div>
                  <div className="text-xs mt-0.5 bg-brand text-white px-2 py-0.5 rounded">
                    + Add
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: cart + payment ── */}
        <div className="w-80 flex flex-col gap-3 flex-shrink-0">
          {/* Cart items */}
          <div className="card p-4 flex flex-col overflow-hidden" style={{ flex: '1 1 0' }}>
            <h2 className="font-bold mb-3 flex items-center gap-2 text-sm flex-shrink-0">
              <ShoppingCart className="w-4 h-4" />
              Cart&nbsp;
              <span className="text-gray-500 font-normal">
                ({cart.reduce((s, l) => s + l.quantity, 0)} items)
              </span>
            </h2>
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                No items yet
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 space-y-2">
                {cart.map((line) => (
                  <div key={line.productId} className="flex items-center gap-2 text-sm">
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium text-xs">{line.name}</div>
                      <div className="text-gray-500 text-xs">${line.price.toFixed(2)} ea</div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => updateQty(line.productId, -1)}
                        className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-semibold text-sm">{line.quantity}</span>
                      <button
                        onClick={() => updateQty(line.productId, 1)}
                        disabled={line.quantity >= line.stock}
                        className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="w-14 text-right font-semibold text-sm flex-shrink-0">
                      ${(line.price * line.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeFromCart(line.productId)}
                      className="text-red-400 hover:text-red-600 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          {cart.length > 0 && (
            <div className="card p-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IVU (11.5%)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-1 mt-1">
                <span>TOTAL</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-xs p-2 bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}

          {/* Payment buttons */}
          <div className="space-y-2">
            <button
              disabled={cart.length === 0 || isLoading}
              onClick={() => { setModal('cash'); setTendered(''); setError(null); }}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-40 transition-colors"
            >
              <Banknote className="w-5 h-5" /> Cash
            </button>
            <button
              disabled={cart.length === 0 || isLoading}
              onClick={() => { setError(null); submitOrder('CARD'); }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-40 transition-colors"
            >
              <CreditCard className="w-5 h-5" /> Card (Stripe)
            </button>
            <button
              disabled={cart.length === 0 || isLoading}
              onClick={() => { setModal('credit'); setCustomer({ name: '', phone: '' }); setError(null); }}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-40 transition-colors"
            >
              <BookOpen className="w-5 h-5" /> Credit / On Account
            </button>
          </div>
        </div>
      </div>

      {/* ── Cash modal ── */}
      {modal === 'cash' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Banknote className="w-5 h-5 text-green-600" /> Cash Payment
            </h2>
            <div className="text-3xl font-bold text-center">${total.toFixed(2)}</div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Amount received ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={tendered}
                onChange={(e) => setTendered(e.target.value)}
                placeholder={total.toFixed(2)}
                className="w-full border rounded-lg px-3 py-2 text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-brand"
                autoFocus
              />
            </div>

            {tendered !== '' && !insufficientCash && (
              <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Change</div>
                <div className="text-3xl font-bold text-green-700">${change.toFixed(2)}</div>
              </div>
            )}
            {insufficientCash && (
              <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 font-medium text-sm">
                Short by ${(total - tenderedNum).toFixed(2)}
              </div>
            )}

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Customer phone <span className="text-gray-400">(optional — WhatsApp receipt)</span>
              </label>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                placeholder="+1 787 555 0100"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setModal(null); setError(null); }}
                className="flex-1 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={!tendered || insufficientCash || isLoading}
                onClick={() => submitOrder('CASH')}
                className="flex-1 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-40"
              >
                {isLoading ? 'Processing…' : 'Confirm Sale'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Credit modal ── */}
      {modal === 'credit' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" /> Credit / On Account
            </h2>
            <div className="text-3xl font-bold text-center text-orange-600">
              Due: ${total.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 text-center">
              Items will be given to the customer. Payment is recorded as pending.
            </p>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Customer name *</label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                placeholder="Full name"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Phone <span className="text-gray-400">(optional — WhatsApp receipt)</span>
              </label>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                placeholder="+1 787 555 0100"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => { setModal(null); setError(null); }}
                className="flex-1 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={!customer.name.trim() || isLoading}
                onClick={() => submitOrder('CREDIT')}
                className="flex-1 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-40"
              >
                {isLoading ? 'Processing…' : 'Record Sale'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Receipt modal ── */}
      {receipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 shadow-xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold">Sale Complete!</h2>
              <p className="text-gray-500 text-sm font-mono">{receipt.orderNumber}</p>
              {receipt.paymentType === 'CARD' && (
                <p className="text-sm text-blue-600 mt-1">Card payment confirmed via Stripe</p>
              )}
            </div>

            {receipt.items.length > 0 && (
              <div className="border rounded-lg p-3 font-mono text-xs space-y-1 bg-gray-50 max-h-48 overflow-y-auto">
                {receipt.items.map((l) => (
                  <div key={l.productId} className="flex justify-between">
                    <span className="truncate max-w-[170px]">{l.name} ×{l.quantity}</span>
                    <span>${(l.price * l.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr className="border-dashed my-1" />
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>${receipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>IVU 11.5%</span><span>${receipt.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span>Total</span><span>${receipt.total.toFixed(2)}</span>
                </div>
                {receipt.paymentType === 'CASH' && receipt.change > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Change</span><span>${receipt.change.toFixed(2)}</span>
                  </div>
                )}
                {receipt.paymentType === 'CREDIT' && (
                  <div className="text-orange-600 pt-1">
                    On account — {receipt.customerName}
                  </div>
                )}
              </div>
            )}

            {receipt.customerPhone && (
              <p className="text-center text-xs text-green-600 flex items-center justify-center gap-1">
                <MessageSquare className="w-3 h-3" />
                WhatsApp receipt sent to {receipt.customerPhone}
              </p>
            )}

            <div className="flex gap-2">
              {receipt.items.length > 0 && (
                <button
                  onClick={printReceipt}
                  className="flex-1 py-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-sm font-medium"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
              )}
              <button
                onClick={newSale}
                className="flex-1 py-2 bg-brand text-white rounded-lg font-bold text-sm hover:bg-brand/90"
              >
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function POSPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading POS…</div>}>
      <POSTerminal />
    </Suspense>
  );
}
