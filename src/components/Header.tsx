"use client";
import Link from "next/link";
import { ShoppingCart, User, Search, MapPin, Phone } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/assets/nc_logo.jpg";

export default function Header() {
  const itemCount = useCart((s) => s.getItemCount());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-brand text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Naguabo, Puerto Rico</span>
            <span className="sm:hidden">PR</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+17875551234"
              className="flex items-center gap-1 hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">(787) 555-1234</span>
            </a>
            <span className="hidden md:inline">
              Open 24/7 Online · Free Pickup
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
              placeholder="What can we help you find?"
              className="w-full border-2 border-brand rounded-md py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-light"
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

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            href="/account"
            className="flex items-center gap-1 text-sm hover:text-brand"
          >
            <User className="w-5 h-5" />
            <span className="hidden md:inline">Account</span>
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1 text-sm hover:text-brand"
          >
            <ShoppingCart className="w-6 h-6" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
            <span className="hidden md:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto py-2 text-sm font-medium">
          <Link href="/store" className="hover:text-brand whitespace-nowrap">
            All Products
          </Link>
          <Link
            href="/store?category=tools"
            className="hover:text-brand whitespace-nowrap"
          >
            Tools
          </Link>
          <Link
            href="/store?category=building-materials"
            className="hover:text-brand whitespace-nowrap"
          >
            Building
          </Link>
          <Link
            href="/store?category=plumbing"
            className="hover:text-brand whitespace-nowrap"
          >
            Plumbing
          </Link>
          <Link
            href="/store?category=electrical"
            className="hover:text-brand whitespace-nowrap"
          >
            Electrical
          </Link>
          <Link
            href="/store?category=paint"
            className="hover:text-brand whitespace-nowrap"
          >
            Paint
          </Link>
          <Link
            href="/store?category=garden"
            className="hover:text-brand whitespace-nowrap"
          >
            Garden
          </Link>
          <Link
            href="/store?category=lighting"
            className="hover:text-brand whitespace-nowrap"
          >
            Lighting
          </Link>
          <Link
            href="/admin"
            className="ml-auto text-accent whitespace-nowrap font-semibold"
          >
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
