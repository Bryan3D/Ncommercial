'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/lib/cart-store';
import { useLanguage } from '@/components/LanguageProvider';

interface Props {
  product: Product;
  variants?: Product[];
  preselectedSize?: string | null;
}

export default function ProductCard({ product, variants, preselectedSize }: Props) {
  const addItem = useCart((s) => s.addItem);
  const { t } = useLanguage();

  const hasVariants = variants && variants.length > 1;

  const [selected, setSelected] = useState<Product | null>(() => {
    if (!hasVariants) return product;
    if (preselectedSize) return variants!.find((v) => v.size === preselectedSize) ?? null;
    return null;
  });

  useEffect(() => {
    if (hasVariants && preselectedSize) {
      setSelected(variants!.find((v) => v.size === preselectedSize) ?? null);
    }
  }, [preselectedSize, variants, hasVariants]);

  // The "active" product drives image, link, and ratings (falls back to first/representative)
  const active = selected ?? product;

  // Strip size suffix from name when grouping variants
  const displayName = (() => {
    const name = product.name;
    if (!hasVariants) return name;
    for (const v of variants!) {
      if (v.size && name.endsWith(` ${v.size}`)) return name.slice(0, -(v.size.length + 1));
    }
    return name;
  })();

  const priceRange = hasVariants
    ? { min: Math.min(...variants!.map((v) => v.price)), max: Math.max(...variants!.map((v) => v.price)) }
    : null;

  const showRange = hasVariants && !selected;

  const discount = !showRange && active.comparePrice
    ? Math.round(((active.comparePrice - active.price) / active.comparePrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants && !selected) return;
    addItem({
      productId: active.id,
      name: active.name,
      price: active.price,
      imageUrl: active.imageUrl,
      quantity: 1,
      stock: active.stock,
      brand: active.brand,
    });
  };

  return (
    <div className="card flex flex-col overflow-hidden">
      {/* Clickable area — navigates to product detail */}
      <Link href={`/store/${active.slug}`} className="group flex flex-col flex-1">
        <div className="relative aspect-square bg-white overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.imageUrl}
            alt={active.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
          {active.stock < 10 && active.stock > 0 && (
            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              {t('product.lowStock')}
            </span>
          )}
          {active.stock === 0 && (
            <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded">
              {t('product.outOfStock')}
            </span>
          )}
        </div>

        <div className="px-3 pt-3 flex flex-col flex-1">
          {active.brand && (
            <div className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase">
              {active.brand}
            </div>
          )}
          <h3 className="font-medium text-sm text-gray-900 dark:text-slate-100 line-clamp-2 mt-1 flex-1">
            {displayName}
          </h3>
          {active.sku && !hasVariants && (
            <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 font-mono tracking-wide">
              #: {active.sku}
            </div>
          )}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(active.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400">({active.reviewCount})</span>
          </div>

          {/* Price — range when no size selected, exact when selected */}
          <div className="flex items-baseline gap-2 mt-2">
            {showRange ? (
              <span className="text-base font-bold text-gray-900 dark:text-slate-100">
                ${priceRange!.min.toFixed(2)} – ${priceRange!.max.toFixed(2)}
              </span>
            ) : (
              <>
                <span className="text-xl font-black text-gray-900 dark:text-slate-100">
                  ${active.price.toFixed(2)}
                </span>
                {active.comparePrice && (
                  <span className="text-sm text-gray-400 dark:text-slate-500 line-through">
                    ${active.comparePrice.toFixed(2)}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Non-navigating footer: size dropdown + add to cart */}
      <div className="px-3 pb-3">
        {hasVariants && (
          <div className="mt-2 mb-1">
            <select
              value={selected?.id ?? ''}
              onChange={(e) => {
                const v = variants!.find((v) => v.id === e.target.value) ?? null;
                setSelected(v);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-md text-sm py-1.5 px-2
                         bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300
                         focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
            >
              <option value="">{t('product.chooseSize')}</option>
              {variants!.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.size}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          type="button"
          onClick={handleAdd}
          disabled={active.stock === 0 || (hasVariants && !selected)}
          className="mt-2 btn-primary w-full text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {t('product.addToCart')}
        </button>
      </div>
    </div>
  );
}
