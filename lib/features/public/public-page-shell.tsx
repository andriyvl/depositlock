import { type ReactNode } from "react";

interface PublicPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  aside?: ReactNode;
}

export function PublicPageShell({
  eyebrow,
  title,
  description,
  children,
  aside,
}: PublicPageShellProps) {
  return (
    <section className="container py-10 sm:py-14">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start xl:gap-10">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-secondary-700">{eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(2.9rem,5vw,4.8rem)] font-black leading-[0.95] tracking-[-0.075em] text-foreground">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
        </div>

        <div className="xl:pt-3">
          {aside ? (
            <div className="rounded-[2rem] border border-border/60 bg-white/88 p-6 shadow-card sm:p-7">
              {aside}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-border/60 bg-white/88 p-6 shadow-card sm:p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.04em] text-secondary-700">Product context</p>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                DepositLock is a non-custodial escrow interface for rental deposits across Ethereum
                and supported L2 networks.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <div className="space-y-4 sm:space-y-5">{children}</div>
      </div>
    </section>
  );
}
