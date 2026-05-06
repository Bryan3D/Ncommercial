'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', name: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/account');
    } else {
      const d = await res.json();
      setError(d.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-8">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold">Create Account</h1>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input required type="text" placeholder="Full name" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="tel" placeholder="Phone (for WhatsApp)" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input required minLength={6} type="password" placeholder="Password (min 6 chars)" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <Link href="/login" className="text-brand font-semibold hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
