import type { Metadata } from 'next'
import { LegalPage } from '@/components/landing/site-chrome'

export const metadata: Metadata = {
  title: 'Terms of Service | PingLog',
  description: 'Terms governing your use of PingLog.',
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updatedAt="November 12, 2026">
      <section>
        <h2>1. Agreement and eligibility</h2>
        <p>
          These Terms govern access to PingLog, a business-to-business service for publishing product updates and
          collecting roadmap feedback. By creating an account or using the service, you agree to these Terms on
          behalf of yourself and, where applicable, the business you represent. You must have authority to bind that
          business and be at least 18 years old.
        </p>
      </section>
      <section>
        <h2>2. The service and your account</h2>
        <p>
          PingLog provides tools to create projects, publish changelog entries, collect suggestions and votes, and
          embed a customer-facing widget. You are responsible for keeping your credentials secure, maintaining
          accurate account information, and all activity under your account. Notify us promptly if you suspect
          unauthorized access.
        </p>
      </section>
      <section>
        <h2>3. Acceptable use and customer content</h2>
        <p>
          You retain ownership of content you submit. You grant PingLog a limited, worldwide license to host,
          process, display, and transmit that content solely to provide and maintain the service. You must have the
          rights and permissions necessary to submit it and must not upload unlawful, infringing, deceptive, or
          harmful material; disrupt the service; attempt unauthorized access; or use the service to violate law.
        </p>
        <p>
          You are responsible for your products, published content, end-user notices, and compliance with laws
          applicable to your use of PingLog, including privacy and data-protection requirements.
        </p>
      </section>
      <section>
        <h2>4. Plans, billing, and cancellation</h2>
        <p>
          Plan features and prices are shown at checkout or on our pricing page. Paid subscriptions are billed in
          advance on the stated billing cycle and renew until cancelled. Any applicable taxes and the payment
          processor&apos;s checkout terms are presented at purchase. You may cancel through the account or billing
          controls provided; cancellation takes effect at the end of the current paid period unless required
          otherwise by law or covered by our Refund Policy.
        </p>
      </section>
      <section>
        <h2>5. Availability and changes</h2>
        <p>
          We aim to provide a reliable service but do not promise uninterrupted or error-free operation. We may
          modify or discontinue features, and will use reasonable efforts to give notice of material changes that
          negatively affect paid customers. We may suspend access when reasonably necessary to protect the service,
          comply with law, or address a breach of these Terms.
        </p>
      </section>
      <section>
        <h2>6. Termination</h2>
        <p>
          You may stop using PingLog and close your account at any time. We may suspend or terminate access for a
          material breach, unlawful use, or a security risk. On termination, your right to use the service ends.
          We may delete account data after a reasonable period, subject to legal, security, and backup-retention
          requirements.
        </p>
      </section>
      <section>
        <h2>7. Disclaimers and limitation of liability</h2>
        <p>
          To the extent permitted by law, PingLog is provided “as is” and “as available,” without warranties of
          merchantability, fitness for a particular purpose, or non-infringement. Neither party is liable for
          indirect, incidental, special, consequential, or punitive damages, or loss of profits, revenue, data, or
          goodwill. To the extent permitted by law, PingLog&apos;s aggregate liability relating to the service will
          not exceed the fees paid by you to PingLog for the service in the 12 months before the event giving rise
          to the claim. Nothing in these Terms limits liability that cannot lawfully be limited.
        </p>
      </section>
      <section>
        <h2>8. Changes and contact</h2>
        <p>
          We may update these Terms from time to time. Material changes will be posted here with a revised date;
          continued use after they take effect constitutes acceptance where permitted by law. For questions about
          these Terms, contact PingLog through the support channel provided in your account.
        </p>
      </section>
    </LegalPage>
  )
}
