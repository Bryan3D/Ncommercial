'use client';
import Link from 'next/link';
import { Truck, ShieldCheck, Headphones, Zap, ChevronRight, Tag, Info } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import AdBanner from '@/components/AdBanner';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import { useLanguage } from '@/components/LanguageProvider';

const topCategories = mockCategories.filter((c) => !c.parentSlug);
const featured = mockProducts.filter((p) => p.featured).slice(0, 8);
const deals = mockProducts.filter((p) => p.comparePrice).slice(0, 4);

export default function HomePage() {
  const { t, tCat } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-brand to-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {t('home.hero.badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              {t('home.hero.h1.line1')} <br /> {t('home.hero.h1.line2')}
            </h1>
            <p className="mt-4 text-lg text-orange-100 max-w-md">
              {t('home.hero.sub')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/store" className="bg-white text-brand font-bold px-6 py-3 rounded-md hover:bg-orange-50">
                {t('home.hero.shopNow')}
              </Link>
              <Link href="/store?deals=1" className="bg-accent text-white font-bold px-6 py-3 rounded-md hover:bg-accent-dark">
                {t('home.hero.todaysDeals')}
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

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-amber-800 dark:text-amber-300">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            {t('home.disclaimer.before')} <strong>{t('home.disclaimer.hours')}</strong> {t('home.disclaimer.after')}
          </span>
        </div>
      </div>

      {/* Trust badges */}
      <section className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Truck className="w-6 h-6 text-brand" />
            <div className="font-semibold text-sm text-gray-900 dark:text-slate-100">{t('home.trust.pickup')}</div>
            <div className="text-xs text-gray-500 dark:text-slate-400">{t('home.trust.pickupSub')}</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Headphones className="w-6 h-6 text-brand" />
            <div className="font-semibold text-sm text-gray-900 dark:text-slate-100">{t('home.trust.support')}</div>
            <div className="text-xs text-gray-500 dark:text-slate-400">{t('home.trust.supportSub')}</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-6 h-6 text-brand" />
            <div className="font-semibold text-sm text-gray-900 dark:text-slate-100">{t('home.trust.secure')}</div>
            <div className="text-xs text-gray-500 dark:text-slate-400">{t('home.trust.secureSub')}</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-6 h-6 text-brand" />
            <div className="font-semibold text-sm text-gray-900 dark:text-slate-100">{t('home.trust.fast')}</div>
            <div className="text-xs text-gray-500 dark:text-slate-400">{t('home.trust.fastSub')}</div>
          </div>
        </div>
      </section>

      {/* Ad / Sponsor / News banner */}
      <AdBanner />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">{t('home.shopByDept')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {topCategories.map((c) => (
            <Link
              key={c.id}
              href={`/store?category=${c.slug}`}
              className="card p-4 text-center hover:border-brand"
            >
              <div className="text-3xl">{c.icon}</div>
              <div className="text-sm font-semibold mt-2">{tCat(c.slug)}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's deals */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="w-6 h-6 text-brand" />
            {t('home.specialOffers')}
          </h2>
          <Link href="/store?deals=1" className="text-brand font-semibold flex items-center hover:underline">
            {t('home.viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {deals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('home.featured')}</h2>
          <Link href="/store" className="text-brand font-semibold flex items-center hover:underline">
            {t('home.shopAll')} <ChevronRight className="w-4 h-4" />
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
            <h2 className="text-2xl font-bold">{t('home.whatsapp.title')}</h2>
            <p className="text-green-50 mt-1">{t('home.whatsapp.sub')}</p>
          </div>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '19393823332'}?text=${encodeURIComponent('Subscribe me to deals!')}`}
            target="_blank" rel="noopener noreferrer"
            className="bg-white text-[#25D366] font-bold px-6 py-3 rounded-md hover:bg-gray-100"
          >
            {t('home.whatsapp.cta')}
          </a>
        </div>
      </section>
    </div>
  );
}
