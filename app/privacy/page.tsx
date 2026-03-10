import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DepositLock",
  description: "Learn how DepositLock handles your wallet and agreement data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">What we collect</h2>
          <p className="text-muted-foreground">
            DepositLock is a non-custodial application. We never take possession of your wallet keys or escrowed funds.
            We may store contract metadata you submit (contract address, role, selected network, title, and timestamps)
            to improve your dashboard experience.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">How blockchain data works</h2>
          <p className="text-muted-foreground">
            Information written to public blockchains (addresses, transfers, and contract events) is permanently public and
            cannot be deleted by DepositLock.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">How we use data</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Show your escrow contracts in the dashboard.</li>
            <li>Validate your contract role (creator/depositor) for account actions.</li>
            <li>Provide product support and maintain platform reliability.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            Questions about privacy? Reach us through the Contact page and include your wallet address and contract address (if relevant).
          </p>
        </section>
      </div>
    </div>
  );
}
