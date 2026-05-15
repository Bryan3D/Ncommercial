'use client';
import { useState, useCallback } from 'react';
import { ShoppingCart, ShoppingBag, MessageCircle, Star, Package, Check } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { useCart } from '@/lib/cart-store';

type Category = 'all' | 'apparel' | 'drinkware' | 'accessories';

interface MerchItem {
  id: number;
  name: string;
  nameEs: string;
  category: Exclude<Category, 'all'>;
  price: number;
  image: string;
  badge?: string;
  badgeEs?: string;
  colors?: string[];
  sizes?: string[];
  description: string;
  descriptionEs: string;
}

const items: MerchItem[] = [
  {
    id: 1,
    name: 'NC Classic T-Shirt',
    nameEs: 'Camiseta Clásica NC',
    category: 'apparel',
    price: 24.99,
    image: 'https://files.tapstitch.com/material/style/item_image/image/image-image-RU0130%20(1)-v1741228875-v1753247871.png?x-oss-process=style/hugepod-product-list',
    badge: 'Best Seller',
    badgeEs: 'Más Vendido',
    colors: ['#FFFFFF', '#1a1a1a', '#FF6B35'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: '100% cotton unisex tee with embroidered Naguabo Commercial logo on the chest.',
    descriptionEs: 'Camiseta unisex 100% algodón con logo bordado de Naguabo Commercial en el pecho.',
  },
  {
    id: 2,
    name: 'NC Polo Shirt',
    nameEs: 'Polo NC',
    category: 'apparel',
    price: 34.99,
    image: 'https://assets-cdn.logoup.com/Alldayshirts_ProductImages/K500ES_401061_front.jpg',
    colors: ['#FF6B35', '#FFFFFF', '#1a1a1a'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Professional polo with Naguabo Commercial logo. Perfect for the job site or the store.',
    descriptionEs: 'Polo profesional con logo Naguabo Commercial. Perfecto para el trabajo o la tienda.',
  },
  {
    id: 3,
    name: 'NC Hoodie',
    nameEs: 'Sudadera NC',
    category: 'apparel',
    price: 44.99,
    image: 'https://files.tapstitch.com/material/style/item_image/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_2025/style/item_image/20251014/image-v1760435428-image-image-R00286-(23)-v1741338808-v1750230173.jpg?x-oss-process=style/hugepod-product',
    badge: 'New',
    badgeEs: 'Nuevo',
    colors: ['#1a1a1a', '#FF6B35', '#6B7280'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Heavy-weight pullover hoodie with large screen-printed NC logo on the back.',
    descriptionEs: 'Sudadera de peso pesado con logo NC serigrafiado en la espalda.',
  },
  {
    id: 4,
    name: 'Trucker Hat',
    nameEs: 'Gorra Camionera',
    category: 'apparel',
    price: 22.99,
    image: 'https://theparkwholesale.com/cdn/shop/files/unbranded6panelflatbilltruckerhat-3_1445x-Photoroom_600x.jpg?v=1721775728',
    badge: 'Fan Favorite',
    badgeEs: 'Favorita del Público',
    colors: ['#FFFFFF', '#1a1a1a', '#FF6B35'],
    description: 'Structured snapback trucker hat with embroidered NC logo. One size fits most.',
    descriptionEs: 'Gorra camionera snapback con logo NC bordado. Talla única ajustable.',
  },
  {
    id: 5,
    name: 'NC Tumbler 30oz',
    nameEs: 'Termo NC 30oz',
    category: 'drinkware',
    price: 29.99,
    image: 'https://patriotcoolers.com/cdn/shop/files/pt-40-w-4_540x.jpg?v=1726583031',
    badge: 'Best Seller',
    badgeEs: 'Más Vendido',
    colors: ['#FF6B35', '#1a1a1a', '#FFFFFF'],
    description: 'Double-wall vacuum insulated stainless steel tumbler. Keeps drinks cold 24h / hot 12h.',
    descriptionEs: 'Termo de acero inoxidable con doble pared al vacío. Mantiene frío 24h / caliente 12h.',
  },
  {
    id: 6,
    name: 'NC Coffee Mug',
    nameEs: 'Taza NC',
    category: 'drinkware',
    price: 16.99,
    image: 'https://patriotcoolers.com/cdn/shop/products/pt-stemw-3_540x.jpg?v=1690825907',
    colors: ['#FFFFFF', '#1a1a1a'],
    description: '15oz ceramic mug with the NC logo. Dishwasher and microwave safe.',
    descriptionEs: 'Taza de cerámica 15oz con logo NC. Apta para lavavajillas y microondas.',
  },
  {
    id: 7,
    name: 'Insulated Water Bottle',
    nameEs: 'Botella Térmica',
    category: 'drinkware',
    price: 27.99,
    image: 'https://patriotcoolers.com/cdn/shop/files/pt-bottle40-w_540x.jpg?v=1699040674',
    badge: 'New',
    badgeEs: 'Nuevo',
    colors: ['#FF6B35', '#1a1a1a', '#6B7280'],
    description: '24oz stainless steel water bottle with NC logo. Leak-proof lid, fits most cup holders.',
    descriptionEs: 'Botella de acero inoxidable 24oz con logo NC. Tapa hermética, cabe en la mayoría de portavasos.',
  },
  {
    id: 8,
    name: 'Logo Keychain',
    nameEs: 'Llavero con Logo',
    category: 'accessories',
    price: 9.99,
    image: 'https://s3.amazonaws.com/wbbros-prod/variant_image/original-9ae292e2-bbc7-4ebf-af5c-1a8fd10693f9.jpg?1758223790',
    badge: 'Best Seller',
    badgeEs: 'Más Vendido',
    description: 'Durable metal keychain with the NC logo. A great everyday carry piece.',
    descriptionEs: 'Llavero de metal resistente con el logo NC. Perfecto para el día a día.',
  },
  {
    id: 9,
    name: 'Sticker Pack (5x)',
    nameEs: 'Pack de Stickers (5x)',
    category: 'accessories',
    price: 7.99,
    image: 'https://images.myhardhatstickers.com/img/md/H/Custom-Circular-Hard-Hat-Label-HH-3051.gif',
    description: '5-piece waterproof vinyl sticker set. Perfect for your toolbox, laptop, or hard hat.',
    descriptionEs: 'Set de 5 stickers de vinilo impermeables. Perfectos para tu caja de herramientas, laptop o casco.',
  },
  {
    id: 10,
    name: 'Canvas Tote Bag',
    nameEs: 'Bolsa de Lona',
    category: 'accessories',
    price: 18.99,
    image: 'https://totebagfactory.com/cdn/shop/files/eco-friendly-convention-canvas-tote-bag.jpg?v=1748939686&width=1500',
    colors: ['#F5F0E8', '#1a1a1a'],
    description: 'Heavy-duty canvas tote with NC logo. Reinforced handles, holds up to 30 lbs.',
    descriptionEs: 'Bolsa de lona resistente con logo NC. Asas reforzadas, soporta hasta 30 lbs.',
  },
  {
    id: 11,
    name: 'Hard Hat Decal Set',
    nameEs: 'Stickers para Casco',
    category: 'accessories',
    price: 5.99,
    image: 'https://images.myhardhatstickers.com/img/md/H/Custom-Circular-Hard-Hat-Label-HH-3051.gif',
    badge: 'New',
    badgeEs: 'Nuevo',
    description: 'Set of 3 high-visibility NC logo decals designed for hard hats and helmets.',
    descriptionEs: 'Set de 3 calcomanías de alta visibilidad del logo NC para cascos de construcción.',
  },
  {
    id: 12,
    name: 'NC Work Apron',
    nameEs: 'Delantal de Trabajo NC',
    category: 'apparel',
    price: 39.99,
    image: 'https://mms-images.out.customink.com/mms/images/catalog/5da93a7475cafb7b2a6e237cc16b991c/colors/481406/views/alt/front_large.png?autoNegate=1&design=uaj0-00cy-5555&digest=000000028&ixbg=%23f5f5f5&ixfm=jpeg&ixq=60&ixw=722&placeMax=1&placeMaxPct=0.8&placeUseProduct=1&placeUseView=front',
    badge: 'New',
    badgeEs: 'Nuevo',
    colors: ['#1a1a1a', '#FF6B35'],
    description: 'Heavy canvas work apron with multiple pockets and adjustable straps. NC logo on front.',
    descriptionEs: 'Delantal de lona resistente con múltiples bolsillos y correas ajustables. Logo NC al frente.',
  },
];

const cats = [
  { key: 'all' as Category,        labelEs: 'Todo',        labelEn: 'All' },
  { key: 'apparel' as Category,    labelEs: 'Ropa',        labelEn: 'Apparel' },
  { key: 'drinkware' as Category,  labelEs: 'Bebidas',     labelEn: 'Drinkware' },
  { key: 'accessories' as Category,labelEs: 'Accesorios',  labelEn: 'Accessories' },
];

export default function MerchPage() {
  const { lang } = useLanguage();
  const es = lang === 'es';
  const addItem = useCart((s) => s.addItem);

  const [active, setActive] = useState<Category>('all');
  const [selectedSize, setSelectedSize] = useState<Record<number, string>>({});
  const [added, setAdded] = useState<Record<number, boolean>>({});

  const filtered = active === 'all' ? items : items.filter((i) => i.category === active);

  const handleAddToCart = useCallback((item: MerchItem) => {
    const size = selectedSize[item.id];
    if (item.sizes && !size) return; // require size selection
    const name = (es ? item.nameEs : item.name) + (size ? ` (${size})` : '');
    const productId = `merch-${item.id}${size ? `-${size}` : ''}`;
    addItem({ productId, name, price: item.price, imageUrl: item.image, quantity: 1, stock: 99, brand: 'NC Merch' });
    setAdded((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.id]: false })), 2000);
  }, [addItem, selectedSize, es]);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-brand to-brand-dark text-white overflow-hidden">
        {/* subtle pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              🛍️ {es ? 'Mercancía Oficial' : 'Official Merchandise'}
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              {es ? 'Rep Tu' : 'Rep Your'}<br />
              <span className="text-yellow-300">Ferretería</span> 🇵🇷
            </h1>
            <p className="mt-4 text-lg text-orange-100 max-w-md mx-auto md:mx-0">
              {es
                ? 'Camisetas, termos, gorras, llaveros y más — con el orgullo de Naguabo Commercial.'
                : 'Shirts, tumblers, trucker hats, keychains and more — proudly bearing the Naguabo Commercial name.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="#merch-grid"
                className="bg-white text-brand font-bold px-7 py-3 rounded-md hover:bg-orange-50 transition-colors">
                {es ? 'Ver Todo' : 'Shop All'}
              </a>
              <a href={buildWhatsAppLink(es ? 'Hola! Me interesa ordenar merch personalizado.' : 'Hello! I\'m interested in custom merch.')}
                target="_blank" rel="noopener noreferrer"
                className="bg-white/20 border border-white/40 text-white font-bold px-7 py-3 rounded-md hover:bg-white/30 transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {es ? 'Orden Personalizada' : 'Custom Order'}
              </a>
            </div>
          </div>
          {/* Floating product preview cards */}
          <div className="hidden lg:grid grid-cols-3 gap-3 shrink-0">
            {items.slice(0, 6).map((item) => (
              <div key={item.id} className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-3 divide-x divide-gray-200 dark:divide-slate-700 text-center">
          {[
            { val: `${items.length}+`, sub: es ? 'Productos' : 'Products' },
            { val: es ? 'Hecho a Pedido' : 'Made to Order', sub: es ? 'Fresco siempre' : 'Always fresh' },
            { val: es ? 'Carrito & Pago' : 'Cart & Checkout', sub: es ? 'Ordena en línea' : 'Order online' },
          ].map(({ val, sub }) => (
            <div key={val} className="flex flex-col items-center py-1">
              <span className="text-sm font-black text-brand">{val}</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      <div id="merch-grid" className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Category filter ── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {cats.map(({ key, labelEs, labelEn }) => (
            <button key={key} type="button" onClick={() => setActive(key)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                active === key
                  ? 'bg-brand text-white shadow-md'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}>
              {es ? labelEs : labelEn}
              <span className="ml-1.5 text-xs opacity-70">
                ({key === 'all' ? items.length : items.filter(i => i.category === key).length})
              </span>
            </button>
          ))}
        </div>

        {/* ── Product grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item) => {
            const name  = es ? item.nameEs : item.name;
            const desc  = es ? item.descriptionEs : item.description;
            const badge = item.badge ? (es ? item.badgeEs : item.badge) : null;
            const size  = selectedSize[item.id];
            const isAdded = added[item.id];
            const needsSize = !!(item.sizes && !size);

            return (
              <div key={item.id} className="card group overflow-hidden flex flex-col">
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100 dark:bg-slate-700 aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {badge && (
                    <span className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm leading-tight">{name}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">{desc}</p>

                  {/* Color swatches */}
                  {item.colors && (
                    <div className="flex gap-1 mt-1">
                      {item.colors.map((c) => (
                        <span key={c} className="w-4 h-4 rounded-full border border-gray-300 dark:border-slate-600 shadow-sm"
                          style={{ background: c }} />
                      ))}
                    </div>
                  )}

                  {/* Size picker */}
                  {item.sizes && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.sizes.map((s) => (
                        <button key={s} type="button"
                          onClick={() => setSelectedSize((prev) => ({ ...prev, [item.id]: s }))}
                          className={`text-xs rounded px-1.5 py-0.5 border transition-colors ${
                            size === s
                              ? 'bg-brand text-white border-brand'
                              : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-brand hover:text-brand'
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                    <span className="text-lg font-black text-brand">${item.price.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      disabled={needsSize}
                      title={needsSize ? (es ? 'Selecciona una talla' : 'Select a size') : undefined}
                      className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                        isAdded
                          ? 'bg-green-500 text-white'
                          : needsSize
                          ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                          : 'bg-brand text-white hover:bg-brand-dark'
                      }`}>
                      {isAdded
                        ? <><Check className="w-3.5 h-3.5" />{es ? '¡Añadido!' : 'Added!'}</>
                        : <><ShoppingCart className="w-3.5 h-3.5" />{es ? 'Al carrito' : 'Add to cart'}</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── How to order ── */}
      <section className="bg-gray-50 dark:bg-slate-800/50 py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100 mb-2">
            {es ? '¿Cómo ordenar?' : 'How to Order'}
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mb-10">
            {es
              ? 'Todo el merch se hace a pedido. Agrega al carrito y finaliza tu compra en línea.'
              : 'All merch is made to order. Add to cart and check out online.'}
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                icon: ShoppingBag,
                title: es ? 'Elige tu producto' : 'Pick your item',
                desc: es ? 'Selecciona talla si aplica, luego haz clic en "Al carrito".' : 'Select a size if needed, then click "Add to cart".',
              },
              {
                num: '02',
                icon: ShoppingCart,
                title: es ? 'Revisa el carrito' : 'Review your cart',
                desc: es ? 'Ve al carrito, revisa tu pedido y procede al pago seguro con Stripe.' : 'Go to your cart, review your order, and proceed to secure Stripe checkout.',
              },
              {
                num: '03',
                icon: Package,
                title: es ? 'Recibe tu merch' : 'Get your merch',
                desc: es ? 'Recoge en tienda o recíbelo en tu puerta. Listo para lucirlo.' : 'Pick up in store or receive it at your door. Ready to wear.',
              },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="card p-6 flex flex-col items-center text-center gap-3">
                <span className="text-4xl font-black text-brand/20">{num}</span>
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-slate-100">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom order CTA ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-brand fill-brand" />
              <Star className="w-5 h-5 text-brand fill-brand" />
              <Star className="w-5 h-5 text-brand fill-brand" />
              <Star className="w-5 h-5 text-brand fill-brand" />
              <Star className="w-5 h-5 text-brand fill-brand" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100">
              {es ? '¿Quieres algo personalizado?' : 'Want something custom?'}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2 max-w-lg">
              {es
                ? 'Ordena en cantidad para tu empresa, equipo o evento. Logos personalizados, colores especiales y más. Pregúntanos por precios al por mayor.'
                : 'Order in bulk for your company, team, or event. Custom logos, special colors, and more. Ask us about wholesale pricing.'}
            </p>
          </div>
          <a href={buildWhatsAppLink(
              es
                ? 'Hola! Me interesa una orden personalizada de merch en cantidad.'
                : 'Hello! I\'m interested in a bulk custom merch order.'
            )}
            target="_blank" rel="noopener noreferrer"
            className="shrink-0 bg-brand text-white font-bold px-8 py-3.5 rounded-md hover:bg-brand-dark transition-colors flex items-center gap-2 text-base">
            <MessageCircle className="w-5 h-5" />
            {es ? 'Contáctenos por WhatsApp' : 'Contact via WhatsApp'}
          </a>
        </div>
      </section>
    </div>
  );
}
