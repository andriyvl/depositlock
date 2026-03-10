export const dynamic = "force-static";

import Link from "next/link";
import {
  Bike,
  Building2,
  Camera,
  Car,
  Check,
  CircleDollarSign,
  Globe2,
  LockKeyhole,
  Rocket,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { HowItWorks } from "@/lib/features/home/how-it-works";

const RENTAL_SEGMENTS = [
  {
    title: "Bike rentals",
    description: "Create deposit agreements for city bikes, e-bikes, and adventure gear.",
    icon: Bike,
  },
  {
    title: "Flat rentals",
    description: "Protect bookings and long-term stays with transparent escrow terms.",
    icon: Building2,
  },
  {
    title: "Photo equipment",
    description: "Secure high-value cameras, lenses, and lighting kits with confidence.",
    icon: Camera,
  },
  {
    title: "Transportation",
    description: "Handle car, scooter, and van deposits with onchain settlement.",
    icon: Car,
  },
];

const PLATFORM_FEATURES = [
  {
    title: "Escrow by smart contract",
    description: "Funds are locked inside the contract and released only according to the agreement terms.",
    icon: LockKeyhole,
  },
  {
    title: "Clear, auditable flow",
    description: "Every contract and movement is verifiable onchain for both business and renter.",
    icon: ShieldCheck,
  },
  {
    title: "Built for small teams",
    description: "Go live in minutes without custom integrations or legal-heavy back office setup.",
    icon: Rocket,
  },
  {
    title: "Wallet-native experience",
    description: "Renters can connect, review terms, and fill deposits directly from their wallet.",
    icon: Wallet,
  },
];

const SUPPORTED_NETWORKS = ["Ethereum", "Arbitrum", "Base", "Optimism", "Polygon"];

export default async function HomePage() {
  return (
    <div className="bg-[#f6f7f2] text-[#0b160f]">
      <section className="px-4 pb-12 pt-14 md:pb-20 md:pt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 rounded-[2rem] bg-white p-8 shadow-[0_18px_60px_rgba(12,23,16,0.08)] md:grid-cols-[1.15fr_0.85fr] md:p-12">
            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-[#cde7cb] bg-[#e7fcd7] px-4 py-2 text-sm font-semibold text-[#13310d]">
                Crypto escrow for rental businesses
              </div>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Protect every rental deposit with simple onchain escrow
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#3f4f44] md:text-2xl md:leading-relaxed">
                DepositLock helps small rental businesses create secure crypto contracts for bikes, flats, photo equipment, and transportation rentals.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/creator"
                  className="inline-flex items-center justify-center rounded-full bg-[#9fe870] px-8 py-3 text-lg font-semibold text-[#11290c] transition-colors hover:bg-[#8edc5d]"
                >
                  Create agreement
                </Link>
                <Link
                  href="/contract/entry"
                  className="inline-flex items-center justify-center rounded-full border border-[#20471a] px-8 py-3 text-lg font-semibold text-[#20471a] transition-colors hover:bg-[#eff9e8]"
                >
                  Fill deposit
                </Link>
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-[#163300] p-6 text-[#d9f6c8] md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9fe870]">Supported networks</p>
              <ul className="mt-5 space-y-3">
                {SUPPORTED_NETWORKS.map((network) => (
                  <li key={network} className="flex items-center gap-3 text-base md:text-lg">
                    <Check className="h-5 w-5 text-[#9fe870]" />
                    {network}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl bg-[#1f4514] p-4">
                <div className="flex items-center gap-2 text-[#9fe870]">
                  <CircleDollarSign className="h-5 w-5" />
                  <p className="font-semibold">Escrow with transparent terms</p>
                </div>
                <p className="mt-2 text-sm text-[#dcefd2]">
                  Funds remain locked in-contract until the agreed deadline and conditions are met.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold md:text-5xl">Made for real rental operations</h2>
          <p className="mt-4 max-w-3xl text-lg text-[#46564b] md:text-2xl">
            From independent owners to growing local fleets, DepositLock gives you a secure way to hold deposits without manual follow-up.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {RENTAL_SEGMENTS.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-3xl border border-[#dbe6d8] bg-[#f1f4ee] p-6">
                <div className="mb-5 inline-flex rounded-2xl bg-white p-3 text-[#15350f]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-base text-[#4a5a50]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 md:pb-16">
        <div className="container mx-auto max-w-6xl rounded-[2rem] bg-[#163300] p-8 text-white md:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9fe870]">Why businesses choose DepositLock</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">Reduce disputes and secure deposits with auditable agreements</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PLATFORM_FEATURES.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-3xl bg-[#1f4514] p-6">
                <Icon className="h-6 w-6 text-[#9fe870]" />
                <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-[#d7ebcb]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="px-4 pb-20 pt-8">
        <div className="container mx-auto max-w-6xl rounded-[2rem] border border-[#d4dfd0] bg-white px-8 py-12 text-center md:px-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ebf8e3] text-[#214819]">
            <Globe2 className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-3xl font-bold md:text-5xl">Start secure crypto escrow in minutes</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-[#4a5a50] md:text-2xl">
            Launch your next rental agreement on Ethereum and major L2 networks with a workflow built for speed and trust.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/creator"
              className="inline-flex items-center justify-center rounded-full bg-[#9fe870] px-8 py-3 text-lg font-semibold text-[#11290c] transition-colors hover:bg-[#8edc5d]"
            >
              Request deposit
            </Link>
            <Link
              href="/contract/entry"
              className="inline-flex items-center justify-center rounded-full border border-[#20471a] px-8 py-3 text-lg font-semibold text-[#20471a] transition-colors hover:bg-[#eff9e8]"
            >
              Fill deposit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
