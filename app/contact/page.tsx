import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | DepositLock",
  description: "Contact the DepositLock team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Contact</h1>
          <p className="text-muted-foreground">Need help with a contract or have a platform question? Reach out below.</p>
        </header>

        <section className="rounded-lg border border-border p-6 bg-background/70 space-y-4">
          <p className="text-muted-foreground">
            Email us at <a href="mailto:support@depositlock.app" className="text-primary-600 underline">support@depositlock.app</a>.
          </p>
          <p className="text-muted-foreground">
            For faster support, include the network, contract address, and a short summary of your issue.
          </p>
        </section>
      </div>
    </div>
  );
}
