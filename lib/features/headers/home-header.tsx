"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/features/auth/auth.context";
import { Button } from "@/lib/components/ui/button";

export function HomeHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/88 backdrop-blur-xl">
      <div className="container flex min-h-[4.5rem] items-center justify-between gap-4 py-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
            <Lock className="h-4 w-4" />
          </span>
          <span className="flex flex-col">
            <span className="text-lg font-semibold tracking-[-0.03em] text-foreground">DepositLock</span>
            <span className="hidden text-xs uppercase tracking-[0.01em] text-muted-foreground sm:block">
              Crypto escrow
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground xl:flex">
          <Link href="/#how-it-works" className="transition-colors hover:text-foreground">How it works</Link>
          <Link href="/#coverage" className="transition-colors hover:text-foreground">Coverage</Link>
          <Link href="/faq" className="transition-colors hover:text-foreground">FAQ</Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          {user?.isConnected && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/contract/entry">Fill deposit</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/creator">Create</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
