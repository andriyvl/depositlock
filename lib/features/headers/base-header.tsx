"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { type ReactNode } from "react";
import { ConnectWallet } from "@/lib/features/shared";

interface BaseHeaderProps {
  children?: ReactNode;
}



export function BaseHeader({ children }: BaseHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
            <Lock className="h-4 w-4" />
          </span>
          <span className="flex flex-col">
            <span className="text-lg font-semibold tracking-[-0.03em] text-foreground">DepositLock</span>
            <span className="hidden text-xs uppercase tracking-[0.01em] text-muted-foreground sm:block">
              App workspace
            </span>
          </span>
        </Link>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {children && <div className="hidden items-center gap-2 sm:flex">{children}</div>}
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
