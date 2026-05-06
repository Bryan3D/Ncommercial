'use client';
import { useCart } from '@/lib/cart-store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, UserPlus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

type CheckoutMode = 'guest' | 'login' | 'register';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<CheckoutMode>('guest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '', name: '', phone: '', password: '',
    address: '', city: '', zip: '',
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold">Cart is empty</h1>
        <Link href="/store" className="btn-primary mt-6 inline-block">Shop now</Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const tax = subtotal * 0.115;
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // If user is registering, create the account first
      if (mode === 'register') {
        const reg = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email, name: form.name,
            phone: form.phone, password: form.password,
          }),
        });
        if (!reg.ok) {
          const d = await reg.json();
          throw new Error(d.error || 'Registration failed');
        }
      }

      // Create Stripe checkout session
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items, customer: form, mode,
          totals: { subtotal, tax, shipping, total },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      // For demo: clear cart and go to success page.
      // In production, redirect to Stripe Checkout URL: window.location.href = data.url
      if (data.url) {
        window.location.href = data.url;
      } else {
        clearCart();
        router.push(`/checkout/success?order=${data.orderNumber}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Account selection */}
          <div className="card p-5">
            <h2 className="font-bold text-lg mb-4">How would you like to checkout?</h2>
            <div className="grid sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMode('guest')}
                className={`border-2 rounded-md p-3 text-left ${mode === 'guest' ? 'border-brand bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <ShoppingBag className="w-5 h-5 mb-1 text-brand" />
                <div className="font-semibold text-sm">Guest</div>
                <div className="text-xs text-gray-500">Fast — no account needed</div>
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`border-2 rounded-md p-3 text-left ${mode === 'login' ? 'border-brand bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <User className="w-5 h-5 mb-1 text-brand" />
                <div className="font-semibold text-sm">Sign in</div>
                <div className="text-xs text-gray-500">Existing customer</div>
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`border-2 rounded-md p-3 text-left ${mode === 'register' ? 'border-brand bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <UserPlus className="w-5 h-5 mb-1 text-brand" />
                <div className="font-semibold text-sm">Create account</div>
                <div className="text-xs text-gray-500">Track orders & earn rewards</div>
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="card p-5">
            <h2 className="font-bold text-lg mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input required className="input-field sm:col-span-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {mode !== 'login' && (
                <input required className="input-field" type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              )}
              <input required className="input-field" type="tel" placeholder="Phone (for WhatsApp updates)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              {(mode === 'login' || mode === 'register') && (
                <input required minLength={6} className="input-field sm:col-span-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-5">
            <h2 className="font-bold text-lg mb-4">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input required className="input-field sm:col-span-2" placeholder="Street address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <input required className="input-field" placeholder="City (e.g. Naguabo)" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <input required className="input-field" placeholder="ZIP (e.g. 00718)" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-600" /> Payment
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              You'll enter your card details securely on Stripe's checkout page after clicking below.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded p-3 flex items-center justify-between text-sm">
              <span>💳 Stripe Secure Checkout — Visa, Mastercard, Amex, ATH Móvil</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full text-lg disabled:opacity-50">
            {loading ? 'Processing…' : `Pay $${total.toFixed(2)} securely`}
          </button>
        </form>

        {/* Order summary */}
        <aside>
          <div className="card p-5 sticky top-32">
            <h2 className="font-bold text-lg mb-4">Your Order</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 text-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded shrink-0" />
                  <div className="flex-1 line-clamp-2">{item.name}</div>
                  <div className="text-right shrink-0">
                    <div>x{item.quantity}</div>
                    <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
