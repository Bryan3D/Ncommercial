import Link from 'next/link';
import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
            <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
            <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">My Account</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/register" className="hover:text-white">Register</Link></li>
            <li><Link href="/account/orders" className="hover:text-white">Order Status</Link></li>
            <li><Link href="/checkout?guest=true" className="hover:text-white">Guest Checkout</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">Get in Touch</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> Carr. 31, Naguabo, PR 00718</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> (787) 555-1234</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@naguabo-commercial.com</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="#" aria-label="Facebook" className="hover:text-white"><Facebook className="w-5 h-5" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 text-center text-sm">
        © {new Date().getFullYear()} Naguabo Commercial. All rights reserved. · Tu ferretería de confianza 🇵🇷
      </div>
    </footer>
  );
}
