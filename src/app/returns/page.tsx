'use client';
import Link from 'next/link';
import {
  ClipboardList, PackageCheck, Truck, BadgeCheck,
  AlertTriangle, XCircle, Info, Phone, Mail, MessageCircle,
  Clock, RotateCcw, ShieldAlert, Boxes,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export default function ReturnsPage() {
  const { lang } = useLanguage();
  const es = lang === 'es';

  const waMsg = es
    ? 'Hola, quiero solicitar una autorización de devolución (RGA). Mi número de orden es: #___'
    : 'Hello, I would like to request a Return Authorization (RGA). My order number is: #___';

  const steps = es
    ? [
        { icon: ClipboardList,  num: '01', title: 'Solicita tu RGA',       desc: 'Contáctanos dentro de los 10 días hábiles desde la recepción del producto para solicitar un número de Autorización de Devolución (RGA). Sin RGA no se aceptará la devolución.' },
        { icon: PackageCheck,   num: '02', title: 'Prepara el paquete',    desc: 'Empaca el producto en su estado original, con todos los accesorios, manuales y empaque. Escribe el número de RGA visible en el exterior de la caja.' },
        { icon: Truck,          num: '03', title: 'Envía el producto',     desc: 'Despacha el artículo dentro de los 5 días laborables tras recibir tu número de RGA. Los gastos de flete de devolución corren por cuenta del cliente salvo excepciones.' },
        { icon: BadgeCheck,     num: '04', title: 'Recibe tu crédito',     desc: 'Al recibir e inspeccionar el artículo, procesaremos tu reembolso o crédito en un plazo de 5 a 7 días laborables al método de pago original.' },
      ]
    : [
        { icon: ClipboardList,  num: '01', title: 'Request your RGA',      desc: 'Contact us within 10 business days of receiving the product to request a Return Goods Authorization (RGA) number. Returns will not be accepted without an RGA.' },
        { icon: PackageCheck,   num: '02', title: 'Prepare the package',   desc: 'Pack the item in its original condition with all accessories, manuals, and packaging. Write the RGA number visibly on the outside of the box.' },
        { icon: Truck,          num: '03', title: 'Ship the product',      desc: 'Dispatch the item within 5 business days of receiving your RGA number. Return freight costs are the customer\'s responsibility unless otherwise agreed.' },
        { icon: BadgeCheck,     num: '04', title: 'Receive your credit',   desc: 'Upon receipt and inspection, we will process your refund or credit within 5–7 business days to the original payment method.' },
      ];

  const eligible = es
    ? [
        { ok: true,  label: 'Productos en condición como nueva (like-new), sin usar' },
        { ok: true,  label: 'Con empaque original completo, accesorios y manuales' },
        { ok: true,  label: 'Notificados dentro de los 10 días hábiles tras la recepción' },
        { ok: true,  label: 'Con número de RGA asignado por Naguabo Commercial' },
        { ok: true,  label: 'Defectos de fabricación — sin límite de empaque (dentro del plazo)' },
      ]
    : [
        { ok: true,  label: 'Items in like-new, unused condition' },
        { ok: true,  label: 'With complete original packaging, accessories, and manuals' },
        { ok: true,  label: 'Reported within 10 business days of receipt' },
        { ok: true,  label: 'With an RGA number assigned by Naguabo Commercial' },
        { ok: true,  label: 'Manufacturing defects — no packaging requirement (within timeframe)' },
      ];

  const notEligible = es
    ? [
        'Pedidos especiales / productos a medida o por encargo',
        'Artículos en liquidación o venta final',
        'Productos usados, instalados o con daños causados por el comprador',
        'Artículos sin empaque original (salvo defecto de fabricación)',
        'Productos enviados directamente por el fabricante sin autorización del fabricante',
        'Artículos reportados fuera del plazo de 10 días hábiles',
      ]
    : [
        'Special orders / custom or made-to-order products',
        'Clearance or final-sale items',
        'Used, installed, or buyer-damaged products',
        'Items without original packaging (except manufacturing defect)',
        'Products shipped directly from the manufacturer without manufacturer authorization',
        'Items reported outside the 10-business-day window',
      ];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <RotateCcw className="w-4 h-4" />
            {es ? 'Política de Devoluciones' : 'Return Policy'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {es ? 'Devoluciones y Cambios' : 'Returns & Exchanges'}
          </h1>
          <p className="text-orange-100 text-lg max-w-xl mx-auto">
            {es
              ? 'Tu satisfacción es nuestra prioridad. Procesamos devoluciones de manera justa, rápida y transparente.'
              : 'Your satisfaction is our priority. We process returns fairly, quickly, and transparently.'}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* ── At a glance ── */}
        <section className="grid sm:grid-cols-3 gap-4 text-center">
          {[
            { icon: Clock,      val: es ? '10 días hábiles'  : '10 business days', sub: es ? 'para notificar la devolución'    : 'to notify us of a return' },
            { icon: Truck,      val: es ? '5 días laborables': '5 business days',  sub: es ? 'para enviar tras recibir el RGA' : 'to ship after receiving RGA' },
            { icon: BadgeCheck, val: es ? '5–7 días'         : '5–7 days',         sub: es ? 'para procesar tu reembolso'      : 'to process your refund' },
          ].map(({ icon: Icon, val, sub }) => (
            <div key={val} className="card p-6 flex flex-col items-center gap-2">
              <Icon className="w-7 h-7 text-brand" />
              <span className="text-2xl font-black text-brand">{val}</span>
              <span className="text-sm text-gray-500 dark:text-slate-400">{sub}</span>
            </div>
          ))}
        </section>

        {/* ── Step-by-step ── */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100 mb-8 text-center">
            {es ? 'Cómo Hacer una Devolución' : 'How to Make a Return'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map(({ icon: Icon, num, title, desc }) => (
              <div key={num} className="card p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-brand/30 leading-none">{num}</span>
                  <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-slate-100">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* RGA callout */}
          <div className="mt-6 rounded-xl border-2 border-brand/30 bg-brand/5 dark:bg-brand/10 p-5 flex gap-4 items-start">
            <Info className="w-5 h-5 text-brand shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-slate-300">
              {es
                ? <><strong>¿Qué es un RGA?</strong> Un número de Autorización de Devolución de Mercancía (RGA — Returned Goods Authorization) es un código único que debemos asignarte antes de que envíes cualquier producto de regreso. Esto nos permite rastrear la devolución, verificar elegibilidad y agilizar tu reembolso. Sin RGA, el paquete será rechazado.</>
                : <><strong>What is an RGA?</strong> A Returned Goods Authorization (RGA) number is a unique code we must assign you before you ship any product back. This allows us to track the return, verify eligibility, and expedite your refund. Without an RGA, the package will be refused.</>
              }
            </p>
          </div>
        </section>

        {/* ── Eligible / Not eligible ── */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Eligible */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <BadgeCheck className="w-5 h-5 text-green-500" />
              {es ? 'Elegible para devolución' : 'Eligible for return'}
            </h3>
            <ul className="space-y-2">
              {eligible.map(({ label }) => (
                <li key={label} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Not eligible */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-500" />
              {es ? 'No elegible para devolución' : 'Not eligible for return'}
            </h3>
            <ul className="space-y-2">
              {notEligible.map((label) => (
                <li key={label} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Fees section ── */}
        <section className="space-y-5">
          <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100">
            {es ? 'Cargos y Responsabilidades' : 'Fees & Responsibilities'}
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Restocking */}
            <div className="card p-6 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Boxes className="w-5 h-5 text-brand" />
                <h3 className="font-bold text-gray-900 dark:text-slate-100">
                  {es ? 'Cargo por realmacenamiento (Restocking)' : 'Restocking Fee'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                {es
                  ? 'Puede aplicar un cargo por realmacenamiento dependiendo del producto y el fabricante. Este cargo se informará al momento de aprobar el RGA. Los productos enviados directamente por el fabricante están sujetos a la política de restocking del fabricante.'
                  : 'A restocking fee may apply depending on the product and manufacturer. This fee will be communicated when the RGA is approved. Products shipped directly from the manufacturer are subject to the manufacturer\'s restocking policy.'}
              </p>
            </div>

            {/* Return freight */}
            <div className="card p-6 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="w-5 h-5 text-brand" />
                <h3 className="font-bold text-gray-900 dark:text-slate-100">
                  {es ? 'Flete de devolución' : 'Return Freight'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                {es
                  ? 'En la mayoría de los casos, el flete de devolución corre por cuenta del cliente. Las excepciones aplican si el producto tiene un defecto de fabricación confirmado o si el error fue de Naguabo Commercial. Los cargos de transporte, manejo y movimiento de la bodega al cliente son responsabilidad del comprador.'
                  : 'In most cases, return freight is the customer\'s responsibility. Exceptions apply if the product has a confirmed manufacturing defect or if the error was Naguabo Commercial\'s. Transportation, handling, and warehouse-to-customer charges are the buyer\'s responsibility.'}
              </p>
            </div>

            {/* Finance charges */}
            <div className="card p-6 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-5 h-5 text-brand" />
                <h3 className="font-bold text-gray-900 dark:text-slate-100">
                  {es ? 'Cargos por mora' : 'Finance Charges'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                {es
                  ? 'Las facturas no pagadas de acuerdo con los términos de crédito establecidos devengarán cargos financieros al 12% anual o la tasa máxima permitida por ley en Puerto Rico, la que sea mayor. Los pagos se aplican primero a cargos por mora pendientes y luego al saldo de las facturas.'
                  : 'Unpaid invoices past their credit terms will accrue finance charges at 12% per annum or the maximum rate permitted by Puerto Rico law, whichever is greater. Payments are applied first to outstanding finance charges, then to invoice balances.'}
              </p>
            </div>

            {/* Credit card surcharge */}
            <div className="card p-6 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-5 h-5 text-brand" />
                <h3 className="font-bold text-gray-900 dark:text-slate-100">
                  {es ? 'Recargo por tarjeta de crédito' : 'Credit Card Surcharge'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                {es
                  ? 'Los pagos con tarjeta de crédito están sujetos a un recargo de conveniencia de hasta el 3%, conforme a los términos estándar de venta. Este cargo se mostrará antes de confirmar la compra.'
                  : 'Credit card payments are subject to a convenience surcharge of up to 3%, per standard terms of sale. This charge will be displayed before confirming the purchase.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── Freight damage ── */}
        <section>
          <div className="rounded-xl border-2 border-amber-400/50 bg-amber-50 dark:bg-amber-900/10 p-6 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-slate-100">
                {es ? 'Daño en el transporte — Reporte inmediato' : 'Freight Damage — Report Immediately'}
              </h3>
              <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                {es
                  ? 'Si recibes un pedido con daño evidente en el empaque o en el producto, <strong>notifícanos dentro de las 48 horas</strong> siguientes a la recepción. Para pedidos de instalación o comerciales, el reporte debe hacerse dentro de las <strong>4 horas</strong> para poder gestionar reclamaciones con el transportista. Envía fotografías del daño al producto y al empaque a <strong>info@naguabo-commercial.com</strong> o por WhatsApp. Fuera de este plazo, no podremos gestionar reclamaciones de flete ante el transportista.'
                  : <>If you receive an order with visible damage to the packaging or product, <strong>notify us within 48 hours</strong> of receipt. For commercial or installation orders, the report must be made within <strong>4 hours</strong> to allow freight claims with the carrier. Send photos of the damaged product and packaging to <strong>info@naguabo-commercial.com</strong> or via WhatsApp. Outside this window, we cannot file freight claims with the carrier.</>
                }
              </p>
            </div>
          </div>
        </section>

        {/* ── Manufacturer returns + Custom orders ── */}
        <section className="grid sm:grid-cols-2 gap-5">
          <div className="card p-6 space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-brand" />
              {es ? 'Devoluciones al fabricante' : 'Manufacturer Returns'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              {es
                ? 'Los productos enviados directamente desde el fabricante están sujetos a los términos y condiciones de devolución del fabricante, incluyendo sus políticas de cargos por realmacenamiento. Naguabo Commercial actuará como intermediario en la medida de lo posible para facilitar el proceso.'
                : 'Products shipped directly from the manufacturer are subject to the manufacturer\'s return terms and conditions, including their restocking fee policies. Naguabo Commercial will act as an intermediary as much as possible to facilitate the process.'}
            </p>
          </div>
          <div className="card p-6 space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              {es ? 'Pedidos especiales / a medida' : 'Custom / Special Orders'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              {es
                ? 'Los pedidos especiales y productos a medida o por encargo <strong>no son retornables</strong>. Estos pedidos requieren un depósito al momento de la orden y están sujetos a cargos por cancelación. Los precios están sujetos a cambios por variaciones en los costos del fabricante o recargos de materiales, lo cual es responsabilidad del cliente.'
                : <>Custom orders and made-to-order products are <strong>non-returnable</strong>. These orders require a deposit at the time of order and are subject to cancellation fees. Prices are subject to change due to manufacturer cost variations or material surcharges, which are the customer's responsibility.</>
              }
            </p>
          </div>
        </section>

        {/* ── Security interest note ── */}
        <section>
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 p-5 flex gap-4 items-start">
            <ShieldAlert className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-gray-700 dark:text-slate-300 mb-1">
                {es ? 'Retención de título' : 'Title Retention'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                {es
                  ? 'Naguabo Commercial retiene el título y un interés de seguridad sobre los productos hasta que el comprador haya efectuado el pago total. En caso de impago, mora o insolvencia del comprador, Naguabo Commercial se reserva el derecho de recuperar los bienes conforme al Código Comercial Uniforme (UCC) adoptado en Puerto Rico y demás leyes aplicables. Este documento puede ser registrado como declaración de financiamiento UCC-1.'
                  : 'Naguabo Commercial retains title and a security interest in all products until the buyer has made full payment. In the event of non-payment, default, or buyer insolvency, Naguabo Commercial reserves the right to repossess goods under the Uniform Commercial Code (UCC) as adopted in Puerto Rico and other applicable laws. This document may be filed as a UCC-1 Financing Statement.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="card p-8 text-center">
          <RotateCcw className="w-10 h-10 text-brand mx-auto mb-3" />
          <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100 mb-2">
            {es ? '¿Listo para iniciar una devolución?' : 'Ready to start a return?'}
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
            {es
              ? 'Ten a mano tu número de orden. Uno de nuestros representantes te asignará el número de RGA y te guiará paso a paso.'
              : 'Have your order number ready. One of our representatives will assign your RGA number and guide you step by step.'}
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <a href="tel:+17878742120"
              className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-brand hover:shadow-md transition-all">
              <Phone className="w-7 h-7 text-brand" />
              <span className="font-bold text-sm text-gray-800 dark:text-slate-100">
                {es ? 'Llamar' : 'Call us'}
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-400">(787) 874-2120</span>
              <span className="text-xs text-gray-400 dark:text-slate-500">
                {es ? 'Lun–Sáb 7am–5pm' : 'Mon–Sat 7am–5pm'}
              </span>
            </a>
            <a href={buildWhatsAppLink(waMsg)} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-brand hover:shadow-md transition-all">
              <MessageCircle className="w-7 h-7 text-green-500" />
              <span className="font-bold text-sm text-gray-800 dark:text-slate-100">WhatsApp</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">(787) 874-2120</span>
              <span className="text-xs text-gray-400 dark:text-slate-500">
                {es ? 'Respuesta rápida' : 'Quick response'}
              </span>
            </a>
            <a href="mailto:info@naguabo-commercial.com"
              className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-brand hover:shadow-md transition-all">
              <Mail className="w-7 h-7 text-brand" />
              <span className="font-bold text-sm text-gray-800 dark:text-slate-100">
                {es ? 'Correo' : 'Email'}
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-400 text-center">info@naguabo-commercial.com</span>
              <span className="text-xs text-gray-400 dark:text-slate-500">
                {es ? 'Respuesta en 24h' : 'Response within 24h'}
              </span>
            </a>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 flex flex-wrap justify-center gap-5 text-sm">
            <Link href="/terms" className="text-brand hover:underline">
              {es ? 'Términos y Condiciones' : 'Terms & Conditions'}
            </Link>
            <Link href="/help" className="text-brand hover:underline">
              {es ? 'Centro de Ayuda' : 'Help Center'}
            </Link>
            <Link href="/privacy" className="text-brand hover:underline">
              {es ? 'Política de Privacidad' : 'Privacy Policy'}
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
