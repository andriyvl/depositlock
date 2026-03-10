import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | DepositLock",
  description: "Reach out to the DepositLock team.",
};

export default function ContactPage() {
  return (
    <section className="container mx-auto max-w-4xl px-4 py-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">Contact</h1>
        <p className="text-muted-foreground">
          Need support with a contract or transaction? Reach us through one of the channels below.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-border bg-background/80 p-5 space-y-2">
          <h2 className="text-lg font-medium">General support</h2>
          <p className="text-muted-foreground">Email: support@depositlock.devviy.com</p>
          <p className="text-muted-foreground">Response time: usually within 24 hours.</p>
        </article>

        <article className="rounded-xl border border-border bg-background/80 p-5 space-y-2">
          <h2 className="text-lg font-medium">Contract issues</h2>
          <p className="text-muted-foreground">Include contract address, network, and transaction hash when reporting issues.</p>
          <p className="text-muted-foreground">This helps us triage quickly and reduce back-and-forth.</p>
        </article>
      </div>

      <p className="text-sm text-muted-foreground">
        You can also start by checking the <Link className="underline underline-offset-4" href="/faq">FAQ page</Link> for common workflows.
      </p>
    </section>
  );
}
