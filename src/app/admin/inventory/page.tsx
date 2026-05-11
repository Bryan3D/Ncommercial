'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import type { Product } from '@/types';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const load = async (query = '') => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products${query ? `?q=${encodeURIComponent(query)}` : ''}`);
      setProducts(await res.json());
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => { load(); }, []);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => load(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <div className="flex gap-2">
          <Link href="/admin/scanner" className="btn-secondary text-sm flex items-center gap-1">
            + Scan to update
          </Link>
          <Link href="/admin/products/new" className="btn-primary text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      <div className="card p-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, SKU, barcode, or brand"
            className="input-field pl-9"
          />
        </div>
        <button
          type="button"
          onClick={() => load(q)}
          className="p-2 border rounded-lg hover:bg-gray-50 text-gray-500"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 border-b">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Barcode</th>
              <th className="px-3 py-2 text-right">Price</th>
              <th className="px-3 py-2 text-right">Stock</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-gray-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-gray-400">
                  No products found.{' '}
                  <Link href="/admin/products/new" className="text-brand underline">
                    Add your first product
                  </Link>
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="line-clamp-1 max-w-xs font-medium">{p.name}</div>
                      {p.brand && <div className="text-xs text-gray-400">{p.brand}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                <td className="px-3 py-2 font-mono text-xs">{p.barcode}</td>
                <td className="px-3 py-2 text-right">
                  <div className="font-semibold">${p.price.toFixed(2)}</div>
                  {p.comparePrice && (
                    <div className="text-xs text-gray-400 line-through">${p.comparePrice.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-right font-semibold">{p.stock}</td>
                <td className="px-3 py-2">
                  {p.stock === 0 ? (
                    <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded">Out</span>
                  ) : p.stock < 5 ? (
                    <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" /> Critical
                    </span>
                  ) : p.stock < 20 ? (
                    <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" /> Low
                    </span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded">In stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-right">
        {products.length} product{products.length !== 1 ? 's' : ''}
        {q && ` matching "${q}"`}
      </p>
    </div>
  );
}
