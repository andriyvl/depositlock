"use client";

import { useState } from "react";

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"creator" | "depositor">("creator");

  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple as 1, 2, 3</h2>
          <p className="text-xl text-muted-foreground">Choose your role and follow the guided process</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-muted p-1 rounded-2xl flex">
            <button
              onClick={() => setActiveTab("creator")}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeTab === "creator"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              I need a deposit (Creator)
            </button>
            <button
              onClick={() => setActiveTab("depositor")}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeTab === "depositor"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              I'm making a deposit (Depositor)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {activeTab === "creator" ? (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Set Terms</h3>
                <p className="text-muted-foreground">Enter deposit amount, deadline, and details</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Deploy Contract</h3>
                <p className="text-muted-foreground">Confirm with your wallet to create the escrow</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-tertiary-400 to-tertiary-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Share Link</h3>
                <p className="text-muted-foreground">Send the deposit link to your tenant or customer</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Open Link</h3>
                <p className="text-muted-foreground">Click the deposit link shared with you</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Connect Wallet</h3>
                <p className="text-muted-foreground">Review terms and connect your wallet securely</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-tertiary-400 to-tertiary-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Send Deposit</h3>
                <p className="text-muted-foreground">Confirm the transaction to lock funds until deadline</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
