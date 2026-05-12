export type Lang = 'en' | 'es';

const ui: Record<string, { en: string; es: string }> = {
  // ── Header ──
  'header.search.placeholder': { en: 'What can we help you find?', es: '¿Qué estás buscando?' },
  'header.openHours': { en: 'Open 24/7 Online · Free Pickup', es: 'Abierto 24/7 · Recogido Gratis' },
  'header.account': { en: 'Account', es: 'Cuenta' },
  'header.cart': { en: 'Cart', es: 'Carrito' },

  // ── Nav ──
  'nav.allProducts': { en: 'All Products', es: 'Todos' },
  'nav.tools': { en: 'Tools', es: 'Herramientas' },
  'nav.building': { en: 'Building', es: 'Materiales' },
  'nav.plumbing': { en: 'Plumbing', es: 'Plomería' },
  'nav.electrical': { en: 'Electrical', es: 'Eléctrico' },
  'nav.paint': { en: 'Paint', es: 'Pintura' },
  'nav.roofSealing': { en: '🏠 Roof Sealing', es: '🏠 Impermeabilización' },
  'nav.garden': { en: 'Garden', es: 'Jardín' },
  'nav.lighting': { en: 'Lighting', es: 'Iluminación' },

  // ── ProductCard ──
  'product.addToCart': { en: 'Add to cart', es: 'Añadir al carrito' },
  'product.lowStock': { en: 'Low stock', es: 'Poco stock' },
  'product.outOfStock': { en: 'Out of stock', es: 'Agotado' },

  // ── Store page ──
  'store.filters': { en: 'Filters', es: 'Filtros' },
  'store.department': { en: 'Department', es: 'Departamento' },
  'store.allProducts': { en: 'All Products', es: 'Todos los Productos' },
  'store.maxPrice': { en: 'Max price', es: 'Precio máximo' },
  'store.sortFeatured': { en: 'Featured', es: 'Destacados' },
  'store.sortPriceAsc': { en: 'Price: Low to High', es: 'Precio: Menor a Mayor' },
  'store.sortPriceDesc': { en: 'Price: High to Low', es: 'Precio: Mayor a Menor' },
  'store.sortRating': { en: 'Top Rated', es: 'Mejor Valorados' },
  'store.subtabAll': { en: 'All', es: 'Todos' },
  'store.empty': { en: 'No products match your filters. Try adjusting them.', es: 'Ningún producto coincide con tus filtros. Intenta ajustarlos.' },
  'store.resultsFor': { en: 'Results for', es: 'Resultados para' },
  'store.todaysDeals': { en: "Today's Deals", es: 'Ofertas de Hoy' },
  'store.items': { en: 'items', es: 'artículos' },

  // ── Breadcrumb ──
  'breadcrumb.home': { en: 'Home', es: 'Inicio' },
  'breadcrumb.store': { en: 'Store', es: 'Tienda' },

  // ── Home page ──
  'home.hero.badge': { en: '🇵🇷 Your trusted hardware store in Naguabo', es: '🇵🇷 Tu ferretería de confianza en Naguabo' },
  'home.hero.h1.line1': { en: 'Build It. Fix It.', es: 'Construye. Arregla.' },
  'home.hero.h1.line2': { en: 'Get It Done.', es: 'Hazlo Ya.' },
  'home.hero.sub': { en: 'Thousands of products from top brands. Online ordering with curbside pickup or delivery across Puerto Rico.', es: 'Miles de productos de las mejores marcas. Ordena en línea con recogido o entrega en todo Puerto Rico.' },
  'home.hero.shopNow': { en: 'Shop Now', es: 'Comprar Ahora' },
  'home.hero.todaysDeals': { en: "Today's Deals", es: 'Ofertas de Hoy' },
  'home.disclaimer.before': { en: 'If an item is currently out of stock, please allow', es: 'Si un artículo está agotado, permita de' },
  'home.disclaimer.hours': { en: '24 to 48 hours', es: '24 a 48 horas' },
  'home.disclaimer.after': { en: 'for delivery or pickup.', es: 'para entrega o recogido.' },
  'home.trust.pickup': { en: 'Free pickup', es: 'Recogido gratis' },
  'home.trust.pickupSub': { en: 'In-store ready in 1hr', es: 'Listo en tienda en 1h' },
  'home.trust.support': { en: '24/7 chat support', es: 'Soporte por chat 24/7' },
  'home.trust.supportSub': { en: 'Always here to help', es: 'Siempre aquí para ayudar' },
  'home.trust.secure': { en: 'Secure checkout', es: 'Pago seguro' },
  'home.trust.secureSub': { en: 'Stripe-powered payments', es: 'Pagos con Stripe' },
  'home.trust.fast': { en: 'Fast delivery', es: 'Entrega rápida' },
  'home.trust.fastSub': { en: 'Across Puerto Rico', es: 'En todo Puerto Rico' },
  'home.shopByDept': { en: 'Shop by Department', es: 'Comprar por Departamento' },
  'home.specialOffers': { en: "Today's Special Offers", es: 'Ofertas Especiales de Hoy' },
  'home.viewAll': { en: 'View all', es: 'Ver todo' },
  'home.featured': { en: 'Featured Products', es: 'Productos Destacados' },
  'home.shopAll': { en: 'Shop all', es: 'Ver todo' },
  'home.whatsapp.title': { en: 'Get exclusive deals on WhatsApp 📱', es: 'Recibe ofertas exclusivas por WhatsApp 📱' },
  'home.whatsapp.sub': { en: 'Subscribe to receive weekly offers, new arrivals, and pro tips.', es: 'Suscríbete para recibir ofertas semanales, novedades y consejos.' },
  'home.whatsapp.cta': { en: 'Subscribe via WhatsApp', es: 'Suscribirse por WhatsApp' },

  // ── Footer ──
  'footer.customerService': { en: 'Customer Service', es: 'Servicio al Cliente' },
  'footer.helpCenter': { en: 'Help Center', es: 'Centro de Ayuda' },
  'footer.returns': { en: 'Returns', es: 'Devoluciones' },
  'footer.shippingInfo': { en: 'Shipping Info', es: 'Información de Envío' },
  'footer.contactUs': { en: 'Contact Us', es: 'Contáctenos' },
  'footer.myAccount': { en: 'My Account', es: 'Mi Cuenta' },
  'footer.signIn': { en: 'Sign In', es: 'Iniciar Sesión' },
  'footer.register': { en: 'Register', es: 'Registrarse' },
  'footer.orderStatus': { en: 'Order Status', es: 'Estado del Pedido' },
  'footer.guestCheckout': { en: 'Guest Checkout', es: 'Comprar sin Cuenta' },
  'footer.company': { en: 'Company', es: 'Empresa' },
  'footer.aboutUs': { en: 'About Us', es: 'Sobre Nosotros' },
  'footer.careers': { en: 'Careers', es: 'Empleos' },
  'footer.privacy': { en: 'Privacy', es: 'Privacidad' },
  'footer.terms': { en: 'Terms', es: 'Términos' },
  'footer.getInTouch': { en: 'Get in Touch', es: 'Contáctanos' },
  'footer.rights': { en: 'All rights reserved.', es: 'Todos los derechos reservados.' },
};

