'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Package } from 'lucide-react';
import type { SalesStats } from '@/types';

export default function StatsPage() {
  const [stats, setStats] = useState<SalesStats | null>(null);

  useEffect(() => {
    fetch('/api/stats').then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) return <div className="card p-12 text-center">Loading statistics…</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sales Statistics</h1>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="text-green-600" />
        <KPI label="Total Orders" value={stats.totalOrders.toLocaleString()} icon={ShoppingBag} color="text-blue-600" />
        <KPI label="Avg. Order Value" value={`$${stats.averageOrder.toFixed(2)}`} icon={TrendingUp} color="text-brand" />
        <KPI label="Top Product" value={stats.topProducts[0]?.name.slice(0, 20) || 'N/A'} icon={Package} color="text-purple-600" />
      </div>

      {/* Daily revenue */}
      <div className="card p-5">
        <h3 className="font-bold mb-4">Daily Revenue (last 30 days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={stats.daily}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F96302" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#F96302" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" fontSize={11} />
            <YAxis fontSize={11} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#F96302" fillOpacity={1} fill="url(#rev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly trend */}
        <div className="card p-5">
          <h3 className="font-bold mb-4">Monthly Revenue (last 12 months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.monthly}>
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#004990" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast */}
        <div className="card p-5">
          <h3 className="font-bold mb-4">6-Month Forecast (projected)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.forecast}>
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="projected" stroke="#F96302" strokeWidth={2} strokeDasharray="5 5" name="Projected revenue" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">
            Forecast based on linear trend of last 12 months. Use as guidance only.
          </p>
        </div>
      </div>

      {/* Top products */}
      <div className="card p-5">
        <h3 className="font-bold mb-4">Top Selling Products</h3>
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr><th className="py-2">#</th><th>Product</th><th className="text-right">Units sold</th><th className="text-right">Revenue</th></tr>
          </thead>
          <tbody>
            {stats.topProducts.map((p, i) => (
              <tr key={p.name} className="border-b last:border-0">
                <td className="py-2">{i + 1}</td>
                <td>{p.name}</td>
                <td className="text-right">{p.sold.toLocaleString()}</td>
                <td className="text-right font-semibold">${p.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KPI({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <div className="card p-4">
      <Icon className={`w-7 h-7 ${color}`} />
      <div className="text-2xl font-bold mt-3 truncate">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
