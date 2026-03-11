import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleDollarSign, Network, ShieldCheck } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { PublicPageShell } from "@/lib/features/public/public-page-shell";

export const metadata: Metadata = {
  title: "FAQ | DepositLock",
  description: "Common questions about DepositLock networks, currencies, fees, and escrow workflows.",
};

const faqItems = [
  {
    question: "What networks are supported?",
    answer:
      "DepositLock currently supports Ethereum, Arbitrum, Base, Optimism, Polygon, Mantle, and Polygon Amoy for testnet coverage.",
  },
  {
    question: "What currencies are supported?",
    answer:
      "Supported currencies depend on the selected network and currently focus on stablecoins such as USDC and USDT where they are configured.",
  },
  {
    question: "What are the platform fees?",
    answer:
      "DepositLock charges no platform fee. Users only pay the network gas required to deploy or interact with the escrow contract.",
  },
  {
    question: "How does the contract work?",
    answer:
      "A creator deploys an escrow agreement with amount, deadline, and description. The depositor funds the contract, and the agreement is then resolved through release, cancel, or dispute actions.",
  },
  {
    question: "How do I create a contract?",
    answer:
      "Connect your wallet, open the creator flow, choose the network and token, set the amount and deadline, then deploy the agreement from your wallet.",
  },
  {
    question: "How do I fill a deposit?",
    answer:
      "Open the contract link or paste the contract ID into the entry page, connect your wallet, review the agreement, and confirm the deposit transaction.",
  },
  {
    question: "How do I withdraw or release funds?",
    answer:
      "When the contract is ready to settle, the authorized party uses the contract actions panel to release funds from escrow to the appropriate wallet.",
  },
  {
    question: "How do disputes work?",
    answer:
      "If terms are contested, a dispute can be opened from the contract actions area with a reason and proposed release amount for resolution.",
  },
] as const;

const factCards = [
  {
    title: "Ethereum + L2s",
    description: "Choose reach or lower fees depending on the rental and customer flow.",
    icon: Network,
  },
  {
    title: "No platform fee",
    description: "The product itself does not add a DepositLock fee to the escrow workflow.",
    icon: CircleDollarSign,
  },
  {
    title: "Non-custodial",
    description: "Funds stay controlled by contract logic and wallet signatures, not by DepositLock custody.",
    icon: ShieldCheck,
  },
] as const;

export default function FaqPage() {
  return (
    <PublicPageShell
      eyebrow="Knowledge base"
      title="Everything renters and rental businesses usually ask first."
      description="Use this page to understand which networks are available, what the contract flow looks like, and what to expect before you create or fund an escrow."
      aside={
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.05em] text-secondary-700">Need direct help?</p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            If your question is about a live contract, include the network and contract address when
            you contact support.
          </p>
          <Button size="lg" className="mt-5 w-full" asChild>
            <Link href="/contact">
              Contact support
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {factCards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.title} className="rounded-[1.75rem] border border-border/70 bg-white/84 p-5 shadow-card backdrop-blur-sm sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="h-[1.125rem] w-[1.125rem]" />
              </div>
              <h2 className="mt-4 text-[1.35rem] font-bold tracking-[-0.03em] text-foreground">{card.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">{card.description}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {faqItems.map((item) => (
          <article key={item.question} className="h-full rounded-[2rem] border border-border/70 bg-white/84 p-6 shadow-card backdrop-blur-sm sm:p-7">
            <h2 className="text-[1.45rem] font-bold tracking-[-0.03em] text-foreground">{item.question}</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">{item.answer}</p>
          </article>
        ))}
      </div>
    </PublicPageShell>
  );
}