export function t(key: string, lang: Lang): string {
  return ui[key]?.[lang] ?? ui[key]?.en ?? key;
}

// Category name translations (used in sidebar, breadcrumb, page titles)
export const categoryNames: Record<string, { en: string; es: string }> = {
  'tools':                      { en: 'Tools',                  es: 'Herramientas' },
  'building-materials':         { en: 'Building Materials',     es: 'Materiales de Construcción' },
  'plumbing':                   { en: 'Plumbing',               es: 'Plomería' },
  'electrical':                 { en: 'Electrical',             es: 'Eléctrico' },
  'paint':                      { en: 'Paint',                  es: 'Pintura' },
  'garden':                     { en: 'Garden',                 es: 'Jardín' },
  'hardware':                   { en: 'Hardware',               es: 'Herrajes' },
  'lighting':                   { en: 'Lighting',               es: 'Iluminación' },
  'roof-sealing':               { en: 'Roof Sealing',           es: 'Impermeabilización de Techo' },
  'building-stone':             { en: 'Stone & Aggregates',     es: 'Piedra y Agregados' },
  'building-grouts':            { en: 'Grouts',                 es: 'Lechadas' },
  'building-adhesives':         { en: 'Adhesives & Thinsets',   es: 'Adhesivos y Morteros' },
  'building-waterproofing':     { en: 'Waterproofing',          es: 'Impermeabilización' },
  'building-mortars':           { en: 'Mortars & Cement',       es: 'Morteros y Cemento' },
  'building-primers':           { en: 'Primers & Bonding',      es: 'Selladores y Adherentes' },
  'building-concrete-treatment':{ en: 'Concrete Treatment',     es: 'Tratamiento de Concreto' },
  'building-tile-tools':        { en: 'Tile Tools',             es: 'Herramientas para Azulejos' },
  'building-paints':            { en: 'Construction Paints',    es: 'Pinturas de Construcción' },
};

export function tCat(slug: string, lang: Lang): string {
  return categoryNames[slug]?.[lang] ?? slug;
}
