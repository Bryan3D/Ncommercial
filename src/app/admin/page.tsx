import Link from 'next/link';
import { DollarSign, ShoppingBag, Package, TrendingUp, ScanLine, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  // In production these come from /api/stats
  const stats = [
    { label: 'Revenue today', value: '$2,847.50', icon: DollarSign, change: '+12.4%', color: 'text-green-600' },
    { label: 'Orders today', value: '23', icon: ShoppingBag, change: '+8', color: 'text-blue-600' },
    { label: 'Low stock items', value: '7', icon: Package, change: 'Action needed', color: 'text-yellow-600' },
    { label: 'Monthly growth', value: '+18.2%', icon: TrendingUp, change: 'vs last month', color: 'text-brand' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center justify-between">
              <s.icon className={`w-8 h-8 ${s.color}`} />
              <span className={`text-sm font-semibold ${s.color}`}>{s.change}</span>
            </div>
            <div className="text-2xl font-bold mt-3">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/admin/scanner" className="card p-5 hover:border-brand text-center">
          <ScanLine className="w-12 h-12 mx-auto text-brand mb-3" />
          <h3 className="font-bold">Scan Barcodes</h3>
          <p className="text-sm text-gray-500 mt-1">Receive boxes & update inventory</p>
        </Link>
        <Link href="/admin/stats" className="card p-5 hover:border-brand text-center">
          <TrendingUp className="w-12 h-12 mx-auto text-brand mb-3" />
          <h3 className="font-bold">View Statistics</h3>
          <p className="text-sm text-gray-500 mt-1">Daily, monthly & forecast</p>
        </Link>
        <Link href="/admin/whatsapp" className="card p-5 hover:border-brand text-center">
          <MessageSquare className="w-12 h-12 mx-auto text-brand mb-3" />
          <h3 className="font-bold">WhatsApp Campaigns</h3>
          <p className="text-sm text-gray-500 mt-1">Send promotional messages</p>
        </Link>
      </div>
    </div>
  );
}
