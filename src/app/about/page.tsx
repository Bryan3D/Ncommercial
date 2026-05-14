'use client';
import Link from 'next/link';
import {
  Wrench, HardHat, Zap, Droplets, Paintbrush2, Leaf,
  MapPin, Phone, Mail, Clock, ShieldCheck, BadgeDollarSign,
  Truck, Users,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

const categories = [
  { icon: Wrench,        labelKey: 'nav.tools' },
  { icon: HardHat,       labelKey: 'nav.building' },
  { icon: Droplets,      labelKey: 'nav.plumbing' },
  { icon: Zap,           labelKey: 'nav.electrical' },
  { icon: Paintbrush2,   labelKey: 'nav.paint' },
  { icon: Leaf,          labelKey: 'nav.garden' },
];

const valueIcons = [ShieldCheck, BadgeDollarSign, Truck, Users];

export default function AboutPage() {
  const { t } = useLanguage();

  const values = [
    { icon: valueIcons[0], title: t('about.values.q1.title'), desc: t('about.values.q1.desc') },
    { icon: valueIcons[1], title: t('about.values.q2.title'), desc: t('about.values.q2.desc') },
    { icon: valueIcons[2], title: t('about.values.q3.title'), desc: t('about.values.q3.desc') },
    { icon: valueIcons[3], title: t('about.values.q4.title'), desc: t('about.values.q4.desc') },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-brand via-brand to-brand-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            {t('about.badge')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-3xl mx-auto">
            {t('about.hero.title')}
          </h1>
          <p className="mt-5 text-lg text-orange-100 max-w-2xl mx-auto">
            {t('about.hero.sub')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/store" className="bg-white text-brand font-bold px-7 py-3 rounded-md hover:bg-orange-50 transition-colors">
              {t('about.hero.shopCta')}
            </Link>
            <Link href="/contact" className="border border-white/60 text-white font-bold px-7 py-3 rounded-md hover:bg-white/10 transition-colors">
              {t('about.hero.contactCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand">
            {t('about.mission.label')}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-2 text-gray-900 dark:text-slate-100">
            {t('about.mission.title')}
          </h2>
          <p className="mt-5 text-gray-600 dark:text-slate-300 leading-relaxed text-lg">
            {t('about.mission.p1')}
          </p>
          <p className="mt-4 text-gray-600 dark:text-slate-300 leading-relaxed text-lg">
            {t('about.mission.p2')}
          </p>
          <blockquote className="mt-6 border-l-4 border-brand pl-5 text-xl font-bold text-brand-dark dark:text-brand italic">
            {t('about.mission.quote')}
          </blockquote>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { num: '20+', label: 'Años de servicio', sublabel: 'Years of service' },
            { num: '5,000+', label: 'Productos disponibles', sublabel: 'Products available' },
            { num: '1h', label: 'Recogido en tienda', sublabel: 'In-store pickup' },
            { num: '24/7', label: 'Tienda en línea', sublabel: 'Online store' },
          ].map(({ num, label, sublabel }) => (
            <div key={num} className="card p-6 text-center">
              <div className="text-3xl font-black text-brand">{num}</div>
              <div className="text-sm font-semibold text-gray-700 dark:text-slate-200 mt-1">{label}</div>
              <div className="text-xs text-gray-400 dark:text-slate-400">{sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-gray-50 dark:bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center text-gray-900 dark:text-slate-100 mb-10">
            {t('about.values.title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 flex flex-col gap-3">
                <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-slate-100">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100">{t('about.categories.title')}</h2>
          <p className="mt-2 text-gray-500 dark:text-slate-400">{t('about.categories.sub')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(({ icon: Icon, labelKey }) => (
            <Link href="/store" key={labelKey}
              className="card p-5 flex flex-col items-center gap-3 hover:border-brand hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                <Icon className="w-6 h-6 text-brand" />
              </div>
              <span className="text-sm font-semibold text-center text-gray-700 dark:text-slate-200">
                {t(labelKey)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Visit + CTA ── */}
      <section className="bg-gray-50 dark:bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-start">
          {/* Visit info */}
          <div className="card p-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100 mb-6">{t('about.visit.title')}</h2>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <a href="https://maps.google.com/?q=20+Calle+Venecia,+Naguabo,+Puerto+Rico+00718"
                  target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                  20 Calle Venecia, Naguabo, PR 00718
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand shrink-0" />
                <a href="tel:+17878742120" className="hover:text-brand">(787) 874-2120</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand shrink-0" />
                <a href="mailto:info@naguabo-commercial.com" className="hover:text-brand">
                  info@naguabo-commercial.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <div>
                  <div>{t('about.visit.hoursVal')}</div>
                  <div>{t('about.visit.online')}</div>
                </div>
              </li>
            </ul>
            <a href="https://maps.google.com/?q=20+Calle+Venecia,+Naguabo,+Puerto+Rico+00718"
              target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-block bg-brand text-white font-bold px-5 py-2.5 rounded-md hover:bg-brand-dark transition-colors text-sm">
              {t('about.cta.directions')}
            </a>
          </div>

          {/* CTA */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 leading-tight">
              {t('about.cta.title')}
            </h2>
            <p className="mt-4 text-gray-500 dark:text-slate-400 text-lg">{t('about.cta.sub')}</p>
            <div className="mt-6">
              <Link href="/store"
                className="inline-block bg-brand text-white font-bold px-7 py-3 rounded-md hover:bg-brand-dark transition-colors">
                {t('about.cta.shop')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
