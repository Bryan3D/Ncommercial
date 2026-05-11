'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Save, ArrowLeft, ImageIcon } from 'lucide-react';
import type { Category } from '@/types';

interface FormData {
  name: string;
  sku: string;
  barcode: string;
  price: string;
  comparePrice: string;
  stock: string;
  categoryId: string;
  brand: string;
  imageUrl: string;
  description: string;
  featured: boolean;
}

const EMPTY: FormData = {
  name: '',
  sku: '',
  barcode: '',
  price: '',
  comparePrice: '',
  stock: '0',
  categoryId: '',
  brand: '',
  imageUrl: '',
  description: '',
  featured: false,
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
          stock: parseInt(form.stock, 10),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Failed to create product');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/admin/inventory'), 1200);
    } catch {
      setError('Network error — try again');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Package className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold">Product added!</h2>
        <p className="text-gray-500 text-sm">Redirecting to inventory…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6 text-brand" /> Add New Product
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic info */}
        <section className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">Basic Information</h2>

          <div>
            <label className="label">Product name *</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. DEWALT 20V Cordless Drill"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Product details, specifications, features…"
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => set('brand', e.target.value)}
                placeholder="e.g. DEWALT"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Category *</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => set('categoryId', e.target.value)}
                className="input-field"
              >
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon ? `${c.icon} ` : ''}{c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 accent-brand"
            />
            <label htmlFor="featured" className="text-sm text-gray-700">
              Feature this product on the homepage
            </label>
          </div>
        </section>

        {/* Pricing & stock */}
        <section className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">Pricing & Stock</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Price ($) *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0.00"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Compare price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.comparePrice}
                onChange={(e) => set('comparePrice', e.target.value)}
                placeholder="0.00"
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">Shows as strikethrough</p>
            </div>
            <div>
              <label className="label">Initial stock *</label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                placeholder="0"
                className="input-field"
              />
            </div>
          </div>
        </section>

        {/* Identifiers */}
        <section className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">Identifiers</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">SKU *</label>
              <input
                required
                type="text"
                value={form.sku}
                onChange={(e) => set('sku', e.target.value.toUpperCase())}
                placeholder="e.g. DW-DCD771C2"
                className="input-field font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">Must be unique</p>
            </div>
            <div>
              <label className="label">Barcode *</label>
              <input
                required
                type="text"
                value={form.barcode}
                onChange={(e) => set('barcode', e.target.value)}
                placeholder="e.g. 885911599832"
                className="input-field font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">UPC, EAN, or custom</p>
            </div>
          </div>
        </section>

        {/* Image */}
        <section className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">Product Image</h2>

          <div>
            <label className="label">Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://…"
              className="input-field"
            />
            <p className="text-xs text-gray-400 mt-1">
              Paste any public image URL (Unsplash, CDN, etc.). Leave blank to use a placeholder.
            </p>
          </div>

          {/* Preview */}
          {form.imageUrl ? (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
        </section>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving…' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
