'use client';
import { useState } from 'react';
import { mockProducts } from '@/lib/mock-data';
import { Search, AlertTriangle } from 'lucide-react';

export default function InventoryPage() {
  const [q, setQ] = useState('');
  const filtered = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.sku.toLowerCase().includes(q.toLowerCase()) ||
    p.barcode.includes(q)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <a href="/admin/scanner" className="btn-primary text-sm">+ Scan to update</a>
      </div>

      <div className="card p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, SKU, or barcode"
            className="input-field pl-9"
          />
        </div>
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
            {filtered.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded object-cover" />
                    <span className="line-clamp-1 max-w-xs">{p.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                <td className="px-3 py-2 font-mono text-xs">{p.barcode}</td>
                <td className="px-3 py-2 text-right">${p.price.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-semibold">{p.stock}</td>
                <td className="px-3 py-2">
                  {p.stock === 0 ? (
                    <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded">Out</span>
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
    </div>
  );
}
