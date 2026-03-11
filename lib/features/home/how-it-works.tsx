import Link from "next/link";
import { ArrowRight, Bike, HandCoins, Link2, LockKeyhole, Store, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/lib/components/ui/button";

const creatorSteps = [
  {
    title: "Create the agreement",
    description: "Set the amount, token, network, deadline, and contract description from the creator flow.",
    icon: Store,
  },
  {
    title: "Share one contract link",
    description: "Send the generated contract URL instead of explaining the deposit process manually.",
    icon: Link2,
  },
  {
    title: "Manage the result",
    description: "Release, cancel, or dispute directly from the contract workspace when the rental ends.",
    icon: LockKeyhole,
  },
] as const;

const depositorSteps = [
  {
    title: "Open the contract link",
    description: "Review the amount, token, network, deadline, and contract description before acting.",
    icon: WalletCards,
  },
  {
    title: "Fund the deposit",
    description: "Connect the wallet and confirm the deposit transaction if the terms match the agreement.",
    icon: HandCoins,
  },
  {
    title: "Follow the contract status",
    description: "Track when the deposit is filled and how the agreement is resolved.",
    icon: Bike,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container mt-24">
      <div className="grid gap-8 lg:grid-cols-[0.34fr_1fr] lg:items-start">
        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-secondary-700">How it works</p>
          <h2 className="mt-4 font-display text-[clamp(2.8rem,5vw,4.5rem)] font-black leading-[0.98] tracking-[-0.06em] text-foreground">
            Escrow contracts created on-chain
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Using smart contracts we secure the funds during the contract duration. No need for bank transfers or cash deposits. All transparent and auditable on-chain.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <article className="rounded-[2.1rem] border border-border/60 bg-white/90 p-6 shadow-card sm:p-7">
            <Badge variant="primary" size="m">
              For rental businesses
            </Badge>
            <h3 className="mt-5 text-[1.9rem] font-semibold leading-tight tracking-[-0.035em] text-foreground">
              Create and manage the escrow.
            </h3>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              This path is for the team issuing the deposit requirement.
            </p>

            <div className="mt-8 space-y-6">
              {creatorSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="grid gap-4 md:grid-cols-[auto_1fr]">
                    <div className="flex items-center gap-3 md:flex-col md:items-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold uppercase tracking-[0.04em] text-secondary-700 md:hidden">
                        Step 0{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="hidden text-sm font-semibold uppercase tracking-[0.04em] text-secondary-700 md:block">
                        Step 0{index + 1}
                      </p>
                      <h4 className="mt-1 text-[1.35rem] font-semibold leading-tight tracking-[-0.025em] text-foreground">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button className="mt-8" asChild>
              <Link href="/creator">
                Open creator flow
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </article>

          <article className="rounded-[2.1rem] border border-border/60 bg-secondary p-6 text-secondary-foreground shadow-card sm:p-7">
            <Badge variant="outline" size="m" className="border-white/18 bg-white/10 text-white">
              For renters
            </Badge>
            <h3 className="mt-5 text-[1.9rem] font-semibold leading-tight tracking-[-0.035em] text-white">
              Open the link and pay the deposit.
            </h3>
            <p className="mt-3 text-base leading-7 text-white/72">
              This path is for the depositor who already received the contract URL from the business.
            </p>

            <div className="mt-8 space-y-6">
              {depositorSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="grid gap-4 md:grid-cols-[auto_1fr]">
                    <div className="flex items-center gap-3 md:flex-col md:items-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold uppercase tracking-[0.04em] text-white/58 md:hidden">
                        Step 0{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="hidden text-sm font-semibold uppercase tracking-[0.04em] text-white/58 md:block">
                        Step 0{index + 1}
                      </p>
                      <h4 className="mt-1 text-[1.35rem] font-semibold leading-tight tracking-[-0.025em] text-white">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-white/72">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button variant="outline" className="mt-8 border-white/18 bg-white/10 text-white hover:bg-white/16" asChild>
              <Link href="/contract/entry">
                Open deposit entry
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </article>
        </div>
      </div>
    </section>
  );
}
