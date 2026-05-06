'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Star, ShoppingCart, Truck, MapPin, Share2, MessageCircle } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';
import { useCart } from '@/lib/cart-store';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import Link from 'next/link';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const product = mockProducts.find((p) => p.slug === slug);
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/store" className="text-brand mt-4 inline-block">← Back to store</Link>
      </div>
    );
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: qty,
      stock: product.stock,
      brand: product.brand,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const waLink = buildWhatsAppLink(
    `Hola! Estoy interesado en: ${product.name} (${product.sku}) - $${product.price.toFixed(2)}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-brand">Home</Link> /{' '}
        <Link href="/store" className="hover:text-brand">Store</Link> /{' '}
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card p-4 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imageUrl} alt={product.name} className="w-full aspect-square object-cover rounded" />
        </div>

        <div>
          {product.brand && (
            <div className="text-xs text-gray-500 font-bold uppercase">{product.brand}</div>
          )}
          <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          <div className="text-sm text-gray-500 mt-1">SKU: {product.sku} · UPC: {product.barcode}</div>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-black">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <>
                <span className="text-xl text-gray-500 line-through">${product.comparePrice.toFixed(2)}</span>
                <span className="bg-brand text-white text-sm font-bold px-2 py-1 rounded">Save {discount}%</span>
              </>
            )}
          </div>

          <p className="mt-4 text-gray-700">{product.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="border rounded p-3">
              <div className="flex items-center gap-2 font-semibold text-green-700">
                <Truck className="w-4 h-4" /> Ships in 1-2 days
              </div>
              <div className="text-gray-500 text-xs mt-1">Free for orders over $99</div>
            </div>
            <div className="border rounded p-3">
              <div className="flex items-center gap-2 font-semibold text-accent">
                <MapPin className="w-4 h-4" /> Pickup in 1 hour
              </div>
              <div className="text-gray-500 text-xs mt-1">Naguabo store</div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <label className="font-semibold text-sm">Quantity</label>
            <div className="flex border border-gray-300 rounded">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Decrease"
              >−</button>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                className="w-14 text-center border-x border-gray-300 focus:outline-none"
              />
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Increase"
              >+</button>
            </div>
            <span className="text-sm text-gray-500">{product.stock} in stock</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-secondary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" /> Add to cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="btn-primary disabled:opacity-50"
            >
              Buy now
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] font-semibold py-2 px-4 rounded-md hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
            </a>
            <button
              onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
              className="btn-outline flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
