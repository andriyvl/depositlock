"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAgreement } from "@/lib/features/shared/agreement.hook";
import {
  AlertCircle,
  Loader2
} from "lucide-react";
import { ContractActionsCard } from "@/lib/features/contract/components/contract-actions-card";
import { ContractEventBanner } from "@/lib/features/contract/components/contract-event-banner";
import { TimelineCard } from "@/lib/features/contract/components/timeline-card";
import { HelpCard } from "@/lib/features/contract/components/help-card";
import { QuickActionsCard } from "@/lib/features/contract/components/quick-actions-card";
import { useAppStore } from "@/lib/features/store/app.store";
import { ContractDetailsCard } from "@/lib/features/contract/components/contract-details-card";
import { useAuth } from "@/lib/features/auth/auth.hook";

export default function ContractDetailPage() {
  const params = useParams<{ contractId: string }>();
  const contractId = params?.contractId as string | undefined;
  const { user } = useAuth();

  const { fetchAgreement } = useAgreement(contractId || "", user);
  const {
    currentAgreement,
    currentAgreementLoading,
    currentAgreementError,
    setCurrentAgreement,
    setCurrentAgreementLoading,
    setCurrentAgreementStatusEvent,
  } = useAppStore();

  useEffect(() => {
    setCurrentAgreementStatusEvent(undefined);
  }, [contractId, setCurrentAgreementStatusEvent]);

  useEffect(() => {
    if (!contractId) {
      setCurrentAgreementLoading(false);
      return;
    }

    fetchAgreement();
  }, [contractId, fetchAgreement, setCurrentAgreementLoading]);

  if (currentAgreementLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 mt-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-muted-foreground">Loading deposit agreement...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentAgreement && !currentAgreementLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
            <p className="text-muted-foreground">{currentAgreementError || "Failed to load agreement."}</p>
            <p className="text-sm text-muted-foreground/70">Contract ID: {contractId}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // TypeScript guard - we know agreement exists at this point
  if (!currentAgreement) return null;

  return (
    <div className="min-h-screen">
      <div className="container py-8 sm:py-12">
        <ContractEventBanner agreement={currentAgreement} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ContractDetailsCard agreement={currentAgreement} />

            <ContractActionsCard agreement={currentAgreement} contractId={contractId!} />
          </div>

          <div className="space-y-6">
            <QuickActionsCard agreement={currentAgreement} contractId={contractId!} />

            <TimelineCard agreement={currentAgreement} />
            <HelpCard />
          </div>
        </div>
      </div>
    </div>
  );
}
