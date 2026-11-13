import type { Metadata } from 'next'
import { LegalPage } from '@/components/landing/site-chrome'

export const metadata: Metadata = {
  title: 'Privacy Policy | PingLog',
  description: 'How PingLog handles account, project, and widget data.',
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updatedAt="November 12, 2026">
      <section>
        <h2>1. Scope and roles</h2>
        <p>
          This Policy describes how PingLog handles personal information when you visit our site, create an account,
          or use our changelog and roadmap service. For account and service operation, PingLog generally acts as a
          controller of account information. When you use PingLog to collect feedback from your own users, you
          determine the purposes and means of that collection and are responsible for providing them with any
          required notices and obtaining any required permissions.
        </p>
      </section>
      <section>
        <h2>2. Information we process</h2>
        <ul>
          <li>Account details such as your email address and authentication identifiers.</li>
          <li>Project information, API keys, published updates, feedback, and account settings.</li>
          <li>Widget interactions, including feedback submissions and votes. To discourage duplicate votes, the widget derives a pseudonymous fingerprint from browser and device attributes.</li>
          <li>Basic technical and diagnostic information needed to secure, operate, and troubleshoot the service.</li>
          <li>Subscription status and transaction references from our billing provider. Payment details are handled by the checkout/payment provider and are not stored by PingLog.</li>
        </ul>
      </section>
      <section>
        <h2>3. How we use information</h2>
        <p>
          We use information to provide and secure PingLog, authenticate users, display your updates and feedback
          widgets, process votes, administer subscriptions, respond to support requests, prevent abuse, and meet
          legal obligations. We do not sell personal information or use widget data for advertising.
        </p>
      </section>
      <section>
        <h2>4. Service providers and disclosures</h2>
        <p>
          We use service providers for infrastructure, authentication, database hosting, and payment processing.
          They may process information on our behalf under their applicable terms. We may disclose information if
          required by law, to protect people or the service, or as part of a business transfer. We do not make
          personal information available to third parties for their own advertising.
        </p>
      </section>
      <section>
        <h2>5. Retention and security</h2>
        <p>
          We retain information for as long as needed to provide the service, maintain your account, resolve
          disputes, enforce agreements, and satisfy legal obligations. We apply reasonable technical and
          organizational safeguards, but no online service can guarantee absolute security.
        </p>
      </section>
      <section>
        <h2>6. Your choices and rights</h2>
        <p>
          You can update some account and project information in PingLog or request account deletion through the
          support channel in your account. Depending on your location, you may have rights to access, correct,
          delete, restrict, or export personal information, or object to certain processing. Contact us through
          your account to make a request. We may need to verify your identity and may retain information where the
          law permits or requires it.
        </p>
      </section>
      <section>
        <h2>7. International processing and updates</h2>
        <p>
          Our providers may process information in countries other than yours. Where required, appropriate
          safeguards are used for international transfers. We may update this Policy from time to time and will
          publish the current version here with its effective date.
        </p>
      </section>
      <section>
        <h2>8. Contact</h2>
        <p>
          For privacy questions or requests, contact PingLog through the support channel provided in your account.
        </p>
      </section>
    </LegalPage>
  )
}
