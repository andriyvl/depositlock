"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip-custom";
import { copyWalletAddress } from "@/lib/helpers/contract.helpers";
import { AgreementStatus } from "@/lib/model/agreement.types";
import { getNetworkDisplayName, SupportedNetworkIds } from "@/lib/model/network.config";

export type BadgeType = 
  | "address"
  | "creator"
  | "depositor"
  | "mode-creator"
  | "mode-depositor"
  | `status-${AgreementStatus}`;

interface UnifiedBadgeProps {
  type: BadgeType;
  value?: string;
  className?: string;
  onClick?: () => void;
  size?: "s" | "m";
  children?: React.ReactNode;
  value2?: string;
}

interface BadgeConfig {
  variant: "primary" | "secondary" | "tertiary" | "accent" | "destructive" | "muted";
  getLabel: (value: string) => string;
  getTooltip?: (value: string, value2?: string) => React.ReactNode;
  onClick?: (value: string) => Promise<void>;
}

const badgeConfig: Record<BadgeType, BadgeConfig> = {
  address: {
    variant: "tertiary" as const,
    getLabel: (value: string) => `${value.slice(0, 3)}...${value.slice(-3)}`,
    getTooltip: (value: string, value2?: string) => (
      <div className="sm:w-full w-fit">
        <p className="text-xs text-muted-foreground">Your wallet address:</p>
        <p className="text-foreground text-sm">{value}</p>  
        <p className="text-xs text-muted-foreground">Network: <span className="font-mono text-sm">{getNetworkDisplayName(value2 as SupportedNetworkIds)}</span></p>
        <p className="text-xs text-foreground mt-1 text-right">Click to copy</p>
      </div>
    ),
    onClick: async (value: string) => {
      await copyWalletAddress(value);
    }
  },
  creator: {
    variant: "primary" as const,
    getLabel: () => "Creator",
    getTooltip: () => "You have created this agreement",
  },
  depositor: {
    variant: "secondary" as const,
    getLabel: () => "Depositor",
    getTooltip: () => "You are participating in this agreement as a depositor",
  },
  "mode-creator": {
    variant: "primary" as const,
    getLabel: () => "Creator",
    getTooltip: () => "You are viewing this agreement as a creator",
  },
  "mode-depositor": {
    variant: "secondary" as const,
    getLabel: () => "Depositor",
    getTooltip: () => "You are viewing this agreement as a depositor",
  },
  [`status-${AgreementStatus.pending}`]: {
    variant: "accent" as const,
    getLabel: () => "Pending",
    getTooltip: () => "Agreement is waiting for deposit",
  },
  [`status-${AgreementStatus.filled}`]: {
    variant: "tertiary" as const,
    getLabel: () => "Filled",
    getTooltip: () => "Deposit has been made and agreement is filled",
  },
  [`status-${AgreementStatus.released}`]: {
    variant: "secondary" as const,
    getLabel: () => "Released",
    getTooltip: () => "Funds have been released successfully",
  },
  [`status-${AgreementStatus.disputed}`]: {
    variant: "destructive" as const,
    getLabel: () => "Disputed",
    getTooltip: () => "Agreement is under dispute and requires resolution",
  },
  [`status-${AgreementStatus.canceled}`]: {
    variant: "muted" as const,
    getLabel: () => "Canceled",
    getTooltip: () => "Agreement has been canceled",
  },
};

export function UnifiedBadge({ type, value = "", value2 = "", size = "s", className, onClick, children }: UnifiedBadgeProps) {
  const config = badgeConfig[type];
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (config.onClick && value) {
      config.onClick(value);
    }
  };

  const badge = (
    <Badge
      variant={config.variant}
      size={size}
      className={`cursor-pointer hover:opacity-80 transition-opacity ${className || ""}}`}
      onClick={handleClick}
    >
      {children}
      {config.getLabel(value)}
    </Badge>
  );

  if (config.getTooltip) {
    return (
      <Tooltip position="bottom-left" content={config.getTooltip(value, value2)}>
        {badge}
      </Tooltip>
    );
  }

  return badge;
}