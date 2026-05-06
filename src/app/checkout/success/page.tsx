'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { buildWhatsAppLink } from '@/lib/whatsapp';

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order') || 'NC-' + Date.now().toString().slice(-6);
  const { clearCart } = useCart();

  useEffect(() => { clearCart(); }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold">Thank you for your order!</h1>
      <p className="text-gray-600 mt-2">
        Order <strong>#{orderNumber}</strong> has been confirmed.
      </p>
      <p className="text-gray-600 mt-1">
        We'll send a confirmation to your email and WhatsApp.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 gap-3 max-w-md mx-auto">
        <a
          href={buildWhatsAppLink(`Hi! I want to track order ${orderNumber}`)}
          target="_blank" rel="noopener noreferrer"
          className="bg-[#25D366] text-white py-3 rounded-md font-semibold hover:bg-[#1DA851]"
        >
          Track on WhatsApp
        </a>
        <Link href="/store" className="btn-outline py-3">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
