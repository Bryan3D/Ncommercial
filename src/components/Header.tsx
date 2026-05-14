"use client";
import Link from "next/link";
import { ShoppingCart, User, Search, MapPin, Phone, Clock, Sun, Moon } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/assets/nc_logo.jpg";

export default function Header() {
  const itemCount = useCart((s) => s.getItemCount());
  const { theme, toggle } = useTheme();
  const { lang, toggle: toggleLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-800/50 sticky top-0 z-40 transition-colors duration-200">
      {/* Top bar */}
      <div className="bg-brand text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Naguabo, Puerto Rico</span>
              <span className="sm:hidden">PR</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {mounted ? t('header.storeHours') : 'Mon–Sat 7am–5pm'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+(787)874-2120"
              className="flex items-center gap-1 hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">(787) 874-2120</span>
            </a>
            <span className="hidden md:inline">
              {mounted ? t('header.openHours') : 'Open 24/7 Online · Free Pickup'}
            </span>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src={logo}
            alt="Naguabo Commercial logo"
            width={80}
            height={80}
            className="rounded"
            priority
          />
          <span className="font-black text-xl text-brand">
            Naguabo Commercial
          </span>
        </Link>

        {/* Search */}
        <form action="/store" className="flex-1 max-w-2xl">
          <div className="relative">
            <input
              type="search"
              name="q"
              placeholder={mounted ? t('header.search.placeholder') : 'What can we help you find?'}
              className="w-full border-2 border-brand rounded-md py-2 pl-4 pr-12
                         bg-white dark:bg-slate-800
                         text-gray-900 dark:text-slate-100
                         placeholder:text-gray-400 dark:placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-0 top-0 h-full px-4 bg-brand text-white rounded-r-md hover:bg-brand-dark"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/account"
            className="flex items-center gap-1 text-sm text-gray-700 dark:text-slate-300 hover:text-brand dark:hover:text-brand"
          >
            <User className="w-5 h-5" />
            <span className="hidden md:inline">{mounted ? t('header.account') : 'Account'}</span>
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-1 text-sm text-gray-700 dark:text-slate-300 hover:text-brand dark:hover:text-brand"
          >
            <ShoppingCart className="w-6 h-6" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
            <span className="hidden md:inline">{mounted ? t('header.cart') : 'Cart'}</span>
          </Link>

          {/* Language toggle */}
          {mounted && (
            <button
              type="button"
              onClick={toggleLang}
              aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
              className="px-2.5 py-1 rounded text-xs font-bold tracking-wider
                         border border-gray-400 dark:border-slate-500
                         text-gray-600 dark:text-slate-300
                         hover:border-brand hover:text-brand dark:hover:text-brand
                         transition-colors duration-200"
            >
              {lang === 'en' ? 'ES' : 'EN'}
            </button>
          )}

          {/* Dark / Light toggle */}
          {mounted && (
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-full text-gray-600 dark:text-slate-300
                         hover:bg-gray-100 dark:hover:bg-slate-700
                         transition-colors duration-200"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto py-2 text-sm font-medium">
          <Link href="/store" className="text-gray-700 dark:text-slate-300 hover:text-brand whitespace-nowrap">
            {mounted ? t('nav.allProducts') : 'All Products'}
          </Link>
          <Link href="/store?category=tools" className="text-gray-700 dark:text-slate-300 hover:text-brand whitespace-nowrap">
            {mounted ? t('nav.tools') : 'Tools'}
          </Link>
          <Link href="/store?category=building-materials" className="text-gray-700 dark:text-slate-300 hover:text-brand whitespace-nowrap">
            {mounted ? t('nav.building') : 'Building'}
          </Link>
          <Link href="/store?category=plumbing" className="text-gray-700 dark:text-slate-300 hover:text-brand whitespace-nowrap">
            {mounted ? t('nav.plumbing') : 'Plumbing'}
          </Link>
          <Link href="/store?category=electrical" className="text-gray-700 dark:text-slate-300 hover:text-brand whitespace-nowrap">
            {mounted ? t('nav.electrical') : 'Electrical'}
          </Link>
          <Link href="/store?category=paint" className="text-gray-700 dark:text-slate-300 hover:text-brand whitespace-nowrap">
            {mounted ? t('nav.paint') : 'Paint'}
          </Link>
          <Link href="/store?category=roof-sealing" className="text-gray-700 dark:text-slate-300 hover:text-brand whitespace-nowrap">
            {mounted ? t('nav.roofSealing') : '🏠 Roof Sealing'}
          </Link>
          <Link href="/store?category=garden" className="text-gray-700 dark:text-slate-300 hover:text-brand whitespace-nowrap">
            {mounted ? t('nav.garden') : 'Garden'}
          </Link>
          <Link href="/store?category=lighting" className="text-gray-700 dark:text-slate-300 hover:text-brand whitespace-nowrap">
            {mounted ? t('nav.lighting') : 'Lighting'}
          </Link>
          <Link href="/admin" className="ml-auto text-accent whitespace-nowrap font-semibold">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
