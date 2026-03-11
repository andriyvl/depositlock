export const dynamic = "force-static";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Camera,
  CarFront,
  CircleDollarSign,
  Network,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import { HowItWorks } from "@/lib/features/home/how-it-works";

const rentalUseCases = [
  {
    title: "Mobility",
    description: "Cars, bikes, scooters, and other transport rentals with one escrow flow.",
    icon: CarFront,
  },
  {
    title: "Living spaces",
    description: "Flats, short stays, and access-related deposits without ad-hoc transfers.",
    icon: Building2,
  },
  {
    title: "Equipment",
    description: "Cameras, tools, and high-value items that need a repeatable deposit step.",
    icon: Camera,
  },
  {
    title: "Other rentals",
    description: "A flexible escrow setup for mixed inventory or niche rental businesses.",
    icon: Package,
  },
] as const;

const networkHighlights = [
  { name: "Ethereum", iconSrc: "/networks/ethereum.svg" },
  { name: "Arbitrum", iconSrc: "/networks/arbitrum.svg" },
  { name: "Base", iconSrc: "/networks/base.svg" },
  { name: "Optimism", iconSrc: "/networks/optimism.svg" },
  { name: "Polygon", iconSrc: "/networks/polygon.svg" },
  { name: "Mantle", iconSrc: "/networks/mantle.svg" },
] as const;

const keyFacts = [
  { label: "What is needed", value: "Any Web3 wallet with Etherium address" },
  { label: "Fees", value: "Everithing is free. Pay only network fee ($0.01 - $0.99)" },
  { label: "Trust", value: "Full transparency with on-chain transactions" },
] as const;



