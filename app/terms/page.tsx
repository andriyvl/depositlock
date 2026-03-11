import type { Metadata } from "next";
import { AlertTriangle, FileText, Scale, Shield } from "lucide-react";
import { PublicPageShell } from "@/lib/features/public/public-page-shell";

export const metadata: Metadata = {
  title: "Terms of Service | DepositLock",
  description: "Terms for using the DepositLock escrow platform.",
};

const termsSections = [
  {
    title: "Software interface, not custody",
    description:
      "DepositLock provides an interface for interacting with escrow contracts. Funds move according to contract rules and wallet signatures rather than by DepositLock taking custody of assets.",
    icon: FileText,
  },
  {
    title: "User responsibility",
    description:
      "You are responsible for wallet security, verifying addresses, selecting the correct network, and reviewing transactions before signing them.",
    icon: Shield,
  },
  {
    title: "No legal, tax, or investment advice",
    description:
      "DepositLock is an operational product surface. It does not replace professional advice about legal obligations, accounting treatment, or digital asset regulation.",
    icon: Scale,
  },
  {
    title: "Infrastructure risk",
    description:
      "Blockchain congestion, wallet provider failures, RPC outages, and user mistakes can affect results. Those risks remain part of using on-chain applications.",
    icon: AlertTriangle,
  },
] as const;

export default function TermsPage() {
  return (
    <PublicPageShell
      eyebrow="Terms"
      title="Use DepositLock with the same care you use for any on-chain transaction."
      description="These terms summarize the practical boundaries of the product: DepositLock helps users operate escrow agreements, but users stay responsible for their wallets, their network choices, and the actions they sign."
      aside={
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.05em] text-secondary-700">Short version</p>
          <p className="mt-3 text-base leading-7 text-secondary-900/80">
            Review contract details carefully before you sign. On-chain actions are difficult or impossible to reverse once confirmed.
          </p>
        </div>
      }
    >
      {termsSections.map((section) => {
        const Icon = section.icon;

        return (
          <article key={section.title} className="rounded-[2rem] border border-border/70 bg-white/84 p-6 shadow-card backdrop-blur-sm sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-secondary-700">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-[1.55rem] font-semibold tracking-[-0.03em] text-foreground">{section.title}</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">{section.description}</p>
          </article>
        );
      })}
    </PublicPageShell>
  );
}
