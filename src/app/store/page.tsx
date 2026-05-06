'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState, Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import { SlidersHorizontal } from 'lucide-react';

function StoreContent() {
  const params = useSearchParams();
  const categorySlug = params.get('category') || '';
  const search = params.get('q')?.toLowerCase() || '';
  const dealsOnly = params.get('deals') === '1';

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(500);

  const categoryId = useMemo(
    () => mockCategories.find((c) => c.slug === categorySlug)?.id,
    [categorySlug]
  );

  const filtered = useMemo(() => {
    let list = [...mockProducts];
    if (categoryId) list = list.filter((p) => p.categoryId === categoryId);
    if (search) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.brand?.toLowerCase().includes(search)
      );
    }
    if (dealsOnly) list = list.filter((p) => p.comparePrice);
    list = list.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [categoryId, search, dealsOnly, sortBy, maxPrice]);

  const currentCategory = mockCategories.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-brand">Home</a> /{' '}
        <a href="/store" className="hover:text-brand">Store</a>
        {currentCategory && (
          <> / <span className="text-gray-700">{currentCategory.name}</span></>
        )}
      </nav>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="md:w-60 shrink-0">
          <div className="card p-4 mb-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Department</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="/store" className={`block py-1 ${!categorySlug ? 'text-brand font-bold' : 'hover:text-brand'}`}>
                    All Products
                  </a>
                </li>
                {mockCategories.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`/store?category=${c.slug}`}
                      className={`block py-1 ${categorySlug === c.slug ? 'text-brand font-bold' : 'hover:text-brand'}`}
                    >
                      {c.icon} {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">
                Max price: ${maxPrice}
              </h4>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h1 className="text-2xl font-bold">
              {currentCategory?.name || (search ? `Results for "${search}"` : dealsOnly ? "Today's Deals" : 'All Products')}
              <span className="text-gray-500 font-normal text-base ml-2">
                ({filtered.length} items)
              </span>
            </h1>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'rating')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="card p-12 text-center text-gray-500">
              No products match your filters. Try adjusting them.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12">Loading…</div>}>
      <StoreContent />
    </Suspense>
  );
}
