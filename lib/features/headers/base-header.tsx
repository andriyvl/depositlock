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
    <header className="border-b sm:px-8 px-4 border-border/50 bg-background/0 backdrop-blur-sm sticky top-0 z-20">
      <div className="mx-auto py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center sm:space-x-2 space-x-1">
          <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
            <Lock className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
          </div>
          <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            DepositLock
          </span>
        </Link>
        <div className="h-10 flex items-center sm:space-x-3 space-x-1">
          {children}
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}