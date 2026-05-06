'use client';
import { useState } from 'react';
import { mockProducts } from '@/lib/mock-data';
import { Send, MessageSquare } from 'lucide-react';

export default function WhatsAppAdsPage() {
  const [productId, setProductId] = useState(mockProducts[0]?.id || '');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const product = mockProducts.find((p) => p.id === productId);

  const send = async () => {
    setSending(true);
    setResult(null);
    const numbers = recipients.split(/[\s,;]+/).filter(Boolean);
    const res = await fetch('/api/whatsapp/campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipients: numbers, message, productId }),
    });
    const data = await res.json();
    setResult(`Campaign queued: ${data.queued} messages.`);
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">WhatsApp Marketing</h1>
        <p className="text-gray-600 mt-1">
          Send promotional messages and ads to your customer list.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5 space-y-3">
          <h3 className="font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#25D366]" /> Compose
          </h3>

          <label className="block text-sm font-semibold">Featured product</label>
          <select className="input-field" value={productId} onChange={(e) => setProductId(e.target.value)}>
            {mockProducts.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — ${p.price.toFixed(2)}</option>
            ))}
          </select>

          <label className="block text-sm font-semibold">Message</label>
          <textarea
            className="input-field min-h-[120px]"
            placeholder="Special offer this week! Get..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <label className="block text-sm font-semibold">Recipients (one number per line, with country code)</label>
          <textarea
            className="input-field min-h-[100px] font-mono text-xs"
            placeholder="17875551111&#10;17875552222"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
          />

          <button onClick={send} disabled={sending || !message} className="btn-primary w-full flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> {sending ? 'Sending…' : 'Send Campaign'}
          </button>
          {result && <div className="text-sm text-green-700 bg-green-50 p-2 rounded">{result}</div>}
        </div>

        {/* Preview */}
        <div className="card p-5">
          <h3 className="font-bold mb-3">Preview</h3>
          <div className="bg-[#ECE5DD] rounded-lg p-4 max-w-sm">
            <div className="bg-white rounded-lg p-3 shadow text-sm">
              {product && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
              )}
              <div className="font-bold">🛠️ Naguabo Commercial Special!</div>
              {product && (
                <>
                  <div className="mt-1">{product.name}</div>
                  <div className="font-bold">💰 Just ${product.price.toFixed(2)}</div>
                </>
              )}
              {message && <p className="mt-2 whitespace-pre-wrap">{message}</p>}
              <p className="mt-2 text-blue-600 underline">naguabo-commercial.com</p>
              <p className="text-xs text-gray-400 italic mt-2">Reply STOP to unsubscribe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
