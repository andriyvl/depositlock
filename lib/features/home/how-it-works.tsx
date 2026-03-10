"use client";

import { useState } from "react";
import { ArrowRight, Briefcase, HandCoins } from "lucide-react";

const CREATOR_STEPS = [
  {
    title: "Set rental terms",
    description: "Define amount, deadline, and rental terms in a clear escrow agreement.",
  },
  {
    title: "Create contract",
    description: "Connect your wallet and deploy the escrow contract in one guided flow.",
  },
  {
    title: "Share payment link",
    description: "Send the contract link to your renter so they can review and deposit.",
  },
];

const DEPOSITOR_STEPS = [
  {
    title: "Open agreement",
    description: "Access the shared link and verify the terms before paying the deposit.",
  },
  {
    title: "Connect wallet",
    description: "Connect your wallet securely and check the selected network details.",
  },
  {
    title: "Lock deposit",
    description: "Confirm the transaction and lock funds in escrow until completion.",
  },
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"creator" | "depositor">("creator");
  const steps = activeTab === "creator" ? CREATOR_STEPS : DEPOSITOR_STEPS;

  return (
    <section id="how-it-works" className="px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl rounded-[2rem] bg-[#f1f4ee] p-8 md:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2e5226]">How it works</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">A fast, two-sided escrow flow for rentals</h2>
            <p className="mt-4 max-w-2xl text-lg text-[#4a5a50]">
              Pick your role and follow the exact path your business or renter needs.
            </p>
          </div>
          <div className="inline-flex rounded-full bg-white p-1">
            <button
              onClick={() => setActiveTab("creator")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors ${
                activeTab === "creator" ? "bg-[#163300] text-white" : "text-[#274922]"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Business
            </button>
            <button
              onClick={() => setActiveTab("depositor")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors ${
                activeTab === "depositor" ? "bg-[#163300] text-white" : "text-[#274922]"
              }`}
            >
              <HandCoins className="h-4 w-4" />
              Renter
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-3xl bg-white p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ebf8e3] text-lg font-semibold text-[#1f4514]">
                {index + 1}
              </div>
              <h3 className="mt-4 text-2xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-[#4a5a50]">{step.description}</p>
              <div className="mt-5 text-[#1f4514]">
                <ArrowRight className="h-5 w-5" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
