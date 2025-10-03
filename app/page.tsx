export const dynamic = "force-static";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { HowItWorks } from "@/lib/features/home/how-it-works";
import { Button } from "@/lib/components/ui/button";

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      <main className="py-20">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary-100 text-primary-700 border-primary-200">
            🚀 Web3 Escrow for Everyone
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary-600 to-secondary-600 bg-clip-text text-transparent leading-tight">
            Secure Crypto Deposits,
            <br />
            <span className="text-primary-500">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Lock rental deposits safely on the blockchain. Perfect for apartments, equipment rentals, and any situation requiring secure fund escrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/creator" className="px-8 py-3 rounded-md bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary/90 hover:to-secondary/90 text-primary-foreground">Create Agreement</Link>
            <Link href="/contract/entry" className="px-8 py-3 rounded-md border bg-white hover:bg-grey-50 border-input text-outline-foreground">Fill Deposit</Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 border-2 border-background flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-500 border-2 border-background flex items-center justify-center">
                <span className="text-white text-sm font-medium">B</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tertiary-400 to-tertiary-500 border-2 border-background flex items-center justify-center">
                <span className="text-white text-sm font-medium">C</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">2,500+</span> users worldwide
            </p>
          </div>
        </div>

        <section id="features" className="py-20 px-4 bg-background/50 mt-16">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DepositLock?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built for the future of secure transactions with blockchain technology you can trust
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="rounded-xl border-0 shadow-lg bg-gradient-to-br from-primary-50 to-primary-100 p-6">
                <h3 className="font-semibold mb-2">Trustless Security</h3>
                <p className="text-sm text-primary-700">Smart contracts ensure funds are locked safely until the rental period ends</p>
              </div>
              <div className="rounded-xl border-0 shadow-lg bg-gradient-to-br from-secondary-50 to-secondary-100 p-6">
                <h3 className="font-semibold mb-2">Mobile First</h3>
                <p className="text-sm text-secondary-700">Beautiful, responsive design that works perfectly on any device</p>
              </div>
              <div className="rounded-xl border-0 shadow-lg bg-gradient-to-br from-tertiary-50 to-tertiary-100 p-6">
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-tertiary-700">Set up deposits in minutes with our intuitive process</p>
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />

        <section className="py-20 px-4 bg-gradient-to-r from-primary-500 to-secondary-500">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Secure Your First Deposit?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">Join thousands who trust DepositLock for secure, transparent crypto escrow</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradientPrimarySecondary" size="lg">
                <Link href="/creator">Request Deposit</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/contract/entry" >Fill Deposit</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}