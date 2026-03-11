"use client";

import Image from "next/image";
import { AlertCircle, Clock3, Copy, Lock, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { getNetworkDisplayName, getNetworkIconSrc, SupportedNetworkIds } from "@/lib/model/network.config";
import { BadgeType, UnifiedBadge } from "@/lib/features/shared";
import { Agreement, AgreementStatus } from "@/lib/model/agreement.types";
import { copyAddressToClipboard, isZeroAddress } from "../../../helpers/contract.helpers";

interface ContractDetailsCardProps {
  agreement: Agreement;
}

export function ContractDetailsCard({ agreement }: ContractDetailsCardProps) {
  const isDepositor = agreement.depositor && !isZeroAddress(agreement.depositor);
  const networkId = agreement.networkId as SupportedNetworkIds;
  const networkIconSrc = getNetworkIconSrc(networkId);

  return (
    <Card className="bg-white/86">
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.05em] text-secondary-700">
              Contract workspace
            </p>
            <CardTitle className="mt-3 text-4xl">{agreement.title}</CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <UnifiedBadge type={`status-${agreement.status}` as BadgeType} size="m" />
            <UnifiedBadge type={agreement.role} size="m" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-primary-200 bg-primary-50/90 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary-700">Amount</div>
            <div className="mt-3 font-display text-4xl tracking-[-0.05em] text-foreground">
              {agreement.amount} {agreement.currency}
            </div>
            <div className="mt-2 text-sm font-medium text-secondary-800">Deposit amount</div>
          </div>

          <div className="rounded-[1.75rem] border border-tertiary-200 bg-tertiary-50/90 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary-700">Funding</div>
            <div className="mt-3 font-display text-4xl tracking-[-0.05em] text-foreground">
              {agreement.filledAt ? (
                `${agreement.amount} ${agreement.currency}`
              ) : (
                <Clock3 className="h-8 w-8" />
              )}
            </div>
            <div className="mt-2 text-sm font-medium text-secondary-800">
              {agreement.filledAt ? "Filled amount" : "To be filled"}
            </div>
          </div>

          {agreement.status === AgreementStatus.released && (
            <div className="rounded-[1.75rem] border border-secondary-200 bg-secondary-50/90 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary-700">Release</div>
              <div className="mt-3 font-display text-4xl tracking-[-0.05em] text-foreground">
                {agreement.releasedAt ? (
                  `${agreement.releasedAmount} ${agreement.currency}`
                ) : (
                  <Clock3 className="h-8 w-8" />
                )}
              </div>
              <div className="mt-2 text-sm font-medium text-secondary-800">
                {agreement.releasedAt ? "Released amount" : "To be released"}
              </div>
            </div>
          )}

          {agreement.status === AgreementStatus.disputed && (
            <div className="rounded-[1.75rem] border border-accent-200 bg-accent-50/90 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary-700">Dispute</div>
              <div className="mt-3 font-display text-4xl tracking-[-0.05em] text-foreground">
                {agreement.proposedAmount} {agreement.currency}
              </div>
              <div className="mt-2 text-sm font-medium text-secondary-800">Proposed release amount</div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="flex items-center font-semibold text-foreground">
            <Lock className="mr-2 h-4 w-4" />
            Agreement details
          </h4>

          <div className="rounded-[1.6rem] border border-border/60 bg-white/74 p-5">
            <span className="text-sm text-muted-foreground">Description</span>
            <div className="mt-3 text-base font-medium leading-7 text-foreground">{agreement.description}</div>
          </div>

          {agreement.disputeReason && (
            <div className="rounded-[1.6rem] border border-accent-200 bg-accent-50/80 p-5">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 text-accent-500" />
                Dispute reason
              </span>
              <div className="mt-3 text-base font-medium leading-7 text-foreground">{agreement.disputeReason}</div>
            </div>
          )}

          <h4 className="flex items-center font-semibold text-foreground">
            <Network className="mr-1 h-4 w-4" />
            Contract information
          </h4>

          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="rounded-[1.6rem] border border-border/60 bg-white/74 p-5">
              <span className="block text-sm text-muted-foreground">Network</span>
              <div className="mt-3 inline-flex items-center gap-3 rounded-full bg-white py-3">
                <span className="font-medium text-foreground">{getNetworkDisplayName(networkId)}</span>
                <Image
                  src={networkIconSrc}
                  alt={`${getNetworkDisplayName(networkId)} icon`}
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyAddressToClipboard(agreement.contractAddress, "Contract Address")}
              className="rounded-[1.6rem] border border-border/60 bg-white/74 p-5 text-left transition-colors hover:border-secondary-200 hover:bg-white"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Contract address</span>
                <Copy className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 break-all font-mono text-sm leading-7 text-foreground">{agreement.contractAddress}</div>
            </button>

            <button
              type="button"
              onClick={() => copyAddressToClipboard(agreement.creator, "Creator Address")}
              className="rounded-[1.6rem] border border-border/60 bg-white/74 p-5 text-left transition-colors hover:border-secondary-200 hover:bg-white"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Creator address</span>
                <Copy className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 break-all font-mono text-sm leading-7 text-foreground">{agreement.creator}</div>
            </button>

            {isDepositor && (
              <button
                type="button"
                onClick={() => copyAddressToClipboard(agreement.depositor, "Depositor Address")}
                className="rounded-[1.6rem] border border-border/60 bg-white/74 p-5 text-left transition-colors hover:border-secondary-200 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Depositor address</span>
                  <Copy className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3 break-all font-mono text-sm leading-7 text-foreground">{agreement.depositor}</div>
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
