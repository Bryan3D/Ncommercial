export type Lang = 'en' | 'es';

const ui: Record<string, { en: string; es: string }> = {
  // ── Header ──
  'header.search.placeholder': { en: 'What can we help you find?', es: '¿Qué estás buscando?' },
  'header.openHours':   { en: 'Open 24/7 Online · Free Pickup', es: 'Abierto 24/7 · Recogido Gratis' },
  'header.storeHours': { en: 'Mon–Sat 7am–5pm', es: 'Lun–Sáb 7am–5pm' },
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
  'product.addToCart':        { en: 'Add to cart',           es: 'Añadir al carrito' },
  'product.lowStock':         { en: 'Low stock',             es: 'Poco stock' },
  'product.outOfStock':       { en: 'Out of stock',          es: 'Agotado' },

  // ── Product detail page ──
  'product.backToStore':      { en: '← Back to store',       es: '← Volver a la tienda' },
  'product.notFound':         { en: 'Product not found',     es: 'Producto no encontrado' },
  'product.reviews':          { en: 'reviews',               es: 'reseñas' },
  'product.save':             { en: 'Save',                  es: 'Ahorras' },
  'product.ships':            { en: 'Ships in 1-2 days',     es: 'Envío en 1-2 días' },
  'product.shipsNote':        { en: 'Free for orders over $99', es: 'Gratis en pedidos sobre $99' },
  'product.pickup':           { en: 'Pickup in 1 hour',      es: 'Recogido en 1 hora' },
  'product.pickupNote':       { en: 'Naguabo store',         es: 'Tienda Naguabo' },
  'product.quantity':         { en: 'Quantity',              es: 'Cantidad' },
  'product.inStock':          { en: 'in stock',              es: 'en inventario' },
  'product.buyNow':           { en: 'Buy now',               es: 'Comprar ahora' },
  'product.askWhatsApp':      { en: 'Ask on WhatsApp',       es: 'Preguntar por WhatsApp' },
  'product.share':            { en: 'Share',                 es: 'Compartir' },

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

  // ── About page ──
  'about.badge':          { en: '🇵🇷 Hardware Store · Est. Naguabo, PR', es: '🇵🇷 Ferretería · Naguabo, PR' },
  'about.hero.title':     { en: 'Your Trusted Hardware Store in Eastern Puerto Rico', es: 'Tu Ferretería de Confianza en el Este de Puerto Rico' },
  'about.hero.sub':       { en: 'Tools, building materials, plumbing, electrical, paint, and everything you need to complete your projects.', es: 'Herramientas, materiales de construcción, plomería, electricidad, pintura y todo lo que necesitas para completar tus proyectos.' },
  'about.hero.shopCta':   { en: 'Shop Now', es: 'Comprar Ahora' },
  'about.hero.contactCta':{ en: 'Contact Us', es: 'Contáctenos' },

  'about.mission.label':  { en: 'Our Mission', es: 'Nuestra Misión' },
  'about.mission.title':  { en: 'Built for Builders, Pros & Homeowners', es: 'Para Contratistas, Profesionales y el Hogar' },
  'about.mission.p1':     { en: 'Naguabo Commercial is your trusted hardware store in eastern Puerto Rico. We specialize in building materials, tools, plumbing, electrical, paint, general hardware, and everything you need to complete your projects.', es: 'Naguabo Commercial es tu ferretería de confianza en el este de Puerto Rico. Nos especializamos en materiales de construcción, herramientas, plomería, electricidad, pintura, artículos de ferretería general y todo lo que necesitas para completar tus proyectos.' },
  'about.mission.p2':     { en: 'Our commitment is to offer quality products, competitive prices, and personal, fast, and reliable service for contractors, professionals, and homeowners alike.', es: 'Nuestro compromiso es ofrecer productos de calidad, precios competitivos y un servicio cercano, rápido y confiable para contratistas, profesionales y clientes del hogar.' },
  'about.mission.quote':  { en: 'Everything for your project — in one place!', es: '¡Todo para tu proyecto, en un solo lugar!' },

  'about.values.title':   { en: 'Why Choose Us', es: '¿Por Qué Elegirnos?' },
  'about.values.q1.title':{ en: 'Quality Products', es: 'Productos de Calidad' },
  'about.values.q1.desc': { en: 'We carry trusted brands and carefully selected products you can rely on for every job.', es: 'Llevamos marcas reconocidas y productos seleccionados en los que puedes confiar para cada trabajo.' },
  'about.values.q2.title':{ en: 'Competitive Prices', es: 'Precios Competitivos' },
  'about.values.q2.desc': { en: 'Fair pricing for contractors and homeowners — no surprises, no markups.', es: 'Precios justos para contratistas y familias — sin sorpresas ni recargos.' },
  'about.values.q3.title':{ en: 'Fast & Reliable Service', es: 'Servicio Rápido y Confiable' },
  'about.values.q3.desc': { en: 'In-store pickup in 1 hour or delivery across Puerto Rico. Chat support available 24/7.', es: 'Recogido en tienda en 1 hora o entrega en todo Puerto Rico. Soporte por chat disponible 24/7.' },
  'about.values.q4.title':{ en: 'Local & Community', es: 'Local y Comunitario' },
  'about.values.q4.desc': { en: 'Proudly serving Naguabo and the eastern region of Puerto Rico. We know our customers by name.', es: 'Con orgullo sirviendo a Naguabo y la región este de Puerto Rico. Conocemos a nuestros clientes por nombre.' },

  'about.categories.title': { en: 'What We Carry', es: 'Lo Que Ofrecemos' },
  'about.categories.sub':   { en: 'From foundations to finishes — we have it all.', es: 'Desde cimientos hasta acabados — lo tenemos todo.' },

  'about.cta.title':      { en: 'Find Solutions to Build, Repair, Remodel & Improve', es: 'Encuentra Soluciones para Construir, Reparar, Remodelar y Mejorar' },
  'about.cta.sub':        { en: 'Browse our full catalog online or visit us in Naguabo.', es: 'Navega nuestro catálogo completo en línea o visítanos en Naguabo.' },
  'about.cta.shop':       { en: 'Browse Products', es: 'Ver Productos' },
  'about.cta.directions': { en: 'Get Directions', es: 'Cómo Llegar' },

  'about.visit.title':    { en: 'Visit Us', es: 'Visítanos' },
  'about.visit.hours':    { en: 'Store Hours', es: 'Horario' },
  'about.visit.hoursVal': { en: 'Mon – Sat: 7:00 am – 5:00 pm', es: 'Lun – Sáb: 7:00 am – 5:00 pm' },
  'about.visit.online':   { en: 'Online: 24/7', es: 'En línea: 24/7' },

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
  'tools-hand-tools':           { en: 'Hand Tools',             es: 'Herramientas de Mano' },
};

export function tCat(slug: string, lang: Lang): string {
  return categoryNames[slug]?.[lang] ?? slug;
}
