'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

const LAST_UPDATED = 'Mayo 14, 2025 / May 14, 2025';

const tocEs = [
  { id: 'acceptance',    label: '1. Aceptación de los Términos' },
  { id: 'modifications', label: '2. Modificaciones' },
  { id: 'use',           label: '3. Uso del Sitio Web' },
  { id: 'accounts',      label: '4. Cuentas de Usuario' },
  { id: 'purchases',     label: '5. Compras y Pagos' },
  { id: 'shipping',      label: '6. Envíos y Entregas' },
  { id: 'returns',       label: '7. Devoluciones y Cancelaciones' },
  { id: 'warranties',    label: '8. Garantías de Productos' },
  { id: 'ip',            label: '9. Propiedad Intelectual' },
  { id: 'liability',     label: '10. Limitación de Responsabilidad' },
  { id: 'indemnity',     label: '11. Indemnización' },
  { id: 'privacy',       label: '12. Privacidad' },
  { id: 'prlaw',         label: '13. Ley Aplicable — Puerto Rico' },
  { id: 'disputes',      label: '14. Resolución de Disputas' },
  { id: 'general',       label: '15. Disposiciones Generales' },
  { id: 'contact',       label: '16. Contáctenos' },
];

const tocEn = [
  { id: 'acceptance',    label: '1. Acceptance of Terms' },
  { id: 'modifications', label: '2. Modifications' },
  { id: 'use',           label: '3. Use of the Website' },
  { id: 'accounts',      label: '4. User Accounts' },
  { id: 'purchases',     label: '5. Purchases & Payments' },
  { id: 'shipping',      label: '6. Shipping & Delivery' },
  { id: 'returns',       label: '7. Returns & Cancellations' },
  { id: 'warranties',    label: '8. Product Warranties' },
  { id: 'ip',            label: '9. Intellectual Property' },
  { id: 'liability',     label: '10. Limitation of Liability' },
  { id: 'indemnity',     label: '11. Indemnification' },
  { id: 'privacy',       label: '12. Privacy' },
  { id: 'prlaw',         label: '13. Governing Law — Puerto Rico' },
  { id: 'disputes',      label: '14. Dispute Resolution' },
  { id: 'general',       label: '15. General Provisions' },
  { id: 'contact',       label: '16. Contact Us' },
];

