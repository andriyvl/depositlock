"use client";

import { Button } from "@/components/ui/button";
import { NETWORK_CONFIGS, SupportedNetworkIds } from "@/lib/model/network.config";
import { ExternalLink } from "lucide-react";

interface ViewOnExplorerProps {
  contractAddress: string;
  networkId?: SupportedNetworkIds;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
  children?: React.ReactNode;
}

export function ViewOnExplorer({ 
  contractAddress, 
  networkId = SupportedNetworkIds.polygonAmoy,
  variant = "outline",
  className = "w-full justify-start",
  children 
}: ViewOnExplorerProps) {
  const getExplorerUrl = () => {
    if (!contractAddress) return '#';
    const explorerUrl = NETWORK_CONFIGS[networkId].blockExplorers?.default.url;

    return `${explorerUrl}/address/${contractAddress}`;
  };

  const explorerUrl = getExplorerUrl();
  const isDisabled = explorerUrl === '#';

  return (
    <Button 
      variant={variant} 
      className={className} 
      asChild
      disabled={isDisabled}
    >
      <a 
        href={explorerUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className={isDisabled ? 'pointer-events-none opacity-50' : ''}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        {children || "View on Explorer"}
      </a>
    </Button>
  );
} 