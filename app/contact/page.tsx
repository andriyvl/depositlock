import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquareQuote, ShieldCheck } from "lucide-react";
import { PublicPageShell } from "@/lib/features/public/public-page-shell";

export const metadata: Metadata = {
  title: "Contact | DepositLock",
  description: "Reach out to the DepositLock team.",
};

const contactCards = [
  {
    title: "General support",
    description: "support@depositlock.devviy.com",
    detail: "Typical response time is within one business day.",
    icon: Mail,
  },
  {
    title: "Contract troubleshooting",
    description: "Include the contract address, network, and transaction hash.",
    detail: "This shortens the time needed to understand whether the issue is wallet, network, or contract related.",
    icon: ShieldCheck,
  },
  {
    title: "Product and business questions",
    description: "Tell us what rental flow you want to support.",
    detail: "Bike hire, flats, camera gear, transport, and similar use cases all benefit from different setup guidance.",
    icon: MessageSquareQuote,
  },
] as const;

const messageChecklist = [
  "Contract address",
  "Selected network",
  "Transaction hash if a transaction failed",
  "Short description of what you expected to happen",
] as const;

export default function ContactPage() {
  return (
    <PublicPageShell
      eyebrow="Contact"
      title="Support that starts with the contract details."
      description="If you are contacting DepositLock about a live escrow, send the network and contract address first. That gives the team enough context to triage the issue quickly."
      aside={
        <div className="text-foreground">
          <p className="text-sm font-semibold uppercase tracking-[0.05em] text-secondary-900">Please provide the following information:</p>
          <div className="mt-4 grid gap-2.5">
            {messageChecklist.map((item) => (
              <div key={item} className="rounded-[1.25rem] bg-muted/60 px-4 py-3 text-sm font-medium leading-6 text-secondary-900/82">
                {item}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-border/70 bg-white/84 p-6 shadow-card backdrop-blur-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-[1.7rem] font-bold tracking-[-0.035em] text-foreground">
            {contactCards[0].title}
          </h2>
          <p className="mt-4 text-[1.2rem] font-semibold tracking-[-0.02em] text-secondary-800">
            {contactCards[0].description}
          </p>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            {contactCards[0].detail}
          </p>
        </article>

        <div className="grid gap-4">
          {contactCards.slice(1).map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="rounded-[2rem] border border-border/70 bg-white/84 p-6 shadow-card backdrop-blur-sm sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-secondary-800">
                  <Icon className="h-[1.125rem] w-[1.125rem]" />
                </div>
                <h2 className="mt-4 text-[1.4rem] font-bold tracking-[-0.03em] text-foreground">{card.title}</h2>
                <p className="mt-3 text-base font-medium text-secondary-800">{card.description}</p>
                <p className="mt-2 text-base leading-7 text-muted-foreground">{card.detail}</p>
              </article>
            );
          })}
        </div>
      </div>

      <article className="rounded-[2.2rem] border border-border/70 bg-secondary p-6 text-secondary-foreground shadow-card sm:p-7">
        <h2 className="text-[1.9rem] font-bold leading-tight tracking-[-0.035em]">Start with the FAQ if you need workflow guidance.</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/72">
          The FAQ covers supported networks, stablecoin support, creator and depositor flows, and how disputes or releases work in the current application.
        </p>
        <Link href="/faq" className="mt-5 inline-flex text-sm font-semibold text-primary underline underline-offset-4">
          Open the FAQ
        </Link>
      </article>
    </PublicPageShell>
  );
}