function HeroEthereumVisual() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[-10rem] flex justify-center sm:bottom-[-20rem] lg:bottom-[-25rem]">
      <div className="hero-ethereum-float relative h-[20rem] w-[20rem] sm:h-[36rem] sm:w-[36rem] lg:h-[44rem] lg:w-[44rem]">
        <div className="absolute inset-x-[18%] bottom-[7%] h-[9%] rounded-full bg-secondary-900/14 blur-3xl" />
        <div className="absolute inset-x-[26%] bottom-[18%] h-[12%] rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute inset-0 rounded-full border border-white/75 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.98),rgba(237,239,236,0.96)_32%,rgba(205,209,206,0.9)_72%,rgba(255,255,255,0.98)_100%)] shadow-[0_38px_72px_-28px_rgba(17,35,17,0.32)]" />
        <div className="absolute inset-[1.75rem] rounded-full border border-white/80 bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.98),rgba(248,249,246,0.96)_24%,rgba(231,234,230,0.94)_68%,rgba(247,248,245,0.98)_100%)] sm:inset-[2.5rem] lg:inset-[3rem]" />
        <div className="absolute left-[14%] top-[15%] h-[18%] w-[42%] rotate-[-18deg] rounded-full bg-white/48 blur-2xl" />
        <div className="absolute right-[14%] top-[22%] h-[12%] w-[24%] rounded-full bg-white/26 blur-2xl" />

        <svg
          viewBox="0 0 784.37 1277.39"
          aria-hidden="true"
          className="hero-ethereum-mark absolute left-1/2 top-1/2 h-[72%] w-auto -translate-x-1/2 -translate-y-1/2"
        >
          <polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54" />
          <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 0,650.54 392.07,882.29 392.07,472.33" />
          <polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89" />
          <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 0,724.89" />
          <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33" />
          <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33" />
        </svg>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="pb-24 sm:pb-28">
      <section className="container pt-10 sm:pt-14">
        <div className="relative overflow-hidden rounded-[3.25rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(241,243,238,0.97)_100%)] px-6 pt-10 pb-[6rem] text-center shadow-card sm:px-10 sm:pt-14 sm:pb-[8rem] lg:px-16 lg:pt-16 lg:pb-[12rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(153,240,117,0.18),transparent_34%),radial-gradient(circle_at_50%_92%,rgba(255,255,255,0.82),transparent_38%)]" />
          <HeroEthereumVisual />

          <div className="relative z-10 mx-auto max-w-5xl">
            <Badge variant="primary" size="m">
              Crypto escrow for rental deposits
            </Badge>
            <h1 className="mt-6 whitespace-pre-line font-display text-[clamp(3.8rem,11vw,7.9rem)] font-black text-foreground">
              {"Rental deposits,\non-chain."}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-[1.2rem]">
              DepositLock helps small rental businesses create escrow contracts via crypto. Set the
              amount and deadline, share one contract link, and keep funding and resolution visible
              from start to finish.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/creator">
                  Create agreement
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contract/entry">Pay a deposit</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {networkHighlights.map((item) => (
                <Badge key={item.name} variant="muted" size="m" className="gap-2 border-white/70 bg-white/80">
                  <Image
                    src={item.iconSrc}
                    alt={`${item.name} icon`}
                    width={18}
                    height={18}
                    className="h-[18px] w-[18px] rounded-full"
                  />
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section >

      <HowItWorks />

      <section id="coverage" className="container mt-24">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-secondary-700">Rental categories</p>
            <h2 className="mt-4 font-display text-[clamp(2.8rem,5vw,4.5rem)] font-black leading-[0.98] tracking-[-0.06em] text-foreground">
              One deposit flow across different rental models.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              DepositLock fits operators who rent out vehicles, spaces, equipment, or mixed
              inventory and need a cleaner way to handle deposits before handover.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {rentalUseCases.map((useCase) => {
              const Icon = useCase.icon;

              return (
                <article key={useCase.title} className="rounded-[1.875rem] border border-border/60 bg-white/88 p-6 shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-[1.5rem] font-bold leading-tight tracking-[-0.03em] text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">{useCase.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mt-24">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-secondary-700">What is needed</p>
            <h2 className="mt-4 font-display text-[clamp(2.8rem,5vw,4.5rem)] font-black leading-[0.98] tracking-[-0.06em] text-foreground">
              Real-life securtity with Web3 crypto wallets.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Use any Web3 crypto wallet in one of the selected Etherium networks to complete the escrow contract flow.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              {keyFacts.map((item) => (
                <article key={item.label} className="rounded-[1.75rem] border border-border/60 bg-white/88 p-5 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary-700">
                    {item.label}
                  </p>
                  <p className="mt-4 text-[1.35rem] font-bold leading-8 tracking-[-0.03em] text-foreground">
                    {item.value}
                  </p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <article className="rounded-[2rem] border border-border/60 bg-primary-50/72 p-6 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Network className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[1.7rem] font-semibold leading-tight tracking-[-0.035em] text-foreground">
                  Supported networks
                </h3>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Choose any supported Ethereum network.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {networkHighlights.map((network) => (
                    <span
                      key={network.name}
                      className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/90 px-4 py-2 text-sm font-medium text-foreground"
                    >
                      <Image
                        src={network.iconSrc}
                        alt={`${network.name} icon`}
                        width={18}
                        height={18}
                        className="h-[18px] w-[18px] rounded-full"
                      />
                      {network.name}
                    </span>
                  ))}
                </div>

              </article>

              <article className="rounded-[2rem] bg-secondary p-6 text-secondary-foreground shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CircleDollarSign className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[1.7rem] font-semibold leading-tight tracking-[-0.035em] text-white">
                  Cost and custody
                </h3>
                <p className="mt-3 text-base leading-7 text-white/72">
                  DepositLock does not add a platform fee. Funds remain controlled by contract logic
                  and wallet signatures rather than by DepositLock custody.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-24">
        <div className="grid gap-6 rounded-[2.5rem] bg-secondary px-7 py-8 text-secondary-foreground shadow-card sm:px-10 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <Badge variant="outline" size="m" className="border-white/18 bg-white/10 text-white">
              Start with the right path
            </Badge>
            <h2 className="mt-6 font-display text-[clamp(2.8rem,5vw,4.6rem)] font-black leading-[0.98] tracking-[-0.06em]">
              Create a deposit agreement or open the one you already received.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/72">
              Businesses should start from the creator flow. Renters should start from the deposit
              entry route with the contract link.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button size="lg" asChild>
              <Link href="/creator">Create a new contract</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/18 bg-white/10 text-white hover:bg-white/16" asChild>
              <Link href="/contract/entry">Open existing contract</Link>
            </Button>
          </div>
        </div>
      </section>
    </div >
  );
}
