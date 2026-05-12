'use client';
import Link from 'next/link';
import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold mb-3">{t('footer.customerService')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/help" className="hover:text-white">{t('footer.helpCenter')}</Link></li>
            <li><Link href="/returns" className="hover:text-white">{t('footer.returns')}</Link></li>
            <li><Link href="/shipping" className="hover:text-white">{t('footer.shippingInfo')}</Link></li>
            <li><Link href="/contact" className="hover:text-white">{t('footer.contactUs')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">{t('footer.myAccount')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/login" className="hover:text-white">{t('footer.signIn')}</Link></li>
            <li><Link href="/register" className="hover:text-white">{t('footer.register')}</Link></li>
            <li><Link href="/account/orders" className="hover:text-white">{t('footer.orderStatus')}</Link></li>
            <li><Link href="/checkout?guest=true" className="hover:text-white">{t('footer.guestCheckout')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">{t('footer.company')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">{t('footer.aboutUs')}</Link></li>
            <li><Link href="/careers" className="hover:text-white">{t('footer.careers')}</Link></li>
            <li><Link href="/privacy" className="hover:text-white">{t('footer.privacy')}</Link></li>
            <li><Link href="/terms" className="hover:text-white">{t('footer.terms')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">{t('footer.getInTouch')}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> 20 Calle Venecia Naguabo, Puerto Rico, 00718</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> (787)874-2120</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@naguabo-commercial.com</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="https://www.facebook.com/naguabocommercial718" aria-label="Facebook" className="hover:text-white"><Facebook className="w-5 h-5" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 text-center text-sm">
        © {new Date().getFullYear()} Naguabo Commercial. {t('footer.rights')} · Tu ferretería de confianza 🇵🇷
      </div>
    </footer>
  );
}
