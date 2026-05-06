'use client';
import { useCart } from '@/lib/cart-store';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const tax = subtotal * 0.115; // PR sales tax 11.5%
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-gray-600 mt-2">Looks like you haven't added anything yet.</p>
        <Link href="/store" className="btn-primary mt-6 inline-block">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="card p-4 flex gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded shrink-0" />
              <div className="flex-1">
                {item.brand && <div className="text-xs text-gray-500 uppercase font-semibold">{item.brand}</div>}
                <Link href={`/store`} className="font-semibold hover:text-brand line-clamp-2">{item.name}</Link>
                <div className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)} each</div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex border rounded">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 hover:bg-gray-100">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 hover:bg-gray-100">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside>
          <div className="card p-5 sticky top-32">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-700 font-semibold">FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between"><span>Tax (11.5%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            {subtotal < 99 && (
              <div className="mt-3 text-xs text-gray-600 bg-orange-50 p-2 rounded">
                Add ${(99 - subtotal).toFixed(2)} more for FREE shipping!
              </div>
            )}
            <Link href="/checkout" className="btn-primary w-full mt-4 block text-center">
              Proceed to Checkout
            </Link>
            <Link href="/store" className="btn-outline w-full mt-2 block text-center">
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
