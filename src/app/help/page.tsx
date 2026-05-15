'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Package, RotateCcw, Boxes, CreditCard, User, Store,
  ChevronDown, Phone, Mail, MessageCircle, MapPin, Clock,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { buildWhatsAppLink } from '@/lib/whatsapp';

/* ─── Types ─────────────────────────────────────────────────────────── */
interface FaqItem { q: string; a: string }
interface FaqCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  items: FaqItem[];
}

/* ─── Content (bilingual) ─────────────────────────────────────────────── */
function getContent(es: boolean) {
  const categories: FaqCategory[] = [
    {
      id: 'orders',
      icon: Package,
      title: es ? 'Órdenes y Envíos' : 'Orders & Shipping',
      items: [
        {
          q: es ? '¿Cómo puedo rastrear mi pedido?' : 'How do I track my order?',
          a: es
            ? 'Una vez confirmado tu pedido recibirás un correo electrónico con el número de orden y, si aplica, un enlace de rastreo del transportista. También puedes ver el estado de tu orden en Mi Cuenta → Mis Pedidos.'
            : 'Once your order is confirmed, you will receive an email with your order number and, if applicable, a carrier tracking link. You can also view order status under My Account → My Orders.',
        },
        {
          q: es ? '¿Cuánto tarda el envío?' : 'How long does shipping take?',
          a: es
            ? 'El envío estándar dentro de Puerto Rico tarda entre 1 y 3 días laborables. En algunas áreas remotas puede tomar hasta 5 días. El recogido en tienda en Naguabo está listo en aproximadamente 1 hora tras la confirmación del pedido.'
            : 'Standard shipping within Puerto Rico takes 1–3 business days. In some remote areas it may take up to 5 days. In-store pickup in Naguabo is ready approximately 1 hour after order confirmation.',
        },
        {
          q: es ? '¿Hacen envíos fuera de Puerto Rico?' : 'Do you ship outside Puerto Rico?',
          a: es
            ? 'Por el momento solo realizamos envíos dentro de Puerto Rico. Para consultas sobre envíos especiales, contáctanos por WhatsApp o al (787) 874-2120.'
            : 'At this time we only ship within Puerto Rico. For special shipping inquiries, contact us via WhatsApp or at (787) 874-2120.',
        },
        {
          q: es ? '¿Qué pasa si mi pedido llega dañado?' : 'What if my order arrives damaged?',
          a: es
            ? 'Si tu pedido llega dañado, contáctanos dentro de los 48 horas siguientes a la entrega con fotos del producto y el empaque. Gestionaremos un reemplazo o reembolso sin costo adicional.'
            : 'If your order arrives damaged, contact us within 48 hours of delivery with photos of the product and packaging. We will arrange a replacement or refund at no additional cost.',
        },
        {
          q: es ? '¿Puedo modificar o cancelar un pedido?' : 'Can I modify or cancel an order?',
          a: es
            ? 'Puedes modificar o cancelar tu pedido dentro de las primeras 2 horas después de realizarlo, siempre que no haya sido procesado para envío. Contáctanos inmediatamente al (787) 874-2120 o por WhatsApp.'
            : 'You may modify or cancel your order within the first 2 hours after placing it, as long as it has not been processed for shipping. Contact us immediately at (787) 874-2120 or via WhatsApp.',
        },
        {
          q: es ? '¿Cuándo recibiré la confirmación de mi pedido?' : 'When will I receive my order confirmation?',
          a: es
            ? 'Recibirás un correo de confirmación automático en los minutos siguientes a tu compra. Si no lo recibes, revisa tu carpeta de spam o contáctanos.'
            : 'You will receive an automatic confirmation email within minutes of your purchase. If you do not receive it, check your spam folder or contact us.',
        },
      ],
    },
    {
      id: 'returns',
      icon: RotateCcw,
      title: es ? 'Devoluciones y Cambios' : 'Returns & Exchanges',
      items: [
        {
          q: es ? '¿Cuál es la política de devoluciones?' : 'What is the return policy?',
          a: es
            ? 'Aceptamos devoluciones dentro de los 30 días calendario a partir de la fecha de compra, siempre que el producto esté en su estado original, sin usar y en su empaque original. Los artículos en liquidación o venta final no son elegibles para devolución.'
            : 'We accept returns within 30 calendar days from the purchase date, provided the product is in its original, unused condition and original packaging. Clearance or final-sale items are not eligible for return.',
        },
        {
          q: es ? '¿Cómo inicio una devolución?' : 'How do I start a return?',
          a: es
            ? 'Para iniciar una devolución, contáctanos por correo a info@naguabo-commercial.com o por WhatsApp con tu número de orden y el motivo de la devolución. Te daremos instrucciones para enviar o traer el producto a nuestra tienda en Naguabo.'
            : 'To start a return, contact us by email at info@naguabo-commercial.com or via WhatsApp with your order number and reason for return. We will provide instructions to ship or bring the product to our Naguabo store.',
        },
        {
          q: es ? '¿Puedo devolver un producto que ya usé?' : 'Can I return a product I already used?',
          a: es
            ? 'Los productos usados generalmente no son elegibles para devolución. Excepciones aplican si el producto resultó ser defectuoso. En ese caso, contáctanos para evaluar la situación.'
            : 'Used products are generally not eligible for return. Exceptions apply if the product turned out to be defective. In that case, contact us so we can evaluate the situation.',
        },
        {
          q: es ? '¿Cuándo recibiré mi reembolso?' : 'When will I receive my refund?',
          a: es
            ? 'Una vez recibido e inspeccionado el producto devuelto, procesaremos tu reembolso dentro de 5 a 7 días laborables. El tiempo de acreditación depende de tu entidad bancaria.'
            : 'Once the returned product is received and inspected, we will process your refund within 5–7 business days. Credit time depends on your bank.',
        },
        {
          q: es ? '¿Puedo cambiar un producto por otro?' : 'Can I exchange a product for another?',
          a: es
            ? 'Sí. Los cambios están sujetos a disponibilidad. El proceso es igual al de una devolución: contáctanos con tu número de orden e indicanos el producto que deseas en su lugar.'
            : 'Yes. Exchanges are subject to availability. The process is the same as a return: contact us with your order number and let us know the product you want instead.',
        },
      ],
    },
    {
      id: 'products',
      icon: Boxes,
      title: es ? 'Productos y Disponibilidad' : 'Products & Availability',
      items: [
        {
          q: es ? '¿Cómo sé si un producto está en inventario?' : 'How do I know if a product is in stock?',
          a: es
            ? 'Cada página de producto muestra el estado de inventario actualizado. Si aparece "Agotado", puedes contactarnos por WhatsApp para preguntar por disponibilidad próxima o productos alternativos.'
            : 'Each product page shows the current inventory status. If it shows "Out of stock," you can contact us via WhatsApp to ask about upcoming availability or alternative products.',
        },
        {
          q: es ? '¿Puedo reservar un producto agotado?' : 'Can I reserve an out-of-stock product?',
          a: es
            ? 'Sí. Contáctanos por WhatsApp o llámanos al (787) 874-2120 y podemos avisarte cuando el producto esté disponible o gestionar un pedido especial para ti.'
            : 'Yes. Contact us via WhatsApp or call (787) 874-2120 and we can notify you when the product is available or arrange a special order for you.',
        },
        {
          q: es ? '¿Ofrecen productos por pedido especial?' : 'Do you offer special-order products?',
          a: es
            ? 'Sí. Si no encuentras lo que buscas en nuestro catálogo, contáctanos. Trabajamos con distribuidores y podemos conseguir artículos de construcción, herramientas y materiales especializados.'
            : 'Yes. If you cannot find what you need in our catalog, contact us. We work with distributors and can source specialized construction items, tools, and materials.',
        },
        {
          q: es ? '¿Cómo encuentro el SKU o código de un producto?' : 'How do I find a product SKU or code?',
          a: es
            ? 'El SKU y el código de barras (UPC) aparecen en la página de detalle de cada producto, debajo del nombre. También puedes buscarlo directamente en la barra de búsqueda de la tienda.'
            : 'The SKU and barcode (UPC) appear on each product detail page, below the product name. You can also search for it directly in the store search bar.',
        },
        {
          q: es ? '¿Ofrecen precios especiales para contratistas?' : 'Do you offer special pricing for contractors?',
          a: es
            ? 'Sí. Contratistas y compradores al por mayor pueden comunicarse con nosotros directamente al (787) 874-2120 o por WhatsApp para discutir precios especiales en volumen.'
            : 'Yes. Contractors and wholesale buyers can contact us directly at (787) 874-2120 or via WhatsApp to discuss special volume pricing.',
        },
      ],
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: es ? 'Pagos y Facturación' : 'Payments & Billing',
      items: [
        {
          q: es ? '¿Qué métodos de pago aceptan?' : 'What payment methods do you accept?',
          a: es
            ? 'Aceptamos las principales tarjetas de crédito y débito (Visa, Mastercard, American Express, Discover) a través de Stripe. También puedes pagar en efectivo directamente en nuestra tienda en Naguabo.'
            : 'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) through Stripe. You can also pay cash directly at our Naguabo store.',
        },
        {
          q: es ? '¿Es seguro pagar en línea?' : 'Is it safe to pay online?',
          a: es
            ? 'Sí. Todos los pagos se procesan a través de Stripe, certificado PCI DSS Nivel 1 — el estándar más alto de seguridad para pagos en línea. Nunca almacenamos datos de tu tarjeta en nuestros servidores.'
            : 'Yes. All payments are processed through Stripe, certified PCI DSS Level 1 — the highest standard for online payment security. We never store your card data on our servers.',
        },
        {
          q: es ? '¿Por qué fue rechazada mi tarjeta?' : 'Why was my card declined?',
          a: es
            ? 'Los rechazos pueden ocurrir por fondos insuficientes, datos de tarjeta incorrectos, restricciones del banco o límites de transacción. Te recomendamos verificar los datos ingresados o contactar a tu banco. También puedes intentar con otra tarjeta.'
            : 'Declines can occur due to insufficient funds, incorrect card details, bank restrictions, or transaction limits. We recommend verifying the entered data or contacting your bank. You can also try a different card.',
        },
        {
          q: es ? '¿Puedo pagar en efectivo al recoger en tienda?' : 'Can I pay cash when picking up in store?',
          a: es
            ? 'Sí. Si seleccionas "Recogido en tienda" como método de entrega, puedes pagar en efectivo al momento de recoger tu pedido en nuestra tienda de Naguabo.'
            : 'Yes. If you select "In-store pickup" as your delivery method, you may pay in cash when collecting your order at our Naguabo store.',
        },
        {
          q: es ? '¿Emiten facturas o recibos oficiales?' : 'Do you issue official invoices or receipts?',
          a: es
            ? 'Sí. Al completar tu compra recibirás automáticamente un recibo por correo electrónico. Si necesitas una factura formal para fines comerciales o de impuestos, contáctanos a info@naguabo-commercial.com.'
            : 'Yes. Upon completing your purchase you will automatically receive a receipt by email. If you need a formal invoice for business or tax purposes, contact us at info@naguabo-commercial.com.',
        },
      ],
    },
    {
      id: 'account',
      icon: User,
      title: es ? 'Cuenta y Perfil' : 'Account & Profile',
      items: [
        {
          q: es ? '¿Cómo creo una cuenta?' : 'How do I create an account?',
          a: es
            ? 'Haz clic en el ícono de usuario en la parte superior de la página y selecciona "Registrarse". Ingresa tu nombre, correo electrónico y contraseña. También puedes completar una compra como invitado sin necesidad de crear una cuenta.'
            : 'Click the user icon at the top of the page and select "Register." Enter your name, email, and password. You can also complete a purchase as a guest without creating an account.',
        },
        {
          q: es ? '¿Olvidé mi contraseña, cómo la recupero?' : 'I forgot my password — how do I reset it?',
          a: es
            ? 'En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?" e ingresa tu correo electrónico. Recibirás un enlace para restablecer tu contraseña en minutos.'
            : 'On the login page, click "Forgot your password?" and enter your email address. You will receive a password reset link within minutes.',
        },
        {
          q: es ? '¿Cómo actualizo mi información de contacto?' : 'How do I update my contact information?',
          a: es
            ? 'Inicia sesión en tu cuenta, ve a Mi Cuenta → Perfil y actualiza tu nombre, correo, teléfono o dirección según necesites.'
            : 'Log in to your account, go to My Account → Profile, and update your name, email, phone, or address as needed.',
        },
        {
          q: es ? '¿Puedo eliminar mi cuenta?' : 'Can I delete my account?',
          a: es
            ? 'Sí. Para solicitar la eliminación de tu cuenta y todos tus datos, escríbenos a privacy@naguabo-commercial.com con el asunto "Eliminar cuenta". Procesaremos tu solicitud dentro de 30 días.'
            : 'Yes. To request deletion of your account and all your data, email us at privacy@naguabo-commercial.com with the subject "Delete account." We will process your request within 30 days.',
        },
      ],
    },
    {
      id: 'store',
      icon: Store,
      title: es ? 'Tienda y Recogido' : 'Store & Pickup',
      items: [
        {
          q: es ? '¿Cuál es el horario de la tienda?' : 'What are the store hours?',
          a: es
            ? 'Nuestra tienda física en Naguabo está abierta de lunes a sábado, de 7:00 am a 5:00 pm (AST). Nuestra tienda en línea está disponible las 24 horas, los 7 días de la semana.'
            : 'Our physical store in Naguabo is open Monday through Saturday, 7:00 am to 5:00 pm (AST). Our online store is available 24 hours a day, 7 days a week.',
        },
        {
          q: es ? '¿Cómo funciona el recogido en tienda?' : 'How does in-store pickup work?',
          a: es
            ? 'Selecciona "Recogido en tienda" al finalizar tu compra. Cuando tu pedido esté listo (normalmente en 1 hora), recibirás una notificación por correo. Preséntate en 20 Calle Venecia, Naguabo con tu confirmación y un ID.'
            : 'Select "In-store pickup" at checkout. When your order is ready (usually within 1 hour), you will receive an email notification. Come to 20 Calle Venecia, Naguabo with your confirmation and a valid ID.',
        },
        {
          q: es ? '¿Dónde está ubicada la tienda?' : 'Where is the store located?',
          a: es
            ? 'Estamos ubicados en 20 Calle Venecia, Naguabo, Puerto Rico 00718. Puedes encontrarnos fácilmente en Google Maps buscando "Naguabo Commercial".'
            : 'We are located at 20 Calle Venecia, Naguabo, Puerto Rico 00718. You can find us easily on Google Maps by searching "Naguabo Commercial."',
        },
        {
          q: es ? '¿Puedo ir a la tienda sin hacer un pedido en línea?' : 'Can I come to the store without placing an online order?',
          a: es
            ? 'Por supuesto. Puedes visitar nuestra tienda física durante el horario de atención para explorar productos, hacer preguntas o comprar directamente. Nuestro equipo estará encantado de ayudarte.'
            : 'Absolutely. You can visit our physical store during business hours to browse products, ask questions, or purchase directly. Our team will be happy to help you.',
        },
        {
          q: es ? '¿Tienen estacionamiento disponible?' : 'Is parking available?',
          a: es
            ? 'Sí, contamos con estacionamiento disponible para clientes directamente en nuestra ubicación en Calle Venecia, Naguabo.'
            : 'Yes, customer parking is available directly at our location on Calle Venecia, Naguabo.',
        },
      ],
    },
  ];

  const quickLinks = [
    { icon: Package,      label: es ? 'Rastrear pedido'       : 'Track order',          href: '/account' },
    { icon: RotateCcw,    label: es ? 'Iniciar devolución'    : 'Start a return',        href: '/contact' },
    { icon: MapPin,       label: es ? 'Ubicación y horario'   : 'Location & hours',      href: '/about#visit' },
    { icon: Phone,        label: es ? 'Llamar a la tienda'    : 'Call the store',        href: 'tel:+17878742120' },
    { icon: MessageCircle,label: es ? 'Chat por WhatsApp'     : 'WhatsApp chat',         href: buildWhatsAppLink(es ? 'Hola, necesito ayuda con mi pedido.' : 'Hello, I need help with my order.') },
    { icon: CreditCard,   label: es ? 'Métodos de pago'       : 'Payment methods',       href: '#payments' },
  ];

  return { categories, quickLinks };
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function HelpPage() {
  const { lang } = useLanguage();
  const es = lang === 'es';
  const { categories, quickLinks } = useMemo(() => getContent(es), [es]);

  const [query, setQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) =>
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  const filtered = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [query, categories]);

  const waLink = buildWhatsAppLink(
    es ? 'Hola, necesito ayuda con mi pedido.' : 'Hello, I need help with my order.'
  );

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            {es ? '¿En qué podemos ayudarte?' : 'How can we help you?'}
          </h1>
          <p className="text-orange-100 mb-8 text-lg">
            {es
              ? 'Encuentra respuestas rápidas o contáctanos directamente.'
              : 'Find quick answers or reach out to us directly.'}
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={es ? 'Buscar en el centro de ayuda…' : 'Search help center…'}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 text-base
                         focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* ── Quick links ── */}
        {!query && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-5">
              {es ? 'Temas populares' : 'Popular topics'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {quickLinks.map(({ icon: Icon, label, href }) => (
                <a key={label} href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="card p-4 flex flex-col items-center gap-2 text-center hover:border-brand hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                    <Icon className="w-5 h-5 text-brand" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-slate-300 leading-tight">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQ sections ── */}
        <section>
          {query && (
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
              {filtered.reduce((sum, c) => sum + c.items.length, 0)}{' '}
              {es ? 'resultado(s) para' : 'result(s) for'}{' '}
              <strong>"{query}"</strong>
            </p>
          )}

          {filtered.length === 0 && (
            <div className="card p-10 text-center text-gray-500 dark:text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">
                {es ? 'No se encontraron resultados.' : 'No results found.'}
              </p>
              <p className="text-sm mt-1">
                {es
                  ? 'Intenta con otras palabras o contáctanos directamente.'
                  : 'Try different words or contact us directly.'}
              </p>
            </div>
          )}

          <div className="space-y-8">
            {filtered.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} id={cat.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                      {cat.title}
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-slate-700 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    {cat.items.map((item, idx) => {
                      const key = `${cat.id}-${idx}`;
                      const open = !!openItems[key];
                      return (
                        <div key={key}>
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left
                                       bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/60
                                       transition-colors"
                          >
                            <span className="font-semibold text-gray-800 dark:text-slate-100 text-sm sm:text-base">
                              {item.q}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {open && (
                            <div className="px-5 pb-5 pt-1 bg-gray-50 dark:bg-slate-800/50 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Still need help ── */}
        {!query && (
          <section className="card p-8 text-center">
            <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100 mb-2">
              {es ? '¿No encontraste lo que buscabas?' : "Didn't find what you were looking for?"}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mb-8">
              {es
                ? 'Nuestro equipo está disponible para ayudarte por teléfono, correo o WhatsApp.'
                : 'Our team is available to help you by phone, email, or WhatsApp.'}
            </p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <a href="tel:+17878742120"
                className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-brand hover:shadow-md transition-all">
                <Phone className="w-7 h-7 text-brand" />
                <span className="font-bold text-sm text-gray-800 dark:text-slate-100">
                  {es ? 'Llamar' : 'Call us'}
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-400">(787) 874-2120</span>
                <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {es ? 'Lun–Sáb 7am–5pm' : 'Mon–Sat 7am–5pm'}
                </span>
              </a>
              <a href="mailto:info@naguabo-commercial.com"
                className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-brand hover:shadow-md transition-all">
                <Mail className="w-7 h-7 text-brand" />
                <span className="font-bold text-sm text-gray-800 dark:text-slate-100">
                  {es ? 'Correo electrónico' : 'Email us'}
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-400">info@naguabo-commercial.com</span>
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  {es ? 'Respuesta en 24h' : 'Response within 24h'}
                </span>
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-brand hover:shadow-md transition-all">
                <MessageCircle className="w-7 h-7 text-green-500" />
                <span className="font-bold text-sm text-gray-800 dark:text-slate-100">WhatsApp</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">(787) 874-2120</span>
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  {es ? 'Respuesta rápida' : 'Quick response'}
                </span>
              </a>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/about" className="text-brand hover:underline">
                {es ? 'Sobre Nosotros' : 'About Us'}
              </Link>
              <Link href="/privacy" className="text-brand hover:underline">
                {es ? 'Política de Privacidad' : 'Privacy Policy'}
              </Link>
              <Link href="/terms" className="text-brand hover:underline">
                {es ? 'Términos de Uso' : 'Terms of Use'}
              </Link>
              <Link href="/store" className="text-brand hover:underline">
                {es ? 'Ir a la Tienda' : 'Go to Store'}
              </Link>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
