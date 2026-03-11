import type { Metadata } from "next";
import { Eye, Globe2, LockKeyhole, UserRoundSearch } from "lucide-react";
import { PublicPageShell } from "@/lib/features/public/public-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | DepositLock",
  description: "Learn how DepositLock handles wallet data and on-chain activity.",
};

const privacySections = [
  {
    title: "Data used in the interface",
    description:
      "DepositLock processes wallet addresses, selected network information, contract metadata, and transaction hashes so the app can create, discover, and manage agreements.",
    icon: UserRoundSearch,
  },
  {
    title: "On-chain transparency",
    description:
      "Anything submitted through a blockchain transaction becomes part of the public ledger for that network and may remain visible permanently through explorers and indexers.",
    icon: Eye,
  },
  {
    title: "Third-party infrastructure",
    description:
      "Wallet providers, RPC services, block explorers, and connected services may process data independently under their own privacy terms.",
    icon: Globe2,
  },
  {
    title: "Key custody",
    description:
      "DepositLock is non-custodial. The interface does not hold or store your private keys, and signing always happens through the connected wallet.",
    icon: LockKeyhole,
  },
] as const;

export default function PrivacyPage() {
  return (
    <PublicPageShell
      eyebrow="Privacy"
      title="Designed for a non-custodial product surface."
      description="DepositLock minimizes what it processes in the interface, but blockchain activity is public by nature. This page outlines the practical privacy boundaries of the app."
      aside={
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.05em] text-secondary-700">Important context</p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            If you publish details on-chain, those details may be publicly visible beyond DepositLock itself.
          </p>
        </div>
      }
    >
      {privacySections.map((section) => {
        const Icon = section.icon;

        return (
          <article key={section.title} className="rounded-[2rem] border border-border/70 bg-white/84 p-6 shadow-card backdrop-blur-sm sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-100 text-tertiary-700">
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
