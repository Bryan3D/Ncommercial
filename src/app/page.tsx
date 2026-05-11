import Link from 'next/link';
import { Truck, ShieldCheck, Headphones, Zap, ChevronRight, Tag } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { mockProducts, mockCategories } from '@/lib/mock-data';

export default function HomePage() {
  const featured = mockProducts.filter((p) => p.featured).slice(0, 8);
  const deals = mockProducts.filter((p) => p.comparePrice).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-brand to-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              🇵🇷 Tu ferretería de confianza en Naguabo
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Build It. Fix It. <br /> Get It Done.
            </h1>
            <p className="mt-4 text-lg text-orange-100 max-w-md">
              Thousands of products from top brands. Online ordering with curbside pickup
              or delivery across Puerto Rico.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/store" className="bg-white text-brand font-bold px-6 py-3 rounded-md hover:bg-orange-50">
                Shop Now
              </Link>
              <Link href="/store?deals=1" className="bg-accent text-white font-bold px-6 py-3 rounded-md hover:bg-accent-dark">
                Today's Deals
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800"
              alt="Hardware tools"
              className="rounded-lg shadow-2xl w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Truck className="w-6 h-6 text-brand" />
            <div className="font-semibold text-sm text-gray-900 dark:text-slate-100">Free pickup</div>
            <div className="text-xs text-gray-500 dark:text-slate-400">In-store ready in 1hr</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Headphones className="w-6 h-6 text-brand" />
            <div className="font-semibold text-sm text-gray-900 dark:text-slate-100">24/7 chat support</div>
            <div className="text-xs text-gray-500 dark:text-slate-400">Always here to help</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-6 h-6 text-brand" />
            <div className="font-semibold text-sm text-gray-900 dark:text-slate-100">Secure checkout</div>
            <div className="text-xs text-gray-500 dark:text-slate-400">Stripe-powered payments</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-6 h-6 text-brand" />
            <div className="font-semibold text-sm text-gray-900 dark:text-slate-100">Fast delivery</div>
            <div className="text-xs text-gray-500 dark:text-slate-400">Across Puerto Rico</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Shop by Department</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {mockCategories.map((c) => (
            <Link
              key={c.id}
              href={`/store?category=${c.slug}`}
              className="card p-4 text-center hover:border-brand"
            >
              <div className="text-3xl">{c.icon}</div>
              <div className="text-sm font-semibold mt-2">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's deals */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="w-6 h-6 text-brand" />
            Today's Special Offers
          </h2>
          <Link href="/store?deals=1" className="text-brand font-semibold flex items-center hover:underline">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {deals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/store" className="text-brand font-semibold flex items-center hover:underline">
            Shop all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* WhatsApp ad banner */}
      <section className="bg-[#25D366] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Get exclusive deals on WhatsApp 📱</h2>
            <p className="text-green-50 mt-1">
              Subscribe to receive weekly offers, new arrivals, and pro tips.
            </p>
          </div>
          <a
            href={`https://wa.me/${process.env.WHATSAPP_NUMBER || '17875551234'}?text=${encodeURIComponent('Subscribe me to deals!')}`}
            target="_blank" rel="noopener noreferrer"
            className="bg-white text-[#25D366] font-bold px-6 py-3 rounded-md hover:bg-gray-100"
          >
            Subscribe via WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
