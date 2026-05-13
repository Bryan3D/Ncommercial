'use client';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/lib/cart-store';
import { useLanguage } from '@/components/LanguageProvider';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const { t } = useLanguage();
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      stock: product.stock,
      brand: product.brand,
    });
  };

  return (
    <Link
      href={`/store/${product.slug}`}
      className="card group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-square bg-white overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            {t('product.lowStock')}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded">
            {t('product.outOfStock')}
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        {product.brand && (
          <div className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase">{product.brand}</div>
        )}
        <h3 className="font-medium text-sm text-gray-900 dark:text-slate-100 line-clamp-2 mt-1 flex-1">
          {product.name}
        </h3>
        {product.sku && (
          <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 font-mono tracking-wide">
            #: {product.sku}
          </div>
        )}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s <= Math.round(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-xl font-black text-gray-900 dark:text-slate-100">
            ${product.price.toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 dark:text-slate-500 line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="mt-3 btn-primary w-full text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {t('product.addToCart')}
        </button>
      </div>
    </Link>
  );
}
