import type { Metadata } from 'next'
import { LegalPage } from '@/components/landing/site-chrome'

export const metadata: Metadata = {
  title: 'Refund Policy | PingLog',
  description: 'PingLog subscription cancellations and 14-day money-back guarantee.',
}

export default function RefundPage() {
  return (
    <LegalPage title="Refund Policy" updatedAt="November 12, 2026">
      <section>
        <h2>14-day money-back guarantee</h2>
        <p>
          If you purchase a paid PingLog subscription for the first time, you may request a full refund within 14
          days of the initial purchase. This guarantee applies to the first payment for a new paid subscription,
          not renewals, plan changes, or subsequent purchases.
        </p>
      </section>
      <section>
        <h2>How to request a refund</h2>
        <p>
          Submit your request within 14 days of purchase using the support channel in your PingLog account. Include
          the account email and order or invoice reference so we can identify the transaction. We will review
          eligible requests and issue the refund to the original payment method through the payment processor.
          Processing times depend on your payment provider.
        </p>
      </section>
      <section>
        <h2>After a refund or cancellation</h2>
        <p>
          A refund ends the refunded subscription. You can cancel a subscription at any time; cancellation stops
          future renewals, and access to paid features normally continues through the end of the current billing
          period. Cancellation alone does not automatically refund a payment outside the 14-day guarantee.
        </p>
      </section>
      <section>
        <h2>Legal rights</h2>
        <p>
          This Policy does not limit any non-waivable consumer or business customer rights that apply under local
          law. Where the law requires a refund or other remedy, we will honor those requirements.
        </p>
      </section>
      <section>
        <h2>Questions</h2>
        <p>
          For billing or refund questions, contact PingLog through the support channel provided in your account.
        </p>
      </section>
    </LegalPage>
  )
}
