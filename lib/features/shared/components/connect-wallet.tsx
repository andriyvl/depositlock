"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useAuth } from "@/lib/features/auth/auth.hook";
import { UnifiedBadge } from "@/lib/features/shared/components/unified-badge";
import { useAppStore } from "@/lib/features/store/app.store";

interface ConnectWalletProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | "tertiary";
  className?: string;
}

export function ConnectWallet({ variant = "outline", className }: ConnectWalletProps) {
  const auth = useAuth();
  const { isAuthLoading } = useAppStore();

  if (auth.isAuthenticated && auth.user?.address) {
    return <UnifiedBadge type="address" size="m" value={auth.user.address} value2={auth.user.networkId}>
      <Wallet className="w-4 h-4 mr-2" />
    </UnifiedBadge>;
  }

  return (
    <Button
      variant={variant}
      onClick={auth.login}
      disabled={isAuthLoading}
      className={className}
      size="sm"
    >
      <Wallet className="w-4 h-4" />
      {isAuthLoading ? 'Loading...' : 'Connect'}
    </Button>
  );
}
