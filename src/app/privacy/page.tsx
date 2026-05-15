'use client';
import { useLanguage } from '@/components/LanguageProvider';

const LAST_UPDATED = 'Mayo 14, 2025 / May 14, 2025';

const sections = {
  es: [
    { id: 'intro',        label: '1. Introducción' },
    { id: 'collect',      label: '2. Información que Recopilamos' },
    { id: 'use',          label: '3. Uso de la Información' },
    { id: 'sharing',      label: '4. Divulgación a Terceros' },
    { id: 'cookies',      label: '5. Cookies y Tecnologías de Rastreo' },
    { id: 'security',     label: '6. Seguridad de la Información' },
    { id: 'rights',       label: '7. Sus Derechos' },
    { id: 'children',     label: '8. Privacidad de Menores' },
    { id: 'retention',    label: '9. Retención de Datos' },
    { id: 'links',        label: '10. Sitios de Terceros' },
    { id: 'pr',           label: '11. Leyes de Puerto Rico' },
    { id: 'changes',      label: '12. Cambios a Esta Política' },
    { id: 'contact',      label: '13. Contáctenos' },
  ],
  en: [
    { id: 'intro',        label: '1. Introduction' },
    { id: 'collect',      label: '2. Information We Collect' },
    { id: 'use',          label: '3. How We Use Your Information' },
    { id: 'sharing',      label: '4. Sharing with Third Parties' },
    { id: 'cookies',      label: '5. Cookies & Tracking Technologies' },
    { id: 'security',     label: '6. Data Security' },
    { id: 'rights',       label: '7. Your Rights' },
    { id: 'children',     label: '8. Children\'s Privacy' },
    { id: 'retention',    label: '9. Data Retention' },
    { id: 'links',        label: '10. Third-Party Links' },
    { id: 'pr',           label: '11. Puerto Rico Laws' },
    { id: 'changes',      label: '12. Changes to This Policy' },
    { id: 'contact',      label: '13. Contact Us' },
  ],
};

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const es = lang === 'es';
  const toc = es ? sections.es : sections.en;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8 border-b border-gray-200 dark:border-slate-700 pb-6">
        <h1 className="text-4xl font-black text-gray-900 dark:text-slate-100">
          {es ? 'Política de Privacidad' : 'Privacy Policy'}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
          {es ? 'Última actualización:' : 'Last updated:'} {LAST_UPDATED}
        </p>
        <p className="mt-3 text-gray-600 dark:text-slate-300 max-w-3xl">
          {es
            ? 'En Naguabo Commercial nos comprometemos a proteger su privacidad. Esta Política describe cómo recopilamos, usamos y protegemos su información personal cuando visita nuestro sitio web o realiza una compra.'
            : 'At Naguabo Commercial we are committed to protecting your privacy. This Policy describes how we collect, use, and protect your personal information when you visit our website or make a purchase.'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar TOC */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 card p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3">
              {es ? 'Contenido' : 'Contents'}
            </h2>
            <nav className="space-y-1">
              {toc.map(({ id, label }) => (
                <a key={id} href={`#${id}`}
                  className="block text-sm text-gray-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand py-0.5 transition-colors">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="flex-1 space-y-10 text-gray-700 dark:text-slate-300 leading-relaxed">

          {/* 1 */}
          <Section id="intro" title={es ? '1. Introducción' : '1. Introduction'}>
            {es ? (
              <>
                <p>Naguabo Commercial ("nosotros", "nuestro" o "la Empresa") opera el sitio web <strong>naguabo-commercial.com</strong> y sus servicios relacionados. Estamos ubicados en 20 Calle Venecia, Naguabo, Puerto Rico 00718.</p>
                <p>Esta Política de Privacidad aplica a toda la información recopilada a través de nuestro sitio web, aplicaciones móviles, ventas en tienda y cualquier otro servicio que ofrecemos (en conjunto, los "Servicios").</p>
                <p>Al usar nuestros Servicios, usted acepta las prácticas descritas en esta Política. Si no está de acuerdo, le pedimos que no utilice nuestros Servicios.</p>
              </>
            ) : (
              <>
                <p>Naguabo Commercial ("we," "our," or "the Company") operates the website <strong>naguabo-commercial.com</strong> and related services. We are located at 20 Calle Venecia, Naguabo, Puerto Rico 00718.</p>
                <p>This Privacy Policy applies to all information collected through our website, mobile applications, in-store sales, and any other services we offer (collectively, the "Services").</p>
                <p>By using our Services, you agree to the practices described in this Policy. If you do not agree, please do not use our Services.</p>
              </>
            )}
          </Section>

          {/* 2 */}
          <Section id="collect" title={es ? '2. Información que Recopilamos' : '2. Information We Collect'}>
            {es ? (
              <>
                <Subtitle>Información que usted nos proporciona</Subtitle>
                <ul>
                  <li><strong>Información de cuenta:</strong> nombre, dirección de correo electrónico, número de teléfono y contraseña al registrarse.</li>
                  <li><strong>Información de compra:</strong> dirección de facturación y envío, información de pago (procesada de forma segura por Stripe — no almacenamos datos de tarjeta).</li>
                  <li><strong>Comunicaciones:</strong> mensajes enviados a través de nuestro chat, WhatsApp o formulario de contacto.</li>
                  <li><strong>Reseñas y opiniones:</strong> comentarios o calificaciones que publique sobre nuestros productos.</li>
                </ul>
                <Subtitle>Información recopilada automáticamente</Subtitle>
                <ul>
                  <li><strong>Datos de uso:</strong> páginas visitadas, términos de búsqueda, productos vistos, carrito de compras y clics.</li>
                  <li><strong>Datos del dispositivo:</strong> dirección IP, tipo de navegador, sistema operativo, idioma y zona horaria.</li>
                  <li><strong>Cookies y tecnologías similares:</strong> vea la Sección 5 para más detalles.</li>
                </ul>
                <Subtitle>Información de terceros</Subtitle>
                <p>Podemos recibir información sobre usted de proveedores de pago (Stripe), redes sociales (si inicia sesión con una red social) y socios publicitarios, en la medida permitida por la ley aplicable.</p>
              </>
            ) : (
              <>
                <Subtitle>Information you provide to us</Subtitle>
                <ul>
                  <li><strong>Account information:</strong> name, email address, phone number, and password when you register.</li>
                  <li><strong>Purchase information:</strong> billing and shipping address, payment information (securely processed by Stripe — we do not store card data).</li>
                  <li><strong>Communications:</strong> messages sent via our chat, WhatsApp, or contact form.</li>
                  <li><strong>Reviews and feedback:</strong> comments or ratings you post about our products.</li>
                </ul>
                <Subtitle>Information collected automatically</Subtitle>
                <ul>
                  <li><strong>Usage data:</strong> pages visited, search terms, products viewed, cart contents, and clicks.</li>
                  <li><strong>Device data:</strong> IP address, browser type, operating system, language, and time zone.</li>
                  <li><strong>Cookies and similar technologies:</strong> see Section 5 for details.</li>
                </ul>
                <Subtitle>Information from third parties</Subtitle>
                <p>We may receive information about you from payment providers (Stripe), social networks (if you log in via a social account), and advertising partners, to the extent permitted by applicable law.</p>
              </>
            )}
          </Section>

          {/* 3 */}
          <Section id="use" title={es ? '3. Uso de la Información' : '3. How We Use Your Information'}>
            {es ? (
              <ul>
                <li>Procesar y entregar sus pedidos y enviarle confirmaciones y actualizaciones.</li>
                <li>Administrar su cuenta y proporcionar servicio al cliente.</li>
                <li>Personalizar su experiencia de compra y mostrarle productos relevantes.</li>
                <li>Enviarle comunicaciones de marketing si usted ha dado su consentimiento (puede darse de baja en cualquier momento).</li>
                <li>Detectar, investigar y prevenir fraudes, abusos y actividades ilegales.</li>
                <li>Cumplir con obligaciones legales y reglamentarias aplicables en Puerto Rico y Estados Unidos.</li>
                <li>Mejorar nuestros Servicios mediante análisis de uso y comentarios de clientes.</li>
              </ul>
            ) : (
              <ul>
                <li>Process and fulfill your orders and send confirmations and updates.</li>
                <li>Manage your account and provide customer service.</li>
                <li>Personalize your shopping experience and show you relevant products.</li>
                <li>Send you marketing communications if you have given consent (you may opt out at any time).</li>
                <li>Detect, investigate, and prevent fraud, abuse, and illegal activity.</li>
                <li>Comply with applicable legal and regulatory obligations in Puerto Rico and the United States.</li>
                <li>Improve our Services through usage analysis and customer feedback.</li>
              </ul>
            )}
          </Section>

          {/* 4 */}
          <Section id="sharing" title={es ? '4. Divulgación a Terceros' : '4. Sharing with Third Parties'}>
            {es ? (
              <>
                <p>No vendemos ni alquilamos su información personal a terceros con fines comerciales. Podemos compartir su información únicamente en las siguientes circunstancias:</p>
                <ul>
                  <li><strong>Proveedores de servicios:</strong> empresas que nos ayudan a operar nuestros Servicios, como procesadores de pago (Stripe), servicios de entrega, plataformas de análisis (Google Analytics) y proveedores de hosting, bajo contratos de confidencialidad.</li>
                  <li><strong>Requisitos legales:</strong> cuando la divulgación sea requerida por ley, orden judicial, citación u otras autoridades gubernamentales de Puerto Rico o de los Estados Unidos.</li>
                  <li><strong>Prevención de fraude:</strong> para proteger los derechos, la propiedad o la seguridad de Naguabo Commercial, nuestros clientes u otros.</li>
                  <li><strong>Transferencias empresariales:</strong> en caso de fusión, adquisición o venta de activos, su información podría ser transferida como parte de esa transacción, previo aviso.</li>
                </ul>
              </>
            ) : (
              <>
                <p>We do not sell or rent your personal information to third parties for commercial purposes. We may share your information only in the following circumstances:</p>
                <ul>
                  <li><strong>Service providers:</strong> companies that help us operate our Services, such as payment processors (Stripe), delivery services, analytics platforms (Google Analytics), and hosting providers, under confidentiality agreements.</li>
                  <li><strong>Legal requirements:</strong> when disclosure is required by law, court order, subpoena, or other governmental authority in Puerto Rico or the United States.</li>
                  <li><strong>Fraud prevention:</strong> to protect the rights, property, or safety of Naguabo Commercial, our customers, or others.</li>
                  <li><strong>Business transfers:</strong> in the event of a merger, acquisition, or asset sale, your information may be transferred as part of that transaction, with prior notice.</li>
                </ul>
              </>
            )}
          </Section>

          {/* 5 */}
          <Section id="cookies" title={es ? '5. Cookies y Tecnologías de Rastreo' : '5. Cookies & Tracking Technologies'}>
            {es ? (
              <>
                <p>Utilizamos cookies y tecnologías similares para mejorar su experiencia. Los tipos incluyen:</p>
                <ul>
                  <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento del sitio (sesión, carrito de compras, preferencias de idioma y tema).</li>
                  <li><strong>Cookies analíticas:</strong> nos ayudan a entender cómo se usa el sitio (p. ej., Google Analytics). Los datos son agregados y anónimos.</li>
                  <li><strong>Cookies de marketing:</strong> usadas para mostrar anuncios relevantes. Solo se activan con su consentimiento.</li>
                </ul>
                <p>Puede controlar o eliminar las cookies desde la configuración de su navegador. Tenga en cuenta que desactivar ciertas cookies puede afectar la funcionalidad del sitio.</p>
              </>
            ) : (
              <>
                <p>We use cookies and similar technologies to enhance your experience. Types include:</p>
                <ul>
                  <li><strong>Essential cookies:</strong> required for site functionality (session, shopping cart, language and theme preferences).</li>
                  <li><strong>Analytics cookies:</strong> help us understand how the site is used (e.g., Google Analytics). Data is aggregated and anonymized.</li>
                  <li><strong>Marketing cookies:</strong> used to show relevant advertisements. Only activated with your consent.</li>
                </ul>
                <p>You can control or delete cookies through your browser settings. Please note that disabling certain cookies may affect site functionality.</p>
              </>
            )}
          </Section>

          {/* 6 */}
          <Section id="security" title={es ? '6. Seguridad de la Información' : '6. Data Security'}>
            {es ? (
              <>
                <p>Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger su información personal, incluyendo:</p>
                <ul>
                  <li>Transmisión cifrada mediante SSL/TLS (HTTPS).</li>
                  <li>Procesamiento de pagos a través de Stripe, certificado PCI DSS Nivel 1 — no almacenamos números de tarjeta de crédito en nuestros servidores.</li>
                  <li>Acceso restringido a la información personal solo al personal autorizado.</li>
                  <li>Revisiones periódicas de seguridad.</li>
                </ul>
                <p>A pesar de estas medidas, ningún sistema es 100% seguro. En caso de una brecha de seguridad que afecte sus datos, le notificaremos conforme a lo exigido por la <strong>Ley Núm. 81 de 2012</strong> de Puerto Rico y las leyes federales aplicables.</p>
              </>
            ) : (
              <>
                <p>We implement administrative, technical, and physical security measures to protect your personal information, including:</p>
                <ul>
                  <li>Encrypted transmission via SSL/TLS (HTTPS).</li>
                  <li>Payment processing through Stripe, PCI DSS Level 1 certified — we do not store credit card numbers on our servers.</li>
                  <li>Restricted access to personal information by authorized personnel only.</li>
                  <li>Periodic security reviews.</li>
                </ul>
                <p>Despite these measures, no system is 100% secure. In the event of a security breach affecting your data, we will notify you as required by Puerto Rico <strong>Act 81 of 2012</strong> and applicable federal laws.</p>
              </>
            )}
          </Section>

          {/* 7 */}
          <Section id="rights" title={es ? '7. Sus Derechos' : '7. Your Rights'}>
            {es ? (
              <>
                <p>Como usuario, usted tiene los siguientes derechos respecto a su información personal:</p>
                <ul>
                  <li><strong>Acceso:</strong> solicitar una copia de la información que tenemos sobre usted.</li>
                  <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
                  <li><strong>Eliminación:</strong> solicitar la eliminación de su información, sujeto a obligaciones legales de retención.</li>
                  <li><strong>Oposición:</strong> oponerse al uso de su información para fines de marketing directo.</li>
                  <li><strong>Portabilidad:</strong> recibir sus datos en un formato estructurado y legible por máquina.</li>
                  <li><strong>Retirar consentimiento:</strong> retirar cualquier consentimiento otorgado previamente en cualquier momento.</li>
                </ul>
                <p>Para ejercer cualquiera de estos derechos, contáctenos en <strong>privacy@naguabo-commercial.com</strong>. Responderemos dentro de los 30 días siguientes a la recepción de su solicitud.</p>
              </>
            ) : (
              <>
                <p>As a user, you have the following rights regarding your personal information:</p>
                <ul>
                  <li><strong>Access:</strong> request a copy of the information we hold about you.</li>
                  <li><strong>Rectification:</strong> request correction of inaccurate or incomplete data.</li>
                  <li><strong>Deletion:</strong> request deletion of your information, subject to legal retention obligations.</li>
                  <li><strong>Objection:</strong> object to the use of your information for direct marketing purposes.</li>
                  <li><strong>Portability:</strong> receive your data in a structured, machine-readable format.</li>
                  <li><strong>Withdraw consent:</strong> withdraw any previously granted consent at any time.</li>
                </ul>
                <p>To exercise any of these rights, contact us at <strong>privacy@naguabo-commercial.com</strong>. We will respond within 30 days of receiving your request.</p>
              </>
            )}
          </Section>

          {/* 8 */}
          <Section id="children" title={es ? '8. Privacidad de Menores' : "8. Children's Privacy"}>
            {es ? (
              <>
                <p>Nuestros Servicios no están dirigidos a menores de 13 años. No recopilamos intencionalmente información personal de niños menores de 13 años, conforme a la <strong>Ley Federal de Protección de la Privacidad Infantil en Línea (COPPA)</strong>.</p>
                <p>Si usted cree que hemos recopilado información de un menor sin el consentimiento del padre o tutor, contáctenos de inmediato a <strong>privacy@naguabo-commercial.com</strong> y tomaremos medidas para eliminar dicha información.</p>
              </>
            ) : (
              <>
                <p>Our Services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13, in compliance with the federal <strong>Children's Online Privacy Protection Act (COPPA)</strong>.</p>
                <p>If you believe we have collected information from a minor without parental or guardian consent, contact us immediately at <strong>privacy@naguabo-commercial.com</strong> and we will take steps to delete such information.</p>
              </>
            )}
          </Section>

          {/* 9 */}
          <Section id="retention" title={es ? '9. Retención de Datos' : '9. Data Retention'}>
            {es ? (
              <p>Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos descritos en esta Política, o según lo exijan las leyes aplicables. Los registros de transacciones pueden conservarse por hasta <strong>7 años</strong> conforme a las leyes fiscales y comerciales de Puerto Rico y de los Estados Unidos. Cuando su información ya no sea necesaria, la eliminaremos o anonimizaremos de forma segura.</p>
            ) : (
              <p>We retain your personal information for as long as necessary to fulfill the purposes described in this Policy, or as required by applicable law. Transaction records may be retained for up to <strong>7 years</strong> under Puerto Rico and U.S. tax and commercial laws. When your information is no longer needed, we will securely delete or anonymize it.</p>
            )}
          </Section>

          {/* 10 */}
          <Section id="links" title={es ? '10. Sitios de Terceros' : '10. Third-Party Links'}>
            {es ? (
              <p>Nuestro sitio puede contener enlaces a sitios web de terceros (por ejemplo, fabricantes de productos o socios). No somos responsables de las prácticas de privacidad de dichos sitios. Le recomendamos revisar la política de privacidad de cualquier sitio que visite.</p>
            ) : (
              <p>Our site may contain links to third-party websites (e.g., product manufacturers or partners). We are not responsible for the privacy practices of those sites. We encourage you to review the privacy policy of any site you visit.</p>
            )}
          </Section>

          {/* 11 — PR specific */}
          <Section id="pr" title={es ? '11. Leyes Aplicables en Puerto Rico' : '11. Applicable Puerto Rico Laws'}>
            {es ? (
              <>
                <p>Como empresa ubicada en Puerto Rico, cumplimos con las siguientes leyes y regulaciones locales y federales:</p>
                <ul>
                  <li>
                    <strong>Ley Núm. 81 de 2012 — Ley para la Seguridad, Confidencialidad e Integridad de la Información Personal:</strong> exige que las empresas que recopilan información personal de residentes de Puerto Rico implementen medidas de seguridad adecuadas y notifiquen a los afectados y al gobierno en caso de violación de seguridad.
                  </li>
                  <li>
                    <strong>Ley Núm. 247 de 2006 — Ley de Prevención del Robo de Identidad de Puerto Rico:</strong> protege a los consumidores puertorriqueños contra el uso no autorizado de su información personal con fines fraudulentos.
                  </li>
                  <li>
                    <strong>Ley Federal COPPA (Children's Online Privacy Protection Act):</strong> protege la información personal de menores de 13 años en línea. Aplica en Puerto Rico como territorio de los Estados Unidos.
                  </li>
                  <li>
                    <strong>Ley Federal FTC Act (Federal Trade Commission Act):</strong> prohíbe prácticas injustas o engañosas en el comercio, incluyendo el manejo de datos personales.
                  </li>
                  <li>
                    <strong>Reglamento de Protección al Consumidor de Puerto Rico:</strong> bajo la jurisdicción del Departamento de Asuntos del Consumidor (DACO), garantiza derechos adicionales a los consumidores en sus transacciones comerciales.
                  </li>
                  <li>
                    <strong>Estándares de accesibilidad — Ley Núm. 229 de 2003:</strong> nuestro sitio procura cumplir con los estándares de accesibilidad para todos los usuarios.
                  </li>
                </ul>
                <p>Si tiene alguna queja relacionada con el manejo de su información, puede contactar al <strong>Departamento de Asuntos del Consumidor (DACO)</strong> de Puerto Rico al (787) 722-7555 o visitar <strong>www.daco.pr.gov</strong>.</p>
              </>
            ) : (
              <>
                <p>As a company located in Puerto Rico, we comply with the following local and federal laws and regulations:</p>
                <ul>
                  <li>
                    <strong>Act No. 81 of 2012 — Personal Information Security, Confidentiality, and Integrity Act:</strong> requires businesses that collect personal information of Puerto Rico residents to implement adequate security measures and notify affected individuals and the government in case of a security breach.
                  </li>
                  <li>
                    <strong>Act No. 247 of 2006 — Puerto Rico Identity Theft Prevention Act:</strong> protects Puerto Rican consumers against the unauthorized use of their personal information for fraudulent purposes.
                  </li>
                  <li>
                    <strong>Federal COPPA (Children's Online Privacy Protection Act):</strong> protects the personal information of children under 13 online. Applies in Puerto Rico as a U.S. territory.
                  </li>
                  <li>
                    <strong>Federal FTC Act (Federal Trade Commission Act):</strong> prohibits unfair or deceptive practices in commerce, including the handling of personal data.
                  </li>
                  <li>
                    <strong>Puerto Rico Consumer Protection Regulations:</strong> under the jurisdiction of the Department of Consumer Affairs (DACO), guarantees additional rights to consumers in commercial transactions.
                  </li>
                  <li>
                    <strong>Accessibility standards — Act No. 229 of 2003:</strong> our site strives to meet accessibility standards for all users.
                  </li>
                </ul>
                <p>If you have a complaint regarding the handling of your information, you may contact the Puerto Rico <strong>Department of Consumer Affairs (DACO)</strong> at (787) 722-7555 or visit <strong>www.daco.pr.gov</strong>.</p>
              </>
            )}
          </Section>

          {/* 12 */}
          <Section id="changes" title={es ? '12. Cambios a Esta Política' : '12. Changes to This Policy'}>
            {es ? (
              <p>Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos publicando la nueva versión en esta página con la fecha de actualización y, cuando corresponda, por correo electrónico. Le recomendamos revisar esta página periódicamente. El uso continuo de nuestros Servicios después de la publicación de cambios constituye su aceptación de la Política actualizada.</p>
            ) : (
              <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new version on this page with the updated date and, where appropriate, by email. We encourage you to review this page periodically. Your continued use of our Services after the posting of changes constitutes your acceptance of the updated Policy.</p>
            )}
          </Section>

          {/* 13 */}
          <Section id="contact" title={es ? '13. Contáctenos' : '13. Contact Us'}>
            {es ? (
              <>
                <p>Si tiene preguntas, inquietudes o desea ejercer sus derechos sobre su información personal, contáctenos:</p>
                <div className="mt-4 card p-5 not-prose space-y-2 text-sm">
                  <p><strong>Naguabo Commercial</strong></p>
                  <p>20 Calle Venecia, Naguabo, Puerto Rico 00718</p>
                  <p>Teléfono: <a href="tel:+17878742120" className="text-brand hover:underline">(787) 874-2120</a></p>
                  <p>Correo: <a href="mailto:privacy@naguabo-commercial.com" className="text-brand hover:underline">privacy@naguabo-commercial.com</a></p>
                  <p>Horario de atención: Lun – Sáb, 7:00 am – 5:00 pm (AST)</p>
                </div>
              </>
            ) : (
              <>
                <p>If you have questions, concerns, or wish to exercise your rights regarding your personal information, contact us:</p>
                <div className="mt-4 card p-5 not-prose space-y-2 text-sm">
                  <p><strong>Naguabo Commercial</strong></p>
                  <p>20 Calle Venecia, Naguabo, Puerto Rico 00718</p>
                  <p>Phone: <a href="tel:+17878742120" className="text-brand hover:underline">(787) 874-2120</a></p>
                  <p>Email: <a href="mailto:privacy@naguabo-commercial.com" className="text-brand hover:underline">privacy@naguabo-commercial.com</a></p>
                  <p>Office hours: Mon – Sat, 7:00 am – 5:00 pm (AST)</p>
                </div>
              </>
            )}
          </Section>

        </article>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
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

function Subtitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-gray-800 dark:text-slate-200 mt-4 mb-1">{children}</h3>;
}
