import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | DepositLock",
  description: "Terms for using the DepositLock escrow platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">By using DepositLock, you agree to these terms.</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Non-custodial service</h2>
          <p className="text-muted-foreground">
            DepositLock provides smart-contract tooling and dashboard interfaces. Funds are controlled by blockchain
            contracts and wallet signatures, not by DepositLock.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">User responsibilities</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Use the correct wallet and network before signing transactions.</li>
            <li>Review contract terms (amount, deadline, and descriptions) before creating agreements.</li>
            <li>Comply with all applicable local laws and regulations.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">No guarantees</h2>
          <p className="text-muted-foreground">
            Blockchain networks may experience outages, congestion, or volatile gas prices. DepositLock does not guarantee
            uninterrupted service and is not liable for third-party network failures.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Fees</h2>
          <p className="text-muted-foreground">
            DepositLock platform fee is currently 0. You still pay standard blockchain gas fees to submit transactions.
          </p>
        </section>
      </div>
    </div>
  );
}
