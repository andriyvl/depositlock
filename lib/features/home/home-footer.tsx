import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/lib/components/ui/button";

const footerLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function HomeFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-white/38">
      <div className="container py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xl font-semibold tracking-[-0.03em] text-foreground">DepositLock</p>
                <p className="text-sm text-muted-foreground">Escrow contracts for rental deposits</p>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
              DepositLock is built for rental businesses that want a cleaner deposit workflow across
              Ethereum and supported L2 networks without adding custody or manual reconciliation.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:justify-self-end">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-secondary-700">Start here</p>
            <Button size="lg" asChild>
              <Link href="/creator">
                Create a new contract
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contract/entry">Open existing contract</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 DepositLock. Non-custodial escrow software for rental deposits.</p>
          <div className="flex flex-wrap items-center gap-4">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
