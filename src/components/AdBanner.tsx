'use client';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type Slide = {
  id: number;
  label: string;
  headline: string;
  sub: string;
  bg: string;
  cta?: { text: string; href: string };
  image?: string;
};

// Edit this array to add, remove, or update ads / sponsor banners / news
const slides: Slide[] = [
  {
    id: 1,
    label: 'SPONSOR',
    headline: 'CROSSCO® — Your Trusted Roofing Brand',
    sub: 'High-performance sealants and coatings for every surface. Puerto Rico\'s #1 choice.',
    bg: 'from-blue-700 to-blue-900',
    cta: { text: 'Shop Crossco', href: '/store?category=roof-sealing' },
  },
  {
    id: 2,
    label: 'NEW ARRIVALS',
    headline: 'Stone Aggregates Now In Stock',
    sub: 'Piedra 3/4", Piedra Blanca, and Piedra Dalmata — available for pickup today.',
    bg: 'from-orange-600 to-orange-800',
    cta: { text: 'View Products', href: '/store?category=building-materials' },
  },
  {
    id: 3,
    label: 'NEWS',
    headline: 'Now Delivering Across Puerto Rico',
    sub: 'Order online and receive your materials at your door. Fast, reliable, and affordable.',
    bg: 'from-emerald-700 to-emerald-900',
    cta: { text: 'Order Now', href: '/store' },
  },
  {
    id: 4,
    label: 'FEATURED BRAND',
    headline: 'DEWALT® — Built Tough',
    sub: 'Professional-grade power tools available at Naguabo Commercial.',
    bg: 'from-yellow-600 to-yellow-800',
    cta: { text: 'Shop Tools', href: '/store?category=tools' },
  },
  {
    id: 5,
    label: 'SPONSOR',
    headline: 'NMD Aluminium & More — Humacao',
    sub: 'Quality aluminium fabrication and installation for residential and commercial projects across Puerto Rico.',
    bg: 'from-zinc-600 to-zinc-800',
    cta: { text: 'Visit on Facebook', href: 'https://www.facebook.com/profile.php?id=100071678385816' },
    image: '/NMD_Aluminum_n.jpg',
  },
  {
    id: 7,
    label: 'SPONSOR',
    headline: "Deli's Delicias — Naguabo's Hidden Gem",
    sub: 'Deliciosa comida casera y más. Síguenos en Facebook para ver nuestras ofertas y menú del día.',
    bg: 'from-rose-600 to-rose-900',
    cta: { text: 'Visit on Facebook', href: 'https://www.facebook.com/deliannise.rodriguez' },
    image: '/DelisDelicias_n.jpg',
  },
  {
    id: 8,
    label: 'NEW',
    headline: 'Naguabo Commercial Merch Is Here!',
    sub: 'Shirts, tumblers, trucker hats, keychains & more — rep your ferretería 🇵🇷',
    bg: 'from-brand to-brand-dark',
    cta: { text: 'Shop Merch', href: '/merch' },
  },
  {
    id: 6,
    label: 'PROMO',
    headline: 'Your Ad Could Be Here',
    sub: 'Reach thousands of customers in Naguabo and across Puerto Rico. Contact us to advertise.',
    bg: 'from-slate-600 to-slate-800',
    cta: { text: 'Contact Us', href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '19393823332'}` },
  },
];

const AUTOPLAY_MS = 5000;

export default function AdBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);
  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide */}
      <div
        key={slide.id}
        className={`bg-gradient-to-r ${slide.bg} text-white transition-all duration-500`}
      >
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between gap-6">
          {/* Left arrow */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="shrink-0 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center gap-4 text-center">
            {slide.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={slide.image}
                alt={slide.headline}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/40 shrink-0 hidden sm:block"
              />
            )}
            <div>
              <span className="inline-block text-xs font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full mb-1">
                {slide.label}
              </span>
              <h2 className="text-lg md:text-xl font-black leading-tight">{slide.headline}</h2>
              <p className="text-sm text-white/80 mt-0.5 hidden sm:block">{slide.sub}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="shrink-0 flex items-center gap-3">
            {slide.cta && (
              <a
                href={slide.cta.href}
                target={slide.cta.href.startsWith('http') ? '_blank' : undefined}
                rel={slide.cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="whitespace-nowrap bg-white text-gray-900 text-sm font-bold px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                {slide.cta.text}
              </a>
            )}
            {/* Right arrow */}
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 py-2 bg-gray-100 dark:bg-slate-800">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current
                ? 'bg-brand w-4'
                : 'bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
