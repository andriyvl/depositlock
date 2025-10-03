"use client";

import {
    Lock, Clock, AlertCircle,
    Network, Globe
  } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Separator } from "@/lib/components/ui/separator";
import { getNetworkDisplayName, SupportedNetworkIds } from "@/lib/model/network.config";
import { BadgeType, UnifiedBadge } from "@/lib/features/shared";
import { Agreement, AgreementStatus } from "@/lib/model/agreement.types";
import { copyAddressToClipboard, isZeroAddress } from "../../../helpers/contract.helpers";

interface ContractDetailsCardProps {
    agreement: Agreement;
}

export function ContractDetailsCard({ agreement }: ContractDetailsCardProps) {
    const isDepositor = agreement.depositor && !isZeroAddress(agreement.depositor);

    return (
        <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl">{agreement.title}</CardTitle>
                    <UnifiedBadge type={`status-${agreement.status}` as BadgeType} />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Deposit Amount */}
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary-700">
                            {agreement.amount} {agreement.currency}
                        </div>
                        <div className="text-sm text-primary-600">Deposit Amount</div>
                    </div>
                    {/* Filled Amount */}
                    <div className="bg-tertiary-50 border border-tertiary-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-tertiary-700">
                            {agreement.filledAt
                                ? `${agreement.amount} ${agreement.currency}`
                                : <Clock className="w-6 h-6 mx-auto mb-1" />}
                        </div>
                        <div className="text-sm text-tertiary-600">
                            {agreement.filledAt ? 'Filled Amount' : 'To be filled'}
                        </div>
                    </div>
                    {/* Released Amount */}
                    {agreement.status === AgreementStatus.released && (   
                        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-secondary-700">
                                {agreement.releasedAt
                                    ? `${agreement.releasedAmount} ${agreement.currency}`
                                    : <Clock className="w-6 h-6 mx-auto mb-1" />}
                            </div>
                            <div className="text-sm text-secondary-600">
                                {agreement.releasedAt ? 'Released Amount' : 'To be released'}
                            </div>
                        </div>
                    )}
                    {/* Dispute Proposed Release Amount */}
                    {agreement.status === AgreementStatus.disputed && (
                    <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-accent-700">
                            {agreement.proposedAmount} {agreement.currency}
                        </div>
                            <div className="text-sm text-accent-600">Proposed Release Amount</div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Agreement Details
                    </h4>

                    <div>
                        <span className="text-muted-foreground text-sm">Description:</span>
                        <div className="font-medium mt-1 text-md">
                            {agreement.description}
                        </div>
                    </div>

                    {agreement.disputeReason && (
                        <div>
                            <span className="flex items-center gap-1 text-muted-foreground text-sm"><AlertCircle className="w-4 h-4 text-accent-500" />Dispute Reason:</span>
                            <div className="font-medium mt-1 text-md">
                                {agreement.disputeReason}
                            </div>
                        </div>
                    )}

                    <Separator />
                    <h4 className="font-semibold flex items-center">
                        <Network className="w-4 h-4 mr-1" />
                        Contract Information
                    </h4>

                    <div>
                        <span className="text-muted-foreground text-sm">Network:</span>
                        <div className="font-medium mt-1 text-md">
                            {getNetworkDisplayName(agreement.networkId as SupportedNetworkIds)}
                        </div>
                    </div>
                    <div className="text-sm">
                        <span className="text-muted-foreground">Contract Address:</span>
                        <div onClick={() => copyAddressToClipboard(agreement.contractAddress, "Contract Address")} className="font-mono bg-muted p-2 rounded mt-1 break-all cursor-pointer">
                            {agreement.contractAddress}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Creator Address:</span>
                            <div onClick={() => copyAddressToClipboard(agreement.creator, "Creator Address")} className="font-mono bg-muted p-2 rounded mt-1 break-all cursor-pointer">
                                {agreement.creator}
                            </div>
                        </div>
                        {isDepositor && <div>
                            <span className="text-muted-foreground">Depositor Address:</span>
                            <div onClick={() => copyAddressToClipboard(agreement.depositor, "Depositor Address")} className="font-mono bg-muted p-2 rounded mt-1 break-all cursor-pointer">
                                {agreement.depositor}
                            </div>
                        </div>}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}