export default function TermsPage() {
  const { lang } = useLanguage();
  const es = lang === 'es';
  const toc = es ? tocEs : tocEn;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 border-b border-gray-200 dark:border-slate-700 pb-6">
        <h1 className="text-4xl font-black text-gray-900 dark:text-slate-100">
          {es ? 'Términos y Condiciones de Uso' : 'Terms and Conditions of Use'}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
          {es ? 'Última actualización:' : 'Last updated:'} {LAST_UPDATED}
        </p>
        <p className="mt-3 text-gray-600 dark:text-slate-300 max-w-3xl">
          {es
            ? 'Lea estos Términos y Condiciones detenidamente antes de usar el sitio web o realizar una compra en Naguabo Commercial. Al acceder o utilizar nuestros Servicios, usted acepta quedar obligado por estos Términos.'
            : 'Please read these Terms and Conditions carefully before using the website or making a purchase at Naguabo Commercial. By accessing or using our Services, you agree to be bound by these Terms.'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar TOC */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 card p-5 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3">
              {es ? 'Contenido' : 'Contents'}
            </h2>
            <nav className="space-y-1">
              {toc.map(({ id, label }) => (
                <a key={id} href={`#${id}`}
                  className="block text-xs text-gray-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand py-0.5 transition-colors leading-snug">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="flex-1 space-y-10 text-gray-700 dark:text-slate-300 leading-relaxed">

          {/* 1 */}
          <S id="acceptance" title={es ? '1. Aceptación de los Términos' : '1. Acceptance of Terms'}>
            {es ? (
              <>
                <p>Estos Términos y Condiciones de Uso ("Términos") constituyen un acuerdo legal entre usted ("Usuario") y <strong>Naguabo Commercial</strong>, una empresa ubicada en 20 Calle Venecia, Naguabo, Puerto Rico 00718, que opera el sitio web <strong>naguabo-commercial.com</strong> y sus servicios relacionados (en conjunto, los "Servicios").</p>
                <p>Al acceder, navegar o utilizar nuestros Servicios — incluyendo realizar compras — usted confirma que ha leído, comprendido y acepta cumplir con estos Términos y nuestra <Link href="/privacy" className="text-brand hover:underline">Política de Privacidad</Link>. Si no está de acuerdo con alguna parte de estos Términos, no utilice nuestros Servicios.</p>
                <p>Para usar nuestros Servicios debe tener al menos <strong>18 años</strong> o contar con el consentimiento y supervisión de un padre o tutor legal. Al aceptar estos Términos, usted declara que cumple con este requisito.</p>
              </>
            ) : (
              <>
                <p>These Terms and Conditions of Use ("Terms") constitute a legal agreement between you ("User") and <strong>Naguabo Commercial</strong>, a business located at 20 Calle Venecia, Naguabo, Puerto Rico 00718, which operates the website <strong>naguabo-commercial.com</strong> and related services (collectively, the "Services").</p>
                <p>By accessing, browsing, or using our Services — including making purchases — you confirm that you have read, understood, and agree to comply with these Terms and our <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link>. If you disagree with any part of these Terms, do not use our Services.</p>
                <p>To use our Services you must be at least <strong>18 years old</strong> or have the consent and supervision of a parent or legal guardian. By accepting these Terms, you represent that you meet this requirement.</p>
              </>
            )}
          </S>

          {/* 2 */}
          <S id="modifications" title={es ? '2. Modificaciones' : '2. Modifications'}>
            {es ? (
              <>
                <p>Naguabo Commercial se reserva el derecho de modificar estos Términos en cualquier momento. Las modificaciones serán efectivas inmediatamente después de su publicación en el sitio web con la fecha de actualización correspondiente.</p>
                <p>Para cambios sustanciales, le notificaremos por correo electrónico (si tiene cuenta registrada) o mediante un aviso destacado en el sitio. Su uso continuo de los Servicios tras la publicación de cambios constituye su aceptación de los Términos actualizados.</p>
                <p>Le recomendamos revisar esta página periódicamente. La versión vigente siempre será la publicada en <strong>naguabo-commercial.com/terms</strong>.</p>
              </>
            ) : (
              <>
                <p>Naguabo Commercial reserves the right to modify these Terms at any time. Modifications will be effective immediately upon publication on the website with the corresponding update date.</p>
                <p>For material changes, we will notify you by email (if you have a registered account) or through a prominent notice on the site. Your continued use of the Services after changes are posted constitutes acceptance of the updated Terms.</p>
                <p>We recommend reviewing this page periodically. The current version will always be published at <strong>naguabo-commercial.com/terms</strong>.</p>
              </>
            )}
          </S>

          {/* 3 */}
          <S id="use" title={es ? '3. Uso del Sitio Web' : '3. Use of the Website'}>
            {es ? (
              <>
                <H3>Usos permitidos</H3>
                <p>Usted puede usar nuestros Servicios únicamente para propósitos legales y personales o comerciales legítimos, incluyendo buscar productos, realizar compras, gestionar su cuenta y contactar servicio al cliente.</p>
                <H3>Conducta prohibida</H3>
                <p>Queda estrictamente prohibido:</p>
                <ul>
                  <li>Usar el sitio con fines fraudulentos, ilegales o engañosos.</li>
                  <li>Copiar, modificar, distribuir o reproducir contenido sin autorización escrita previa.</li>
                  <li>Intentar acceder sin autorización a sistemas, cuentas o datos de otros usuarios.</li>
                  <li>Transmitir virus, malware o cualquier código dañino.</li>
                  <li>Usar herramientas automatizadas (bots, scrapers) para extraer datos sin permiso.</li>
                  <li>Publicar reseñas falsas o contenido difamatorio.</li>
                  <li>Interferir con el funcionamiento normal del sitio o sus servidores.</li>
                  <li>Suplantar la identidad de otra persona o entidad.</li>
                </ul>
                <p>El incumplimiento puede resultar en la suspensión de su cuenta y, cuando aplique, en acciones legales bajo las leyes de Puerto Rico y de los Estados Unidos.</p>
              </>
            ) : (
              <>
                <H3>Permitted uses</H3>
                <p>You may use our Services only for lawful purposes and legitimate personal or commercial use, including browsing products, making purchases, managing your account, and contacting customer service.</p>
                <H3>Prohibited conduct</H3>
                <p>The following is strictly prohibited:</p>
                <ul>
                  <li>Using the site for fraudulent, illegal, or deceptive purposes.</li>
                  <li>Copying, modifying, distributing, or reproducing content without prior written authorization.</li>
                  <li>Attempting unauthorized access to systems, accounts, or other users' data.</li>
                  <li>Transmitting viruses, malware, or any harmful code.</li>
                  <li>Using automated tools (bots, scrapers) to extract data without permission.</li>
                  <li>Posting false reviews or defamatory content.</li>
                  <li>Interfering with the normal operation of the site or its servers.</li>
                  <li>Impersonating another person or entity.</li>
                </ul>
                <p>Violations may result in account suspension and, where applicable, legal action under the laws of Puerto Rico and the United States.</p>
              </>
            )}
          </S>

          {/* 4 */}
          <S id="accounts" title={es ? '4. Cuentas de Usuario' : '4. User Accounts'}>
            {es ? (
              <>
                <p>Para acceder a ciertas funciones (historial de pedidos, guardado de direcciones, etc.) puede crear una cuenta. Al hacerlo, usted se compromete a:</p>
                <ul>
                  <li>Proporcionar información veraz, completa y actualizada.</li>
                  <li>Mantener la confidencialidad de su contraseña y no compartirla con terceros.</li>
                  <li>Notificarnos inmediatamente si sospecha acceso no autorizado a su cuenta.</li>
                  <li>Ser responsable de todas las actividades realizadas desde su cuenta.</li>
                </ul>
                <p>Naguabo Commercial se reserva el derecho de suspender o eliminar cuentas que violen estos Términos o que se usen de manera fraudulenta, sin previo aviso y sin responsabilidad para la Empresa.</p>
              </>
            ) : (
              <>
                <p>To access certain features (order history, saved addresses, etc.) you may create an account. By doing so, you agree to:</p>
                <ul>
                  <li>Provide truthful, complete, and up-to-date information.</li>
                  <li>Maintain the confidentiality of your password and not share it with third parties.</li>
                  <li>Notify us immediately if you suspect unauthorized access to your account.</li>
                  <li>Be responsible for all activities carried out from your account.</li>
                </ul>
                <p>Naguabo Commercial reserves the right to suspend or delete accounts that violate these Terms or are used fraudulently, without prior notice and without liability to the Company.</p>
              </>
            )}
          </S>

          {/* 5 */}
          <S id="purchases" title={es ? '5. Compras y Pagos' : '5. Purchases & Payments'}>
            {es ? (
              <>
                <H3>Precios y disponibilidad</H3>
                <p>Todos los precios se expresan en <strong>dólares estadounidenses (USD)</strong> e incluyen el Impuesto sobre Ventas y Uso (IVU) de Puerto Rico cuando aplica. Nos reservamos el derecho de modificar precios en cualquier momento. En caso de error tipográfico en el precio, nos reservamos el derecho de cancelar el pedido y notificarle.</p>
                <p>La disponibilidad de productos está sujeta a existencias. Un producto mostrado en el sitio puede agotarse entre el momento en que usted lo agrega al carrito y el momento de confirmar el pedido. Le notificaremos de inmediato si algún artículo no está disponible.</p>
                <H3>Procesamiento de pagos</H3>
                <p>Los pagos en línea se procesan a través de <strong>Stripe</strong>, certificado PCI DSS Nivel 1. Aceptamos Visa, Mastercard, American Express y Discover. También se acepta pago en efectivo para recogidos en tienda. La transacción se considera confirmada únicamente cuando recibimos la autorización completa del pago.</p>
                <H3>Impuesto sobre Ventas y Uso (IVU)</H3>
                <p>De conformidad con la <strong>Ley Núm. 1 de 2011</strong> (Código de Rentas Internas de Puerto Rico) y sus enmiendas, las ventas realizadas en Puerto Rico están sujetas al IVU municipal y estatal vigente. El IVU aplicable se calculará y mostrará antes de confirmar su compra.</p>
              </>
            ) : (
              <>
                <H3>Prices and availability</H3>
                <p>All prices are expressed in <strong>US dollars (USD)</strong> and include Puerto Rico's Sales and Use Tax (IVU) where applicable. We reserve the right to modify prices at any time. In case of a typographical error in the price, we reserve the right to cancel the order and notify you.</p>
                <p>Product availability is subject to stock. A product shown on the site may sell out between the time you add it to your cart and the time you confirm the order. We will notify you immediately if any item is unavailable.</p>
                <H3>Payment processing</H3>
                <p>Online payments are processed through <strong>Stripe</strong>, PCI DSS Level 1 certified. We accept Visa, Mastercard, American Express, and Discover. Cash payment is also accepted for in-store pickup. A transaction is considered confirmed only upon receipt of full payment authorization.</p>
                <H3>Sales and Use Tax (IVU)</H3>
                <p>In accordance with <strong>Act No. 1 of 2011</strong> (Puerto Rico Internal Revenue Code) and its amendments, sales made in Puerto Rico are subject to the applicable municipal and state IVU. The applicable IVU will be calculated and displayed before you confirm your purchase.</p>
              </>
            )}
          </S>

          {/* 6 */}
          <S id="shipping" title={es ? '6. Envíos y Entregas' : '6. Shipping & Delivery'}>
            {es ? (
              <>
                <p>El envío está disponible <strong>únicamente dentro de Puerto Rico</strong>. Los tiempos estimados son:</p>
                <ul>
                  <li><strong>Recogido en tienda (Naguabo):</strong> listo en aproximadamente 1 hora tras la confirmación.</li>
                  <li><strong>Envío estándar:</strong> 1 a 3 días laborables en la mayoría de las áreas; hasta 5 días en áreas remotas.</li>
                </ul>
                <p>Los tiempos de entrega son estimados y pueden verse afectados por condiciones meteorológicas, festivos o circunstancias fuera de nuestro control. Naguabo Commercial no será responsable por retrasos causados por terceros transportistas o por fuerza mayor.</p>
                <p>El riesgo de pérdida o daño de los productos se transfiere al comprador en el momento de la entrega. Si su pedido llega dañado, contáctenos dentro de las <strong>48 horas</strong> siguientes con fotografías del daño.</p>
              </>
            ) : (
              <>
                <p>Shipping is available <strong>within Puerto Rico only</strong>. Estimated timeframes are:</p>
                <ul>
                  <li><strong>In-store pickup (Naguabo):</strong> ready approximately 1 hour after confirmation.</li>
                  <li><strong>Standard shipping:</strong> 1–3 business days in most areas; up to 5 days in remote areas.</li>
                </ul>
                <p>Delivery times are estimates and may be affected by weather conditions, holidays, or circumstances beyond our control. Naguabo Commercial shall not be liable for delays caused by third-party carriers or force majeure.</p>
                <p>The risk of loss or damage to products transfers to the buyer upon delivery. If your order arrives damaged, contact us within <strong>48 hours</strong> with photographs of the damage.</p>
              </>
            )}
          </S>

          {/* 7 */}
          <S id="returns" title={es ? '7. Devoluciones y Cancelaciones' : '7. Returns & Cancellations'}>
            {es ? (
              <>
                <H3>Política de devoluciones</H3>
                <ul>
                  <li>Aceptamos devoluciones dentro de los <strong>30 días calendario</strong> desde la fecha de compra.</li>
                  <li>El producto debe estar en su <strong>estado original, sin usar y en su empaque original</strong>.</li>
                  <li>Los artículos en liquidación, venta final, o con daños causados por el comprador <strong>no son elegibles</strong> para devolución.</li>
                  <li>Productos defectuosos o con defecto de fabricación son elegibles para devolución o cambio sin importar el empaque, dentro del plazo indicado.</li>
                </ul>
                <H3>Política de cancelaciones</H3>
                <p>Adaptada a las prácticas del comercio local en Puerto Rico:</p>
                <ul>
                  <li><strong>Cancelación dentro de las primeras 2 horas</strong> de realizado el pedido (siempre que no haya sido procesado para envío): reembolso completo.</li>
                  <li><strong>Cancelación después de las 2 horas</strong> pero antes del envío: reembolso menos los gastos de procesamiento de pago (hasta 3%).</li>
                  <li><strong>Cancelación una vez despachado el pedido:</strong> no se acepta cancelación; debe iniciarse una devolución al recibirlo.</li>
                  <li><strong>Cancelación por indisponibilidad de producto</strong> (falta de inventario no prevista): reembolso completo o cambio por producto equivalente a elección del cliente.</li>
                  <li><strong>Cancelación por condiciones climáticas</strong> que impidan la entrega: reembolso completo o reagendamiento sin costo.</li>
                </ul>
                <p>Para iniciar una devolución o cancelación, contáctenos al <strong>(787) 874-2120</strong>, por WhatsApp o a <strong>info@naguabo-commercial.com</strong> con su número de orden.</p>
                <H3>Reembolsos</H3>
                <p>Los reembolsos se procesarán al método de pago original dentro de <strong>5 a 7 días laborables</strong> tras la recepción e inspección del producto devuelto. El tiempo de acreditación depende de su entidad bancaria.</p>
              </>
            ) : (
              <>
                <H3>Return policy</H3>
                <ul>
                  <li>We accept returns within <strong>30 calendar days</strong> from the purchase date.</li>
                  <li>The product must be in its <strong>original, unused condition and original packaging</strong>.</li>
                  <li>Clearance, final-sale items, or items damaged by the buyer are <strong>not eligible</strong> for return.</li>
                  <li>Defective or manufacturer-defective products are eligible for return or exchange regardless of packaging, within the stated period.</li>
                </ul>
                <H3>Cancellation policy</H3>
                <p>Adapted to local Puerto Rico commerce practices:</p>
                <ul>
                  <li><strong>Cancellation within the first 2 hours</strong> of placing the order (provided it has not been processed for shipping): full refund.</li>
                  <li><strong>Cancellation after 2 hours</strong> but before shipping: refund minus payment processing fees (up to 3%).</li>
                  <li><strong>Cancellation after order has been dispatched:</strong> cancellation not accepted; a return must be initiated upon receipt.</li>
                  <li><strong>Cancellation due to product unavailability</strong> (unforeseen stock shortage): full refund or exchange for equivalent product at customer's choice.</li>
                  <li><strong>Cancellation due to weather conditions</strong> preventing delivery: full refund or rescheduling at no charge.</li>
                </ul>
                <p>To initiate a return or cancellation, contact us at <strong>(787) 874-2120</strong>, via WhatsApp, or at <strong>info@naguabo-commercial.com</strong> with your order number.</p>
                <H3>Refunds</H3>
                <p>Refunds will be processed to the original payment method within <strong>5–7 business days</strong> after the returned product is received and inspected. Credit time depends on your bank.</p>
              </>
            )}
          </S>

          {/* 8 */}
          <S id="warranties" title={es ? '8. Garantías de Productos' : '8. Product Warranties'}>
            {es ? (
              <>
                <p>Los productos vendidos en Naguabo Commercial pueden estar sujetos a las garantías del fabricante. Naguabo Commercial no ofrece garantías adicionales más allá de lo establecido por los fabricantes, salvo lo dispuesto por la <strong>Ley de Garantías al Consumidor de Puerto Rico</strong> y la ley federal aplicable.</p>
                <p>Para reclamar una garantía del fabricante, conserve su recibo o confirmación de compra. En muchos casos deberá contactar directamente al fabricante. Naguabo Commercial le asistirá en la medida de lo posible para facilitar el proceso.</p>
                <p><strong>EXCLUSIÓN DE GARANTÍAS IMPLÍCITAS:</strong> En la medida permitida por la ley aplicable de Puerto Rico, Naguabo Commercial no otorga garantías implícitas de comerciabilidad o idoneidad para un propósito particular, salvo las expresamente ofrecidas por los fabricantes.</p>
              </>
            ) : (
              <>
                <p>Products sold at Naguabo Commercial may be subject to manufacturer warranties. Naguabo Commercial does not offer additional warranties beyond those established by manufacturers, except as required by Puerto Rico consumer warranty law and applicable federal law.</p>
                <p>To claim a manufacturer warranty, keep your receipt or purchase confirmation. In many cases you will need to contact the manufacturer directly. Naguabo Commercial will assist as much as possible to facilitate the process.</p>
                <p><strong>DISCLAIMER OF IMPLIED WARRANTIES:</strong> To the extent permitted by applicable Puerto Rico law, Naguabo Commercial makes no implied warranties of merchantability or fitness for a particular purpose, except those expressly offered by manufacturers.</p>
              </>
            )}
          </S>

          {/* 9 */}
          <S id="ip" title={es ? '9. Propiedad Intelectual' : '9. Intellectual Property'}>
            {es ? (
              <>
                <p>Todo el contenido del sitio web de Naguabo Commercial — incluyendo, sin limitarse a, el logotipo, nombre comercial, textos, imágenes, diseño gráfico, código fuente y base de datos de productos — es propiedad exclusiva de Naguabo Commercial o de sus licenciantes, y está protegido por las leyes de <strong>derechos de autor, marcas registradas y propiedad intelectual</strong> de Puerto Rico, los Estados Unidos y los tratados internacionales aplicables.</p>
                <p>Queda prohibida la reproducción, distribución, modificación, exhibición pública o creación de obras derivadas de cualquier contenido del sitio sin autorización escrita previa de Naguabo Commercial.</p>
                <p>Se le concede una licencia limitada, no exclusiva, intransferible y revocable para acceder y usar el sitio con fines personales y no comerciales, sujeto a estos Términos.</p>
              </>
            ) : (
              <>
                <p>All content on the Naguabo Commercial website — including but not limited to the logo, trade name, text, images, graphic design, source code, and product database — is the exclusive property of Naguabo Commercial or its licensors, and is protected by <strong>copyright, trademark, and intellectual property laws</strong> of Puerto Rico, the United States, and applicable international treaties.</p>
                <p>Reproduction, distribution, modification, public display, or creation of derivative works from any site content is prohibited without prior written authorization from Naguabo Commercial.</p>
                <p>You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the site for personal and non-commercial purposes, subject to these Terms.</p>
              </>
            )}
          </S>

          {/* 10 */}
          <S id="liability" title={es ? '10. Limitación de Responsabilidad' : '10. Limitation of Liability'}>
            {es ? (
              <>
                <p>En la máxima medida permitida por la ley aplicable de Puerto Rico, Naguabo Commercial, sus directores, empleados y agentes <strong>no serán responsables</strong> por:</p>
                <ul>
                  <li>Daños indirectos, incidentales, especiales, consecuentes o punitivos.</li>
                  <li>Pérdida de beneficios, datos, negocios o buena voluntad.</li>
                  <li>Interrupciones del servicio, errores, omisiones o inexactitudes en el sitio.</li>
                  <li>Daños derivados del uso inadecuado de productos adquiridos.</li>
                  <li>Acceso no autorizado a sus datos o cuentas más allá de nuestro control razonable.</li>
                </ul>
                <p>En ningún caso la responsabilidad total de Naguabo Commercial hacia usted excederá el <strong>monto total pagado por usted en los últimos 12 meses</strong> por los Servicios que dieron lugar al reclamo.</p>
                <p>Estas limitaciones aplican independientemente de la teoría legal invocada y aunque se haya advertido a Naguabo Commercial sobre la posibilidad de tales daños. Algunos estados o jurisdicciones no permiten la exclusión de ciertas garantías o la limitación de responsabilidad; en esos casos, las limitaciones aplican en la medida máxima permitida.</p>
              </>
            ) : (
              <>
                <p>To the maximum extent permitted by applicable Puerto Rico law, Naguabo Commercial, its directors, employees, and agents <strong>shall not be liable</strong> for:</p>
                <ul>
                  <li>Indirect, incidental, special, consequential, or punitive damages.</li>
                  <li>Loss of profits, data, business, or goodwill.</li>
                  <li>Service interruptions, errors, omissions, or inaccuracies on the site.</li>
                  <li>Damages arising from improper use of purchased products.</li>
                  <li>Unauthorized access to your data or accounts beyond our reasonable control.</li>
                </ul>
                <p>In no event shall Naguabo Commercial's total liability to you exceed the <strong>total amount paid by you in the last 12 months</strong> for the Services giving rise to the claim.</p>
                <p>These limitations apply regardless of the legal theory invoked and even if Naguabo Commercial has been advised of the possibility of such damages. Some states or jurisdictions do not allow the exclusion of certain warranties or limitation of liability; in those cases, the limitations apply to the maximum extent permitted.</p>
              </>
            )}
          </S>

          {/* 11 */}
          <S id="indemnity" title={es ? '11. Indemnización' : '11. Indemnification'}>
            {es ? (
              <p>Usted acepta indemnizar, defender y mantener indemne a Naguabo Commercial y a sus directores, empleados, agentes y proveedores frente a cualquier reclamación, daño, pérdida, responsabilidad, costo y gasto (incluyendo honorarios de abogados razonables) que surjan de: (a) su uso de los Servicios; (b) su violación de estos Términos; (c) su violación de cualquier derecho de un tercero; o (d) cualquier contenido que usted publique o envíe a través del sitio.</p>
            ) : (
              <p>You agree to indemnify, defend, and hold harmless Naguabo Commercial and its directors, employees, agents, and suppliers from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from: (a) your use of the Services; (b) your violation of these Terms; (c) your violation of any third-party rights; or (d) any content you post or submit through the site.</p>
            )}
          </S>

          {/* 12 */}
          <S id="privacy" title={es ? '12. Privacidad' : '12. Privacy'}>
            {es ? (
              <p>El tratamiento de su información personal se rige por nuestra <Link href="/privacy" className="text-brand hover:underline">Política de Privacidad</Link>, la cual forma parte integral de estos Términos. Al usar nuestros Servicios, usted consiente las prácticas de datos descritas en dicha Política.</p>
            ) : (
              <p>The handling of your personal information is governed by our <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link>, which is incorporated into and forms part of these Terms. By using our Services, you consent to the data practices described in that Policy.</p>
            )}
          </S>

          {/* 13 — PR law */}
          <S id="prlaw" title={es ? '13. Ley Aplicable — Puerto Rico' : '13. Governing Law — Puerto Rico'}>
            {es ? (
              <>
                <p>Estos Términos se rigen e interpretan de conformidad con las leyes del <strong>Estado Libre Asociado de Puerto Rico</strong> y las leyes federales de los Estados Unidos aplicables, sin dar efecto a ningún principio de conflicto de leyes.</p>
                <p>Las siguientes leyes y regulaciones son especialmente relevantes para las transacciones realizadas en Naguabo Commercial:</p>
                <ul>
                  <li><strong>Código Civil de Puerto Rico (Ley Núm. 55 de 2020):</strong> rige los contratos de compraventa, obligaciones y responsabilidades entre las partes.</li>
                  <li><strong>Reglamento de Protección al Consumidor (DACO):</strong> garantiza derechos adicionales a los consumidores en sus transacciones con comerciantes. El Departamento de Asuntos del Consumidor (DACO) supervisa el cumplimiento — (787) 722-7555 / <strong>daco.pr.gov</strong>.</li>
                  <li><strong>Ley Núm. 1 de 2011 (Código de Rentas Internas de PR):</strong> regula el Impuesto sobre Ventas y Uso (IVU) aplicable a las transacciones.</li>
                  <li><strong>Ley Núm. 81 de 2012 (Seguridad de Información Personal):</strong> regula la protección y notificación de brechas de datos.</li>
                  <li><strong>Ley Núm. 247 de 2006 (Prevención del Robo de Identidad):</strong> protege a los consumidores puertorriqueños.</li>
                  <li><strong>Federal FTC Act y COPPA:</strong> aplican como leyes federales en Puerto Rico como territorio de EE.UU.</li>
                  <li><strong>Uniform Commercial Code (UCC) adoptado en PR:</strong> rige las transacciones comerciales de bienes muebles.</li>
                </ul>
              </>
            ) : (
              <>
                <p>These Terms are governed by and construed in accordance with the laws of the <strong>Commonwealth of Puerto Rico</strong> and applicable United States federal laws, without giving effect to any conflict-of-law principles.</p>
                <p>The following laws and regulations are particularly relevant to transactions made at Naguabo Commercial:</p>
                <ul>
                  <li><strong>Puerto Rico Civil Code (Act No. 55 of 2020):</strong> governs purchase contracts, obligations, and liabilities between parties.</li>
                  <li><strong>Consumer Protection Regulations (DACO):</strong> guarantees additional rights to consumers in their transactions with merchants. The Department of Consumer Affairs (DACO) oversees compliance — (787) 722-7555 / <strong>daco.pr.gov</strong>.</li>
                  <li><strong>Act No. 1 of 2011 (PR Internal Revenue Code):</strong> regulates the Sales and Use Tax (IVU) applicable to transactions.</li>
                  <li><strong>Act No. 81 of 2012 (Personal Information Security):</strong> regulates data protection and breach notification.</li>
                  <li><strong>Act No. 247 of 2006 (Identity Theft Prevention):</strong> protects Puerto Rican consumers.</li>
                  <li><strong>Federal FTC Act and COPPA:</strong> apply as federal laws in Puerto Rico as a U.S. territory.</li>
                  <li><strong>Uniform Commercial Code (UCC) as adopted in PR:</strong> governs commercial transactions involving movable goods.</li>
                </ul>
              </>
            )}
          </S>

          {/* 14 */}
          <S id="disputes" title={es ? '14. Resolución de Disputas' : '14. Dispute Resolution'}>
            {es ? (
              <>
                <H3>Resolución informal</H3>
                <p>Antes de iniciar cualquier proceso formal, le pedimos que nos contacte primero al <strong>(787) 874-2120</strong> o a <strong>info@naguabo-commercial.com</strong>. La mayoría de los problemas se resuelven de manera rápida y amigable.</p>
                <H3>DACO — Departamento de Asuntos del Consumidor</H3>
                <p>Los consumidores en Puerto Rico tienen derecho a radicar una querella ante el <strong>DACO</strong> si no se llega a un acuerdo satisfactorio. Puede hacerlo en <strong>daco.pr.gov</strong> o llamando al (787) 722-7555.</p>
                <H3>Jurisdicción</H3>
                <p>Para cualquier disputa que no pueda resolverse informalmente, usted y Naguabo Commercial acuerdan someterse a la jurisdicción exclusiva de los <strong>tribunales del Estado Libre Asociado de Puerto Rico</strong> con sede en el Municipio de Humacao o San Juan, según corresponda, y a los tribunales federales de los Estados Unidos con jurisdicción sobre Puerto Rico.</p>
              </>
            ) : (
              <>
                <H3>Informal resolution</H3>
                <p>Before initiating any formal process, we ask that you contact us first at <strong>(787) 874-2120</strong> or <strong>info@naguabo-commercial.com</strong>. Most issues are resolved quickly and amicably.</p>
                <H3>DACO — Department of Consumer Affairs</H3>
                <p>Consumers in Puerto Rico have the right to file a complaint with <strong>DACO</strong> if a satisfactory agreement cannot be reached. You may do so at <strong>daco.pr.gov</strong> or by calling (787) 722-7555.</p>
                <H3>Jurisdiction</H3>
                <p>For any dispute that cannot be resolved informally, you and Naguabo Commercial agree to submit to the exclusive jurisdiction of the <strong>courts of the Commonwealth of Puerto Rico</strong> located in the Municipality of Humacao or San Juan, as applicable, and the U.S. federal courts with jurisdiction over Puerto Rico.</p>
              </>
            )}
          </S>

          {/* 15 */}
          <S id="general" title={es ? '15. Disposiciones Generales' : '15. General Provisions'}>
            {es ? (
              <ul>
                <li><strong>Acuerdo completo:</strong> Estos Términos, junto con la Política de Privacidad, constituyen el acuerdo completo entre usted y Naguabo Commercial respecto al uso de los Servicios.</li>
                <li><strong>Divisibilidad:</strong> Si alguna disposición de estos Términos es declarada inválida o inaplicable, las demás disposiciones continuarán en plena vigencia y efecto.</li>
                <li><strong>Renuncia:</strong> La omisión de Naguabo Commercial de hacer cumplir cualquier disposición de estos Términos no constituye una renuncia a ese derecho.</li>
                <li><strong>Cesión:</strong> Usted no puede ceder sus derechos u obligaciones bajo estos Términos sin consentimiento previo por escrito de Naguabo Commercial. La Empresa puede ceder sus derechos sin restricción.</li>
                <li><strong>Idioma:</strong> Estos Términos se redactaron originalmente en español. La versión en inglés es una traducción de cortesía; en caso de conflicto, prevalecerá la versión en español conforme a las leyes de Puerto Rico.</li>
                <li><strong>Fuerza mayor:</strong> Naguabo Commercial no será responsable por incumplimientos causados por eventos fuera de su control razonable, incluyendo desastres naturales, huracanes, terremotos, apagones, huelgas o actos gubernamentales.</li>
              </ul>
            ) : (
              <ul>
                <li><strong>Entire agreement:</strong> These Terms, together with the Privacy Policy, constitute the entire agreement between you and Naguabo Commercial regarding use of the Services.</li>
                <li><strong>Severability:</strong> If any provision of these Terms is found invalid or unenforceable, the remaining provisions will continue in full force and effect.</li>
                <li><strong>Waiver:</strong> Naguabo Commercial's failure to enforce any provision of these Terms does not constitute a waiver of that right.</li>
                <li><strong>Assignment:</strong> You may not assign your rights or obligations under these Terms without prior written consent of Naguabo Commercial. The Company may assign its rights without restriction.</li>
                <li><strong>Language:</strong> These Terms were originally drafted in Spanish. The English version is a courtesy translation; in case of conflict, the Spanish version shall prevail under Puerto Rico law.</li>
                <li><strong>Force majeure:</strong> Naguabo Commercial shall not be liable for failures caused by events beyond its reasonable control, including natural disasters, hurricanes, earthquakes, power outages, strikes, or governmental acts.</li>
              </ul>
            )}
          </S>

          {/* 16 */}
          <S id="contact" title={es ? '16. Contáctenos' : '16. Contact Us'}>
            {es ? (
              <>
                <p>Si tiene preguntas sobre estos Términos o sobre cualquier transacción, contáctenos:</p>
                <div className="mt-4 card p-5 space-y-2 text-sm">
                  <p><strong>Naguabo Commercial</strong></p>
                  <p>20 Calle Venecia, Naguabo, Puerto Rico 00718</p>
                  <p>Teléfono: <a href="tel:+17878742120" className="text-brand hover:underline">(787) 874-2120</a></p>
                  <p>Correo: <a href="mailto:info@naguabo-commercial.com" className="text-brand hover:underline">info@naguabo-commercial.com</a></p>
                  <p>Horario: Lun – Sáb, 7:00 am – 5:00 pm (AST)</p>
                </div>
                <p className="mt-4 text-sm">
                  Para quejas de consumidores también puede contactar al <strong>Departamento de Asuntos del Consumidor (DACO)</strong>:{' '}
                  <a href="https://daco.pr.gov" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">daco.pr.gov</a>
                  {' '}· (787) 722-7555.
                </p>
              </>
            ) : (
              <>
                <p>If you have questions about these Terms or any transaction, contact us:</p>
                <div className="mt-4 card p-5 space-y-2 text-sm">
                  <p><strong>Naguabo Commercial</strong></p>
                  <p>20 Calle Venecia, Naguabo, Puerto Rico 00718</p>
                  <p>Phone: <a href="tel:+17878742120" className="text-brand hover:underline">(787) 874-2120</a></p>
                  <p>Email: <a href="mailto:info@naguabo-commercial.com" className="text-brand hover:underline">info@naguabo-commercial.com</a></p>
                  <p>Hours: Mon – Sat, 7:00 am – 5:00 pm (AST)</p>
                </div>
                <p className="mt-4 text-sm">
                  For consumer complaints you may also contact the <strong>Department of Consumer Affairs (DACO)</strong>:{' '}
                  <a href="https://daco.pr.gov" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">daco.pr.gov</a>
                  {' '}· (787) 722-7555.
                </p>
              </>
            )}
          </S>

        </article>
      </div>
    </div>
  );
}

function S({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
        {title}
      </h2>
      <div className="space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-gray-700 [&_li]:dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-gray-800 dark:text-slate-200 mt-4 mb-1">{children}</h3>;
}
