'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/account');
    } else {
      const d = await res.json();
      setError(d.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-8">
        <div className="flex items-center gap-2 mb-6">
          <LogIn className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold">Sign In</h1>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input required type="email" placeholder="Email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="password" placeholder="Password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          New here? <Link href="/register" className="text-brand font-semibold hover:underline">Create an account</Link>
        </div>
        <div className="mt-2 text-sm text-center text-gray-600">
          Or <Link href="/checkout" className="text-brand font-semibold hover:underline">checkout as guest</Link>
        </div>
      </div>
    </div>
  );
}
