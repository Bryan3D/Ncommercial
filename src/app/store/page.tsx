'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState, Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import { SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

function StoreContent() {
  const params = useSearchParams();
  const categorySlug = params.get('category') || '';
  const search = params.get('q')?.toLowerCase() || '';
  const dealsOnly = params.get('deals') === '1';
  const { t, tCat } = useLanguage();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(500);

  const topLevelCategories = useMemo(
    () => mockCategories.filter((c) => !c.parentSlug),
    []
  );

  const currentCategory = useMemo(
    () => mockCategories.find((c) => c.slug === categorySlug),
    [categorySlug]
  );

  // Recursively collect all descendant category IDs for a given slug
  const getDescendantIds = (slug: string): string[] => {
    const direct = mockCategories.filter((c) => c.parentSlug === slug);
    return [...direct.map((c) => c.id), ...direct.flatMap((c) => getDescendantIds(c.slug))];
  };

  // The section whose sub-tabs to show: the category itself if it has children,
  // otherwise its parent (so a child page still shows the parent's sub-tabs).
  const currentSection = useMemo(() => {
    if (!categorySlug) return null;
    const cat = mockCategories.find((c) => c.slug === categorySlug);
    if (!cat) return null;
    const hasChildren = mockCategories.some((c) => c.parentSlug === cat.slug);
    if (hasChildren) return cat;
    if (cat.parentSlug) return mockCategories.find((c) => c.slug === cat.parentSlug) ?? null;
    return null;
  }, [categorySlug]);

  const sectionSubCategories = useMemo(
    () => (currentSection ? mockCategories.filter((c) => c.parentSlug === currentSection.slug) : []),
    [currentSection]
  );

  // Walk up to find the top-level (no parentSlug) ancestor for sidebar highlighting
  const topLevelAncestor = useMemo(() => {
    if (!categorySlug) return null;
    let cat = mockCategories.find((c) => c.slug === categorySlug);
    while (cat?.parentSlug) cat = mockCategories.find((c) => c.slug === cat!.parentSlug);
    return cat ?? null;
  }, [categorySlug]);

  // Build ordered list of ancestor categories for breadcrumb
  const ancestorPath = useMemo(() => {
    const path: Array<{ id: string; slug: string; name: string }> = [];
    let cat = currentCategory?.parentSlug
      ? mockCategories.find((c) => c.slug === currentCategory?.parentSlug)
      : undefined;
    while (cat) {
      path.unshift(cat);
      cat = cat.parentSlug ? mockCategories.find((c) => c.slug === cat!.parentSlug) : undefined;
    }
    return path;
  }, [currentCategory]);

  const categoryId = useMemo(
    () => mockCategories.find((c) => c.slug === categorySlug)?.id,
    [categorySlug]
  );

  const filtered = useMemo(() => {
    let list = [...mockProducts];

    if (currentSection && categorySlug === currentSection.slug) {
      // "All" tab for this section — include products from all descendants
      const allIds = new Set(getDescendantIds(currentSection.slug));
      list = list.filter((p) => allIds.has(p.categoryId));
    } else if (categoryId) {
      list = list.filter((p) => p.categoryId === categoryId);
    }

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
  }, [categoryId, categorySlug, currentSection, search, dealsOnly, sortBy, maxPrice]);

  const pageTitle = currentSection && categorySlug === currentSection.slug
    ? tCat(currentSection.slug)
    : currentCategory
      ? tCat(currentCategory.slug)
      : search
        ? `${t('store.resultsFor')} "${search}"`
        : dealsOnly
          ? t('store.todaysDeals')
          : t('store.allProducts');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-slate-400 mb-4">
        <a href="/" className="hover:text-brand">{t('breadcrumb.home')}</a> /{' '}
        <a href="/store" className="hover:text-brand">{t('breadcrumb.store')}</a>
        {ancestorPath.map((ancestor) => (
          <span key={ancestor.id}> / <a href={`/store?category=${ancestor.slug}`} className="hover:text-brand">{tCat(ancestor.slug)}</a></span>
        ))}
        {currentCategory && (
          <> / <span className="text-gray-700 dark:text-slate-300">{tCat(currentCategory.slug)}</span></>
        )}
      </nav>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="md:w-60 shrink-0">
          <div className="card p-4 mb-4">
            <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-slate-100">
              <SlidersHorizontal className="w-4 h-4" /> {t('store.filters')}
            </h3>
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-slate-300">{t('store.department')}</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="/store" className={`block py-1 ${!categorySlug ? 'text-brand font-bold' : 'text-gray-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand'}`}>
                    {t('store.allProducts')}
                  </a>
                </li>
                {topLevelCategories.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`/store?category=${c.slug}`}
                      className={`block py-1 ${
                        categorySlug === c.slug || topLevelAncestor?.slug === c.slug
                          ? 'text-brand font-bold'
                          : 'text-gray-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand'
                      }`}
                    >
                      {c.icon} {tCat(c.slug)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-slate-300">
                {t('store.maxPrice')}: ${maxPrice}
              </h4>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand"
                aria-label={t('store.maxPrice')}
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {pageTitle}
              <span className="text-gray-500 dark:text-slate-400 font-normal text-base ml-2">
                ({filtered.length} {t('store.items')})
              </span>
            </h1>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'rating')}
              aria-label={t('store.filters')}
              className="border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm
                         bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
            >
              <option value="featured">{t('store.sortFeatured')}</option>
              <option value="price-asc">{t('store.sortPriceAsc')}</option>
              <option value="price-desc">{t('store.sortPriceDesc')}</option>
              <option value="rating">{t('store.sortRating')}</option>
            </select>
          </div>

          {/* Sub-category tabs (any section with sub-categories) */}
          {currentSection && sectionSubCategories.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 mb-5 border-b border-gray-200 dark:border-slate-700">
              <a
                href={`/store?category=${currentSection.slug}`}
                className={`shrink-0 px-3 py-1.5 rounded-t text-sm font-medium transition-colors ${
                  categorySlug === currentSection.slug
                    ? 'bg-brand text-white'
                    : 'text-gray-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand'
                }`}
              >
                {t('store.subtabAll')}
              </a>
              {sectionSubCategories.map((sub) => (
                <a
                  key={sub.id}
                  href={`/store?category=${sub.slug}`}
                  className={`shrink-0 px-3 py-1.5 rounded-t text-sm font-medium transition-colors whitespace-nowrap ${
                    categorySlug === sub.slug
                      ? 'bg-brand text-white'
                      : 'text-gray-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand'
                  }`}
                >
                  {sub.icon} {tCat(sub.slug)}
                </a>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="card p-12 text-center text-gray-500 dark:text-slate-400">
              {t('store.empty')}
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
