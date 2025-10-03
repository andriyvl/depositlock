"use client";

import React from "react";
import { AuthProvider } from "@/lib/features/auth/auth.context";
import { ToastNotification } from "@/lib/features/shared/components/toast-notification";
import { Web3Provider } from "@/lib/features/web3/provider/web3-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <AuthProvider>
        {children}
        <ToastNotification />
      </AuthProvider>
    </Web3Provider>
  );
}
