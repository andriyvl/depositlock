import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | DepositLock",
  description: "Terms for using the DepositLock escrow platform.",
};

export default function TermsPage() {
  return (
    <section className="container mx-auto max-w-4xl px-4 py-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">Terms of Service</h1>
        <p className="text-muted-foreground">
          By using DepositLock, you agree to these terms and to comply with local regulations related to digital assets.
        </p>
      </header>

      <div className="space-y-6">
        <article className="space-y-2">
          <h2 className="text-xl font-medium">Non-custodial protocol</h2>
          <p className="text-muted-foreground">
            DepositLock provides software to interact with escrow contracts. Funds are controlled by smart contract rules and wallet signatures.
          </p>
        </article>

        <article className="space-y-2">
          <h2 className="text-xl font-medium">User responsibility</h2>
          <p className="text-muted-foreground">
            You are responsible for wallet security, verifying recipient addresses, selecting correct networks, and reviewing transaction details before signing.
          </p>
        </article>

        <article className="space-y-2">
          <h2 className="text-xl font-medium">No financial advice</h2>
          <p className="text-muted-foreground">
            DepositLock is provided for informational and operational purposes. It does not provide legal, tax, or investment advice.
          </p>
        </article>

        <article className="space-y-2">
          <h2 className="text-xl font-medium">Limitation of liability</h2>
          <p className="text-muted-foreground">
            We are not liable for blockchain outages, wallet provider failures, user mistakes, or losses caused by third-party infrastructure.
          </p>
        </article>
      </div>
    </section>
  );
}
