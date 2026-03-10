import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DepositLock",
  description: "Learn how DepositLock handles wallet data and on-chain activity.",
};

export default function PrivacyPage() {
  return (
    <section className="container mx-auto max-w-4xl px-4 py-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          DepositLock is a non-custodial escrow interface. We do not store your private keys and we only process the minimum data required to run the app.
        </p>
      </header>

      <div className="space-y-6">
        <article className="space-y-2">
          <h2 className="text-xl font-medium">Data we process</h2>
          <p className="text-muted-foreground">
            We process wallet addresses, selected network, contract metadata, and transaction hashes so you can create and manage escrow agreements.
          </p>
        </article>

        <article className="space-y-2">
          <h2 className="text-xl font-medium">On-chain transparency</h2>
          <p className="text-muted-foreground">
            Smart contract interactions are public on supported block explorers. Any information submitted on-chain may be visible permanently.
          </p>
        </article>

        <article className="space-y-2">
          <h2 className="text-xl font-medium">Third-party services</h2>
          <p className="text-muted-foreground">
            Wallet providers, RPC endpoints, and blockchain explorers may process data independently under their own privacy policies.
          </p>
        </article>

        <article className="space-y-2">
          <h2 className="text-xl font-medium">Contact</h2>
          <p className="text-muted-foreground">
            For privacy requests, use the contact page and include your wallet address and transaction reference for faster support.
          </p>
        </article>
      </div>
    </section>
  );
}
