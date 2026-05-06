import Link from 'next/link';
import { LayoutDashboard, Package, BarChart3, ScanLine, MessageSquare } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <aside>
          <div className="card p-3 sticky top-32">
            <div className="px-3 py-2 mb-3 border-b">
              <div className="font-bold">Admin Panel</div>
              <div className="text-xs text-gray-500">Naguabo Commercial</div>
            </div>
            <nav className="space-y-1 text-sm">
              <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link href="/admin/inventory" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
                <Package className="w-4 h-4" /> Inventory
              </Link>
              <Link href="/admin/scanner" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
                <ScanLine className="w-4 h-4" /> Barcode Scanner
              </Link>
              <Link href="/admin/stats" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
                <BarChart3 className="w-4 h-4" /> Sales Statistics
              </Link>
              <Link href="/admin/whatsapp" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
                <MessageSquare className="w-4 h-4" /> WhatsApp Ads
              </Link>
            </nav>
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
